const TREND_ICON = {
  melhorando: '↓',
  piorando:   '↑',
  estável:    '→',
};

const TREND_LABEL = {
  melhorando: 'Melhorando',
  piorando:   'Piorando',
  estável:    'Estável',
};

const TREND_CLS = {
  melhorando: 'bg-[rgba(34,197,94,0.15)] text-[#4ade80] border border-[rgba(34,197,94,0.3)]',
  piorando:   'bg-[rgba(239,68,68,0.15)] text-[#fca5a5] border border-[rgba(239,68,68,0.3)]',
  estável:    'bg-[rgba(245,200,0,0.12)] text-[#fde047] border border-[rgba(245,200,0,0.3)]',
};

export default function ExhaustionChart({ exhaustionData = [] }) {
  const bars      = exhaustionData.slice(-5);
  const lastTrend = bars.length >= 2 ? bars[bars.length - 1]?.trend : null;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 sm:p-7 sm:gap-5 sm:min-h-[380px] min-[900px]:p-8 min-[900px]:min-h-[413px]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-[18px] sm:text-[22px] min-[900px]:text-[24px] font-bold text-[var(--text-primary)]">
          ANÁLISE DE EXAUSTÃO
        </p>
        {lastTrend && (
          <span className={`text-[12px] sm:text-[13px] font-bold py-1 px-[10px] sm:px-3 rounded-[20px] tracking-[0.5px] whitespace-nowrap ${TREND_CLS[lastTrend] ?? ''}`}>
            {TREND_ICON[lastTrend]} {TREND_LABEL[lastTrend]}
          </span>
        )}
      </div>

      {bars.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] text-sm sm:text-[15px] text-center">
          <p>Nenhum dado registrado ainda.</p>
          <p>Complete o questionário para ver a análise.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:gap-4 flex-1 justify-center">
            {bars.map(({ key, label, exhaustionPct }) => (
              <div key={key} className="flex items-center gap-[10px] sm:gap-[14px]">
                <span className="text-[12px] sm:text-sm font-bold text-[var(--text-secondary)] w-11 sm:w-[52px] flex-shrink-0">
                  {label}
                </span>
                <div className="flex-1 bg-[var(--bg-elevated)] rounded-[var(--radius-xs)] h-9 sm:h-11 overflow-hidden">
                  <div
                    className="bg-[var(--accent)] h-full rounded-[var(--radius-xs)] transition-[width] duration-[600ms] ease-out"
                    style={{ width: `${Math.min(exhaustionPct, 100)}%` }}
                    title={`${exhaustionPct}% de exaustão`}
                  />
                </div>
                <span className="text-[12px] sm:text-[13px] font-semibold text-[var(--text-muted)] w-9 sm:w-10 text-right flex-shrink-0">
                  {exhaustionPct}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pl-[54px] pr-[46px] sm:pl-[66px] sm:pr-[54px] text-[11px] sm:text-xs font-semibold text-[var(--text-muted)]">
            <span>0</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </>
      )}
    </div>
  );
}
