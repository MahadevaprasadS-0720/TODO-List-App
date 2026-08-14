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

  // Dynamic high-end motivation text
  let motivation = "🌱 Let's get started!";
  if (percentage === 100 && total > 0) {
    motivation = '🎉 All tasks completed! Excellent work!';
  } else if (percentage >= 75) {
    motivation = '🔥 Almost at the finish line!';
  } else if (percentage >= 50) {
    motivation = '⚡ Over halfway there!';
  } else if (percentage > 0) {
    motivation = '🚀 Great momentum, keep going!';
  }

  return (
    <div
      className={`p-6 rounded-3xl mb-6 transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-xl'
          : 'bg-white/80 border border-slate-200 shadow-lg backdrop-blur-xl'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/25 border border-white/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight">Completion Progress</h3>
            <p className="text-xs text-slate-400 font-medium">
              {completed} of {total} tasks completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{motivation}</span>
          </span>
          <span className="text-xl font-extrabold text-indigo-400">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3 rounded-full bg-slate-950/80 overflow-hidden p-0.5 border border-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-md shadow-indigo-500/40"
        />
      </div>
    </div>
  );
}
