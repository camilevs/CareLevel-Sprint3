export default function ServiceCard({ icon: Icon, label, onClick }) {
  return (
    <button
      className="flex items-center gap-5 w-full py-5 px-2 cursor-pointer bg-transparent border-none text-left transition-opacity duration-200 hover:opacity-70"
      onClick={onClick}
      aria-label={label}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full text-[var(--accent)]">
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <span className="text-base font-semibold text-[var(--text-primary)]">{label}</span>
    </button>
  );
}
