// useAuth: simple auth state hook wrapping auth service
import { useCallback, useMemo, useState } from 'react'
import { login as svcLogin, logout as svcLogout, isAuthenticated } from '../services/auth'
import type { AppError } from '../types/api'
import { ApiError } from '../services/api'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
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
      const appErr: AppError = e instanceof ApiError
        ? { message: e.message, errorCode: e.code }
        : status === 401
          ? { message: 'Login ou senha inválidos' }
          : { message: e?.message || 'Falha no login' }
      setError(appErr)
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
      const appErr: AppError = e instanceof ApiError
        ? { message: e.message, errorCode: e.code }
        : { message: e?.message || 'Falha ao sair' }
      setError(appErr)
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
