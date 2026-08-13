import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, Tag, Flame, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AddTodoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setCategory(initialData.category || 'General');
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('General');
      setDueDate('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Keyboard Shortcuts: Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Task title cannot exceed 200 characters';
    }

    if (dueDate) {
      const selected = new Date(dueDate);
      if (isNaN(selected.getTime())) {
        newErrors.dueDate = 'Please select a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim() || 'General',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
  };

  const categories = ['General', 'Work', 'Personal', 'Development', 'Design'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl z-10 ${
              isDark
                ? 'glass-panel-dark text-slate-100'
                : 'glass-panel-light text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/40 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {initialData ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Esc</kbd> to close or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd> to submit
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    errors.title
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : isDark
                      ? 'bg-slate-900/80 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400'
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add optional notes, links, or instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition resize-none ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* Priority & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Priority
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900/40 dark:bg-slate-900/80 border border-slate-800">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-1.5 text-xs font-medium capitalize rounded-lg transition-all ${
                          priority === p
                            ? p === 'high'
                              ? 'bg-rose-500 text-white shadow-sm'
                              : p === 'medium'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-blue-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none transition ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 focus:border-indigo-500 text-white'
                        : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: null }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    errors.dueDate
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : isDark
                      ? 'bg-slate-900/80 border-slate-800 focus:border-indigo-500 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900'
                  }`}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.dueDate}</span>
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{initialData ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
