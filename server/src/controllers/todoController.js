import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import { isConnectedToDB } from '../config/db.js';
import { getStoredTodos, saveStoredTodos } from '../services/fileStore.js';

// Helper to check if Mongoose is fully connected and ready to execute queries
const isDbReady = () => isConnectedToDB && mongoose.connection.readyState === 1;

// Helper to generate unique IDs
const generateId = () => 'task_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

// Helper for file-store query filtering & sorting
const getFileStoreTodos = (query = {}) => {
  const { completed, priority, category, search, sortBy, order } = query;
  let filtered = getStoredTodos();

  if (completed !== undefined) {
    const isComp = completed === 'true';
    filtered = filtered.filter((t) => Boolean(t.completed) === isComp);
  }

  if (priority && priority !== 'all') {
    filtered = filtered.filter((t) => t.priority === priority);
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((t) =>
      (t.category || '').toLowerCase().includes(category.toLowerCase())
    );
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        (t.title || '').toLowerCase().includes(term) ||
        (t.description || '').toLowerCase().includes(term)
    );
  }

  const sortField = sortBy || 'createdAt';
  const sortDir = order === 'asc' ? 1 : -1;

  filtered.sort((a, b) => {
    if (sortField === 'priority') {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      const pA = priorityMap[a.priority] || 0;
      const pB = priorityMap[b.priority] || 0;
      return (pA - pB) * sortDir;
    } else if (sortField === 'dueDate') {
      const dA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return (dA - dB) * sortDir;
    } else if (sortField === 'title') {
      return (a.title || '').localeCompare(b.title || '') * sortDir;
    } else {
      const cA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const cB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return (cA - cB) * sortDir;
    }
  });

  return filtered;
};

// Helper for file-store stats calculation
const getFileStoreStats = () => {
  const now = new Date();
  const todos = getStoredTodos();
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.filter((t) => !t.completed).length;
  const overdue = todos.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
  ).length;

  const byPriority = { high: 0, medium: 0, low: 0 };
  const byCategory = {};

  todos.forEach((t) => {
    if (byPriority[t.priority] !== undefined) {
      byPriority[t.priority]++;
    }
    if (t.category) {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    }
  });

  return {
    total,
    completed,
    pending,
    overdue,
    byPriority,
    byCategory,
  };
};

/**
 * @desc    Create a new Todo item
 * @route   POST /api/todos
 * @access  Public
 */
