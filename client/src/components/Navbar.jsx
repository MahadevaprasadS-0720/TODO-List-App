import React from 'react';
import {
  ListTodo,
  Search,
  X,
  Sun,
  Moon,
  Plus,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenAddModal,
  isOnline,
  toggleSidebar,
}) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const isDark = theme === 'dark';

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-300 border-b backdrop-blur-xl ${
        isDark
          ? 'bg-slate-950/70 border-slate-800/80 text-white'
          : 'bg-white/80 border-slate-200/90 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
            aria-label="Toggle sidebar"
          >
            <ListTodo className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20 text-white">
              <ListTodo className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  TaskFlow
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-500/20">
                  2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div
            className={`flex items-center rounded-full px-3.5 py-2 border transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                : 'bg-slate-100/90 border-slate-200 text-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-200 p-0.5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Server Status Indicator */}
          <div
            className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? isDark
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : isDark
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isOnline ? 'API Connected' : 'Connecting...'}</span>
          </div>

          {/* User Profile Info */}
          {currentUser && (
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium transition ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={userDisplayName}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-500/30"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-[11px]">
                  {userInitial}
                </div>
              )}
              <span className="hidden md:inline max-w-[100px] truncate">
                {userDisplayName}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full border transition-all duration-300 ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:scale-105'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:scale-105'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Create Task Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Logout Button */}
          {currentUser && (
            <button
              onClick={logout}
              className={`p-2.5 rounded-full border transition-all duration-300 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
              }`}
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

