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

  // Filters & Sorting
  const [activeStatus, setActiveStatus] = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
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


  // Fetch Raw Todos once or on manual refresh for current user
  const fetchTodos = useCallback(async () => {
    if (!userId) {
      setRawTodos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await todoService.getTodos({}, userId);
      if (res?.data?.todos) {
        setRawTodos(res.data.todos);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
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

  // Derived filtered & sorted todos array (Instant recalculation on filter change)
  const todos = useMemo(() => {
    let result = [...rawTodos];

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (activeStatus === 'completed') {
      result = result.filter((t) => t.completed);
    } else if (activeStatus === 'pending') {
      result = result.filter((t) => !t.completed);
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
  }, [rawTodos, activeStatus, activePriority, activeCategory, searchTerm, sortBy, order]);

  // Derived stats array (0ms instant calculation)
  const stats = useMemo(() => {
    const now = new Date();
    const total = rawTodos.length;
    const completed = rawTodos.filter((t) => t.completed).length;
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
      priority: (todoData.priority || 'medium').toLowerCase(),
      category: todoData.category || 'General',
      dueDate: todoData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRawTodos((prev) => [newTodoPayload, ...prev]);

    try {
      const res = await todoService.createTodo(todoData, userId);
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
      throw err;
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
      throw err;
    }
  };

  // Toggle Todo (Optimistic - 0ms UI update)
  const toggleTodo = async (id) => {
    const targetId = id;
    const target = rawTodos.find((t) => t._id === targetId || t.id === targetId);
    if (!target) return;

    const nextCompleted = !target.completed;

    // Instant state mutation
    setRawTodos((prev) =>
      prev.map((t) =>
        t._id === targetId || t.id === targetId ? { ...t, completed: nextCompleted } : t
      )
    );

    try {
      await todoService.toggleTodo(targetId, nextCompleted);
      toast.success(nextCompleted ? 'Task completed! ✅' : 'Task marked as pending ⏳');
    } catch (err) {
      toast.error(err.message || 'Failed to toggle task completion');
      // Rollback on failure
      setRawTodos((prev) =>
        prev.map((t) =>
          t._id === targetId || t.id === targetId ? { ...t, completed: target.completed } : t
        )
      );
    }
  };

  // Delete Todo (Optimistic - 0ms UI update)
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
    // Filters & Setters
    activeStatus,
    setActiveStatus,
    activePriority,
    setActivePriority,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    order,
    setOrder,
    // Actions
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    setRawTodos,
    refresh: fetchTodos,
  };
}

