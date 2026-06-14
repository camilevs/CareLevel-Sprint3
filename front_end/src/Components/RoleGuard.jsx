import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleGuard({ role, children }) {
	const { user, isAuthenticated } = useAuth()

	// ⚠️ MODO PREVIEW: login desativado para testes sem backend
	return children
}
