import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'taskflow_notifications_enabled';

export function useNotifications(todos = []) {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'denied'
  );

  const [notificationsEnabled, setNotificationsEnabledState] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const notifiedKeysRef = useRef(new Set());

  // Save toggle preference to localStorage
  const setNotificationsEnabled = useCallback((enabled) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
    if (enabled) {
      toast.success('Task notifications enabled! 🔔');
    } else {
      toast('Task notifications disabled.', { icon: '🔕' });
    }
  }, []);

  // Request Notification Permission
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser notifications are not supported on this browser.');
      return 'denied';
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        toast.success('Notification permissions granted! 🎉');
      } else if (res === 'denied') {
        toast.error('Notification permissions denied in browser settings.');
      }
      return res;
    } catch (err) {
      console.warn('Permission request error:', err);
      return 'denied';
    }
  }, []);

  // Auto-request permission once on mount if 'default'
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      requestPermission();
    }
  }, [requestPermission]);

  // Dispatch Native Browser Notification
  const sendNotification = useCallback(
    (title, body, tagKey) => {
      if (
        typeof window === 'undefined' ||
        !('Notification' in window) ||
        Notification.permission !== 'granted' ||
        !notificationsEnabled
      ) {
        return;
      }

      if (notifiedKeysRef.current.has(tagKey)) return;
      notifiedKeysRef.current.add(tagKey);

      try {
        const options = {
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: tagKey,
        };

        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        console.warn('Native notification error:', err);
      }
    },
    [notificationsEnabled]
  );

  // Background Reminder Interval Check (Runs every 30 seconds)
  useEffect(() => {
    if (!notificationsEnabled || permission !== 'granted' || !todos.length) {
      return;
    }

    const checkReminders = () => {
      const now = new Date().getTime();

      todos.forEach((todo) => {
        if (todo.completed || !todo.dueDate) return;

        const dueTime = new Date(todo.dueDate).getTime();
        if (isNaN(dueTime)) return;

        const diffMinutes = (dueTime - now) / (1000 * 60);
        const todoId = todo._id || todo.id;

        // 1. 15 Minutes Before Trigger
        if (diffMinutes > 14 && diffMinutes <= 15.5) {
          sendNotification(
            `⏰ Task Due Soon: ${todo.title}`,
            `Due in 15 minutes! (${todo.category || 'General'})`,
            `15m-${todoId}`
          );
        }

        // 2. Exact Due Time Trigger (Within 1 minute window)
        if (diffMinutes >= -1 && diffMinutes <= 1) {
          sendNotification(
            `🔔 Task Due Now: ${todo.title}`,
            todo.description || 'Time to complete your task!',
            `due-${todoId}`
          );
        }

        // 3. Overdue Trigger (Up to 15 mins past due)
        if (diffMinutes < -1 && diffMinutes >= -15) {
          sendNotification(
            `🚨 Task Overdue: ${todo.title}`,
            `This task has passed its scheduled due time.`,
            `overdue-${todoId}`
          );
        }
      });
    };

    checkReminders();
    const intervalId = setInterval(checkReminders, 30000);
    return () => clearInterval(intervalId);
  }, [todos, notificationsEnabled, permission, sendNotification]);

  return {
    permission,
    notificationsEnabled,
    setNotificationsEnabled,
    requestPermission,
  };
}
