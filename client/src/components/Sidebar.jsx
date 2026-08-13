import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Folder,
  Tag,
  Flame,
  CheckSquare,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({
  activeStatus,
  setActiveStatus,
  activePriority,
  setActivePriority,
  activeCategory,
  setActiveCategory,
  stats,
  categories = ['General', 'Work', 'Personal', 'Development', 'Design'],
  isOpen,
  onClose,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const statusItems = [
    { id: 'all', label: 'All Tasks', icon: Layers, count: stats?.total ?? 0, color: 'text-indigo-500' },
    { id: 'pending', label: 'Pending', icon: Clock, count: stats?.pending ?? 0, color: 'text-amber-500' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats?.completed ?? 0, color: 'text-emerald-500' },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle, count: stats?.overdue ?? 0, color: 'text-rose-500' },
  ];

  const priorityItems = [
    { id: 'all', label: 'All Priorities' },
    { id: 'high', label: 'High Priority', color: 'bg-rose-500' },
    { id: 'medium', label: 'Medium Priority', color: 'bg-amber-500' },
    { id: 'low', label: 'Low Priority', color: 'bg-blue-500' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          isDark
            ? 'bg-slate-900/60 border-r border-slate-800/80 text-slate-300'
            : 'bg-white/80 border-r border-slate-200/90 text-slate-700'
        } backdrop-blur-xl flex flex-col justify-between p-5 overflow-y-auto shrink-0`}
      >
        <div className="space-y-6">
          {/* Status Navigation */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" /> Status Filter
            </h2>
            <nav className="space-y-1">
              {statusItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeStatus === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveStatus(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        : isDark
                        ? 'hover:bg-slate-800/60 hover:text-slate-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? isDark
                            ? 'bg-indigo-500/30 text-indigo-300'
                            : 'bg-indigo-200 text-indigo-800'
                          : isDark
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Priority Filters */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> Priority Level
            </h2>
            <div className="space-y-1">
              {priorityItems.map((item) => {
                const isActive = activePriority === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePriority(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                        : isDark
                        ? 'hover:bg-slate-800/60 hover:text-slate-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.color ? (
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Navigation */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" /> Categories
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === 'all'
                    ? isDark
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : isDark
                    ? 'hover:bg-slate-800/60 hover:text-slate-200'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span>All Categories</span>
                </div>
              </button>

              {categories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                const catCount = stats?.byCategory?.[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        : isDark
                        ? 'hover:bg-slate-800/60 hover:text-slate-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{cat}</span>
                    </div>
                    {catCount > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800/40 text-slate-400">
                        {catCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="pt-6 border-t border-slate-800/50">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-xs text-slate-400 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">TaskFlow 2026</p>
              <p className="text-[11px] text-slate-400">Full-Stack MERN Architecture</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
