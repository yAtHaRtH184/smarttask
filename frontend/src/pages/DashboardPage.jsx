import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import StatusFilter from '../components/StatusFilter';
import PriorityBadge from '../components/PriorityBadge';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('createdAt,desc');

  const fetchTasks = useCallback(async (status, currentPage, currentSortBy) => {
    setLoading(true);
    try {
      const params = { page: currentPage, size: 9, sort: currentSortBy };
      if (status !== 'ALL') params.status = status;
      const res = await getTasks(params);
      setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(filter, page, sortBy);
  }, [filter, page, sortBy, fetchTasks]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        toast.success('Task updated!');
      } else {
        await createTask(formData);
        toast.success('Task created!');
      }
      closeModal();
      fetchTasks(filter, page);
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchTasks(filter, page);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Calls partial update endpoint to only update the status field
      await updateTask(id, { status: newStatus });
      toast.success(newStatus === 'DONE' ? 'Task completed! 🎉' : 'Task set back to To Do.');
      fetchTasks(filter, page);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Summary counts
  const summary = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'DONE').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    todo: tasks.filter((t) => t.status === 'TODO').length,
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">{summary.total}</span>
            <span className="stat-label">Showing</span>
          </div>
          <div className="stat-card">
            <span className="stat-num stat-todo">{summary.todo}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="stat-card">
            <span className="stat-num stat-inprogress">{summary.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card">
            <span className="stat-num stat-done">{summary.done}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <StatusFilter active={filter} onChange={handleFilterChange} />
          
          <div className="toolbar-controls">
            {/* Sorting */}
            <div className="sort-control">
              <span className="sort-label">Sort by:</span>
              <select value={sortBy} onChange={handleSortChange} className="select-input">
                <option value="createdAt,desc">Newest First</option>
                <option value="createdAt,asc">Oldest First</option>
                <option value="dueDate,asc">Due Date (Soonest)</option>
                <option value="dueDate,desc">Due Date (Latest)</option>
                <option value="priority,desc">Priority (High to Low)</option>
                <option value="priority,asc">Priority (Low to High)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button
                className={`btn-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Mode"
              >
                Grid
              </button>
              <button
                className={`btn-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List Mode"
              >
                List
              </button>
            </div>

            <button className="btn btn-primary" onClick={openCreate}>
              + New Task
            </button>
          </div>
        </div>

        {/* Task grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading tasks…</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>
              {filter !== 'ALL'
                ? `You have no ${filter.replace('_', ' ')} tasks.`
                : 'Create your first task to get started!'}
            </p>
            <button className="btn btn-primary" onClick={openCreate}>
              + Create Task
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="task-grid">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="task-table-wrapper">
                <table className="task-table">
                  <thead>
                    <tr>
                      <th>Title & Description</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th>Type</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => {
                      const dueDateStr = task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '-';
                      const isOverdue = task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();
                      
                      return (
                        <tr key={task.id} className={task.status === 'DONE' ? 'row-done' : ''}>
                          <td className="task-table-title-col">
                            <span className="task-table-title">{task.title}</span>
                            {task.description && (
                              <span className="task-table-desc">{task.description}</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge status-${task.status.toLowerCase().replace('_', '')}`}>
                              {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'TODO' ? 'To Do' : 'Done'}
                            </span>
                          </td>
                          <td>
                            <PriorityBadge priority={task.priority} />
                          </td>
                          <td className={isOverdue ? 'overdue' : ''}>
                            {dueDateStr} {isOverdue && '⚠️'}
                          </td>
                          <td>
                            {task.isDaily ? (
                              <span className="status-badge daily-badge">🔄 Daily</span>
                            ) : (
                              <span className="single-badge">Single</span>
                            )}
                          </td>
                          <td className="table-actions">
                            {task.status !== 'DONE' ? (
                              <button
                                className="btn-icon btn-success"
                                title="Mark Completed"
                                onClick={() => handleStatusChange(task.id, 'DONE')}
                              >
                                ✅
                              </button>
                            ) : (
                              <button
                                className="btn-icon btn-warning"
                                title="Mark To Do"
                                onClick={() => handleStatusChange(task.id, 'TODO')}
                              >
                                ↩️
                              </button>
                            )}
                            <button className="btn-icon" title="Edit" onClick={() => openEdit(task)}>✏️</button>
                            <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDelete(task.id)}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-ghost"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className="page-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-ghost"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <TaskModal task={editingTask} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
}
