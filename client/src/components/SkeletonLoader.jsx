import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SkeletonLoader({ count = 3 }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl border animate-pulse flex flex-col justify-between ${
            isDark
              ? 'bg-slate-900/40 border-slate-800/60'
              : 'bg-white/60 border-slate-200/80'
          }`}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-5 h-5 rounded-lg bg-slate-700/40 dark:bg-slate-800/60" />
              <div className="h-5 bg-slate-700/40 dark:bg-slate-800/60 rounded-md w-2/3" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-lg bg-slate-700/40 dark:bg-slate-800/60" />
              <div className="w-6 h-6 rounded-lg bg-slate-700/40 dark:bg-slate-800/60" />
            </div>
          </div>

          {/* Description line */}
          <div className="pl-8 mb-4">
            <div className="h-3 bg-slate-700/30 dark:bg-slate-800/40 rounded-md w-5/6 mb-1.5" />
            <div className="h-3 bg-slate-700/30 dark:bg-slate-800/40 rounded-md w-1/2" />
          </div>

          {/* Footer Badges */}
          <div className="pl-8 pt-3 border-t border-slate-800/30 dark:border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded-full bg-slate-700/40 dark:bg-slate-800/60" />
              <div className="h-5 w-20 rounded-full bg-slate-700/40 dark:bg-slate-800/60" />
            </div>
            <div className="h-4 w-24 rounded-md bg-slate-700/30 dark:bg-slate-800/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
