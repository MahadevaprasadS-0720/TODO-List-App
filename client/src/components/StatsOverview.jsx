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
      subtext: `${completionPercentage}% completion rate`,
      icon: Layers,
      accentColor: 'from-cyan-500 to-teal-500',
      badgeClass: isDark
        ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10'
        : 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
    {
      title: 'Completed',
      value: completed,
      subtext: 'Finished goals',
      icon: CheckCircle2,
      accentColor: 'from-emerald-500 to-green-500',
      badgeClass: isDark
        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
        : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Pending',
      value: pending,
      subtext: 'Active in progress',
      icon: Clock,
      accentColor: 'from-amber-500 to-orange-500',
      badgeClass: isDark
        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10'
        : 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Overdue',
      value: overdue,
      subtext: overdue > 0 ? 'Requires action' : 'All clear',
      icon: AlertTriangle,
      accentColor: 'from-rose-500 to-pink-500',
      badgeClass: isDark
        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10'
        : 'bg-rose-50 text-rose-600 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`p-5 rounded-3xl transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-xl'
                : 'bg-white/80 border border-slate-200 shadow-lg backdrop-blur-xl'
            } flex items-center justify-between relative overflow-hidden group hover:-translate-y-1`}
          >
            {/* Top Accent Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor}`}
            />

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1">
                {card.title}
              </p>
              <h3 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {card.value}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold">{card.subtext}</p>
            </div>


            <div
              className={`p-3.5 rounded-2xl border ${card.badgeClass} backdrop-blur-md transition-transform group-hover:scale-110 shadow-sm`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
