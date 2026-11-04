import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { clearAccessToken, getAccessToken, setAccessToken } from './auth-storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearAccessToken()
    setUser(null)
  }, [])

  useEffect(() => {
    let active = true

    if (!getAccessToken()) {
      setLoading(false)
      return undefined
    }

    api.get('/auth/me')
      .then(({ data }) => {
        if (active) setUser(data)
      })
      .catch(() => {
        if (active) {
          clearAccessToken()
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    if (!data?.token || !data?.user) {
      throw new Error('The authentication service returned an incomplete login response.')
    }
    setAccessToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    hasRole: (roles = []) => roles.some((role) => user?.roles?.some((item) => item.code === role)),
    hasPermission: (permission) => user?.permissions?.includes(permission) ?? false,
  }), [user, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