export const createTodo = async (req, res, next) => {
  try {
    const { title, description, completed, priority, category, dueDate } = req.body;

    if (isDbReady()) {
      try {
        const todo = await Todo.create({
          title,
          description,
          completed,
          priority,
          category,
          dueDate,
        });

        return res.status(201).json({
          status: 'success',
          data: { todo },
        });
      } catch (err) {
        console.warn('[MongoDB Create Warning] Falling back to file store:', err.message);
      }
    }

    // File-store Fallback
    const todos = getStoredTodos();
    const newTodo = {
      _id: generateId(),
      title,
      description: description || '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    todos.unshift(newTodo);
    saveStoredTodos(todos);

    return res.status(201).json({
      status: 'success',
      data: { todo: newTodo },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all Todo items with filtering, title search, and custom sorting
 * @route   GET /api/todos
 * @access  Public
 */
export const getTodos = async (req, res, next) => {
  try {
    if (isDbReady()) {
      try {
        const { completed, priority, category, search, sortBy, order } = req.query;
        const filter = {};

        if (completed !== undefined) {
          filter.completed = completed === 'true';
        }
        if (priority && priority !== 'all') {
          filter.priority = priority;
        }
        if (category && category !== 'all') {
          filter.category = { $regex: category, $options: 'i' };
        }
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ];
        }

        const sortField = sortBy || 'createdAt';
        const sortDirection = order === 'asc' ? 1 : -1;
        let todos;

        if (sortField === 'priority') {
          todos = await Todo.aggregate([
            { $match: filter },
            {
              $addFields: {
                priorityOrder: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$priority', 'high'] }, then: 3 },
                      { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                      { case: { $eq: ['$priority', 'low'] }, then: 1 },
                    ],
                    default: 0,
                  },
                },
              },
            },
            { $sort: { priorityOrder: sortDirection, createdAt: -1 } },
            { $project: { priorityOrder: 0 } },
          ]);
        } else {
          todos = await Todo.find(filter).sort({ [sortField]: sortDirection });
        }

        return res.status(200).json({
          status: 'success',
          count: todos.length,
          data: { todos },
        });
      } catch (err) {
        console.warn('[MongoDB Get Warning] Falling back to file store:', err.message);
      }
    }

    // File-store Fallback
    const filtered = getFileStoreTodos(req.query);
    return res.status(200).json({
      status: 'success',
      count: filtered.length,
      data: { todos: filtered },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get summary statistics for Todo items
 * @route   GET /api/todos/stats
 * @access  Public
 */
export const getTodoStats = async (req, res, next) => {
  try {
    if (isDbReady()) {
      try {
        const now = new Date();
        const [
          total,
          completed,
          pending,
          overdue,
          priorityCounts,
          categoryCounts,
        ] = await Promise.all([
          Todo.countDocuments({}),
          Todo.countDocuments({ completed: true }),
          Todo.countDocuments({ completed: false }),
          Todo.countDocuments({ completed: false, dueDate: { $ne: null, $lt: now } }),
          Todo.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
          Todo.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
        ]);

        const byPriority = { high: 0, medium: 0, low: 0 };
        priorityCounts.forEach((item) => {
          if (item._id && byPriority[item._id] !== undefined) {
            byPriority[item._id] = item.count;
          }
        });

        const byCategory = {};
        categoryCounts.forEach((item) => {
          if (item._id) {
            byCategory[item._id] = item.count;
          }
        });

        return res.status(200).json({
          status: 'success',
          data: {
            stats: {
              total,
              completed,
              pending,
              overdue,
              byPriority,
              byCategory,
            },
          },
        });
      } catch (err) {
        console.warn('[MongoDB Stats Warning] Falling back to file store:', err.message);
      }
    }

    // File-store Fallback
    const stats = getFileStoreStats();
    return res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single Todo by ID
 * @route   GET /api/todos/:id
 * @access  Public
 */
export const getTodoById = async (req, res, next) => {
  try {
    if (isDbReady()) {
      try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
          return res.status(200).json({
            status: 'success',
            data: { todo },
          });
        }
      } catch (err) {
        console.warn('[MongoDB GetById Warning] Falling back to file store:', err.message);
      }
    }

    const todos = getStoredTodos();
    const todo = todos.find((t) => t._id === req.params.id);
    if (!todo) {
      return res.status(404).json({
        status: 'fail',
        message: `Todo not found with ID: ${req.params.id}`,
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing Todo by ID
 * @route   PUT /api/todos/:id
 * @access  Public
 */
export const updateTodo = async (req, res, next) => {
  try {
    if (isDbReady()) {
      try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });

        if (todo) {
          return res.status(200).json({
            status: 'success',
            data: { todo },
          });
        }
      } catch (err) {
        console.warn('[MongoDB Update Warning] Falling back to file store:', err.message);
      }
    }

    const todos = getStoredTodos();
    const index = todos.findIndex((t) => t._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: `Todo not found with ID: ${req.params.id}`,
      });
    }

    todos[index] = {
      ...todos[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveStoredTodos(todos);

    return res.status(200).json({
      status: 'success',
      data: { todo: todos[index] },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a Todo by ID
 * @route   DELETE /api/todos/:id
 * @access  Public
 */
export const deleteTodo = async (req, res, next) => {
  try {
    if (isDbReady()) {
      try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (todo) {
          return res.status(200).json({
            status: 'success',
            message: 'Todo item deleted successfully',
            data: null,
          });
        }
      } catch (err) {
        console.warn('[MongoDB Delete Warning] Falling back to file store:', err.message);
      }
    }

    const todos = getStoredTodos();
    const index = todos.findIndex((t) => t._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: `Todo not found with ID: ${req.params.id}`,
      });
    }

    todos.splice(index, 1);
    saveStoredTodos(todos);

    return res.status(200).json({
      status: 'success',
      message: 'Todo item deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle the completed status of a Todo by ID
 * @route   PATCH /api/todos/:id/toggle
 * @access  Public
 */
export const toggleTodoComplete = async (req, res, next) => {
  try {
    if (isDbReady()) {
      try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
          todo.completed = !todo.completed;
          await todo.save();

          return res.status(200).json({
            status: 'success',
            message: `Todo marked as ${todo.completed ? 'completed' : 'pending'}`,
            data: { todo },
          });
        }
      } catch (err) {
        console.warn('[MongoDB Toggle Warning] Falling back to file store:', err.message);
      }
    }

    const todos = getStoredTodos();
    const todo = todos.find((t) => t._id === req.params.id);
    if (!todo) {
      return res.status(404).json({
        status: 'fail',
        message: `Todo not found with ID: ${req.params.id}`,
      });
    }

    todo.completed = !todo.completed;
    todo.updatedAt = new Date().toISOString();
    saveStoredTodos(todos);

    return res.status(200).json({
      status: 'success',
      message: `Todo marked as ${todo.completed ? 'completed' : 'pending'}`,
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};
