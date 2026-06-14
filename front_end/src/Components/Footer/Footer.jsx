import { NavLink } from 'react-router-dom';
import Logo from '../Logo/Logo';
import styles from './Footer.module.css';

const NAV_COL = [
  { label: 'Início',      to: '/home' },
  { label: 'Missões',     to: '/missoes' },
  { label: 'CareMood',    to: '/caremood' },
  { label: 'Ranking',     to: '/ranking' },
];

const NAV_COL2 = [
  { label: 'Recompensas', to: '/recompensas' },
  { label: 'Conquistas',  to: '/conquistas' },
  { label: 'CarePoints',  to: '/carepoints' },
  { label: 'Meu Perfil',  to: '/perfil' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.wave} aria-hidden="true">
        <svg viewBox="0 0 1440 54" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 27C240 54 480 0 720 27C960 54 1200 0 1440 27V54H0V27Z" fill="var(--footer-wave)" />
        </svg>
      </div>

      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <div className={styles.logoRow}>
            <Logo size={42} />
            <span className={styles.brandName}>CareLevel</span>
          </div>
          <p className={styles.tagline}>
            Bem-estar corporativo inteligente.<br />
            Cuide das pessoas que fazem a diferença.
          </p>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Plataforma ativa
          </div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navCol}>
            <span className={styles.colLabel}>Navegação</span>
            {NAV_COL.map(({ label, to }) => (
              <NavLink key={to} to={to} className={styles.link}>{label}</NavLink>
            ))}
          </div>
          <div className={styles.navCol}>
            <span className={styles.colLabel}>Mais</span>
            {NAV_COL2.map(({ label, to }) => (
              <NavLink key={to} to={to} className={styles.link}>{label}</NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>© {year} CareLevel · Todos os direitos reservados</span>
        <span className={styles.madeWith}>Feito com 💚 para o bem-estar corporativo</span>
      </div>
    </footer>
  );
}
