export function RewardCard() {
  return (
    <div className="flex items-start gap-4 p-5 sm:py-[22px] sm:px-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)]">
      <span
        className="text-[28px] leading-none shrink-0 flex items-center justify-center w-[52px] h-[52px] rounded-[var(--radius-md)]"
        style={{ background: 'linear-gradient(135deg, rgba(245,200,0,0.18) 0%, rgba(124,92,255,0.12) 100%)' }}
      >
        🎁
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-[15px] sm:text-base font-extrabold text-[var(--text-primary)] m-0">
          Recompensa diária
        </p>
        <p className="text-[13px] sm:text-sm font-medium text-[var(--text-secondary)] leading-[1.55] m-0">
          Complete a missão diária e ganhe{' '}
          <strong className="text-[#F5C800]">+500 CarePoints</strong>.
        </p>
      </div>
    </div>
  );
}

export function PrivacyCard() {
  return (
    <div className="flex items-start gap-4 p-5 sm:py-[22px] sm:px-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)]">
      <span
        className="text-[28px] leading-none shrink-0 flex items-center justify-center w-[52px] h-[52px] rounded-[var(--radius-md)]"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.16) 0%, rgba(124,92,255,0.12) 100%)' }}
      >
        🔒
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-[15px] sm:text-base font-extrabold text-[var(--text-primary)] m-0">
          Privacidade garantida
        </p>
        <p className="text-[13px] sm:text-sm font-medium text-[var(--text-secondary)] leading-[1.55] m-0">
          Suas respostas são{' '}
          <strong className="text-[var(--green)]">anônimas</strong> e utilizadas apenas
          para análises agregadas.
        </p>
      </div>
    </div>
  );
}
