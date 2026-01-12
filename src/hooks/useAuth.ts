// useAuth: simple auth state hook wrapping auth service
import { useCallback, useMemo, useState } from 'react'
import { login as svcLogin, logout as svcLogout, isAuthenticated } from '../services/auth'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authed, setAuthed] = useState<boolean>(isAuthenticated())

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await svcLogin(username, password)
      setAuthed(true)
      return true
    } catch (e: any) {
      const status = e?.response?.status
      if (status === 401) {
        setError('Login ou senha inválidos')
      } else {
        setError(e?.message || 'Falha no login')
      }
      setAuthed(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await svcLogout()
      setAuthed(false)
    } catch (e: any) {
      setError(e?.message || 'Falha ao sair')
    } finally {
      setLoading(false)
    }
  }, [])

  return useMemo(
    () => ({ isAuthenticated: authed, loading, error, login, logout }),
    [authed, loading, error, login, logout],
  )
}

export default useAuth
