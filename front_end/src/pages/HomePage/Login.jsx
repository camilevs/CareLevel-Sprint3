import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginRequest } from '../../services/api'
import './Login.css'

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

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <img
                        src="/Logo.svg"
                        alt="CareLevel Logo"
                        className="login-logo"
                    />
                    <h1 className="login-project-name">CareLevel</h1>
                    <p className="login-project-tagline">Bem-estar corporativo inteligente</p>
                </div>

                <div className="login-divider" />

                <h2 className="login-welcome">Bem-vindo de volta</h2>
                <p className="login-subtitle">Faça login para continuar</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        E-mail
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Senha
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}
