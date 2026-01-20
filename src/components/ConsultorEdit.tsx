import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import useConsultor from '../hooks/useConsultor'
import apiClient from '../services/api'
import type { Consultor } from '../types/api'

export default function ConsultorEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, loading, error, refresh } = useConsultor(id)

  const [form, setForm] = useState<Partial<Consultor>>({})
  const [saving, setSaving] = useState(false)
  const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'error'; message: string }>({
    open: false,
    severity: 'success',
    message: '',
  })

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const onChange = (key: keyof Consultor, value: any) => {
    setForm((s) => ({ ...s, [key]: value }))
  }

  const onSave = async () => {
    if (!id) return
    setSaving(true)
    try {
      // Send update to API (assumes backend accepts PUT with partial/full object)
      await apiClient.put(`/api/v1/consultores/${id}`, form)
      setSnack({ open: true, severity: 'success', message: 'Consultor atualizado com sucesso' })
      await refresh()
      navigate('/')
    } catch (e: any) {
      setSnack({ open: true, severity: 'error', message: e?.message || 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <CircularProgress />
  if (error)
    return (
      <Typography color="error">{error}</Typography>
    )

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
        <Stack spacing={2}>
          <Typography variant="h5">Editar Consultor</Typography>
          <TextField label="Nome completo" value={form.nomeCompleto ?? ''} onChange={(e) => onChange('nomeCompleto', e.target.value)} fullWidth />
          <TextField label="Email" value={form.email ?? ''} onChange={(e) => onChange('email', e.target.value)} fullWidth />
          <TextField label="Telefone" value={form.telefone ?? ''} onChange={(e) => onChange('telefone', e.target.value)} fullWidth />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Ativo</Typography>
            <Switch checked={!!form.ativo} onChange={(e) => onChange('ativo', e.target.checked)} />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/')}>Cancelar</Button>
            <Button variant="contained" onClick={onSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
