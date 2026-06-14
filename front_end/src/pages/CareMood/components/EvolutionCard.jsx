import { statusToColor } from '../utils/moodUtils';

const STATUS_EMOJI = {
  Estressado: '😰',
  Cansado:    '😴',
  Normal:     '🙂',
  Excelente:  '🌟',
};

const TREND_INFO = {
  melhorando: { icon: '📈', label: 'Melhorando', color: 'var(--green)' },
  piorando:   { icon: '📉', label: 'Atenção: piorando', color: 'var(--red)' },
  estável:    { icon: '➖', label: 'Estável', color: 'var(--text-secondary)' },
};

const SUMMARY_TEXT = {
  Estressado: 'Seus registros recentes indicam um estado mais estressado. Pequenas pausas ao longo do dia podem ajudar bastante.',
  Cansado:    'Você tem se sentido mais cansado(a) nos últimos dias. Que tal priorizar o descanso na sua rotina?',
  Normal:     'Seu bem-estar tem se mantido equilibrado. Continue com seus bons hábitos diários!',
  Excelente:  'Ótimas notícias! Seus registros recentes mostram um excelente estado de bem-estar.',
};

export default function EvolutionCard({ predominant, exhaustionData = [] }) {
  const lastTrend = exhaustionData.length >= 2
    ? exhaustionData[exhaustionData.length - 1]?.trend
    : null;
  const trendInfo = lastTrend ? TREND_INFO[lastTrend] : null;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)] p-5 sm:p-6 flex flex-col gap-[14px] flex-1">
      <p className="text-[18px] sm:text-[22px] min-[900px]:text-[24px] font-bold text-[var(--text-primary)] m-0">
        SUA EVOLUÇÃO
      </p>

      {predominant ? (
        <>
          <div
            className="flex items-center gap-[14px] rounded-[var(--radius-md)] p-[14px] px-4"
            style={{
              background: statusToColor(predominant) + '18',
              border: `1px solid ${statusToColor(predominant)}55`,
            }}
          >
            <span className="text-[30px] leading-none">
              {STATUS_EMOJI[predominant] ?? '📊'}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold tracking-[0.5px] text-[var(--text-muted)] uppercase">
                Status predominante
              </span>
              <span
                className="text-[18px] sm:text-[20px] font-extrabold"
                style={{ color: statusToColor(predominant) }}
              >
                {predominant}
              </span>
            </div>
          </div>

          {trendInfo && (
            <div
              className="flex items-center gap-2 text-[13px] font-bold"
              style={{ color: trendInfo.color }}
            >
              <span>{trendInfo.icon}</span>
              <span>{trendInfo.label} em relação ao mês anterior</span>
            </div>
          )}

          <p className="text-[13px] sm:text-sm font-medium text-[var(--text-secondary)] leading-[1.6] m-0">
            {SUMMARY_TEXT[predominant] ?? SUMMARY_TEXT.Normal}
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center text-center gap-[10px] py-6 px-2 text-[var(--text-secondary)]">
          <span className="text-[32px]">📊</span>
          <p className="text-[13px] font-medium leading-[1.55] m-0">
            Complete a Missão do Equilíbrio para começar a acompanhar sua evolução emocional.
          </p>
        </div>
      )}
    </div>
  );
}
