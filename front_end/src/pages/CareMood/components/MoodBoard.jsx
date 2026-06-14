import { useState } from 'react';

const STATUS_EMOJI = {
  Excelente:  '🌟',
  Normal:     '😊',
  Cansado:    '😴',
  Estressado: '😤',
};

const STATUS_LABEL_COLOR = {
  Excelente:  '#22c55e',
  Normal:     '#d4a017',
  Cansado:    '#f97316',
  Estressado: '#ef4444',
};

export default function MoodBoard({ weekData = [] }) {
  const [selected, setSelected] = useState(null);

  function handleDotClick(day) {
    if (day.isFuture && !day.status) return;
    setSelected(day);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[18px] sm:text-[22px] min-[900px]:text-[24px] font-bold text-[var(--text-primary)] text-center">
        MOODBOARD SEMANAL:
      </p>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] min-h-[100px] sm:min-h-[120px] md:h-[130px] md:min-h-0 flex items-center justify-around py-4 px-3 sm:py-0 sm:px-6 md:px-8">
        {weekData.map((day) => {
          const { label, status, color, isToday, isFuture } = day;
          const clickable = !isFuture || !!status;
          return (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 sm:gap-[10px] ${isToday ? '[&_.mood-dot]:scale-[1.15] [&_.mood-dot]:shadow-[0_0_0_3px_var(--accent-glow),0_2px_8px_rgba(0,0,0,0.4)]' : ''}`}
            >
              <span className={`text-[11px] sm:text-sm md:text-base ${isToday ? 'font-bold text-[var(--text-primary)]' : 'font-[590] text-[var(--text-secondary)]'}`}>
                {label}
              </span>
              <div
                className={[
                  'mood-dot w-8 h-8 sm:w-[42px] sm:h-[42px] md:w-[50px] md:h-[50px] rounded-full border-[4px] sm:border-[5px] md:border-[7px] border-[var(--bg-elevated)] shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-[background-color] duration-300',
                  isFuture && !status ? 'opacity-30' : '',
                  clickable ? 'cursor-pointer transition-[transform,box-shadow] duration-150 hover:scale-[1.18] hover:shadow-[0_0_0_4px_var(--accent-glow),0_4px_12px_rgba(0,0,0,0.3)]' : '',
                  selected?.label === label ? '!scale-[1.22] !shadow-[0_0_0_5px_var(--accent-glow),0_4px_16px_rgba(0,0,0,0.4)]' : '',
                ].join(' ')}
                style={{ backgroundColor: color }}
                title={status || (isFuture ? 'Dia futuro' : 'Clique para ver detalhes')}
                onClick={() => clickable && handleDotClick(day)}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={e => e.key === 'Enter' && clickable && handleDotClick(day)}
              />
              {isToday && !status && (
                <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-subtle)] rounded-[20px] py-0.5 px-2 tracking-[0.3px]">
                  hoje
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[400] p-5 [backdrop-filter:blur(4px)]"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] py-8 px-9 min-w-[260px] max-w-[360px] w-full shadow-[var(--shadow-lg)] relative text-center animate-[moodPopIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 bg-transparent border-0 text-[1.4rem] text-[var(--text-muted)] cursor-pointer leading-none p-1 transition-colors duration-150 hover:text-[var(--text-primary)]"
              onClick={() => setSelected(null)}
            >×</button>

            {selected.date && (
              <p className="text-[0.8rem] font-semibold text-[var(--text-muted)] mb-[18px] capitalize">
                {new Date(selected.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </p>
            )}

            {selected.status ? (
              <>
                <div
                  className="flex items-center justify-center gap-3 rounded-[var(--radius-md)] py-4 px-6 mb-[18px]"
                  style={{
                    background: STATUS_LABEL_COLOR[selected.status] + '18',
                    border: `1.5px solid ${STATUS_LABEL_COLOR[selected.status]}`,
                  }}
                >
                  <span className="text-[2rem] leading-none">{STATUS_EMOJI[selected.status]}</span>
                  <span
                    className="text-[1.3rem] font-extrabold font-[var(--font-display)]"
                    style={{ color: STATUS_LABEL_COLOR[selected.status] }}
                  >
                    {selected.status}
                  </span>
                </div>

                {selected.score !== null && (
                  <div className="flex items-center gap-[10px]">
                    <span className="text-[0.78rem] font-semibold text-[var(--text-muted)] flex-shrink-0">Pontuação</span>
                    <div className="flex-1 h-2 rounded-[99px] bg-[var(--bg-elevated)] overflow-hidden">
                      <div
                        className="h-full rounded-[99px] transition-[width] duration-400"
                        style={{
                          width: `${(selected.score / 5) * 100}%`,
                          background: STATUS_LABEL_COLOR[selected.status],
                        }}
                      />
                    </div>
                    <span
                      className="text-[0.82rem] font-extrabold flex-shrink-0"
                      style={{ color: STATUS_LABEL_COLOR[selected.status] }}
                    >
                      {selected.score?.toFixed(1)}/5
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2 pb-1">
                <span className="text-[2.2rem]">📋</span>
                <p className="text-[0.88rem] text-[var(--text-secondary)] m-0">
                  Nenhum registro para <strong>{selected.label}</strong>.
                </p>
                <p className="text-[0.76rem] text-[var(--text-muted)] m-0">
                  Complete o CareMood para registrar seu humor do dia.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
