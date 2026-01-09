import { useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import useAuth from '../hooks/useAuth'

// Minimal login form using useAuth
export default function LoginForm() {
  const { login, loading, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isDev = (import.meta as any)?.env?.DEV
  const apiBase = (import.meta as any)?.env?.VITE_API_BASE_URL || ''

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto' }} component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
          <Alert severity="info" variant="outlined">
            Debug ativo — Base URL: {apiBase || 'não definida'}
          </Alert>
        <Typography variant="h6">Entrar</Typography>
        <TextField label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
        <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Stack>
    </Paper>
  )
}
