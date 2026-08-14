import toast from 'react-hot-toast';

export function exportTodosToCSV(todos, filename = 'TaskFlow_Tasks_Export.csv') {
  if (!todos || todos.length === 0) {
    toast.error('No tasks available to export.');
    return;
  }

  try {
    const headers = [
      'Title',
      'Description',
      'Status',
      'Priority',
      'Category',
      'Subtasks Count',
      'Completed Subtasks',
      'Due Date',
      'Created At',
    ];

    const rows = todos.map((t) => {
      const subtasks = Array.isArray(t.subtasks) ? t.subtasks : [];
      const subtasksCount = subtasks.length;
      const completedSubtasks = subtasks.filter((s) => s.completed).length;

      let status = t.completed ? 'Completed' : 'Pending';
      if (t.kanbanStatus === 'in-progress') status = 'In Progress';

      const escapeCSV = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      return [
        escapeCSV(t.title),
        escapeCSV(t.description),
        escapeCSV(status),
        escapeCSV(t.priority || 'medium'),
        escapeCSV(t.category || 'General'),
        escapeCSV(subtasksCount),
        escapeCSV(completedSubtasks),
        escapeCSV(t.dueDate ? new Date(t.dueDate).toLocaleString() : 'N/A'),
        escapeCSV(t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Task export downloaded successfully! 📊');
  } catch (err) {
    console.error('Export CSV error:', err);
    toast.error('Failed to export tasks to CSV.');
  }
}
