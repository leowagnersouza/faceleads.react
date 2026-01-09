import { CircularProgress, Paper, Stack, Typography } from '@mui/material'
import useConsultor from '../hooks/useConsultor'

export default function ConsultorDetails({ id }: { id: string }) {
  const { data, loading, error } = useConsultor(id)

  if (loading) return <CircularProgress />
  if (error)
    return (
      <Typography color="error" variant="body2">
        {error}
      </Typography>
    )
  if (!data) return null

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h6">{data.NomeCompleto}</Typography>
        <Typography variant="body2">Email: {data.Email}</Typography>
        <Typography variant="body2">Telefone: {data.Telefone ?? '-'}</Typography>
        <Typography variant="body2">Ativo: {data.Ativo ? 'Sim' : 'Não'}</Typography>
        <Typography variant="body2">Criado em: {new Date(data.CriadoEmUtc).toLocaleString()}</Typography>
      </Stack>
    </Paper>
  )
}
