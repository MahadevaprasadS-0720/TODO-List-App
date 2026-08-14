import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  Check,
  Sparkles,
  Sliders,
  LogOut,
  Bell,
  BellOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function UserSettingsModal({
  isOpen,
  onClose,
  stats,
  notificationState,
}) {
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    permission = 'default',
    notificationsEnabled = true,
    setNotificationsEnabled = () => {},
    requestPermission = () => {},
  } = notificationState || {};

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser, isOpen]);

  if (!currentUser) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
        });
        toast.success('Profile updated successfully! ✨');
        onClose();
      }
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const userInitial = (displayName || currentUser.email || 'U').charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl z-10 ${
              isDark
                ? 'glass-panel-dark text-slate-100'
                : 'glass-panel-light text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/40 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Account Settings</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Manage your TaskFlow profile & notification preferences
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 dark:bg-slate-950/60 border border-slate-800 mb-6">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-md border border-white/20">
                  {userInitial}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-extrabold tracking-tight truncate">
                  {displayName || 'User'}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium truncate mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{currentUser.email}</span>
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> Cloud Synced
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Toggle Card */}
            <div className="p-4 rounded-2xl bg-slate-900/50 dark:bg-slate-950/70 border border-indigo-500/20 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {notificationsEnabled ? (
                    <Bell className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                      Push Notifications
                    </h5>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Alerts for 15m before, due time, and overdue tasks
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                    notificationsEnabled
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 justify-end'
                      : 'bg-slate-800 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>

              {/* Permission Status */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                <span className="text-slate-400 font-medium">Browser Permission:</span>
                {permission === 'granted' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Granted
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={requestPermission}
                    className="text-xs font-bold text-indigo-400 hover:underline"
                  >
                    Enable Permission
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Display Name
                </label>
                <div
                  className={`flex items-center rounded-2xl px-4 py-3 transition-all ${
                    isDark ? 'glass-input-dark' : 'glass-input-light'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500 font-medium"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/40 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 border border-white/10 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
