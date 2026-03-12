import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login as apiLogin } from '../api/client'

interface User {
  id: string
  email: string
  role: 'student' | 'parent' | 'teacher' | 'admin' | 'government'
  name: string
  nameEn: string
}

interface AuthCtx {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('bhobishyot_user')
    const savedToken = localStorage.getItem('bhobishyot_token')
    if (saved && savedToken) {
      try { setUser(JSON.parse(saved)); setToken(savedToken) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const data = await apiLogin(email, password)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('bhobishyot_user', JSON.stringify(data.user))
    localStorage.setItem('bhobishyot_token', data.token)
    return data.user
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('bhobishyot_user')
    localStorage.removeItem('bhobishyot_token')
  }

  return <Ctx.Provider value={{ user, token, loading, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
