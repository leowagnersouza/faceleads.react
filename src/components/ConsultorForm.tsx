import { useState } from 'react'
import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import apiClient from '../services/api'
import type { CreateConsultorCommand, Consultor, Result } from '../types/api'

// Minimal create form; on success, calls optional callback
export default function ConsultorForm(props: { onCreated?: (c: Consultor) => void }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload: CreateConsultorCommand = { NomeCompleto: nome, Email: email, Telefone: telefone || undefined }
      const { data } = await apiClient.post<Result<Consultor>>('/api/v1/consultores', payload)
      if (!data.Success || !data.Value) throw new Error(data.ErrorMessage || 'Falha ao criar consultor')
      props.onCreated?.(data.Value)
      setNome('')
      setEmail('')
      setTelefone('')
    } catch (e: any) {
      // TODO: map ErrorCode->mensagem amigável
      setError(e?.message || 'Erro ao criar consultor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 520 }} component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        <Typography variant="h6">Novo Consultor</Typography>
        <TextField label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required fullWidth />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
        <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Stack>
    </Paper>
  )
}
