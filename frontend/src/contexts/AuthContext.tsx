import { createContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'
import api from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('@rh:token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      if (!user) loadUser()
      else setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [token])

  async function loadUser() {
    try {
      const response = await api.get('/api/auth/me')
      setUser(response.data.data)
    } catch {
      setToken(null)
      localStorage.removeItem('@rh:token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const response = await api.post('/api/auth/login', { email, password })
    const { token: newToken, user: userData } = response.data.data
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('@rh:token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout')
    } catch {
      // ignore
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('@rh:token')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
