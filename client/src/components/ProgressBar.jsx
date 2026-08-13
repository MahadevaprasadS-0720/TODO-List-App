import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ProgressBar({ stats }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const total = stats?.total ?? stats?.totalTodos ?? 0;
  const completed = stats?.completed ?? stats?.completedTodos ?? 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Dynamic motivation text
  let motivation = "🌱 Let's get started!";
  if (percentage === 100 && total > 0) {
    motivation = '🎉 All tasks completed! You are awesome!';
  } else if (percentage >= 75) {
    motivation = '🔥 Almost at the finish line!';
  } else if (percentage >= 50) {
    motivation = '⚡ Over halfway there!';
  } else if (percentage > 0) {
    motivation = '🚀 Good momentum, keep going!';
  }

  return (
    <div
      className={`p-5 rounded-2xl border mb-6 transition-all duration-300 ${
        isDark ? 'glass-card-dark' : 'glass-card-light'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Completion Progress</h3>
            <p className="text-xs text-slate-400">
              {completed} of {total} tasks completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{motivation}</span>
          </span>
          <span className="text-lg font-extrabold text-indigo-500 dark:text-indigo-400">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm shadow-indigo-500/50"
        />
      </div>
    </div>
  );
}
