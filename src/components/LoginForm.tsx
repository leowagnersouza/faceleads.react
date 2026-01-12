import { useEffect, useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography, Snackbar } from '@mui/material'
import useAuth from '../hooks/useAuth'
import { getApiBaseUrl } from '../services/env'

// Minimal login form using useAuth
export default function LoginForm() {
  const { login, loading, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isDebug = String(import.meta.env.VITE_IS_DEBUG || '').toLowerCase() === 'true'
  const apiBase = getApiBaseUrl()
  const [snackOpen, setSnackOpen] = useState(false)

  // Open snackbar whenever error changes to a truthy value
  useEffect(() => {
    setSnackOpen(!!error)
  }, [error])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto' }} component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        {isDebug && (
          <Alert severity="info" variant="outlined">
            Debug ativo — Base URL: {apiBase || 'não definida'}
          </Alert>
        )}
        <Typography variant="h6">Entrar</Typography>
        <TextField label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
        <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Stack>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setSnackOpen(false)}>
          {error || 'Erro no login'}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
