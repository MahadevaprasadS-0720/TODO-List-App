import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { todoService, formatDoc } from '../services/todoService';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function useTodos() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  // Master state
  const [rawTodos, setRawTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Filters, View Mode & Sorting
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [activeStatus, setActiveStatus] = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('all'); // 'all' | 'today' | 'this-week' | 'overdue'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Check Health
  const checkHealth = useCallback(async () => {
    try {
      await todoService.checkHealth(userId);
      setIsOnline(true);
    } catch {
      setIsOnline(navigator.onLine);
    }
  }, [userId]);

  // Fetch Raw Todos
  const fetchTodos = useCallback(async () => {
    if (!userId) {
      setRawTodos([]);
      setLoading(false);
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const res = await todoService.getTodos({}, userId);
      const tasks = res?.data?.todos || [];
      setRawTodos(tasks);
      return tasks;
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      return [];
    } finally {
      setLoading(false);
    }

  }, [userId]);

  // Real-time Firestore sync setup scoped to currentUser.uid
  useEffect(() => {
    checkHealth();
    if (!userId) {
      setRawTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe;
    try {
      const colRef = collection(db, 'todos');
      const q = query(colRef, where('userId', '==', userId));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const liveTodos = snapshot.docs.map(formatDoc);
          setRawTodos(liveTodos);
          setLoading(false);
          setIsOnline(true);
        },
        (err) => {
          console.warn('Realtime listener fallback to polling:', err.message);
          fetchTodos();
        }
      );
    } catch (err) {
      console.warn('Realtime subscription error:', err);
      fetchTodos();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, checkHealth, fetchTodos]);

  // Derived filtered & sorted todos array
  const todos = useMemo(() => {
    let result = [...rawTodos];

    // Search filter (Title, Description, or Subtasks)
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (Array.isArray(t.subtasks) &&
            t.subtasks.some((s) => s.title && s.title.toLowerCase().includes(q)))
      );
    }

    // Status filter
    if (activeStatus === 'completed') {
      result = result.filter((t) => t.completed || t.kanbanStatus === 'done');
    } else if (activeStatus === 'pending') {
      result = result.filter((t) => !t.completed && t.kanbanStatus !== 'done');
    } else if (activeStatus === 'overdue') {
      const now = new Date();
      result = result.filter(
        (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
      );
    }

    // Priority filter
    if (activePriority !== 'all') {
      const p = activePriority.toLowerCase();
      result = result.filter((t) => (t.priority || '').toLowerCase() === p);
    }

    // Category filter
    if (activeCategory !== 'all') {
      const c = activeCategory.toLowerCase();
      result = result.filter((t) => (t.category || '').toLowerCase() === c);
    }

    // Due Date Filter
    if (dueDateFilter !== 'all') {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
      const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (dueDateFilter === 'today') {
        result = result.filter((t) => {
          if (!t.dueDate) return false;
          const d = new Date(t.dueDate);
          return d >= todayStart && d < todayEnd;
        });
      } else if (dueDateFilter === 'this-week') {
        result = result.filter((t) => {
          if (!t.dueDate) return false;
          const d = new Date(t.dueDate);
          return d >= todayStart && d < weekEnd;
        });
      } else if (dueDateFilter === 'overdue') {
        result = result.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < now);
      }
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'priority') {
        const weights = { high: 3, medium: 2, low: 1 };
        valA = weights[(a.priority || '').toLowerCase()] || 0;
        valB = weights[(b.priority || '').toLowerCase()] || 0;
      } else if (sortBy === 'title') {
        valA = (a.title || '').toLowerCase();
        valB = (b.title || '').toLowerCase();
      } else if (sortBy === 'createdAt' || sortBy === 'dueDate') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    rawTodos,
    activeStatus,
    activePriority,
    activeCategory,
    dueDateFilter,
    searchTerm,
    sortBy,
    order,
  ]);

  // Derived stats array
  const stats = useMemo(() => {
    const now = new Date();
    const total = rawTodos.length;
    const completed = rawTodos.filter((t) => t.completed || t.kanbanStatus === 'done').length;
    const pending = total - completed;
    const highPriority = rawTodos.filter(
      (t) => (t.priority || '').toLowerCase() === 'high'
    ).length;
    const overdue = rawTodos.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
    ).length;

    return {
      total,
      completed,
      pending,
      highPriority,
      overdue,
      totalTodos: total,
      completedTodos: completed,
      pendingTodos: pending,
      highPriorityTodos: highPriority,
      overdueTodos: overdue,
    };
  }, [rawTodos]);

  // Add Todo (Optimistic)
  const addTodo = async (todoData) => {
    if (!userId) {
      toast.error('You must be logged in to create tasks');
      return;
    }
    const tempId = 'temp-' + Date.now();
    const newTodoPayload = {
      id: tempId,
      _id: tempId,
      userId: userId,
      title: todoData.title?.trim() || '',
      description: todoData.description?.trim() || '',
      completed: Boolean(todoData.completed),
      kanbanStatus: todoData.kanbanStatus || 'todo',
      priority: (todoData.priority || 'medium').toLowerCase(),
      category: todoData.category || 'General',
      subtasks: Array.isArray(todoData.subtasks) ? todoData.subtasks : [],
      dueDate: todoData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRawTodos((prev) => [newTodoPayload, ...prev]);

    try {
      const res = await todoService.createTodo(newTodoPayload, userId);
      const created = res?.data?.todo;
      if (created) {
        setRawTodos((prev) =>
          prev.map((t) => (t.id === tempId || t._id === tempId ? created : t))
        );
      }
      toast.success('Task created successfully! 🎉');
      return created;
    } catch (err) {
      setRawTodos((prev) => prev.filter((t) => t.id !== tempId && t._id !== tempId));
      toast.error(err.message || 'Failed to create task');
      return null;
    }
  };

  // Update Todo (Optimistic)
  const updateTodo = async (id, todoData) => {
    const targetId = id || todoData._id || todoData.id;
    setRawTodos((prev) =>
      prev.map((t) =>
        t._id === targetId || t.id === targetId ? { ...t, ...todoData } : t
      )
    );

    try {
      const res = await todoService.updateTodo(targetId, todoData);
      toast.success('Task updated successfully! ✏️');
      return res?.data?.todo;
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      fetchTodos();
      return null;
    }
  };

  // Toggle Subtask Completion
  const toggleSubtask = async (todoId, subtaskId) => {
    const target = rawTodos.find((t) => t._id === todoId || t.id === todoId);
    if (!target) return;

    const updatedSubtasks = (target.subtasks || []).map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    const allSubtasksDone =
      updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);

    const updatedPayload = {
      subtasks: updatedSubtasks,
      completed: allSubtasksDone ? true : target.completed,
    };

    setRawTodos((prev) =>
      prev.map((t) =>
        t._id === todoId || t.id === todoId ? { ...t, ...updatedPayload } : t
      )
    );

    try {
      await todoService.updateTodo(todoId, updatedPayload);
    } catch (err) {
      console.warn('Subtask update error:', err);
      fetchTodos();
    }
  };

  // Move Kanban Column Status
  const moveKanbanStatus = async (todoId, newKanbanStatus) => {
    const isCompleted = newKanbanStatus === 'done';
    const payload = {
      kanbanStatus: newKanbanStatus,
      completed: isCompleted,
    };

    setRawTodos((prev) =>
      prev.map((t) =>
        t._id === todoId || t.id === todoId ? { ...t, ...payload } : t
      )
    );

    try {
      await todoService.updateTodo(todoId, payload);
      toast.success(`Moved to ${newKanbanStatus.toUpperCase()}! 🚀`);
    } catch (err) {
      console.warn('Kanban move error:', err);
      fetchTodos();
    }
  };

  // Toggle Todo (Optimistic - 0ms UI update)
  const toggleTodo = async (id) => {
    const targetId = id;
    const target = rawTodos.find((t) => t._id === targetId || t.id === targetId);
    if (!target) return;

    const nextCompleted = !target.completed;
    const nextKanbanStatus = nextCompleted ? 'done' : 'todo';

    setRawTodos((prev) =>
      prev.map((t) =>
        t._id === targetId || t.id === targetId
          ? { ...t, completed: nextCompleted, kanbanStatus: nextKanbanStatus }
          : t
      )
    );

    try {
      await todoService.toggleTodo(targetId, nextCompleted);
      await todoService.updateTodo(targetId, { kanbanStatus: nextKanbanStatus });
      toast.success(nextCompleted ? 'Task completed! ✅' : 'Task marked as pending ⏳');
    } catch (err) {
      toast.error(err.message || 'Failed to toggle task completion');
      setRawTodos((prev) =>
        prev.map((t) =>
          t._id === targetId || t.id === targetId
            ? { ...t, completed: target.completed, kanbanStatus: target.kanbanStatus }
            : t
        )
      );
    }
  };

  // Delete Todo (Optimistic)
  const deleteTodo = async (id) => {
    const targetId = id;
    const previousTodos = rawTodos;

    setRawTodos((prev) =>
      prev.filter((t) => t._id !== targetId && t.id !== targetId)
    );

    try {
      await todoService.deleteTodo(targetId);
      toast.success('Task deleted! 🗑️');
    } catch (err) {
      setRawTodos(previousTodos);
      toast.error(err.message || 'Failed to delete task');
    }
  };

  return {
    todos,
    stats,
    loading,
    error,
    isOnline,
    // Views & Filters
    viewMode,
    setViewMode,
    activeStatus,
    setActiveStatus,
    activePriority,
    setActivePriority,
    activeCategory,
    setActiveCategory,
    dueDateFilter,
    setDueDateFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    order,
    setOrder,
    // Actions
    addTodo,
    updateTodo,
    toggleSubtask,
    moveKanbanStatus,
    toggleTodo,
    deleteTodo,
    setRawTodos,
    refresh: fetchTodos,
  };
}
