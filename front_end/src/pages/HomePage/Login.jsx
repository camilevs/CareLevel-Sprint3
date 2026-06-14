import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginRequest } from '../../services/api'

export default function Login() {
    const navigate = useNavigate()
    const { login, user } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (user?.role === 'admin') return <Navigate to="/admin/home" replace />
    if (user?.role === 'user') return <Navigate to="/home" replace />

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const normalizedEmail = email.trim().toLowerCase()
            const authData = await loginRequest(normalizedEmail, password)
            login(authData)

            if (authData.user.role === 'admin') {
                navigate('/admin/home', { replace: true })
                return
            }

            navigate('/home', { replace: true })
        } catch (err) {
            if (err?.code === 'ERR_NETWORK') {
                setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3005.')
            } else {
                setError(err?.response?.data?.message ?? 'E-mail ou senha incorretos.')
            }
        } finally {
            setLoading(false)
        }
    }

    const inputCls = 'mt-2 w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-[14px] py-3 text-sm text-[var(--text-primary)] font-[var(--font-body)] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-subtle)] placeholder:text-[var(--text-muted)]'

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_60%_40%,rgba(103,185,159,0.18)_0%,transparent_60%),var(--bg-primary)] px-5 z-[9999]">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] p-10 w-full max-w-[400px] shadow-[var(--shadow-lg),0_0_60px_rgba(103,185,159,0.12)] flex flex-col gap-5">
                <div className="flex flex-col items-center gap-3">
                    <img src="/Logo.svg" alt="CareLevel Logo" className="w-12 h-12 object-contain" />
                    <div className="text-center">
                        <h1 className="text-[28px] font-extrabold text-[var(--text-primary)] m-0 tracking-[-0.5px]">CareLevel</h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Bem-estar corporativo inteligente</p>
                    </div>
                </div>

                <div className="h-px bg-[var(--border)]" />

                <div>
                    <h2 className="text-[18px] font-bold text-[var(--text-primary)] m-0">Bem-vindo de volta</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">Faça login para continuar</p>
                </div>

                {error && (
                    <div className="bg-[rgba(239,68,68,0.12)] text-[#fca5a5] border border-[rgba(239,68,68,0.3)] rounded-[var(--radius-sm)] py-[10px] px-3 text-[13px]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--text-secondary)]">
                        E-mail
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className={inputCls}
                        />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--text-secondary)]">
                        Senha
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className={inputCls}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--accent)] text-white border-0 rounded-[var(--radius-sm)] py-[13px] text-[15px] font-bold cursor-pointer transition-[background,transform] duration-200 shadow-[0_4px_16px_var(--accent-glow)] font-[var(--font-body)] hover:bg-[var(--accent-hover)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}
