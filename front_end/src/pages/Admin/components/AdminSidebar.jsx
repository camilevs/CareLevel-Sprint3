import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export const C = {
  bg:       '#e8f0ec',
  card:     '#2d7a5f',
  cardLight:'#4aaf85',
  cardDark: '#1a4d3a',
  text:     '#fff',
  textDark: '#1a3a2a',
  accent:   '#6fcf97',
}

const NAV_LINKS = [
  { label: 'Home',           path: '/admin/home' },
  { label: 'Beneficiários',  path: '/admin/beneficiarios' },
  { label: 'Recompensas',    path: '/admin/recompensas' },
  { label: 'Missões',        path: '/admin/missoes' },
]

export default function AdminSidebar() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const { logout }   = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 w-64 flex flex-col p-6 gap-4 z-[100] shadow-[2px_0_12px_rgba(0,0,0,0.15)]"
      style={{ background: C.cardDark }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: C.accent }} />
        <span className="font-extrabold text-base text-white tracking-[-0.5px]">CareLevel</span>
        <span className="ml-auto text-[11px] font-bold bg-white/[0.12] text-white rounded-md px-2 py-0.5">ADM</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(({ label, path }) => {
          const isActive = pathname === path || (path !== '/admin/home' && pathname.startsWith(path))
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={[
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border-0 cursor-pointer text-sm font-semibold text-left w-full transition-[background,color] duration-200',
                isActive
                  ? 'bg-white/[0.18] text-white'
                  : 'bg-transparent text-white/65 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </nav>

      {/* Profile + Logout */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="h-px bg-white/10" />
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-white/15">
            RH
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">Conta RH</div>
            <div className="text-[11px] text-white/50">Administrador</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border-0 cursor-pointer text-sm font-semibold w-full text-left transition-[background,color] duration-200 text-white/60 hover:bg-red-500/20 hover:text-red-300 bg-transparent"
        >
          <span className="text-base leading-none">↩</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
