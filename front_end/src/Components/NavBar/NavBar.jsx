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

export default function Navbar() {
  const { user, logout: userLogout } = useUser();
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('has-sidebar-nav');

    return () => {
      document.body.classList.remove('has-sidebar-nav');
    };
  }, []);

  const handleLogout = () => {
    userLogout();
    authLogout();
    navigate('/login', { replace: true });
  };

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




          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              [styles.avatarBtn, isActive ? styles.avatarBtnActive : ''].join(' ')
            }
            title="Meu perfil"
            aria-label="Ir para o perfil"
          >
            <User size={18} />
          </NavLink>

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
