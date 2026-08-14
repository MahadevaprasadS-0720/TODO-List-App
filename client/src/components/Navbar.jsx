import React, { useState } from 'react';
import {
  ListTodo,
  Search,
  X,
  Sun,
  Moon,
  Plus,
  LogOut,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenAddModal,
  onOpenSettingsModal,
  isOnline,
  toggleSidebar,
}) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const isDark = theme === 'dark';

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn('Sign out error:', err.message);
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-300 border-b backdrop-blur-2xl ${
        isDark
          ? 'bg-gradient-to-r from-slate-950/90 via-indigo-950/70 to-slate-950/90 border-indigo-500/20 text-white'
          : 'bg-gradient-to-r from-white/90 via-indigo-50/70 to-white/90 border-slate-200/90 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
            aria-label="Toggle sidebar"
          >
            <ListTodo className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 text-white border border-white/20">
              <ListTodo className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
          </div>
        </div>

        {/* Center: Expanding Glass Search Control */}
        <div className="flex-1 max-w-md flex justify-center relative">
          {isSearchExpanded || searchTerm ? (
            <div
              className={`w-full flex items-center rounded-2xl px-4 py-2 border transition-all duration-300 shadow-lg ${
                isDark
                  ? 'bg-slate-950/90 border-indigo-500/40 text-white shadow-indigo-500/10'
                  : 'bg-white/90 border-indigo-200 text-slate-900 shadow-slate-200'
              }`}
            >
              <Search className="w-4 h-4 text-indigo-400 mr-2.5 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search tasks or subtasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => {
                  if (!searchTerm) setIsSearchExpanded(false);
                }}
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400 font-medium"
              />
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsSearchExpanded(false);
                }}
                className="text-slate-400 hover:text-slate-200 p-0.5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-slate-900/60 border-indigo-500/20 text-slate-300 hover:bg-slate-800 hover:border-indigo-500/40'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Search tasks...</span>
            </button>
          )}
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* Server Connection Status */}
          <div
            className={`hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${
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
            <span>{isOnline ? 'Cloud Synced' : 'Connecting...'}</span>
          </div>

          {/* User Profile Badge (Clickable to open UserSettingsModal) */}
          {currentUser && (
            <button
              onClick={onOpenSettingsModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition hover:scale-105 ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:border-indigo-500/50'
                  : 'bg-white/80 border-slate-200 text-slate-800 hover:border-indigo-300'
              }`}
              title="Click to manage account settings"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={userDisplayName}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-500/40"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {userInitial}
                </div>
              )}
              <span className="hidden md:inline max-w-[110px] truncate">
                {userDisplayName}
              </span>
              <Sliders className="w-3.5 h-3.5 text-indigo-400 ml-0.5" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full border transition-all duration-300 backdrop-blur-md ${
              isDark
                ? 'bg-slate-900/80 border-slate-700/80 text-amber-400 hover:bg-slate-800 hover:scale-110'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:scale-110'
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

          {/* New Task Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 border border-white/10"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Logout Button */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className={`p-2.5 rounded-full border transition-all duration-300 backdrop-blur-md ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
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
