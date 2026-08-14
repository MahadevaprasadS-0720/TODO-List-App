import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ConfirmDeleteModal({
  isOpen,
  todoTitle,
  onConfirm,
  onCancel,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Keyboard Esc Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl z-10 ${
              isDark
                ? 'glass-panel-dark text-slate-100 border-rose-500/20'
                : 'glass-panel-light text-slate-800 border-rose-200'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={onCancel}
                className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <h3 className="text-xl font-extrabold tracking-tight mb-2">Delete Task?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>

            {todoTitle && (
              <div className="p-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 mb-6 truncate">
                "{todoTitle}"
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-xl shadow-rose-500/30 transition-all hover:scale-105 active:scale-95 border border-white/10"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
