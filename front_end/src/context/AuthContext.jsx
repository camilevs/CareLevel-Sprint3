import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'carelevel-auth'

function readStoredAuth() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : null
	} catch {
		return null
	}
}

export function AuthProvider({ children }) {
	const storedAuth = readStoredAuth()
	const [token, setToken] = useState(storedAuth?.token ?? null)
	const [user, setUser] = useState(storedAuth?.user ?? null)

	useEffect(() => {
		setAuthToken(token)
	}, [token])

	const login = useCallback(({ token: nextToken, user: nextUser }) => {
		setToken(nextToken)
		setUser(nextUser)
		setAuthToken(nextToken)
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }))
	}, [])

	const logout = useCallback(() => {
		setToken(null)
		setUser(null)
		setAuthToken(null)
		localStorage.removeItem(STORAGE_KEY)
	}, [])

	const updateUser = useCallback((nextUserData) => {
		setUser((prevUser) => {
			const mergedUser = { ...prevUser, ...nextUserData }
			setAuthToken(token)
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: mergedUser }))
			return mergedUser
		})
	}, [token])

	return (
		<AuthContext.Provider
			value={{
				token,
				user,
				isAuthenticated: Boolean(token && user),
				login,
				logout,
				updateUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
	}

	return context
}
