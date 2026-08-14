import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Calendar,
  Tag,
  Flame,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ListChecks,
  Clock,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AddTodoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [errors, setErrors] = useState({});

  // Alarm Schedule States
  const [dateString, setDateString] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const [enableTime, setEnableTime] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setCategory(initialData.category || 'General');
      setSubtasks(Array.isArray(initialData.subtasks) ? initialData.subtasks : []);

      if (initialData.dueDate) {
        const d = new Date(initialData.dueDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDateString(`${yyyy}-${mm}-${dd}`);

        let hours = d.getHours();
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        setSelectedHour(String(hours).padStart(2, '0'));
        setSelectedMinute(String(d.getMinutes()).padStart(2, '0'));
        setSelectedPeriod(period);
        setEnableTime(true);
      } else {
        setDateString(new Date().toISOString().split('T')[0]);
        setSelectedHour('09');
        setSelectedMinute('00');
        setSelectedPeriod('AM');
        setEnableTime(false);
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('General');
      setDateString(new Date().toISOString().split('T')[0]);
      setSelectedHour('09');
      setSelectedMinute('00');
      setSelectedPeriod('AM');
      setEnableTime(true);
      setSubtasks([]);
    }
    setNewSubtaskTitle('');
    setErrors({});
  }, [initialData, isOpen]);

  // Keyboard Esc listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Quick Date Presets
  const handleSetPresetDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDateString(`${yyyy}-${mm}-${dd}`);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newItem = {
      id: 'sub-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, newItem]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let finalDueDate = null;
    if (dateString) {
      if (enableTime) {
        let hr = parseInt(selectedHour, 10);
        if (selectedPeriod === 'PM' && hr < 12) hr += 12;
        if (selectedPeriod === 'AM' && hr === 12) hr = 0;

        const [yyyy, mm, dd] = dateString.split('-').map(Number);
        const dObj = new Date(yyyy, mm - 1, dd, hr, parseInt(selectedMinute, 10));
        finalDueDate = dObj.toISOString();
      } else {
        const [yyyy, mm, dd] = dateString.split('-').map(Number);
        const dObj = new Date(yyyy, mm - 1, dd, 23, 59, 59);
        finalDueDate = dObj.toISOString();
      }
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim() || 'General',
      subtasks,
      dueDate: finalDueDate,
    });
  };

  const categories = ['General', 'Work', 'Personal', 'Development', 'Design'];

  // Hours array 01-12
  const hoursOptions = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  // Minutes array 00-59
  const minutesOptions = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  );

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

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl z-10 max-h-[90vh] overflow-y-auto ${
              isDark
                ? 'glass-panel-dark text-slate-100'
                : 'glass-panel-light text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/40 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {initialData ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Esc</kbd> to close
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

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                  }}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition font-medium ${
                    errors.title
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : isDark
                      ? 'glass-input-dark'
                      : 'glass-input-light'
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Add optional notes, links, or instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition resize-none font-medium ${
                    isDark ? 'glass-input-dark' : 'glass-input-light'
                  }`}
                />
              </div>

              {/* Subtasks Checklist Builder */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5 text-indigo-400" /> Subtasks Checklist
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    className={`flex-1 px-3.5 py-2 rounded-xl border text-xs outline-none transition font-medium ${
                      isDark ? 'glass-input-dark' : 'glass-input-light'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-bold transition text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {subtasks.length > 0 && (
                  <div className="space-y-1.5 p-2 rounded-2xl bg-slate-900/40 dark:bg-slate-950/60 border border-slate-800 max-h-32 overflow-y-auto">
                    {subtasks.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 text-xs font-medium text-slate-200"
                      >
                        <span className="truncate flex-1 mr-2">{st.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(st.id)}
                          className="text-slate-400 hover:text-rose-400 p-0.5 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" /> Priority
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-900/40 dark:bg-slate-950/70 border border-slate-800">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 text-xs font-bold capitalize rounded-xl transition-all ${
                          priority === p
                            ? p === 'high'
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                              : p === 'medium'
                              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                              : 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" /> Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition font-medium ${
                      isDark ? 'glass-input-dark' : 'glass-input-light'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ====================================================== */}
              {/* SECTION 1: DISTINCT TARGET DATE GLASS CONTAINER        */}
              {/* ====================================================== */}
              <div className="p-4 rounded-3xl bg-slate-900/50 dark:bg-slate-950/70 border border-indigo-500/20 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Target Date</span>
                  </div>

                  {/* Compact Quick Date Presets */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSetPresetDate(0)}
                      className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition text-xs font-semibold"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetPresetDate(1)}
                      className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition text-xs font-semibold"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetPresetDate(7)}
                      className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition text-xs font-semibold"
                    >
                      Next Week
                    </button>
                  </div>
                </div>

                <input
                  type="date"
                  value={dateString}
                  onChange={(e) => setDateString(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none transition font-semibold ${
                    isDark ? 'glass-input-dark' : 'glass-input-light'
                  }`}
                />
              </div>

              {/* ====================================================== */}
              {/* SECTION 2: DISTINCT TIME & ALARM GLASS CONTAINER      */}
              {/* ====================================================== */}
              <div className="p-4 rounded-3xl bg-slate-900/50 dark:bg-slate-950/70 border border-indigo-500/20 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Time & Alarm Settings</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEnableTime(!enableTime)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                      enableTime
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {enableTime ? 'Time Active' : 'Date Only'}
                  </button>
                </div>

                {/* Hour, Minute & AM/PM Controls */}
                {enableTime ? (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 flex-1">
                      {/* Hour Dropdown */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                          Hour
                        </label>
                        <select
                          value={selectedHour}
                          onChange={(e) => setSelectedHour(e.target.value)}
                          className={`w-full px-3 py-2 rounded-2xl border text-sm font-black outline-none transition text-center ${
                            isDark ? 'glass-input-dark' : 'glass-input-light'
                          }`}
                        >
                          {hoursOptions.map((hr) => (
                            <option key={hr} value={hr}>
                              {hr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-xl font-black text-slate-500 mt-4">:</span>

                      {/* Minute Dropdown */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                          Minute
                        </label>
                        <select
                          value={selectedMinute}
                          onChange={(e) => setSelectedMinute(e.target.value)}
                          className={`w-full px-3 py-2 rounded-2xl border text-sm font-black outline-none transition text-center ${
                            isDark ? 'glass-input-dark' : 'glass-input-light'
                          }`}
                        >
                          {minutesOptions.map((mn) => (
                            <option key={mn} value={mn}>
                              {mn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* AM/PM Switcher */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                        Period
                      </label>
                      <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center">
                        <button
                          type="button"
                          onClick={() => setSelectedPeriod('AM')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                            selectedPeriod === 'AM'
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPeriod('PM')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                            selectedPeriod === 'PM'
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic">
                    Task will be scheduled for the end of the selected day (23:59).
                  </p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 border border-white/10"
                >
                  <Check className="w-4 h-4" />
                  <span>{initialData ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
