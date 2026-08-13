import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Calendar,
  Tag,
  Flame,
  Clock,
  Trash2,
  Edit2,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TodoCard({ todo, onToggle, onEdit, onDelete, dragControls }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isCompleted = todo.completed;

  // Format Due Date & Overdue Status
  let isOverdue = false;
  let formattedDate = null;
  if (todo.dueDate) {
    const d = new Date(todo.dueDate);
    isOverdue = !isCompleted && d < new Date();
    formattedDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Priority Color Meta
  const priorityConfig = {
    high: {
      label: 'High',
      badgeClass: isDark
        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
        : 'bg-rose-50 text-rose-600 border-rose-200',
      icon: Flame,
    },
    medium: {
      label: 'Medium',
      badgeClass: isDark
        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
        : 'bg-amber-50 text-amber-600 border-amber-200',
      icon: Clock,
    },
    low: {
      label: 'Low',
      badgeClass: isDark
        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
        : 'bg-blue-50 text-blue-600 border-blue-200',
      icon: Clock,
    },
  };

  const priorityMeta = priorityConfig[todo.priority] || priorityConfig.medium;
  const PriorityIcon = priorityMeta.icon;

  // Category Color Map
  const categoryColorMap = {
    development: isDark
      ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
      : 'bg-indigo-50 text-indigo-600 border-indigo-200',
    work: isDark
      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      : 'bg-blue-50 text-blue-600 border-blue-200',
    personal: isDark
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    design: isDark
      ? 'bg-pink-500/15 text-pink-400 border-pink-500/30'
      : 'bg-pink-50 text-pink-600 border-pink-200',
    general: isDark
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-amber-50 text-amber-600 border-amber-200',
  };

  const catKey = (todo.category || 'general').toLowerCase();
  const catClass =
    categoryColorMap[catKey] ||
    (isDark
      ? 'bg-slate-800/60 text-slate-300 border-slate-700/60'
      : 'bg-slate-100 text-slate-600 border-slate-200');

  const todoId = todo._id || todo.id;

  return (
    <div
      className={`p-5 rounded-2xl transition-all duration-300 border ${
        isCompleted
          ? isDark
            ? 'bg-slate-900/30 border-slate-800/40 opacity-70'
            : 'bg-slate-50/80 border-slate-200/60 opacity-80'
          : isDark
          ? 'glass-card-dark hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-500/5'
          : 'glass-card-light hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50'
      } flex flex-col justify-between group relative`}
    >
      <div>
        {/* Header Row: Drag handle, Checkbox, Title & Actions */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Drag Handle Icon */}
            <div
              className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-200 p-0.5 opacity-60 group-hover:opacity-100 transition"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Animated Checkbox */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onToggle(todoId)}
              className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : isDark
                  ? 'border-slate-700 bg-slate-800/50 hover:border-indigo-500'
                  : 'border-slate-300 bg-white hover:border-indigo-500'
              }`}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
            >
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </motion.div>
              )}
            </motion.button>

            {/* Title */}
            <h4
              onClick={() => onToggle(todoId)}
              className={`text-base font-semibold tracking-tight leading-snug cursor-pointer select-none transition-all ${
                isCompleted
                  ? 'line-through text-slate-500 dark:text-slate-500'
                  : isDark
                  ? 'text-slate-100 group-hover:text-indigo-400'
                  : 'text-slate-800 group-hover:text-indigo-600'
              }`}
            >
              {todo.title}
            </h4>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(todo)}
              className={`p-1.5 rounded-lg transition ${
                isDark
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
              }`}
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(todoId)}
              className={`p-1.5 rounded-lg transition ${
                isDark
                  ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p
            className={`text-sm mb-4 leading-relaxed line-clamp-2 pl-12 ${
              isCompleted
                ? 'line-through text-slate-500/70'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            {todo.description}
          </p>
        )}
      </div>

      {/* Footer Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/40 dark:border-slate-800/60 pl-12">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityMeta.badgeClass}`}
          >
            <PriorityIcon className="w-3 h-3" />
            <span>{priorityMeta.label}</span>
          </span>

          {/* Category Color Badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${catClass}`}
          >
            <Tag className="w-3 h-3" />
            <span>{todo.category || 'General'}</span>
          </span>
        </div>

        {/* Due Date Indicator */}
        {formattedDate && (
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              isOverdue
                ? 'text-rose-500 dark:text-rose-400 font-semibold'
                : 'text-slate-400 dark:text-slate-400'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>{isOverdue ? `Overdue: ${formattedDate}` : formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
