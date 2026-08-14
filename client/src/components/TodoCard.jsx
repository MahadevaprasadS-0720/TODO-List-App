import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  ChevronUp,
  ListChecks,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TodoCard({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onToggleSubtask,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [showSubtasks, setShowSubtasks] = useState(true);

  const isCompleted = todo.completed;
  const subtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskPercentage =
    subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  // Format Due Date & Time (High Contrast Badges)
  let isOverdue = false;
  let isDueToday = false;
  let formattedDateLabel = null;

  if (todo.dueDate) {
    const d = new Date(todo.dueDate);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    isOverdue = !isCompleted && d < now;
    isDueToday = !isCompleted && d >= todayStart && d < todayEnd;

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isOverdue) {
      formattedDateLabel = `Overdue (${timeStr})`;
    } else if (isDueToday) {
      formattedDateLabel = `Due Today at ${timeStr}`;
    } else {
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      formattedDateLabel = `${dateStr} at ${timeStr}`;
    }
  }

  // Priority Color Meta (Colored Glass Effects)
  const priorityConfig = {
    high: {
      label: 'High',
      badgeClass: isDark
        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 backdrop-blur-md shadow-sm'
        : 'bg-rose-50 text-rose-700 border-rose-200 backdrop-blur-md shadow-sm',
      icon: Flame,
    },
    medium: {
      label: 'Medium',
      badgeClass: isDark
        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 backdrop-blur-md shadow-sm'
        : 'bg-amber-50 text-amber-700 border-amber-200 backdrop-blur-md shadow-sm',
      icon: Clock,
    },
    low: {
      label: 'Low',
      badgeClass: isDark
        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30 backdrop-blur-md shadow-sm'
        : 'bg-blue-50 text-blue-700 border-blue-200 backdrop-blur-md shadow-sm',
      icon: Clock,
    },
  };

  const priorityMeta = priorityConfig[todo.priority] || priorityConfig.medium;
  const PriorityIcon = priorityMeta.icon;

  // Category Color Map
  const categoryColorMap = {
    development: isDark
      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30 backdrop-blur-md'
      : 'bg-purple-50 text-purple-700 border-purple-200 backdrop-blur-md',
    work: isDark
      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30 backdrop-blur-md'
      : 'bg-blue-50 text-blue-700 border-blue-200 backdrop-blur-md',
    personal: isDark
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 backdrop-blur-md'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200 backdrop-blur-md',
    design: isDark
      ? 'bg-pink-500/15 text-pink-300 border-pink-500/30 backdrop-blur-md'
      : 'bg-pink-50 text-pink-700 border-pink-200 backdrop-blur-md',
    general: isDark
      ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 backdrop-blur-md'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200 backdrop-blur-md',
  };

  const catKey = (todo.category || 'general').toLowerCase();
  const catClass =
    categoryColorMap[catKey] ||
    (isDark
      ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 backdrop-blur-md'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200 backdrop-blur-md');

  const todoId = todo._id || todo.id;

  return (
    <div
      className={`p-5 rounded-3xl transition-all duration-300 ${
        isCompleted
          ? isDark
            ? 'bg-slate-900/30 border border-slate-800/40 opacity-70'
            : 'bg-slate-50/80 border border-slate-200/60 opacity-80'
          : isDark
          ? 'bg-gradient-to-r from-slate-900/50 via-slate-900/70 to-slate-950/80 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-indigo-500/10'
          : 'bg-white/80 border border-slate-200/90 shadow-md backdrop-blur-xl hover:border-indigo-300'
      } flex flex-col justify-between group relative mb-3`}
    >
      <div>
        {/* Header Row: Drag handle, Checkbox, Title & Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-3 flex-1 min-w-0">
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
              className={`mt-0.5 w-5 h-5 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : isDark
                  ? 'border-slate-700 bg-slate-800/60 hover:border-indigo-500'
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
              className={`text-base font-bold tracking-tight leading-snug cursor-pointer select-none transition-all ${
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

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(todo)}
              className={`p-2 rounded-xl transition ${
                isDark
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(todoId)}
              className={`p-2 rounded-xl transition ${
                isDark
                  ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
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
            className={`text-xs mb-3 leading-relaxed line-clamp-2 pl-12 font-medium ${
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

        {/* Subtasks Checklist Section */}
        {subtasks.length > 0 && (
          <div className="pl-12 mb-3">
            {/* Subtask Mini Progress Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition"
              >
                <ListChecks className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  Checklist ({completedSubtasks}/{subtasks.length})
                </span>
                {showSubtasks ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              <span className="text-[11px] font-bold text-indigo-400">
                {subtaskPercentage}%
              </span>
            </div>

            {/* Mini Progress Bar Track */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subtaskPercentage}%` }}
                transition={{ duration: 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
              />
            </div>

            {/* Subtask Checklist Items */}
            <AnimatePresence>
              {showSubtasks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => onToggleSubtask && onToggleSubtask(todoId, st.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer text-xs font-medium transition ${
                        st.completed
                          ? 'line-through text-slate-500 bg-slate-900/20'
                          : isDark
                          ? 'text-slate-200 bg-slate-900/40 hover:bg-slate-800/60'
                          : 'text-slate-800 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-lg border flex items-center justify-center shrink-0 ${
                          st.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{st.title}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/40 dark:border-slate-800/60 pl-12">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${priorityMeta.badgeClass}`}
          >
            <PriorityIcon className="w-3 h-3" />
            <span>{priorityMeta.label}</span>
          </span>

          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${catClass}`}
          >
            <Tag className="w-3 h-3" />
            <span>{todo.category || 'General'}</span>
          </span>
        </div>

        {/* High-Contrast Due Date Indicator Badges */}
        {formattedDateLabel && (
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${
              isOverdue
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20 animate-pulse'
                : isDueToday
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>{formattedDateLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
