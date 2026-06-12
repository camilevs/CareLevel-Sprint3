import { Flame } from 'lucide-react';
import styles from './StreakTracker.module.css';

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function mondayBasedIndex(jsDay) {
  return (jsDay + 6) % 7;
}

export default function StreakTracker({ streak = 0, className = '' }) {
  const safeStreak = Math.max(0, Number(streak) || 0);
  const todayIndex = mondayBasedIndex(new Date().getDay());

  return (
    <section className={[styles.wrapper, className].filter(Boolean).join(' ')} aria-label="Streak semanal">
      <div className={styles.top}>
        <div className={styles.countWrap}>
          <span className={styles.value}>{safeStreak}</span>
          <span className={styles.dias}>dias</span>
        </div>

        <div className={styles.meta}>
          <div className={styles.iconWrap} aria-hidden="true">
            <Flame size={26} color="#f97316" fill="#f97316" />
          </div>
          <p className={styles.label}>Sequência<br />atual</p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.week}>
        {WEEK_DAYS.map((day, index) => {
          const isFuture = index > todayIndex;
          const isActive = index <= todayIndex && index > todayIndex - safeStreak;

          return (
            <div key={day} className={styles.day}>
              <span
                className={[
                  styles.dot,
                  isFuture  ? styles.dotFuture  : '',
                  isActive  ? styles.dotActive  : '',
                ].filter(Boolean).join(' ')}
                aria-hidden="true"
              />
              <span className={styles.dayLabel}>{day}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
