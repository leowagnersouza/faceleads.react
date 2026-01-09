// Fetch a single consultor by id, handling Result envelope if needed
import { useCallback, useEffect, useState } from 'react'
import apiClient from '../services/api'
import type { Consultor, Result } from '../types/api'

export function useConsultor(id: string | null | undefined) {
  const [data, setData] = useState<Consultor | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOne = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get<Result<Consultor>>(`/api/v1/consultores/${id}`)
      if (!data.Success) throw new Error(data.ErrorMessage || 'Falha ao carregar consultor')
      setData(data.Value ?? null)
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar consultor')
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
