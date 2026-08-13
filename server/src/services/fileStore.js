import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');
const filePath = path.join(dataDir, 'todos.json');

// Ensure data directory and file exist
const ensureStorage = () => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      const defaultTodos = [
        {
          _id: 'task-101',
          title: '🎨 Design Ultra-Stunning Glassmorphism UI',
          description: 'Implement vibrant gradients, neon glow badges, and smooth dark/light micro-interactions.',
          completed: true,
          priority: 'high',
          category: 'Design',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'task-102',
          title: '⚡ Configure High-Performance API & Persistent Storage',
          description: 'Ensure instant CRUD operations with hybrid fallback persistence so zero data is ever lost.',
          completed: false,
          priority: 'high',
          category: 'Development',
          dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'task-103',
          title: '📱 Test Responsive Layouts across All Screen Sizes',
          description: 'Verify desktop sidebars, drawer menus, and mobile bottom floating navigation bars.',
          completed: false,
          priority: 'medium',
          category: 'Work',
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(filePath, JSON.stringify(defaultTodos, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[FileStore Error] Failed to initialize storage:', err.message);
  }
};

export const getStoredTodos = () => {
  ensureStorage();
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('[FileStore Error] Failed to read todos:', err.message);
  }
  // Fallback default sample data if file read/parse fails
  const defaultTodos = [
    {
      _id: 'task-101',
      title: '🎨 Design Ultra-Stunning Glassmorphism UI',
      description: 'Implement vibrant gradients, neon glow badges, and smooth dark/light micro-interactions.',
      completed: true,
      priority: 'high',
      category: 'Design',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task-102',
      title: '⚡ Configure High-Performance API & Persistent Storage',
      description: 'Ensure instant CRUD operations with hybrid fallback persistence so zero data is ever lost.',
      completed: false,
      priority: 'high',
      category: 'Development',
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  saveStoredTodos(defaultTodos);
  return defaultTodos;
};

export const saveStoredTodos = (todos) => {
  ensureStorage();
  try {
    const list = Array.isArray(todos) ? todos : [];
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[FileStore Error] Failed to save todos:', err.message);
  }
};

