import { Flame } from 'lucide-react';

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function mondayBasedIndex(jsDay) {
  return (jsDay + 6) % 7;
}

export default function StreakTracker({ streak = 0, className = '' }) {
  const safeStreak = Math.max(0, Number(streak) || 0);
  const todayIndex = mondayBasedIndex(new Date().getDay());

  return (
    <section
      className={['bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[22px] p-4 px-5 shadow-[var(--shadow-md)] flex flex-col gap-3', className].filter(Boolean).join(' ')}
      aria-label="Streak semanal"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-end gap-1">
          <span className="font-[var(--font-display)] text-4xl font-black text-[var(--text-primary)] leading-none">{safeStreak}</span>
          <span className="text-xs font-bold text-[var(--text-muted)] pb-1">dias</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 bg-[rgba(249,115,22,0.12)] rounded-full" aria-hidden="true">
            <Flame size={26} color="#f97316" fill="#f97316" />
          </div>
          <p className="text-xs font-semibold text-[var(--text-secondary)] leading-tight m-0">Sequência<br />atual</p>
        </div>
      </div>

      <div className="h-px bg-[var(--border)]" />

      <div className="flex justify-between">
        {WEEK_DAYS.map((day, index) => {
          const isFuture = index > todayIndex;
          const isActive = index <= todayIndex && index > todayIndex - safeStreak;

          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span
                className={[
                  'w-2.5 h-2.5 rounded-full transition-colors duration-200',
                  isFuture  ? 'bg-[var(--bg-elevated)] opacity-40' :
                  isActive  ? 'bg-[var(--accent)] shadow-[0_0_6px_var(--accent-glow)]' :
                              'bg-[var(--bg-elevated)]',
                ].join(' ')}
                aria-hidden="true"
              />
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.05em]">{day}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
