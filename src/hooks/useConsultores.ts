// Fetch list of consultores with simple state management
import { useCallback, useEffect, useState } from 'react'
import apiClient, { ApiError } from '../services/api'
import type { Consultor, AppError } from '../types/api'

export function useConsultores() {
  const [data, setData] = useState<Consultor[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<AppError | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get<Consultor[]>('/api/v1/consultores')
      setData(data)
    } catch (e: any) {
      const appErr: AppError = e instanceof ApiError
        ? { message: e.message, errorCode: e.code }
        : { message: e?.message || 'Erro ao carregar consultores' }
      console.error('Erro ao buscar consultores:', appErr)
      setError(appErr)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { data, loading, error, refresh: fetchAll }
}

export default useConsultores
