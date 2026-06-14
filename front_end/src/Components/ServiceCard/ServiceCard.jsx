export default function ServiceCard({ icon: Icon, label, onClick }) {
  return (
    <button
      className="flex flex-col items-center justify-center gap-[10px] p-4 w-24 min-w-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] cursor-pointer transition-[border-color,box-shadow,transform] duration-200 hover:border-[var(--accent)] hover:shadow-[0_0_0_2px_var(--accent-subtle)] hover:-translate-y-0.5"
      onClick={onClick}
      aria-label={label}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] text-[var(--accent)]">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <span className="text-[11px] font-bold text-[var(--text-secondary)] text-center leading-tight">{label}</span>
    </button>
  );
}
