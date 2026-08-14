import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import ProgressBar from './components/ProgressBar';
import MobileBottomNav from './components/MobileBottomNav';
import TodoList from './components/TodoList';
import KanbanBoard from './components/KanbanBoard';
import AddTodoModal from './components/AddTodoModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import UserSettingsModal from './components/UserSettingsModal';
import { useTodos } from './hooks/useTodos';
import { useNotifications } from './hooks/useNotifications';
import { exportTodosToCSV } from './utils/exportUtils';
import {
  ArrowUpDown,
  Filter,
  RefreshCw,
  Flame,
  Loader2,
  Download,
  LayoutList,
  Kanban,
  Calendar,
} from 'lucide-react';

function TodoAppContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Consume Custom Hooks
  const {
    todos,
    stats,
    loading,
    isOnline,
    viewMode,
    setViewMode,
    activeStatus,
    setActiveStatus,
    activePriority,
    setActivePriority,
    activeCategory,
    setActiveCategory,
    dueDateFilter,
    setDueDateFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    order,
    setOrder,
    addTodo,
    updateTodo,
    toggleSubtask,
    moveKanbanStatus,
    toggleTodo,
    deleteTodo,
    setRawTodos,
    refresh,
  } = useTodos();

  const notificationState = useNotifications(todos);

  // UI Drawer & Modal State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Categories list
  const categories = ['General', 'Work', 'Personal', 'Development', 'Design'];

  // Handlers
  const handleCreateOrUpdateTodo = async (todoData) => {
    try {
      if (editingTodo) {
        const targetId = editingTodo._id || editingTodo.id;
        await updateTodo(targetId, todoData);
      } else {
        await addTodo(todoData);
      }
      setIsAddModalOpen(false);
      setEditingTodo(null);
    } catch (error) {
      console.warn('Task submission error:', error.message);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      toast.success('Workspace refreshed! 🔄');
    } catch (err) {
      toast.error('Failed to refresh workspace');
      console.warn('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    exportTodosToCSV(todos);
  };

  const handleTogglePrioritySort = () => {
    setSortBy((prev) => (prev === 'priority' ? 'createdAt' : 'priority'));
  };

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsAddModalOpen(true);
  };

  const handleOpenDeleteModal = (todo) => {
    setDeletingTodo(todo);
  };

  const handleConfirmDelete = async () => {
    if (deletingTodo) {
      const targetId = deletingTodo._id || deletingTodo.id;
      try {
        await deleteTodo(targetId);
      } catch (err) {
        console.warn('Delete error:', err);
      } finally {
        setDeletingTodo(null);
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 relative overflow-x-hidden ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(226, 232, 240, 0.9)',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          },
        }}
      />

      {/* Dynamic Ambient Glowing Mesh Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAddModal={() => {
          setEditingTodo(null);
          setIsAddModalOpen(true);
        }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        isOnline={isOnline}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        {/* Left Sidebar */}
        <Sidebar
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          activePriority={activePriority}
          setActivePriority={setActivePriority}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          stats={stats}
          categories={categories}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-md">
                Task Workspace
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                Organize goals, track completion progress, and filter categories.
              </p>
            </div>

            {/* Header Action Controls (Export CSV & Refresh) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all shadow-sm ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-indigo-400 hover:bg-slate-800 hover:text-white'
                    : 'bg-white/80 border-slate-200 text-indigo-600 hover:bg-slate-100'
                }`}
                title="Download task list as CSV file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all shadow-sm ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
                title="Reload tasks from Cloud Firestore"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isRefreshing || loading ? 'animate-spin text-indigo-400' : ''
                  }`}
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Workspace'}</span>
              </button>
            </div>
          </div>

          {/* Key Metric Cards (Total, Completed, Pending, Overdue) */}
          <StatsOverview stats={stats} />

          {/* Progress Bar Card */}
          <ProgressBar stats={stats} />

          {/* Controls, View Switcher & Filter Toolbar */}
          <div
            className={`p-4 sm:p-5 rounded-3xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark
                ? 'bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-xl'
                : 'bg-white/80 border border-slate-200 shadow-md backdrop-blur-xl'
            }`}
          >
            {/* Left: View Mode Toggle (List vs. Kanban) */}
            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950/60 border border-slate-800">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>

                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    viewMode === 'kanban'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban Board</span>
                </button>
              </div>

              {/* Active Filter Count Summary */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
                <Filter className="w-4 h-4 text-indigo-400" />
                <span>
                  <strong className={isDark ? 'text-white' : 'text-slate-900'}>
                    {todos.length}
                  </strong>{' '}
                  tasks
                </span>
              </div>
            </div>

            {/* Right: Due Date Filter & Sorting Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Due Date Filter */}
              <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={dueDateFilter}
                  onChange={(e) => setDueDateFilter(e.target.value)}
                  className={`px-3 py-1.5 rounded-2xl border text-xs font-semibold outline-none transition ${
                    isDark ? 'glass-input-dark' : 'glass-input-light'
                  }`}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Due Today</option>
                  <option value="this-week">Due This Week</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* Priority Sort Button */}
              <button
                onClick={handleTogglePrioritySort}
                className={`px-3 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition ${
                  sortBy === 'priority'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md shadow-rose-500/10'
                    : isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Sort by Priority (High to Low)"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Priority</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1.5 rounded-2xl border text-xs font-semibold outline-none transition ${
                  isDark ? 'glass-input-dark' : 'glass-input-light'
                }`}
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority Level</option>
                <option value="title">Title (A-Z)</option>
              </select>

              <button
                onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                className={`px-2.5 py-1.5 rounded-2xl border text-xs font-bold uppercase tracking-wider transition backdrop-blur-md ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-indigo-400 hover:bg-slate-800'
                    : 'bg-white/80 border-slate-200 text-indigo-600 hover:bg-slate-100'
                }`}
              >
                {order}
              </button>
            </div>
          </div>

          {/* Conditional View Rendering: List View vs. Kanban Board View */}
          {viewMode === 'kanban' ? (
            <KanbanBoard
              todos={todos}
              onToggle={toggleTodo}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onOpenAddModal={() => {
                setEditingTodo(null);
                setIsAddModalOpen(true);
              }}
              onMoveKanbanStatus={moveKanbanStatus}
            />
          ) : (
            <TodoList
              todos={todos}
              loading={loading && todos.length === 0}
              activeStatus={activeStatus}
              onReorder={(newOrder) => setRawTodos(newOrder)}
              onToggle={toggleTodo}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onOpenAddModal={() => {
                setEditingTodo(null);
                setIsAddModalOpen(true);
              }}
              onToggleSubtask={toggleSubtask}
              searchTerm={searchTerm}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        onOpenAddModal={() => {
          setEditingTodo(null);
          setIsAddModalOpen(true);
        }}
        stats={stats}
      />

      {/* Add / Edit Task Modal */}
      <AddTodoModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleCreateOrUpdateTodo}
        initialData={editingTodo}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingTodo)}
        todoTitle={deletingTodo?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTodo(null)}
      />

      {/* User Account Settings Modal */}
      <UserSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        stats={stats}
        notificationState={notificationState}
      />
    </div>
  );
}

function AuthGate() {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
          isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading your TaskFlow workspace...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <TodoAppContent />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  );
}