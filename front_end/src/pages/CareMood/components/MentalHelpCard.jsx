export default function MentalHelpCard() {
  return (
    <a
      href="https://www.careplus.com.br/assets/documents/mental-health.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)] shrink-0 min-h-[110px] flex items-center justify-start gap-4 px-6 py-5 no-underline cursor-pointer transition-[background,transform,border-color] duration-200 hover:bg-[var(--accent-subtle)] hover:border-[var(--accent)] hover:-translate-y-0.5"
    >
      <span className="text-[32px] leading-none shrink-0 flex items-center justify-center w-[56px] h-[56px] rounded-[var(--radius-md)] bg-[var(--accent-subtle)]">
        🧠
      </span>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-lg sm:text-[20px] font-extrabold text-[var(--text-primary)] tracking-[1.5px]">
          MENTAL HELP
        </span>
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          Materiais de apoio à saúde mental
        </span>
      </div>
      <span className="text-[20px] font-bold text-[var(--text-muted)] shrink-0">→</span>
    </a>
  );
}
