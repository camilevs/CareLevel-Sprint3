import { useState, useEffect } from 'react';
import { getMonthHistory, saveResult } from '../../pages/CareMood/services/moodStorage';
import styles from './DailyTracker.module.css';

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

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const PT_MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function DailyTracker() {
  const realToday = new Date();

  const [viewYear,  setViewYear]  = useState(realToday.getFullYear());
  const [viewMonth, setViewMonth] = useState(realToday.getMonth());
  const [history,   setHistory]   = useState([]);
  const [tooltip,   setTooltip]   = useState(null);

  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const todayDay  = realToday.getDate();
  const isCurrentMonth =
    viewYear === realToday.getFullYear() && viewMonth === realToday.getMonth();

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
  const isNextDisabled =
    viewYear === realToday.getFullYear() && viewMonth === realToday.getMonth();

  function isPastDay(day) {
    if (!isCurrentMonth) return true;
    return day < todayDay;
  }
  function isTodayDay(day) {
    return isCurrentMonth && day === todayDay;
  }
  function isFutureDay(day) {
    if (!isCurrentMonth) return false;
    return day > todayDay;
  }

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const statusCounts = {};
  history.forEach(e => { statusCounts[e.status] = (statusCounts[e.status] || 0) + 1; });
  const totalRegistered = history.length;
  const totalPastDays = isCurrentMonth ? todayDay - 1 : totalDays;

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>📅 Acompanhamento Diário</h3>

        <div className={styles.monthNav}>
          <button className={styles.navBtn} onClick={prevMonth} aria-label="Mês anterior">‹</button>
          <span className={styles.monthLabel}>{monthLabel}</span>
          <button
            className={`${styles.navBtn} ${isNextDisabled ? styles.navBtnDisabled : ''}`}
            onClick={nextMonth}
            disabled={isNextDisabled}
            aria-label="Próximo mês"
          >›</button>
        </div>
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryItem}>
          <span className={styles.summaryCount}>{totalRegistered}</span>
          <span className={styles.summaryLabel}>registros</span>
        </span>
        <span className={styles.summaryDivider} />
        <span className={styles.summaryItem}>
          <span className={styles.summaryCount}>{totalPastDays - totalRegistered}</span>
          <span className={styles.summaryLabel}>sem registro</span>
        </span>
        {Object.entries(statusCounts).map(([status, count]) => (
          <span key={status} className={styles.summaryItem}>
            <span
              className={styles.summaryDot}
              style={{ background: STATUS_CONFIG[status]?.color }}
            />
            <span className={styles.summaryCount}>{count}</span>
            <span className={styles.summaryLabel}>{status}</span>
          </span>
        ))}
      </div>

      <div className={styles.legend}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <span key={key} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: cfg.color }} />
            {cfg.label}
          </span>
        ))}
        <span className={styles.legendItem}>
          <span className={styles.dot} style={{ background: '#cbd5e1' }} />
          Sem registro
        </span>
      </div>

      <div className={styles.grid}>
        {days.map((day) => {
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const entry   = historyMap[dateStr];
          const today   = isTodayDay(day);
          const past    = isPastDay(day);
          const future  = isFutureDay(day);

          let dotColor = null;
          if (past && entry)  dotColor = STATUS_CONFIG[entry.status]?.color ?? '#cbd5e1';
          if (past && !entry) dotColor = '#cbd5e1';

          return (
            <button
              key={day}
              className={[
                styles.dayBtn,
                today   ? styles.dayToday   : '',
                past    ? styles.dayPast    : '',
                future  ? styles.dayFuture  : '',
                past && entry ? styles.dayHasData : '',
              ].join(' ')}
              onClick={() => past && setTooltip({ day, status: entry?.status || null, score: entry?.score, dateStr })}
              disabled={future}
              title={today ? 'Hoje' : undefined}
            >
              <span className={styles.dayNum}>{day}</span>
              {dotColor && (
                <span className={styles.statusDot} style={{ background: dotColor }} />
              )}
              {today && <span className={styles.todayPulse} />}
            </button>
          );
        })}
      </div>

      {tooltip && (
        <div className={styles.tooltipOverlay} onClick={() => setTooltip(null)}>
          <div className={styles.tooltipCard} onClick={e => e.stopPropagation()}>
            <button className={styles.tooltipClose} onClick={() => setTooltip(null)}>×</button>
            <p className={styles.tooltipDate}>
              {new Date(tooltip.dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
            {tooltip.status ? (
              <>
                <div
                  className={styles.tooltipStatus}
                  style={{
                    background: STATUS_CONFIG[tooltip.status]?.color + '22',
                    borderColor: STATUS_CONFIG[tooltip.status]?.color,
                  }}
                >
                  <span className={styles.tooltipEmoji}>{STATUS_CONFIG[tooltip.status]?.emoji}</span>
                  <span className={styles.tooltipStatusLabel} style={{ color: STATUS_CONFIG[tooltip.status]?.color }}>
                    {tooltip.status}
                  </span>
                </div>
                <p className={styles.tooltipScore}>
                  Pontuação: <strong>{tooltip.score?.toFixed(1)}</strong> / 5
                </p>
              </>
            ) : (
              <p className={styles.tooltipEmpty}>Nenhum registro para este dia.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
