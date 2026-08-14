import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit2,
  Plus,
  Flame,
  Tag,
  Check,
  Layers,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function KanbanBoard({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onOpenAddModal,
  onMoveKanbanStatus,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Categorize tasks into 3 columns
  const todoColumn = todos.filter(
    (t) => !t.completed && (!t.kanbanStatus || t.kanbanStatus === 'todo')
  );
  const inProgressColumn = todos.filter(
    (t) => !t.completed && t.kanbanStatus === 'in-progress'
  );
  const doneColumn = todos.filter((t) => t.completed || t.kanbanStatus === 'done');

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: todoColumn,
      accentColor: 'from-amber-500 to-orange-500',
      badgeClass: isDark
        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
        : 'bg-amber-50 text-amber-600 border-amber-200',
      nextStatus: 'in-progress',
      nextLabel: 'In Progress',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: inProgressColumn,
      accentColor: 'from-indigo-500 to-purple-500',
      badgeClass: isDark
        ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
        : 'bg-indigo-50 text-indigo-600 border-indigo-200',
      prevStatus: 'todo',
      prevLabel: 'To Do',
      nextStatus: 'done',
      nextLabel: 'Done',
    },
    {
      id: 'done',
      title: 'Done',
      tasks: doneColumn,
      accentColor: 'from-emerald-500 to-teal-500',
      badgeClass: isDark
        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        : 'bg-emerald-50 text-emerald-600 border-emerald-200',
      prevStatus: 'in-progress',
      prevLabel: 'In Progress',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      {columns.map((col) => (
        <div
          key={col.id}
          className={`p-5 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
            isDark
              ? 'bg-gradient-to-br from-slate-900/50 via-slate-900/70 to-slate-950/80 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-xl'
              : 'bg-white/80 border border-slate-200 shadow-lg backdrop-blur-xl'
          } min-h-[500px]`}
        >
          {/* Column Header */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${col.accentColor}`} />
                <h3 className="font-extrabold text-base tracking-tight">{col.title}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${col.badgeClass}`}
                >
                  {col.tasks.length}
                </span>
              </div>

              {col.id === 'todo' && (
                <button
                  onClick={onOpenAddModal}
                  className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition"
                  title="Add Task to To Do"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task Cards Column Body */}
            <div className="space-y-4">
              {col.tasks.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-800/40 dark:border-slate-800/60 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium">No tasks in {col.title}</p>
                </div>
              ) : (
                col.tasks.map((todo) => {
                  const todoId = todo._id || todo.id;
                  const subtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
                  const completedSubtasks = subtasks.filter((s) => s.completed).length;

                  return (
                    <motion.div
                      key={todoId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 rounded-2xl border transition-all duration-300 ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      } shadow-sm group`}
                    >
                      {/* Title & Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4
                          className={`text-sm font-bold leading-snug ${
                            todo.completed
                              ? 'line-through text-slate-500'
                              : isDark
                              ? 'text-slate-100'
                              : 'text-slate-800'
                          }`}
                        >
                          {todo.title}
                        </h4>

                        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(todo)}
                            className="p-1 text-slate-400 hover:text-indigo-400 p-0.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(todoId)}
                            className="p-1 text-slate-400 hover:text-rose-400 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtask Mini Progress Bar if subtasks exist */}
                      {subtasks.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span>Checklist</span>
                            <span>
                              {completedSubtasks}/{subtasks.length}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                              style={{
                                width: `${Math.round((completedSubtasks / subtasks.length) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tags & Move Column Controls */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/40 text-[11px] font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                            {todo.category || 'General'}
                          </span>
                        </div>

                        {/* Move Status Controls */}
                        <div className="flex items-center gap-1">
                          {col.prevStatus && (
                            <button
                              onClick={() => onMoveKanbanStatus(todoId, col.prevStatus)}
                              className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1 text-[10px]"
                              title={`Move to ${col.prevLabel}`}
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {col.nextStatus && (
                            <button
                              onClick={() => onMoveKanbanStatus(todoId, col.nextStatus)}
                              className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition flex items-center gap-1 text-[10px] font-bold px-2 py-1 shadow-sm"
                              title={`Move to ${col.nextLabel}`}
                            >
                              <span>{col.nextLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
