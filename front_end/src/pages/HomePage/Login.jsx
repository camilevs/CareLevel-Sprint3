import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginRequest } from '../../services/api'

const FEATURES = [
  { label: 'Missões gamificadas',       desc: 'Engajamento com propósito' },
  { label: 'Recompensas e CarePoints',  desc: 'Reconhecimento que motiva' },
  { label: 'Dashboard em tempo real',   desc: 'Decisões orientadas a dados' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login, user } = useAuth()

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)

  if (user?.role === 'admin') return <Navigate to="/admin/home" replace />
  if (user?.role === 'user')  return <Navigate to="/home"       replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const authData = await loginRequest(email.trim().toLowerCase(), password)
      login(authData)
      navigate(authData.user.role === 'admin' ? '/admin/home' : '/home', { replace: true })
    } catch (err) {
      setError(
        err?.code === 'ERR_NETWORK'
          ? 'Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3005.'
          : (err?.response?.data?.message ?? 'E-mail ou senha incorretos.')
      )
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-sm)] ' +
    'px-4 py-3 text-sm text-[var(--text-primary)] font-[var(--font-body)] outline-none ' +
    'transition-[border-color,box-shadow] duration-200 ' +
    'focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-subtle)] ' +
    'placeholder:text-[var(--text-muted)]'

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Painel de marca — lg+ apenas ─────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[58%] xl:w-[60%] flex-shrink-0 flex-col justify-between p-14 xl:p-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1a4d3a 0%, #2d7a5f 55%, #4aaf85 100%)' }}
      >
        {/* Blobs decorativos */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-[0.18]"
             style={{ background: 'radial-gradient(circle, #6fcf97, transparent 70%)' }} />
        <div className="absolute -bottom-28 -left-28 w-[480px] h-[480px] rounded-full pointer-events-none opacity-[0.12]"
             style={{ background: 'radial-gradient(circle, #4aaf85, transparent 70%)' }} />
        <div className="absolute top-[42%] right-[18%] w-56 h-56 rounded-full pointer-events-none opacity-[0.07] animate-float"
             style={{ background: 'radial-gradient(circle, #fff, transparent 70%)' }} />

        {/* Gradiente de integração — funde o painel verde com o escuro */}
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none z-20"
          style={{
            width: '8rem',
            background: 'linear-gradient(to right, rgba(45,122,95,0) 0%, var(--bg-primary) 100%)',
          }}
        />

        {/* Logo — sem container ao redor */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/Logo.svg" alt="CareLevel" className="w-10 h-10 object-contain" />
          <span className="text-white font-extrabold text-xl tracking-tight">CareLevel</span>
          <span
            className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.8)' }}
          >
            BETA
          </span>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 flex flex-col gap-10">
          <div>
            <div className="text-white font-extrabold text-4xl xl:text-[44px] leading-[1.18] tracking-tight">
              Bem-estar corporativo<br />
              <span style={{ color: '#a5d6c0' }}>para quem faz<br />a diferença.</span>
            </div>
            <p className="text-base mt-5 m-0" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 340 }}>
              Acompanhe missões, conquistas e o bem-estar da sua equipe em tempo real.
            </p>
          </div>

          {/* Features — texto interativo, sem ícones */}
          <div className="flex flex-col gap-4">
            {FEATURES.map(f => (
              <div
                key={f.label}
                className="group flex flex-col gap-0.5 pl-4 cursor-default transition-all duration-300"
                style={{ borderLeft: '2px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#6fcf97' }}
                onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.2)' }}
              >
                <span className="text-sm font-bold text-white transition-colors duration-200 group-hover:text-[#6fcf97] leading-snug">
                  {f.label}
                </span>
                <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  {f.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <p className="relative z-10 text-[11px] m-0" style={{ color: 'rgba(255,255,255,0.32)' }}>
          © {new Date().getFullYear()} CareLevel · Todos os direitos reservados
        </p>
      </div>

      {/* ── Painel do formulário — sobrepõe o verde em lg+ ───────────── */}
      <div
        className={[
          'flex-1 flex flex-col items-center justify-center',
          'px-10 py-14 sm:px-14 lg:py-0',
          'relative z-10',
          'lg:-ml-12',
          'lg:rounded-tl-[28px] lg:rounded-bl-[28px]',
        ].join(' ')}
        style={{
          background: 'var(--bg-primary)',
          boxShadow: '-20px 0 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo mobile — sem container ao redor */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-8 animate-fade-in">
          <img src="/Logo.svg" alt="CareLevel" className="w-14 h-14 object-contain" />
          <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            CareLevel
          </span>
          <p className="text-sm text-center m-0" style={{ color: 'var(--text-secondary)' }}>
            Bem-estar corporativo inteligente
          </p>
        </div>

        {/* Card do formulário */}
        <div className="w-full max-w-[400px] flex flex-col gap-6 animate-fade-in-up">

          {/* Cabeçalho */}
          <div>
            <div
              className="font-extrabold tracking-tight"
              style={{ fontSize: '1.65rem', color: 'var(--text-primary)', lineHeight: 1.2 }}
            >
              Bem-vindo de volta
            </div>
            <p className="text-sm mt-1.5 m-0" style={{ color: 'var(--text-secondary)' }}>
              Faça login para acessar a plataforma
            </p>
          </div>

          {/* Mensagem de erro — texto, sem ícone */}
          {error && (
            <div
              className="rounded-xl py-3 px-4 text-sm animate-fade-in leading-relaxed"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#fca5a5',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                E-mail
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className={inputCls}
              />
            </div>

            {/* Senha — toggle como texto junto ao label */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="text-xs font-semibold border-0 bg-transparent cursor-pointer transition-colors duration-150 underline-offset-2 hover:underline text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputCls}
              />
            </div>

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full flex items-center justify-center gap-2.5 py-3.5 text-[15px] font-bold text-white rounded-[var(--radius-sm)] border-0 cursor-pointer transition-[background,transform,opacity] duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{ background: 'var(--accent)', boxShadow: '0 4px 16px var(--accent-glow)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                    <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando…
                </>
              ) : 'Entrar'}
            </button>
          </form>

          {/* Aviso */}
          <p className="text-xs text-center m-0" style={{ color: 'var(--text-muted)' }}>
            Plataforma de uso exclusivo para colaboradores CareLevel
          </p>
        </div>
      </div>
    </div>
  )
}
