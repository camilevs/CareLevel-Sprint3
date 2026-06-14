import { NavLink, useNavigate } from 'react-router-dom';
import { Flame, User, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUser } from '../UserContext/UserContext';
import { useAuth } from '../../context/AuthContext';
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

  const navLinkBase = 'flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--text-secondary)] transition-[background,color] duration-150 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] no-underline';
  const navLinkActive = 'bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]';

  return (
    <header className="fixed left-0 top-0 h-screen w-[280px] bg-[var(--navbar-bg)] border-r border-[var(--navbar-border)] [backdrop-filter:blur(12px)] flex flex-col z-[100] max-[966px]:fixed max-[966px]:top-0 max-[966px]:left-0 max-[966px]:h-auto max-[966px]:w-full max-[966px]:border-r-0 max-[966px]:border-b max-[966px]:border-b-[var(--navbar-border)]">
      <div className="flex flex-col flex-1 min-h-0 p-4 gap-4 max-[966px]:flex-row max-[966px]:items-center max-[966px]:py-3 max-[966px]:px-4">

        {/* Logo + burger row */}
        <div className="flex items-center justify-between max-[966px]:flex-shrink-0">
          <NavLink to="/" className="flex items-center gap-2 no-underline">
            <Logo size={30} />
          </NavLink>
          <button
            className="hidden max-[966px]:flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] bg-transparent border-0 text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors duration-150"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Stats badges */}
        <div className="flex items-center gap-2 max-[966px]:flex-1 max-[966px]:justify-end">
          <div className="flex items-center gap-1.5 bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.25)] rounded-[var(--radius-sm)] py-1.5 px-2.5" title="Sequência de dias">
            <Flame size={14} color="#F97316" fill="#F97316" />
            <span className="text-xs font-bold text-[#F97316]">{user.streak}</span>
          </div>
          <NavLink
            to="/carepoints"
            className={({ isActive }) =>
              `flex items-center gap-1.5 bg-[var(--accent-subtle)] border border-[var(--accent-border)] rounded-[var(--radius-sm)] py-1.5 px-2.5 no-underline transition-[background] duration-150 hover:bg-[var(--accent)] hover:[&>span]:text-white ${isActive ? 'bg-[var(--accent)] [&>span]:text-white' : ''}`
            }
            title="CarePoints"
          >
            <img src="/512x512bb%204.svg" alt="CarePoints" className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-bold text-[var(--accent)]">{user.points.toLocaleString('pt-BR')}</span>
          </NavLink>
        </div>

        {/* Nav links */}
        <nav
          className={[
            'flex flex-col gap-1 flex-1 min-h-0 min-[967px]:flex',
            'max-[966px]:absolute max-[966px]:top-[60px] max-[966px]:left-0 max-[966px]:w-full',
            'max-[966px]:bg-[var(--nav-menu-bg)] max-[966px]:border-b max-[966px]:border-[var(--navbar-border)]',
            'max-[966px]:p-4 max-[966px]:flex-col max-[966px]:gap-1',
            'max-[966px]:transition-all max-[966px]:duration-300',
            menuOpen
              ? 'max-[966px]:translate-y-0 max-[966px]:opacity-100 max-[966px]:pointer-events-auto'
              : 'max-[966px]:-translate-y-3 max-[966px]:opacity-0 max-[966px]:pointer-events-none',
          ].join(' ')}
        >
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + theme + logout */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)] max-[966px]:hidden">
          <div className="flex items-center justify-between gap-2">
            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 px-2.5 rounded-[var(--radius-sm)] text-sm font-semibold no-underline transition-[background,color] duration-150 flex-1 min-w-0 ${isActive ? 'text-[var(--accent)] bg-[var(--accent-subtle)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'}`
              }
              title="Meu perfil"
            >
              <User size={15} className="flex-shrink-0" />
              <span className="truncate">{firstName}</span>
            </NavLink>

            <label className="relative inline-flex w-[34px] h-[20px] flex-shrink-0 cursor-pointer" title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>
              <input type="checkbox" className="absolute opacity-0 w-0 h-0 pointer-events-none" checked={isDark} onChange={() => setIsDark((d) => !d)} />
              <span className={`absolute inset-0 rounded-[10px] border transition-[background,border-color] duration-[250ms] ${isDark ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--bg-elevated)] border-[var(--border)]'}`}>
                <span className={`absolute w-[13px] h-[13px] rounded-full top-[2px] left-[2px] transition-[transform,background] duration-[250ms] ${isDark ? 'translate-x-[14px] bg-white' : 'translate-x-0 bg-[var(--text-muted)]'}`} />
              </span>
            </label>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 py-2 px-2.5 rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--text-muted)] bg-transparent border-0 cursor-pointer transition-[background,color] duration-150 hover:bg-[rgba(239,68,68,0.1)] hover:text-[#fca5a5] w-full"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>

      </div>
    </header>
  );
}
