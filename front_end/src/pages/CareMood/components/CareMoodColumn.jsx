export default function CareMoodColumn({ onQuestionario, jaRespondeuHoje }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-[var(--accent)] rounded-[var(--radius-sm)] shadow-[0_4px_14px_var(--accent-glow)] h-[50px] sm:h-[58px] flex items-center justify-center text-lg sm:text-2xl font-bold text-white">
        CareMood©
      </div>

      <div className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-lg)] py-5 px-5 sm:py-7 sm:px-8 flex flex-col items-center gap-5 sm:gap-6 flex-1 justify-center">
        <p className="text-base sm:text-[20px] min-[900px]:text-[24px] font-semibold text-[var(--text-primary)] text-center leading-6 sm:leading-[29px]">
          {jaRespondeuHoje
            ? 'Você já respondeu o questionário hoje, volte amanhã para atualizar os resultados.'
            : 'Responda o questionário para avaliar seus sentimentos e impressões do dia de hoje!'}
        </p>
        {!jaRespondeuHoje && (
          <button
            className="bg-[var(--accent)] border-0 rounded-[var(--radius-sm)] w-full h-11 sm:h-12 font-[var(--font-body)] text-base sm:text-[18px] min-[900px]:text-xl font-bold text-white cursor-pointer tracking-[1px] shadow-[0_4px_14px_var(--accent-glow)] transition-[background,transform] duration-200 hover:bg-[var(--accent-hover)] hover:-translate-y-px"
            onClick={onQuestionario}
          >
            QUESTIONÁRIO
          </button>
        )}
      </div>

      <a
        href="https://www.careplus.com.br/assets/documents/mental-health.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] h-[90px] sm:h-[120px] flex items-center justify-center gap-[10px] no-underline cursor-pointer py-3 px-6 transition-[background,transform] duration-200 hover:bg-[var(--accent-subtle)] hover:-translate-y-0.5"
      >
        <span className="text-2xl">🧠</span>
        <span className="text-[22px] sm:text-[28px] min-[900px]:text-[32px] font-bold text-[var(--text-primary)] tracking-[2px]">
          MENTAL HELP
        </span>
        <span className="text-xl font-bold text-[var(--text-muted)]">→</span>
      </a>
    </div>
  );
}
