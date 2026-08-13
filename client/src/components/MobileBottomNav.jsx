import React from 'react';
import { Layers, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MobileBottomNav({
  activeStatus,
  setActiveStatus,
  onOpenAddModal,
  stats,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'all', label: 'All', icon: Layers, count: stats?.total || 0 },
    { id: 'pending', label: 'Pending', icon: Clock, count: stats?.pending || 0 },
    { id: 'completed', label: 'Done', icon: CheckCircle2, count: stats?.completed || 0 },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle, count: stats?.overdue || 0 },
  ];

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t px-4 py-2 flex items-center justify-around transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950/85 border-slate-800/80 text-slate-300'
          : 'bg-white/90 border-slate-200/90 text-slate-700'
      }`}
    >
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeStatus === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveStatus(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              isActive
                ? 'text-indigo-500 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}

      {/* Center Floating Plus Button */}
      <button
        onClick={onOpenAddModal}
        className="-mt-5 p-3.5 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 border-2 border-slate-950 hover:scale-110 active:scale-95 transition-transform"
        title="Create New Task"
      >
        <Plus className="w-6 h-6" />
      </button>

      {navItems.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = activeStatus === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveStatus(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              isActive
                ? 'text-indigo-500 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
