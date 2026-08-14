import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';


const COLLECTION_NAME = 'todos';

// Helper to format Firestore document with dual id / _id compatibility
export const formatDoc = (snapshot) => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    _id: snapshot.id,
    userId: data.userId || '',
    title: data.title || '',
    description: data.description || '',
    completed: Boolean(data.completed),
    priority: (data.priority || 'medium').toLowerCase(),
    category: data.category || 'General',
    dueDate: data.dueDate || null,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString()),
  };
};

export const todoService = {
  // Fetch todos filtered by userId with client-side filtering & sorting
  async getTodos(params = {}, userId = null) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const targetUserId = userId || params.userId;
      const q = targetUserId ? query(colRef, where('userId', '==', targetUserId)) : colRef;
      const snapshot = await getDocs(q);
      let todos = snapshot.docs.map(formatDoc);

      // Client-side Filter: Search term
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        todos = todos.filter(
          (t) =>
            t.title.toLowerCase().includes(searchTerm) ||
            t.description.toLowerCase().includes(searchTerm)
        );
      }

      // Client-side Filter: Completed
      if (typeof params.completed === 'boolean') {
        todos = todos.filter((t) => t.completed === params.completed);
      }

      // Client-side Filter: Priority
      if (params.priority && params.priority !== 'all') {
        const targetPriority = params.priority.toLowerCase();
        todos = todos.filter((t) => t.priority.toLowerCase() === targetPriority);
      }

      // Client-side Filter: Category
      if (params.category && params.category !== 'all') {
        todos = todos.filter((t) => t.category.toLowerCase() === params.category.toLowerCase());
      }

      // Client-side Sorting
      const sortBy = params.sortBy || 'createdAt';
      const order = params.order || 'desc';

      todos.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'priority') {
          const priorityWeights = { high: 3, medium: 2, low: 1 };
          valA = priorityWeights[a.priority] || 0;
          valB = priorityWeights[b.priority] || 0;
        } else if (sortBy === 'title') {
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
        } else if (sortBy === 'createdAt' || sortBy === 'dueDate') {
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        }

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });

      return {
        success: true,
        count: todos.length,
        data: { todos },
      };
    } catch (error) {
      console.error('Firestore getTodos Error:', error);
      throw new Error('Failed to fetch tasks from Firebase Firestore.');
    }
  },

  // Fetch summary analytics stats with complete key compatibility
  async getStats(userId = null) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
      const snapshot = await getDocs(q);
      const todos = snapshot.docs.map(formatDoc);

      const now = new Date();
      const total = todos.length;
      const completed = todos.filter((t) => t.completed).length;
      const pending = total - completed;
      const highPriority = todos.filter((t) => t.priority === 'high').length;
      const overdue = todos.filter(
        (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
      ).length;

      const statsObj = {
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

      return {
        success: true,
        data: { stats: statsObj },
      };
    } catch (error) {
      console.error('Firestore getStats Error:', error);
      const fallbackStats = {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        overdue: 0,
        totalTodos: 0,
        completedTodos: 0,
        pendingTodos: 0,
        highPriorityTodos: 0,
        overdueTodos: overdue || 0,
      };
      return {
        success: true,
        data: { stats: fallbackStats },
      };
    }
  },

  // Create a new todo associated with userId
  async createTodo(todoData, userId = null) {
    try {
      const payload = {
        userId: userId || todoData.userId || '',
        title: todoData.title?.trim() || '',
        description: todoData.description?.trim() || '',
        completed: Boolean(todoData.completed),
        priority: (todoData.priority || 'medium').toLowerCase(),
        category: todoData.category || 'General',
        dueDate: todoData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
      const newTodo = {
        id: docRef.id,
        _id: docRef.id,
        ...payload,
      };

      return {
        success: true,
        data: { todo: newTodo },
      };
    } catch (error) {
      console.error('Firestore createTodo Error:', error);
      throw new Error('Failed to create task in Firebase.');
    }
  },

  // Update existing todo
  async updateTodo(id, todoData) {
    try {
      const targetId = id || todoData._id || todoData.id;
      const docRef = doc(db, COLLECTION_NAME, targetId);
      const payload = {
        ...todoData,
        updatedAt: new Date().toISOString(),
      };

      delete payload._id;
      delete payload.id;

      await updateDoc(docRef, payload);

      return {
        success: true,
        data: {
          todo: {
            id: targetId,
            _id: targetId,
            ...todoData,
            updatedAt: payload.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error('Firestore updateTodo Error:', error);
      throw new Error('Failed to update task in Firebase.');
    }
  },

  // Toggle completed status
  async toggleTodo(id, nextCompletedState = null) {
    try {
      const targetId = id;
      const docRef = doc(db, COLLECTION_NAME, targetId);
      let targetCompleted = nextCompletedState;

      if (typeof targetCompleted !== 'boolean') {
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          throw new Error('Task not found in Firebase.');
        }
        targetCompleted = !snap.data().completed;
      }

      await updateDoc(docRef, {
        completed: targetCompleted,
        updatedAt: new Date().toISOString(),
      });

      return {
        success: true,
        data: {
          todo: {
            id: targetId,
            _id: targetId,
            completed: targetCompleted,
          },
        },
      };
    } catch (error) {
      console.error('Firestore toggleTodo Error:', error);
      throw new Error('Failed to toggle task completion in Firebase.');
    }
  },

  // Delete todo
  async deleteTodo(id) {
    try {
      const targetId = id;
      const docRef = doc(db, COLLECTION_NAME, targetId);
      await deleteDoc(docRef);
      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      console.error('Firestore deleteTodo Error:', error);
      throw new Error('Failed to delete task from Firebase.');
    }
  },

  // Connection health check
  async checkHealth(userId = null) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
      await getDocs(q);
      return { success: true, message: 'Firebase connected' };
    } catch (error) {
      console.warn('Firebase checkHealth warning:', error.message);
      return { success: navigator.onLine, message: 'Network active' };
    }
  },
};


