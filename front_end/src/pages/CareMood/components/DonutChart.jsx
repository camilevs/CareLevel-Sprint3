import { useMemo } from 'react';

const C = 502.65;

function buildSegments(donutData) {
  let offset = 0;
  return donutData.map(({ status, pct, color }) => {
    const dash = (pct / 100) * C;
    const seg = { status, pct, color, dash, offset: -offset };
    offset += dash;
    return seg;
  });
}

export default function DonutChart({ donutData = [], predominant }) {
  const segments = useMemo(() => buildSegments(donutData), [donutData]);
  const hasData  = segments.length > 0;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] py-5 px-5 flex flex-col gap-4 sm:py-7 sm:px-7 sm:gap-5 sm:min-h-[380px] min-[900px]:py-8 min-[900px]:px-8 min-[900px]:min-h-[413px]">
      <p className="text-[18px] sm:text-[22px] min-[900px]:text-[24px] font-bold text-[var(--text-primary)]">
        STATUS PREDOMINANTES NO MÊS:
      </p>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] text-sm sm:text-[15px] text-center opacity-70">
          <p>Nenhum dado registrado neste mês.</p>
          <p>Complete o questionário para ver seu histórico.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 flex-1">
          <div className="flex items-center justify-center">
            <svg width="220" height="220" viewBox="0 0 220 220">
              {segments.map(({ status, color, dash, offset }) => (
                <circle
                  key={status}
                  cx="110" cy="110" r="80"
                  fill="none"
                  stroke={color}
                  strokeWidth="42"
                  strokeDasharray={`${dash} ${C}`}
                  strokeDashoffset={offset}
                  transform="rotate(-90 110 110)"
                />
              ))}
              <circle cx="110" cy="110" r="59" fill="white" />
              {predominant && (
                <>
                  <text x="110" y="105" textAnchor="middle" fontSize="11" fill="#555" fontFamily="var(--font-body)">
                    Predominante
                  </text>
                  <text x="110" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0C3F2F" fontFamily="var(--font-body)">
                    {predominant}
                  </text>
                </>
              )}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-[10px_24px] w-full max-w-[300px]">
            {segments.map(({ status, pct, color }) => (
              <div key={status} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[13px] sm:text-sm font-semibold text-[var(--text-primary)] flex-1">{status}</span>
                <span className="text-[13px] sm:text-sm font-bold text-[var(--text-secondary)]">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
