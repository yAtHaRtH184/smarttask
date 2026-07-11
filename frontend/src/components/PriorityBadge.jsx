const PRIORITY_CONFIG = {
  HIGH: { label: 'High', className: 'priority-high' },
  MEDIUM: { label: 'Medium', className: 'priority-medium' },
  LOW: { label: 'Low', className: 'priority-low' },
};

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
  return <span className={`priority-badge ${config.className}`}>{config.label}</span>;
}
