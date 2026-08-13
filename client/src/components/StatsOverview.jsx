import React from 'react';
import { Layers, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function StatsOverview({ stats }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const total = stats?.total ?? stats?.totalTodos ?? 0;
  const completed = stats?.completed ?? stats?.completedTodos ?? 0;
  const pending = stats?.pending ?? stats?.pendingTodos ?? 0;
  const overdue = stats?.overdue ?? stats?.overdueTodos ?? 0;

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      title: 'Total Tasks',
      value: total,
      subtext: `${completionPercentage}% overall completion`,
      icon: Layers,
      color: 'from-blue-500 to-indigo-600',
      badgeBg: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
      glow: 'shadow-blue-500/10',
    },
    {
      title: 'Completed',
      value: completed,
      subtext: 'Tasks marked finished',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      badgeBg: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
      glow: 'shadow-emerald-500/10',
    },
    {
      title: 'Pending',
      value: pending,
      subtext: 'Active tasks in progress',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      badgeBg: isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200',
      glow: 'shadow-amber-500/10',
    },
    {
      title: 'Overdue',
      value: overdue,
      subtext: overdue > 0 ? 'Requires immediate action' : 'No overdue tasks',
      icon: AlertTriangle,
      color: 'from-rose-500 to-pink-600',
      badgeBg: isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200',
      glow: 'shadow-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl transition-all duration-300 shadow-lg ${card.glow} hover:-translate-y-1 ${
              isDark ? 'glass-card-dark' : 'glass-card-light'
            } flex items-center justify-between relative overflow-hidden group`}
          >
            {/* Top ambient color accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-80`}
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                {card.title}
              </p>
              <h3 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {card.value}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
            </div>

            <div className={`p-3 rounded-xl border ${card.badgeBg} transition-transform group-hover:scale-110`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
