import { useState, useEffect, useCallback, useRef } from 'react'
import AdminSidebar, { C } from './components/AdminSidebar'
import Footer from '../../Components/Footer/Footer'
import {
  fetchAdminBeneficiarios,
  fetchAdminBeneficiarioById,
} from '../../services/api'

/* ── Helpers ──────────────────────────────────────────────────── */
const ROLE_LABEL = { admin: 'Admin', user: 'Colaborador' }
const ROLE_COLOR = { admin: '#2d7a5f', user: '#4aaf85' }

const TIPO_COLOR = { credito: '#22c55e', debito: '#ef4444', badge: '#f59e0b' }
const TIPO_LABEL = { credito: '+ Crédito', debito: '- Débito', badge: '🏅 Badge' }

function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

/* ── Modal de Perfil ──────────────────────────────────────────── */
function PerfilModal({ userId, onClose }) {
  const [perfil,  setPerfil]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro,    setErro]    = useState('')

  useEffect(() => {
    setLoading(true)
    setErro('')
    fetchAdminBeneficiarioById(userId)
      .then(setPerfil)
      .catch(() => setErro('Não foi possível carregar o perfil.'))
      .finally(() => setLoading(false))
  }, [userId])

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background:'rgba(0,0,0,0.6)' }}>
      <div
        className="w-full sm:max-w-[640px] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background:'#fff', maxHeight:'92vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: C.cardDark }}>
          <span className="font-bold text-base text-white">Perfil do Colaborador</span>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none cursor-pointer border-0 bg-transparent">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-sm" style={{ color:'#5a7a6a' }}>Carregando…</div>
          ) : erro ? (
            <div className="py-12 text-center text-sm text-red-500">{erro}</div>
          ) : perfil ? (
            <div className="p-6 flex flex-col gap-6">

              {/* Avatar + Nome */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0"
                  style={{ background: C.card }}
                >
                  {initials(perfil.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-lg" style={{ color: C.textDark }}>{perfil.name}</div>
                  <div className="text-sm text-gray-500">{perfil.email}</div>
                  <span
                    className="inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ background: ROLE_COLOR[perfil.role] ?? C.card }}
                  >
                    {ROLE_LABEL[perfil.role] ?? perfil.role}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Nível',       value: perfil.nivel   ?? '—',  icon: '⭐' },
                  { label: 'Streak',      value: perfil.streak  != null ? `${perfil.streak}d` : '—', icon: '🔥' },
                  { label: 'CarePoints',  value: perfil.carepoints?.toLocaleString('pt-BR') ?? '—', icon: '🪙' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 flex flex-col items-center gap-1 text-white" style={{ background: C.card }}>
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-lg font-extrabold leading-none">{s.value}</span>
                    <span className="text-[11px] opacity-75">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Dados pessoais */}
              <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: C.bg }}>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.textDark }}>Informações</span>
                {[
                  { label: 'Telefone', value: perfil.telefone || '—' },
                  { label: 'Equipe',   value: perfil.equipe_nome ? `${perfil.equipe_emoji ?? ''} ${perfil.equipe_nome}`.trim() : '—' },
                  { label: 'Ranking',  value: perfil.ranking_ativo === false ? 'Oculto' : 'Ativo' },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="font-semibold" style={{ color:'#5a7a6a' }}>{f.label}</span>
                    <span className="font-bold" style={{ color: C.textDark }}>{f.value}</span>
                  </div>
                ))}
              </div>

              {/* Histórico de CarePoints */}
              {perfil.historico?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.textDark }}>Histórico de CarePoints</span>
                  <div className="flex flex-col gap-1.5">
                    {perfil.historico.map(h => (
                      <div key={h.id} className="flex items-center justify-between rounded-xl px-4 py-2.5" style={{ background: C.bg }}>
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0 mr-3">
                          <span className="text-xs font-bold truncate" style={{ color: C.textDark }}>{h.atividade}</span>
                          <span className="text-[11px] text-gray-400">{h.data}</span>
                        </div>
                        <span className="text-xs font-extrabold flex-shrink-0" style={{ color: TIPO_COLOR[h.tipo] }}>
                          {h.pontos > 0 ? `+${h.pontos}` : h.pontos}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!perfil.historico?.length && (
                <p className="text-sm text-center text-gray-400 py-2">Sem histórico de CarePoints</p>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-bold cursor-pointer border-0 text-white transition-opacity hover:opacity-80"
            style={{ background: C.card }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Página Principal ─────────────────────────────────────────── */
export default function BeneficiariosAdmin() {
  const [lista,       setLista]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [erro,        setErro]        = useState('')
  const [search,      setSearch]      = useState('')
  const [perfilId,    setPerfilId]    = useState(null)
  const debounceRef = useRef(null)

  const load = useCallback(async (q = '') => {
    setLoading(true)
    setErro('')
    try {
      const data = await fetchAdminBeneficiarios(q)
      setLista(data)
    } catch {
      setErro('Não foi possível carregar os colaboradores.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSearch = (value) => {
    setSearch(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(value), 400)
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background: C.bg, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:'flex', flex:1 }}>
      <AdminSidebar />

      <div style={{ marginLeft: 256, flex: 1, padding:'28px 32px', display:'flex', flexDirection:'column', gap: 24 }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="m-0 font-extrabold text-2xl" style={{ color: C.textDark }}>Beneficiários</h1>
            <p className="m-0 text-sm mt-1" style={{ color:'#5a7a6a' }}>Visualize e monitore os colaboradores cadastrados na plataforma.</p>
          </div>
          {!loading && (
            <div className="text-sm font-semibold" style={{ color:'#5a7a6a' }}>
              {lista.length} {lista.length === 1 ? 'colaborador' : 'colaboradores'}
            </div>
          )}
        </div>

        {/* Busca */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-[400px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none"
              style={{ color: C.textDark }}
            />
          </div>
          {search && (
            <button
              onClick={() => { setSearch(''); load('') }}
              className="text-xs font-semibold cursor-pointer border-0 bg-transparent underline"
              style={{ color:'#5a7a6a' }}
            >
              Limpar
            </button>
          )}
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{erro}</div>
        )}

        {/* Tabela */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background:'#fff' }}>
          {loading ? (
            <div className="py-16 text-center text-sm" style={{ color:'#5a7a6a' }}>Carregando…</div>
          ) : lista.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center gap-3" style={{ color:'#5a7a6a' }}>
              <span className="text-4xl">👥</span>
              <span className="text-sm font-medium">
                {search ? 'Nenhum colaborador encontrado para esta busca' : 'Nenhum colaborador cadastrado'}
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 680 }}>
                <thead>
                  <tr style={{ borderBottom:`2px solid ${C.bg}` }}>
                    {['Colaborador', 'Nível', 'Streak', 'CarePoints', 'Equipe', 'Perfil', 'Ação'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide" style={{ color:'#5a7a6a' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lista.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{ borderBottom: i < lista.length - 1 ? `1px solid ${C.bg}` : 'none' }}
                      className="hover:bg-[#f4f9f6] transition-colors"
                    >
                      {/* Colaborador */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                            style={{ background: C.card }}
                          >
                            {initials(u.name)}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-sm font-bold truncate" style={{ color: C.textDark }}>{u.name}</span>
                            <span className="text-[11px] text-gray-400 truncate">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Nível */}
                      <td className="px-5 py-3.5 text-sm font-bold" style={{ color: C.card }}>
                        {u.nivel ?? '—'}
                      </td>

                      {/* Streak */}
                      <td className="px-5 py-3.5 text-sm" style={{ color: C.textDark }}>
                        {u.streak != null ? `🔥 ${u.streak}d` : '—'}
                      </td>

                      {/* CarePoints */}
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: C.textDark }}>
                        {u.carepoints != null ? `🪙 ${u.carepoints.toLocaleString('pt-BR')}` : '—'}
                      </td>

                      {/* Equipe */}
                      <td className="px-5 py-3.5 text-sm" style={{ color: C.textDark }}>
                        {u.equipe_nome ? `${u.equipe_emoji ?? ''} ${u.equipe_nome}`.trim() : '—'}
                      </td>

                      {/* Role badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                          style={{ background: ROLE_COLOR[u.role] ?? C.card }}
                        >
                          {ROLE_LABEL[u.role] ?? u.role}
                        </span>
                      </td>

                      {/* Ação */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setPerfilId(u.id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer border-0 text-white transition-opacity hover:opacity-80"
                          style={{ background: C.cardLight }}
                        >
                          Ver Perfil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>

      <Footer />

      {perfilId !== null && (
        <PerfilModal userId={perfilId} onClose={() => setPerfilId(null)} />
      )}
    </div>
  )
}
