// Fetch list of consultores with simple state management
import { useCallback, useEffect, useState } from 'react'
import apiClient from '../services/api'
import type { Consultor } from '../types/api'

export function useConsultores() {
  const [data, setData] = useState<Consultor[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get<Consultor[]>('/api/v1/consultores')
      setData(data)
    } catch (e: any) {
      console.error('Erro ao buscar consultores:', e.response?.status, e.response?.data, e.message)
      setError(e?.message || 'Erro ao carregar consultores')
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
