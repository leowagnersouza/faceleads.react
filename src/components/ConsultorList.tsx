import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress } from '@mui/material'
import useConsultores from '../hooks/useConsultores'

// Simple list view - actions will be handled in a dedicated form/modal
export default function ConsultorList() {
  const { data, loading, error } = useConsultores()

  if (loading) return <CircularProgress />
  if (error)
    return (
      <Typography color="error" variant="body2">
        {error}
      </Typography>
    )

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Consultores</Typography>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Ativo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? []).map((c) => (
            <TableRow key={c.id} hover>
              <TableCell>{c.nomeCompleto}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.telefone ?? '-'}</TableCell>
              <TableCell>{c.ativo ? 'Sim' : 'Não'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
