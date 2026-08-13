import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import TodoCard from './TodoCard';
import SkeletonLoader from './SkeletonLoader';
import { Plus, Sparkles, FolderOpen, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TodoList({
  todos,
  loading = false,
  activeStatus = 'all',
  onReorder,
  onToggle,
  onEdit,
  onDelete,
  onOpenAddModal,
  searchTerm,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading) {
    return <SkeletonLoader count={3} />;
  }

  // Tailored Empty States
  const emptyStateConfig = {
    all: {
      icon: FolderOpen,
      title: 'No tasks found',
      subtitle: searchTerm
        ? `No tasks match search "${searchTerm}".`
        : 'You have no tasks in your workspace. Add one to get started!',
    },
    pending: {
      icon: Clock,
      title: 'No pending tasks',
      subtitle: 'Great job! You have no active tasks waiting for completion.',
    },
    completed: {
      icon: CheckCircle2,
      title: 'No completed tasks yet',
      subtitle: 'Complete tasks from your pending list to see them here.',
    },
    overdue: {
      icon: AlertTriangle,
      title: 'No overdue tasks',
      subtitle: 'Awesome! All your scheduled tasks are on time or completed.',
    },
  };

  const emptyMeta = emptyStateConfig[activeStatus] || emptyStateConfig.all;
  const EmptyIcon = emptyMeta.icon;

  if (!todos || todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className={`p-12 rounded-3xl border text-center flex flex-col items-center justify-center my-6 ${
          isDark ? 'glass-card-dark' : 'glass-card-light'
        }`}
      >
        <div className="relative mb-5">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <EmptyIcon className="w-12 h-12" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-indigo-500 text-white rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2">{emptyMeta.title}</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
          {emptyMeta.subtitle}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={todos}
      onReorder={onReorder}
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <Reorder.Item
            key={todo._id}
            value={todo}
            id={todo._id}
            whileDrag={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}
          >
            <TodoCard
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
