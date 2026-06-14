import { useState, useEffect } from 'react';
import { getMonthHistory } from '../../pages/CareMood/services/moodStorage';

const STATUS_CONFIG = {
  Excelente:   { color: '#22c55e', label: 'Excelente',  emoji: '🌟' },
  Normal:      { color: '#facc15', label: 'Normal',      emoji: '😊' },
  Cansado:     { color: '#f97316', label: 'Cansado',     emoji: '😴' },
  Estressado:  { color: '#ef4444', label: 'Estressado',  emoji: '😤' },
};

const DEMO_KEY = 'carelevel-tracker-demo-seeded';
const DEMO_ENTRIES = [
  { dayOffset: -1, status: 'Normal',     score: 3.0 },
  { dayOffset: -2, status: 'Excelente',  score: 4.8 },
  { dayOffset: -3, status: 'Cansado',    score: 2.5 },
  { dayOffset: -4, status: 'Estressado', score: 1.4 },
  { dayOffset: -5, status: 'Normal',     score: 3.2 },
  { dayOffset: -6, status: 'Excelente',  score: 4.5 },
  { dayOffset: -8, status: 'Cansado',    score: 2.1 },
  { dayOffset: -9, status: 'Estressado', score: 1.8 },
  { dayOffset: -10, status: 'Normal',    score: 3.0 },
  { dayOffset: -12, status: 'Excelente', score: 4.9 },
  { dayOffset: -14, status: 'Normal',    score: 3.4 },
  { dayOffset: -16, status: 'Cansado',   score: 2.3 },
  { dayOffset: -18, status: 'Excelente', score: 4.6 },
  { dayOffset: -20, status: 'Estressado',score: 1.2 },
  { dayOffset: -22, status: 'Normal',    score: 3.1 },
  { dayOffset: -24, status: 'Excelente', score: 4.7 },
  { dayOffset: -26, status: 'Cansado',   score: 2.0 },
  { dayOffset: -28, status: 'Normal',    score: 3.5 },
];

