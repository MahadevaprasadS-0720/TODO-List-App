import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import {
  ListTodo,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function LoginScreen() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    if (isRegister && !name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email.trim(), password, name.trim());
        toast.success('Account created successfully! Welcome aboard! 🎉');
      } else {
        await loginWithEmail(email.trim(), password);
        toast.success('Signed in successfully! 👋');
      }
    } catch (error) {
      console.error('Auth submit error:', error);
      let errorMsg = 'Authentication failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google! 🚀');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-full border transition-all duration-300 ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800 hover:scale-105'
              : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:scale-105'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/25 text-white mb-4">
            <ListTodo className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            TaskFlow 2026
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Organize, track, and accomplish your daily tasks with real-time cloud sync.
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <div
          className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all ${
            isDark
              ? 'bg-slate-900/60 border-slate-800/80 shadow-slate-950/50'
              : 'bg-white/70 border-slate-200/90 shadow-slate-200/50'
          }`}
        >
          {/* Mode Switcher Tabs */}
          <div
            className={`grid grid-cols-2 p-1 rounded-2xl border mb-6 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                !isRegister
                  ? isDark
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                isRegister
                  ? isDark
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div
                  className={`flex items-center rounded-xl border px-3.5 py-2.5 transition ${
                    isDark
                      ? 'bg-slate-950/70 border-slate-800 text-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                      : 'bg-white border-slate-200 text-slate-900 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Email Address
              </label>
              <div
                className={`flex items-center rounded-xl border px-3.5 py-2.5 transition ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 text-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                    : 'bg-white border-slate-200 text-slate-900 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                }`}
              >
                <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Password
              </label>
              <div
                className={`flex items-center rounded-xl border px-3.5 py-2.5 transition ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 text-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                    : 'bg-white border-slate-200 text-slate-900 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                }`}
              >
                <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 p-0.5 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In with Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Or continue with
            </span>
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-3 ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Footer info badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Cloud Security & User Data Isolation</span>
        </div>
      </div>
    </div>
  );
}
