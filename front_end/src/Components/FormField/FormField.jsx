export default function FormField({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-[0.04em]">{label}</span>
      {children}
    </div>
  );
}