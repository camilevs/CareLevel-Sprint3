import { Flame } from 'lucide-react';
import styles from './StreakTracker.module.css';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function mondayBasedIndex(jsDay) {
  return (jsDay + 6) % 7;
}

export default function StreakTracker({ streak = 0, className = '' }) {
  const safeStreak = Math.max(0, Number(streak) || 0);
  const todayIndex = mondayBasedIndex(new Date().getDay());

  return (
    <section className={[styles.wrapper, className].filter(Boolean).join(' ')} aria-label="Streak semanal">
      <div className={styles.top}>
        <div className={styles.value}>{safeStreak}</div>

        <div className={styles.meta}>
          <div className={styles.iconWrap}>
            <Flame size={24} color="#f97316" fill="#f97316" aria-hidden="true" />
          </div>
          <p className={styles.label}>Sequencia atual</p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.week}>
        {WEEK_DAYS.map((day, index) => {
          const isFuture = index > todayIndex;
          const isActive = index <= todayIndex && index > todayIndex - safeStreak;

          const dotClassName = [
            styles.dot,
            isFuture ? styles.dotFuture : '',
            isActive ? styles.dotActive : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={day} className={styles.day}>
              <span className={dotClassName} aria-hidden="true" />
              <span className={styles.dayLabel}>{day}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
