import { NavLink } from 'react-router-dom';
import Logo from '../Logo/Logo';

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
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] mt-auto">
      <div className="w-full overflow-hidden h-[54px]" aria-hidden="true">
        <svg viewBox="0 0 1440 54" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 27C240 54 480 0 720 27C960 54 1200 0 1440 27V54H0V27Z" fill="var(--footer-wave)" />
        </svg>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-wrap gap-10 items-start">
        <div className="flex flex-col gap-4 min-w-[200px] flex-1">
          <div className="flex items-center gap-2.5">
            <Logo size={42} />
            <span className="font-[var(--font-display)] text-xl font-black tracking-[-0.5px] text-[var(--accent)]">CareLevel</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed m-0">
            Bem-estar corporativo inteligente.<br />
            Cuide das pessoas que fazem a diferença.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] text-xs font-bold text-[#4ade80] w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            Plataforma ativa
          </div>
        </div>

        <div className="flex gap-12 flex-wrap">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[1px] mb-1">Navegação</span>
            {NAV_COL.map(({ label, to }) => (
              <NavLink key={to} to={to} className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">{label}</NavLink>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[1px] mb-1">Mais</span>
            {NAV_COL2.map(({ label, to }) => (
              <NavLink key={to} to={to} className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">{label}</NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-4 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[var(--text-muted)]">© {year} CareLevel · Todos os direitos reservados</span>
          <span className="text-xs text-[var(--text-muted)]">Feito com 💚 para o bem-estar corporativo</span>
        </div>
      </div>
    </footer>
  );
}