function seedDemoData() {
  if (localStorage.getItem(DEMO_KEY)) return;
  const today = new Date();
  const existing = JSON.parse(localStorage.getItem('caremood_history') || '[]');
  const existingDates = new Set(existing.map(e => e.date));
  const newEntries = DEMO_ENTRIES
    .map(({ dayOffset, status, score }) => {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return { date: dateStr, status, score };
    })
    .filter(e => !existingDates.has(e.date));
  const merged = [...existing, ...newEntries].sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem('caremood_history', JSON.stringify(merged));
  localStorage.setItem(DEMO_KEY, '1');
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function toDateStr(year, month, day) { return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; }

const PT_MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function DailyTracker() {
  const realToday = new Date();
  const [viewYear,  setViewYear]  = useState(realToday.getFullYear());
  const [viewMonth, setViewMonth] = useState(realToday.getMonth());
  const [history,   setHistory]   = useState([]);
  const [tooltip,   setTooltip]   = useState(null);

  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const todayDay  = realToday.getDate();
  const isCurrentMonth = viewYear === realToday.getFullYear() && viewMonth === realToday.getMonth();
  const monthLabel = `${PT_MONTHS[viewMonth].slice(0, 3)}/${viewYear}`;

  useEffect(() => {
    seedDemoData();
    setHistory(getMonthHistory(viewYear, viewMonth));
  }, [viewYear, viewMonth]);

  const historyMap = {};
  history.forEach(e => { historyMap[e.date] = e; });

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    const now = new Date();
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }
  const isNextDisabled = viewYear === realToday.getFullYear() && viewMonth === realToday.getMonth();

  const statusCounts = {};
  history.forEach(e => { statusCounts[e.status] = (statusCounts[e.status] || 0) + 1; });
  const totalRegistered = history.length;
  const totalPastDays = isCurrentMonth ? todayDay - 1 : totalDays;
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const btnBase = 'relative flex flex-col items-center gap-[3px] w-8 h-8 sm:w-9 sm:h-9 rounded-lg border transition-all duration-150 cursor-pointer font-[var(--font-body)]';

  return (
    <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] m-0">📅 Acompanhamento Diário</h3>
        <div className="flex items-center gap-1.5">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] bg-transparent border border-[var(--border)] text-[var(--text-secondary)] cursor-pointer text-base leading-none transition-[background,border-color] duration-150 hover:bg-[var(--bg-elevated)] hover:border-[var(--accent)]"
            onClick={prevMonth} aria-label="Mês anterior"
          >‹</button>
          <span className="text-xs font-semibold text-[var(--text-secondary)] min-w-[64px] text-center">{monthLabel}</span>
          <button
            className={`w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] border text-base leading-none transition-[background,border-color] duration-150 ${isNextDisabled ? 'bg-transparent border-[var(--border)] text-[var(--text-muted)] opacity-35 cursor-not-allowed' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-elevated)] hover:border-[var(--accent)]'}`}
            onClick={nextMonth} disabled={isNextDisabled} aria-label="Próximo mês"
          >›</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <strong className="text-[var(--text-primary)]">{totalRegistered}</strong> registros
        </span>
        <span className="w-px h-3 bg-[var(--border)]" />
        <span className="flex items-center gap-1">
          <strong className="text-[var(--text-primary)]">{totalPastDays - totalRegistered}</strong> sem registro
        </span>
        {Object.entries(statusCounts).map(([status, count]) => (
          <span key={status} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_CONFIG[status]?.color }} />
            <strong className="text-[var(--text-primary)]">{count}</strong> {status}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 text-[10px] text-[var(--text-muted)]">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
            {cfg.label}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#cbd5e1]" />
          Sem registro
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(36px,1fr))] gap-1 sm:gap-1.5">
        {days.map((day) => {
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const entry   = historyMap[dateStr];
          const isToday = isCurrentMonth && day === todayDay;
          const isPast  = isCurrentMonth ? day < todayDay : true;
          const isFuture = isCurrentMonth && day > todayDay;

          let dotColor = null;
          if (isPast && entry)  dotColor = STATUS_CONFIG[entry.status]?.color ?? '#cbd5e1';
          if (isPast && !entry) dotColor = '#cbd5e1';

          return (
            <button
              key={day}
              className={[
                btnBase,
                isToday  ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-bold z-10' : '',
                isPast && entry ? 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)]' : '',
                isPast && !entry ? 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)]' : '',
                isFuture ? 'border-transparent bg-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed' : '',
              ].join(' ')}
              onClick={() => isPast && setTooltip({ day, status: entry?.status || null, score: entry?.score, dateStr })}
              disabled={isFuture}
              title={isToday ? 'Hoje' : undefined}
            >
              <span className="text-[10px] sm:text-[11px] font-semibold leading-none mt-1">{day}</span>
              {dotColor && <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: dotColor }} />}
              {isToday && <span className="absolute inset-0 rounded-lg border-2 border-[var(--accent)] opacity-40 animate-[dailyPulse_2s_ease-in-out_infinite]" />}
            </button>
          );
        })}
      </div>

      {tooltip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-4 [backdrop-filter:blur(3px)]" onClick={() => setTooltip(null)}>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] py-6 px-6 max-w-[300px] w-full shadow-[var(--shadow-lg)] relative animate-[modalIn_0.2s_cubic-bezier(0.34,1.56,0.64,1)]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-4 bg-transparent border-0 text-[1.3rem] text-[var(--text-muted)] cursor-pointer leading-none hover:text-[var(--text-primary)]" onClick={() => setTooltip(null)}>×</button>
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-4 capitalize">
              {new Date(tooltip.dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {tooltip.status ? (
              <>
                <div
                  className="flex items-center gap-3 rounded-[var(--radius-md)] py-3 px-4 mb-3"
                  style={{ background: STATUS_CONFIG[tooltip.status]?.color + '22', borderColor: STATUS_CONFIG[tooltip.status]?.color, border: `1.5px solid ${STATUS_CONFIG[tooltip.status]?.color}` }}
                >
                  <span className="text-2xl">{STATUS_CONFIG[tooltip.status]?.emoji}</span>
                  <span className="font-bold text-base" style={{ color: STATUS_CONFIG[tooltip.status]?.color }}>{tooltip.status}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  Pontuação: <strong className="text-[var(--text-primary)]">{tooltip.score?.toFixed(1)}</strong> / 5
                </p>
              </>
            ) : (
              <p className="text-sm text-[var(--text-muted)] text-center">Nenhum registro para este dia.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
