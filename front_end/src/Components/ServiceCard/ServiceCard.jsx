import styles from './ServiceCard.module.css';

export default function ServiceCard({ icon: Icon, label, onClick }) {
  return (
    <button className={styles.card} onClick={onClick} aria-label={label}>
      <div className={styles.iconWrap}>
        <Icon size={44} color="white" strokeWidth={1.5} />
      </div>
      <span className={styles.label}>{label}</span>
    </button>
  );
}