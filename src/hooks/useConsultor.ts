// Fetch a single consultor by id, handling Result envelope if needed
import { useCallback, useEffect, useState } from 'react'
import apiClient, { ApiError } from '../services/api'
import type { Consultor, AppError } from '../types/api'

export function useConsultor(id: string | null | undefined) {
  const [data, setData] = useState<Consultor | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<AppError | null>(null)

  const fetchOne = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get<Consultor>(`/api/v1/consultores/${id}`)
      setData(data ?? null)
    } catch (e: any) {
      const appErr: AppError = e instanceof ApiError
        ? { message: e.message, errorCode: e.code }
        : { message: e?.message || 'Erro ao carregar consultor' }
      setError(appErr)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOne()
  }, [fetchOne])

  return { data, loading, error, refresh: fetchOne }
}

export default useConsultor
