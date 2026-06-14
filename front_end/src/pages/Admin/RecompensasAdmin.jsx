import { useState, useEffect, useCallback } from 'react'
import AdminSidebar, { C } from './components/AdminSidebar'
import Footer from '../../Components/Footer/Footer'
import {
  fetchAdminRecompensas,
  createAdminRecompensa,
  updateAdminRecompensa,
  deleteAdminRecompensa,
} from '../../services/api'

/* ── Formulário (criar / editar) ──────────────────────────────── */
function RecompensaModal({ recompensa, onClose, onSave }) {
  const [form,   setForm]   = useState({
    nome:   recompensa?.nome   ?? '',
    custo:  recompensa?.custo  ?? '',
    imagem: recompensa?.imagem ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [erro,   setErro]   = useState('')

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.nome.trim())    return setErro('Informe o nome da recompensa')
    if (!form.custo)          return setErro('Informe o custo em CarePoints')
    if (Number(form.custo) <= 0) return setErro('O custo deve ser maior que zero')
    setErro('')
    setSaving(true)
    try {
      await onSave({ nome: form.nome.trim(), custo: Number(form.custo), imagem: form.imagem.trim() || null })
      onClose()
    } catch (e) {
      setErro(e?.response?.data?.erro || 'Erro ao salvar recompensa')
    } finally {
      setSaving(false)
    }
  }

  const preview = form.imagem.trim()

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.55)' }}>
      <div className="w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ background:'#fff' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: C.cardDark }}>
          <span className="font-bold text-base text-white">{recompensa ? 'Editar Recompensa' : 'Nova Recompensa'}</span>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none cursor-pointer border-0 bg-transparent">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{erro}</div>
          )}

          {/* Preview de imagem */}
          {preview && (
            <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold" style={{ color: C.textDark }}>Nome da recompensa *</label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setField('nome', e.target.value)}
              placeholder="Ex: Ingressos para cinema"
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ color: C.textDark }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold" style={{ color: C.textDark }}>Custo (CarePoints) *</label>
            <input
              type="number"
              min={1}
              value={form.custo}
              onChange={e => setField('custo', e.target.value)}
              placeholder="Ex: 500"
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ color: C.textDark }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold" style={{ color: C.textDark }}>URL da imagem</label>
            <input
              type="url"
              value={form.imagem}
              onChange={e => setField('imagem', e.target.value)}
              placeholder="https://..."
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ color: C.textDark }}
            />
            <span className="text-[11px] text-gray-400">Opcional — cole a URL de uma imagem pública</span>
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

/* ── Modal de Confirmação ─────────────────────────────────────── */
function ConfirmModal({ mensagem, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.55)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5">
        <div className="text-4xl">🗑️</div>
        <p className="text-center text-sm font-medium" style={{ color: C.textDark }}>{mensagem}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer border border-gray-200 bg-white hover:bg-gray-50" style={{ color: C.textDark }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer border-0 text-white bg-red-500 hover:opacity-80 disabled:opacity-50">
            {loading ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Card de Recompensa ───────────────────────────────────────── */
function RecompensaCard({ r, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col shadow-sm hover:-translate-y-0.5 transition-transform" style={{ background:'#fff' }}>
      {/* Imagem */}
      <div className="h-40 overflow-hidden flex items-center justify-center" style={{ background: C.bg }}>
        {r.imagem ? (
          <img src={r.imagem} alt={r.nome} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🎁</span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <p className="text-sm font-bold m-0" style={{ color: C.textDark }}>{r.nome}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-base">🪙</span>
            <span className="text-sm font-extrabold" style={{ color: C.card }}>{r.custo.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-gray-400">CarePoints</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(r)}
            className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer border-0 text-white transition-opacity hover:opacity-80"
            style={{ background: C.card }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(r.id)}
            className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer border-0 text-white bg-red-500 transition-opacity hover:opacity-80"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Página Principal ─────────────────────────────────────────── */
export default function RecompensasAdmin() {
  const [recompensas,  setRecompensas]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [erro,         setErro]         = useState('')
  const [modalForm,    setModalForm]    = useState(null)  // null | 'nova' | recompensaObj
  const [confirmando,  setConfirmando]  = useState(null) // null | id
  const [delLoading,   setDelLoading]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const data = await fetchAdminRecompensas()
      setRecompensas(data)
    } catch {
      setErro('Não foi possível carregar as recompensas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (payload) => {
    if (modalForm && modalForm !== 'nova') {
      const updated = await updateAdminRecompensa(modalForm.id, payload)
      setRecompensas(r => r.map(x => x.id === updated.id ? updated : x))
    } else {
      const created = await createAdminRecompensa(payload)
      setRecompensas(r => [...r, created])
    }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await deleteAdminRecompensa(confirmando)
      setRecompensas(r => r.filter(x => x.id !== confirmando))
      setConfirmando(null)
    } catch {
      setErro('Erro ao excluir recompensa.')
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
            <h1 className="m-0 font-extrabold text-2xl" style={{ color: C.textDark }}>Recompensas</h1>
            <p className="m-0 text-sm mt-1" style={{ color:'#5a7a6a' }}>Gerencie o catálogo de recompensas disponíveis para os colaboradores.</p>
          </div>
          <button
            onClick={() => setModalForm('nova')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-0 text-white transition-opacity hover:opacity-85 shadow-md"
            style={{ background: C.card }}
          >
            + Nova Recompensa
          </button>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{erro}</div>
        )}

        {/* Contador */}
        {!loading && recompensas.length > 0 && (
          <p className="m-0 text-sm font-semibold" style={{ color:'#5a7a6a' }}>
            {recompensas.length} {recompensas.length === 1 ? 'recompensa' : 'recompensas'} cadastrada{recompensas.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="py-16 text-center text-sm" style={{ color:'#5a7a6a' }}>Carregando…</div>
        ) : recompensas.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center gap-3" style={{ color:'#5a7a6a' }}>
            <span className="text-4xl">🎁</span>
            <span className="text-sm font-medium">Nenhuma recompensa cadastrada</span>
            <button
              onClick={() => setModalForm('nova')}
              className="text-sm font-bold cursor-pointer border-0 bg-transparent underline"
              style={{ color: C.card }}
            >
              Criar primeira recompensa
            </button>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))' }}>
            {recompensas.map(r => (
              <RecompensaCard
                key={r.id}
                r={r}
                onEdit={rec => setModalForm(rec)}
                onDelete={id => setConfirmando(id)}
              />
            ))}
          </div>
        )}
      </div>
      </div>

      <Footer />

      {modalForm !== null && (
        <RecompensaModal
          recompensa={modalForm !== 'nova' ? modalForm : null}
          onClose={() => setModalForm(null)}
          onSave={handleSave}
        />
      )}
      {confirmando !== null && (
        <ConfirmModal
          mensagem="Tem certeza que deseja excluir esta recompensa? Esta ação não pode ser desfeita."
          onConfirm={handleDelete}
          onCancel={() => setConfirmando(null)}
          loading={delLoading}
        />
      )}
    </div>
  )
}
