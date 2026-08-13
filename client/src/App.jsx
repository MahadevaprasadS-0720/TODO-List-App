import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import ProgressBar from './components/ProgressBar';
import MobileBottomNav from './components/MobileBottomNav';
import TodoList from './components/TodoList';
import AddTodoModal from './components/AddTodoModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { useTodos } from './hooks/useTodos';
import { ArrowUpDown, Filter, RefreshCw, Flame } from 'lucide-react';

function TodoAppContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Consume Custom Hook
  const {
    todos,
    stats,
    loading,
    isOnline,
    activeStatus,
    setActiveStatus,
    activePriority,
    setActivePriority,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    order,
    setOrder,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    setRawTodos,
    refresh,
  } = useTodos();

  // UI Drawer & Modal State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);

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
      await deleteTodo(targetId);
      setDeletingTodo(null);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(12px)',
          },
        }}
      />

      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAddModal={() => {
          setEditingTodo(null);
          setIsAddModalOpen(true);
        }}
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Task Workspace
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Drag to reorder tasks, track completion progress, and filter categories.
              </p>
            </div>

            <button
              onClick={refresh}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats Metrics Cards */}
          <StatsOverview stats={stats} />

          {/* Progress Bar Card */}
          <ProgressBar stats={stats} />

          {/* Controls & Filter Toolbar */}
          <div
            className={`p-4 rounded-2xl border mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark ? 'glass-card-dark' : 'glass-card-light'
            }`}
          >
            {/* Active Filters Summary */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Filter className="w-4 h-4 text-indigo-500" />
              <span>
                Showing{' '}
                <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                  {todos.length}
                </strong>{' '}
                tasks
                {activeStatus !== 'all' && ` • Status: ${activeStatus}`}
                {activePriority !== 'all' && ` • Priority: ${activePriority}`}
                {activeCategory !== 'all' && ` • Category: ${activeCategory}`}
              </span>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-3">
              {/* Quick Priority Sort Toggle */}
              <button
                onClick={handleTogglePrioritySort}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  sortBy === 'priority'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Sort by Priority (High to Low)"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Priority Sort</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium outline-none transition ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority Level</option>
                <option value="title">Title (A-Z)</option>
              </select>

              <button
                onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-indigo-400 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-100'
                }`}
              >
                {order}
              </button>
            </div>
          </div>

          {/* Animated Todo List */}
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
            searchTerm={searchTerm}
          />
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
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TodoAppContent />
    </ThemeProvider>
  );
}