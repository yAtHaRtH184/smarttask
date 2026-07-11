const STATUS_TABS = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE'];

const STATUS_LABELS = {
  ALL: 'All',
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export default function StatusFilter({ active, onChange }) {
  return (
    <div className="status-filter">
      {STATUS_TABS.map((s) => (
        <button
          key={s}
          className={`filter-tab ${active === s ? 'active' : ''}`}
          onClick={() => onChange(s)}
        >
          {STATUS_LABELS[s]}
        </button>
      ))}
    </div>
  );
}
