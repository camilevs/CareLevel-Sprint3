import { NavLink, useNavigate } from 'react-router-dom';
import { Flame, User, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useUser } from '../UserContext/UserContext';
import { useAuth } from '../../context/AuthContext';

import styles from './NavBar.module.css';
import Logo from '../Logo/Logo';

const NAV_LINKS = [
  { label: 'Início',      to: '/home' },
  { label: 'CareMood',    to: '/caremood' },
  { label: 'Jornada',     to: '/jornada' },
  { label: 'Recompensas', to: '/recompensas' },
  { label: 'CarePoints',  to: '/carepoints' },
];

function getInitialDark() {
  try {
    const saved = localStorage.getItem('care-theme');
    if (saved === 'light') return false;
  } catch { /* ignore */ }
  return true;
}

export default function Navbar() {
  const { user, logout: userLogout } = useUser();
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(getInitialDark);

  useEffect(() => {
    document.body.classList.add('has-sidebar-nav');
    return () => document.body.classList.remove('has-sidebar-nav');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    try { localStorage.setItem('care-theme', isDark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [isDark]);

  const handleLogout = () => {
    userLogout();
    authLogout();
    navigate('/login', { replace: true });
  };

  const firstName = (user.name || 'Usuário').split(' ')[0];

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>

        <div className={styles.topRow}>
          <NavLink to="/" className={styles.logoArea}>
            <Logo size={30} />
          </NavLink>

          <div className={styles.badge} title="Sequência de dias">
            <Flame size={16} color="#F97316" fill="#F97316" />
            <span className={styles.badgeText}>{user.streak}</span>
          </div>
        </div>

          <NavLink
            to="/carepoints"
            className={({ isActive }) =>
              [styles.badge, styles.badgeLink, isActive ? styles.badgeActive : ''].join(' ')
            }
            title="CarePoints"
          >
            <img
              src="/512x512bb%204.svg"
              alt="CarePoints"
              className={styles.pointsIconImage}
            />
            <span className={styles.badgeText}>
              {user.points.toLocaleString('pt-BR')}
            </span>
          </NavLink>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.profileRow}>
            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                [styles.profileLink, isActive ? styles.profileLinkActive : ''].join(' ')
              }
              title="Meu perfil"
              aria-label="Ir para o perfil"
            >
              <User size={15} />
              <span className={styles.userName}>{firstName}</span>
            </NavLink>

            <label className={styles.themeToggle} title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={isDark}
                onChange={() => setIsDark((d) => !d)}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Sair"
            aria-label="Fazer logout"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
