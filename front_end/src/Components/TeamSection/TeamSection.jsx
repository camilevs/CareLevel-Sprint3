import styles from './TeamSection.module.css';

const TEAM = [
  { name: 'Lucas',    role: 'Back-end Developer',   avatar: 'https://i.pravatar.cc/100?img=12', emoji: '⚙️' },
  { name: 'Marco',    role: 'Full Stack Developer',  avatar: 'https://i.pravatar.cc/100?img=15', emoji: '🚀' },
  { name: 'Sofia',    role: 'UI/UX Designer',        avatar: 'https://i.pravatar.cc/100?img=47', emoji: '🎨' },
  { name: 'Gustavo',  role: 'Front-end Developer',   avatar: 'https://i.pravatar.cc/100?img=33', emoji: '💻' },
  { name: 'Você',     role: 'TI (Você)',             avatar: 'https://i.pravatar.cc/100?img=68', emoji: '🧑‍💻', isYou: true },
];

export default function TeamSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Nossa Equipe</h2>
        <p className={styles.subtitle}>As pessoas por trás do CareLevel</p>
        <div className={styles.grid}>
          {TEAM.map((member) => (
            <div
              key={member.name}
              className={`${styles.card} ${member.isYou ? styles.cardYou : ''}`}
            >
              <div className={styles.avatarWrap}>
                <img src={member.avatar} alt={member.name} className={styles.avatar} />
                <span className={styles.emoji}>{member.emoji}</span>
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{member.name}</span>
                <span className={styles.role}>{member.role}</span>
              </div>
              {member.isYou && <div className={styles.youBadge}>Você</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
