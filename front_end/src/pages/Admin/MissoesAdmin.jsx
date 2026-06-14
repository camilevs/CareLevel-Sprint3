import { useState, useEffect, useCallback } from 'react'
import AdminSidebar, { C } from './components/AdminSidebar'
import Footer from '../../Components/Footer/Footer'
import {
  fetchAdminMissoes,
  createAdminMissao,
  updateAdminMissao,
  deleteAdminMissao,
} from '../../services/api'

/* ── Helpers ──────────────────────────────────────────────────── */
const TIPO_LABEL = { equipe: 'Equipe', individual: 'Individual' }
const TIPO_COLOR = { equipe: '#4aaf85', individual: '#2d7a5f' }

function emptyForm() {
  return {
    tipo:  'individual',
    tempo: '',
    itens: [{ titulo: '', pontos: 10, progresso: 0 }],
  }
}

/* ── Modal de Formulário ──────────────────────────────────────── */
function MissaoModal({ missao, onClose, onSave }) {
  const [form,    setForm]    = useState(() => missao ? {
    tipo:  missao.tipo,
    tempo: missao.dados?.tempo ?? '',
    itens: (missao.dados?.itens ?? []).map(it => ({ ...it })),
  } : emptyForm())
  const [saving,  setSaving]  = useState(false)
  const [erro,    setErro]    = useState('')

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const setItem = (idx, k, v) =>
    setForm(f => {
      const itens = f.itens.map((it, i) => i === idx ? { ...it, [k]: v } : it)
      return { ...f, itens }
    })

  const addItem = () =>
    setForm(f => ({ ...f, itens: [...f.itens, { titulo: '', pontos: 10, progresso: 0 }] }))

  const removeItem = idx =>
    setForm(f => ({ ...f, itens: f.itens.filter((_, i) => i !== idx) }))

  const handleSave = async () => {
    if (!form.tempo.trim()) return setErro('Informe o tempo da missão')
    if (form.itens.length === 0) return setErro('Adicione pelo menos um item')
    if (form.itens.some(it => !it.titulo.trim())) return setErro('Todos os itens precisam de título')
    setErro('')
    setSaving(true)
    try {
      const dados = {
        tempo: form.tempo.trim(),
        itens: form.itens.map((it, i) => ({
          id:        i + 1,
          titulo:    it.titulo.trim(),
          pontos:    Number(it.pontos) || 0,
          progresso: Math.min(100, Math.max(0, Number(it.progresso) || 0)),
        })),
      }
      await onSave(form.tipo, dados)
      onClose()
    } catch (e) {
      setErro(e?.response?.data?.erro || 'Erro ao salvar missão')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.55)' }}>
      <div className="w-full max-w-[600px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" style={{ background:'#fff' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: C.cardDark }}>
          <span className="font-bold text-base text-white">{missao ? 'Editar Missão' : 'Nova Missão'}</span>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none cursor-pointer border-0 bg-transparent">✕</button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{erro}</div>
          )}

          {/* Tipo + Tempo */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-bold" style={{ color: C.textDark }}>Tipo</label>
              <select
                value={form.tipo}
                onChange={e => setField('tipo', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                style={{ color: C.textDark }}
              >
                <option value="individual">Individual</option>
                <option value="equipe">Equipe</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
              <label className="text-xs font-bold" style={{ color: C.textDark }}>Tempo restante</label>
              <input
                type="text"
                value={form.tempo}
                onChange={e => setField('tempo', e.target.value)}
                placeholder="Ex: 7 dias, 16 horas"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                style={{ color: C.textDark }}
              />
            </div>
          </div>

          {/* Itens */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.textDark }}>Itens da missão</span>
              <button
                onClick={addItem}
                className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer border-0 text-white transition-opacity hover:opacity-80"
                style={{ background: C.card }}
              >
                + Adicionar item
              </button>
            </div>

            {form.itens.map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold" style={{ color: C.card }}>Item {idx + 1}</span>
                  {form.itens.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer border-0 bg-transparent font-semibold"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.titulo}
                  onChange={e => setItem(idx, 'titulo', e.target.value)}
                  placeholder="Título do item"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full"
                  style={{ color: C.textDark }}
                />
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[11px] font-semibold text-gray-500">Pontos</label>
                    <input
                      type="number"
                      min={0}
                      value={item.pontos}
                      onChange={e => setItem(idx, 'pontos', e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ color: C.textDark }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[11px] font-semibold text-gray-500">Progresso (%)</label>
                    <input
                      type="number"
                      min={0} max={100}
                      value={item.progresso}
                      onChange={e => setItem(idx, 'progresso', e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ color: C.textDark }}
                    />
                  </div>
                </div>
                {/* Barra de progresso visual */}
                <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, item.progresso)}%`, background: C.card }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            style={{ color: C.textDark }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-bold cursor-pointer border-0 text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: C.card }}
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Modal de Confirmação de Exclusão ─────────────────────────── */
function ConfirmModal({ mensagem, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.55)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5">
        <div className="text-4xl">🗑️</div>
        <p className="text-center text-sm font-medium" style={{ color: C.textDark }}>{mensagem}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            style={{ color: C.textDark }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer border-0 text-white transition-opacity hover:opacity-80 disabled:opacity-50 bg-red-500"
          >
            {loading ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Página Principal ─────────────────────────────────────────── */
export default function MissoesAdmin() {
  const [missoes,      setMissoes]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [erro,         setErro]         = useState('')
  const [modalForm,    setModalForm]    = useState(null)   // null | 'nova' | missaoObj
  const [confirmando,  setConfirmando]  = useState(null)  // null | missaoId
  const [delLoading,   setDelLoading]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const data = await fetchAdminMissoes()
      setMissoes(data)
    } catch {
      setErro('Não foi possível carregar as missões.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (tipo, dados) => {
    if (modalForm && modalForm !== 'nova') {
      const updated = await updateAdminMissao(modalForm.id, tipo, dados)
      setMissoes(m => m.map(x => x.id === updated.id ? updated : x))
    } else {
      const created = await createAdminMissao(tipo, dados)
      setMissoes(m => [...m, created])
    }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await deleteAdminMissao(confirmando)
      setMissoes(m => m.filter(x => x.id !== confirmando))
      setConfirmando(null)
    } catch {
      setErro('Erro ao excluir missão.')
      setConfirmando(null)
    } finally {
      setDelLoading(false)
    }
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background: C.bg, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:'flex', flex:1 }}>
      <AdminSidebar />

      <div style={{ marginLeft: 256, flex: 1, padding:'28px 32px', display:'flex', flexDirection:'column', gap: 24 }}>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="m-0 font-extrabold text-2xl" style={{ color: C.textDark }}>Missões</h1>
            <p className="m-0 text-sm mt-1" style={{ color:'#5a7a6a' }}>Gerencie as missões individuais e de equipe da plataforma.</p>
          </div>
          <button
            onClick={() => setModalForm('nova')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-0 text-white transition-opacity hover:opacity-85 shadow-md"
            style={{ background: C.card }}
          >
            + Nova Missão
          </button>
        </div>

        {/* Erro global */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{erro}</div>
        )}

        {/* Tabela */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background:'#fff' }}>
          {loading ? (
            <div className="py-16 text-center text-sm" style={{ color:'#5a7a6a' }}>Carregando…</div>
          ) : missoes.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center gap-3" style={{ color:'#5a7a6a' }}>
              <span className="text-4xl">📋</span>
              <span className="text-sm font-medium">Nenhuma missão cadastrada</span>
              <button
                onClick={() => setModalForm('nova')}
                className="text-sm font-bold cursor-pointer border-0 bg-transparent underline"
                style={{ color: C.card }}
              >
                Criar primeira missão
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom:`2px solid ${C.bg}` }}>
                  {['ID', 'Tipo', 'Tempo', 'Itens', 'Ações'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide" style={{ color:'#5a7a6a' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {missoes.map((m, i) => (
                  <tr
                    key={m.id}
                    style={{ borderBottom: i < missoes.length - 1 ? `1px solid ${C.bg}` : 'none' }}
                    className="hover:bg-[#f4f9f6] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-bold" style={{ color: C.card }}>#{m.id}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: TIPO_COLOR[m.tipo] }}
                      >
                        {TIPO_LABEL[m.tipo] ?? m.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: C.textDark }}>
                      {m.dados?.tempo ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: C.textDark }}>
                      {m.dados?.itens?.length ?? 0} {m.dados?.itens?.length === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalForm(m)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer border-0 text-white transition-opacity hover:opacity-80"
                          style={{ background: C.card }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmando(m.id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer border-0 text-white transition-opacity hover:opacity-80 bg-red-500"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>

      <Footer />

      {/* Modais */}
      {modalForm !== null && (
        <MissaoModal
          missao={modalForm !== 'nova' ? modalForm : null}
          onClose={() => setModalForm(null)}
          onSave={handleSave}
        />
      )}
      {confirmando !== null && (
        <ConfirmModal
          mensagem="Tem certeza que deseja excluir esta missão? Esta ação não pode ser desfeita."
          onConfirm={handleDelete}
          onCancel={() => setConfirmando(null)}
          loading={delLoading}
        />
      )}
    </div>
  )
}
