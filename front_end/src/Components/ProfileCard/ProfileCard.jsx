import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../FormField/FormField'
import { useAuth } from '../../context/AuthContext'
import { getProfile, updateProfile } from '../../services/api'

const INITIAL = {
  name: '',
  cpf: '',
  telefone: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export default function ProfileCard() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const initialUserRef = useRef(user)
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const avatarName = useMemo(() => {
    if (!form.name) return 'Beneficiario'
    return form.name
  }, [form.name])

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError('')

      try {
        const profile = await getProfile()
        setForm((prev) => ({
          ...prev,
          name: profile?.name ?? initialUserRef.current?.name ?? '',
          email: profile?.email ?? initialUserRef.current?.email ?? '',
          cpf: profile?.cpf ?? '',
          telefone: profile?.telefone ?? '',
        }))
        updateUser({
          name: profile?.name ?? initialUserRef.current?.name ?? '',
          email: profile?.email ?? initialUserRef.current?.email ?? '',
        })
      } catch (err) {
        if (err?.response?.status === 401) {
          logout()
          navigate('/login', { replace: true })
          return
        }

        setError(err?.response?.data?.message ?? 'Não foi possível carregar o perfil')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [logout, navigate, updateUser])

  const set = (key) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    if (!form.email.trim()) {
      setError('E-mail é obrigatório')
      return
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('A confirmação da nova senha não confere')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name: form.name,
        email: form.email,
        telefone: form.telefone,
      }

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword
        payload.newPassword = form.newPassword
      }

      const response = await updateProfile(payload)
      const updated = response?.user

      setForm((prev) => ({
        ...prev,
        name: updated?.name ?? prev.name,
        email: updated?.email ?? prev.email,
        telefone: updated?.telefone ?? prev.telefone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))

      updateUser({
        name: updated?.name ?? form.name,
        email: updated?.email ?? form.email,
      })

      setSuccess(response?.message ?? 'Perfil atualizado com sucesso')
      setEditing(false)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Não foi possível atualizar o perfil')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setEditing(false)
    setError('')
    setSuccess('')
    setForm((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }))
  }

  const inputCls = "w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-subtle)] disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[var(--bg-secondary)]"
  const btnSaveCls = "bg-[var(--accent)] text-white font-bold text-sm rounded-[var(--radius-sm)] px-5 py-2.5 cursor-pointer border-0 transition-colors duration-150 hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
  const btnSecondaryCls = "bg-transparent border border-[var(--border)] text-[var(--text-secondary)] font-bold text-sm rounded-[var(--radius-sm)] px-5 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] disabled:opacity-60 disabled:cursor-not-allowed"

  if (loading) {
    return (
      <div className="w-[min(900px,calc(100%-48px))] mx-auto mt-6 mb-8 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-8 text-center text-sm font-semibold text-[var(--text-secondary)]">
        Carregando perfil...
      </div>
    )
  }

  return (
    <div className="w-[min(900px,calc(100%-48px))] mx-auto mt-6 mb-8 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-6 sm:p-8 flex flex-col md:flex-row gap-8">
      <div className="flex flex-row md:flex-col items-center text-center gap-3 md:w-[200px] md:flex-shrink-0 md:border-r md:border-[var(--border)] md:pr-8">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[var(--accent)] shadow-[var(--shadow-sm)] flex-shrink-0">
          <img src="https://i.pravatar.cc/200?img=68" alt={avatarName} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-start md:items-center gap-2 min-w-0">
          <p className="text-base font-bold text-[var(--text-primary)] m-0 truncate max-w-full">{form.name || 'Beneficiario'}</p>
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent-border)] rounded-full px-3 py-1">
            {user?.role || 'user'}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {error && (
          <p className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.35)] text-[#fca5a5] text-sm rounded-[var(--radius-sm)] px-4 py-2.5 m-0">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] text-sm rounded-[var(--radius-sm)] px-4 py-2.5 m-0">
            {success}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nome Completo">
            <input
              className={inputCls}
              value={form.name}
              onChange={set('name')}
              disabled={!editing}
            />
          </FormField>

          <FormField label="CPF">
            <input className={inputCls} value={form.cpf} disabled readOnly />
          </FormField>

          <FormField label="Telefone Celular">
            <input
              className={inputCls}
              value={form.telefone}
              onChange={set('telefone')}
              disabled={!editing}
            />
          </FormField>

          <FormField label="E-mail">
            <input
              className={inputCls}
              type="email"
              value={form.email}
              onChange={set('email')}
              disabled={!editing}
            />
          </FormField>
        </div>

        <FormField label="Senha">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className={inputCls}
              type="password"
              placeholder="Senha Atual"
              value={form.currentPassword}
              onChange={set('currentPassword')}
              disabled={!editing}
            />
            <input
              className={inputCls}
              type="password"
              placeholder="Nova Senha"
              value={form.newPassword}
              onChange={set('newPassword')}
              disabled={!editing}
            />
            <input
              className={inputCls}
              type="password"
              placeholder="Confirmar Nova Senha"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              disabled={!editing}
            />
          </div>
        </FormField>

        <div className="flex items-center justify-end gap-3 flex-wrap pt-4 mt-2 border-t border-[var(--border)]">
          {!editing && (
            <button className={btnSaveCls} onClick={() => setEditing(true)}>
              Editar Perfil
            </button>
          )}

          {editing && (
            <>
              <button className={btnSecondaryCls} onClick={handleCancel} disabled={saving}>
                Cancelar
              </button>
              <button className={btnSaveCls} onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alteracoes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}