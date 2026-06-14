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

  if (loading) {
    return <section className="profile-card">Carregando perfil...</section>
  }

  return (
    <div className="profile-card">
      <div className="profile-card__left">
        <div className="profile-card__avatar">
          <img src="https://i.pravatar.cc/200?img=68" alt={avatarName} />
        </div>
        <p className="profile-card__name">{form.name || 'Beneficiario'}</p>
        <span className="profile-card__role">{user?.role || 'user'}</span>
      </div>

      <div className="profile-card__right">
        {error && <p className="profile-card__feedback profile-card__feedback--error">{error}</p>}
        {success && <p className="profile-card__feedback profile-card__feedback--ok">{success}</p>}

        <FormField label="Nome Completo">
          <input
            className="field__input"
            value={form.name}
            onChange={set('name')}
            disabled={!editing}
          />
        </FormField>

        <FormField label="CPF">
          <input className="field__input" value={form.cpf} disabled readOnly />
        </FormField>

        <FormField label="Telefone Celular">
          <input
            className="field__input"
            value={form.telefone}
            onChange={set('telefone')}
            disabled={!editing}
          />
        </FormField>

        <FormField label="E-mail">
          <input
            className="field__input"
            type="email"
            value={form.email}
            onChange={set('email')}
            disabled={!editing}
          />
        </FormField>

        <FormField label="Senha" className="field--password">
          <div className="field__inputs-row">
            <input
              className="field__input"
              type="password"
              placeholder="Senha Atual"
              value={form.currentPassword}
              onChange={set('currentPassword')}
              disabled={!editing}
            />
            <input
              className="field__input"
              type="password"
              placeholder="Nova Senha"
              value={form.newPassword}
              onChange={set('newPassword')}
              disabled={!editing}
            />
            <input
              className="field__input"
              type="password"
              placeholder="Confirmar Nova Senha"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              disabled={!editing}
            />
          </div>
        </FormField>

        <div className="profile-card__actions">
          {!editing && (
            <button className="btn-save" onClick={() => setEditing(true)}>
              Editar Perfil
            </button>
          )}

          {editing && (
            <>
              <button className="btn-secondary" onClick={handleCancel} disabled={saving}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alteracoes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}