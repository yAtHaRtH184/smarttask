import PriorityBadge from './PriorityBadge';

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const STATUS_CLASSES = {
  TODO: 'status-todo',
  IN_PROGRESS: 'status-inprogress',
  DONE: 'status-done',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null;

  const isOverdue =
    task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card ${task.status === 'DONE' ? 'task-done' : ''}`}>
      <div className="task-card-header">
        <span className={`status-badge ${STATUS_CLASSES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
        <PriorityBadge priority={task.priority} />
        {task.isDaily && <span className="status-badge daily-badge">🔄 Daily</span>}
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        {dueDateStr && (
          <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? '⚠️' : '📅'} {dueDateStr}
          </span>
        )}
        <div className="task-actions">
          {task.status !== 'DONE' ? (
            <button
              className="btn-icon btn-success"
              title="Mark Completed"
              onClick={() => onStatusChange(task.id, 'DONE')}
            >
              ✅
            </button>
          ) : (
            <button
              className="btn-icon btn-warning"
              title="Mark To Do"
              onClick={() => onStatusChange(task.id, 'TODO')}
            >
              ↩️
            </button>
          )}
          <button className="btn-icon" title="Edit" onClick={() => onEdit(task)}>✏️</button>
          <button className="btn-icon btn-danger" title="Delete" onClick={() => onDelete(task.id)}>🗑️</button>
        </div>
      </div>
    </div>
  );
}
