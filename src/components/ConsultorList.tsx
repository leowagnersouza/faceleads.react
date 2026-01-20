import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import useConsultores from '../hooks/useConsultores'

// Simple list view - actions will be handled in a dedicated form/modal
export default function ConsultorList() {
  const { data, loading, error } = useConsultores()
  const navigate = useNavigate()

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
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? []).map((c) => (
            <TableRow key={c.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/consultores/${c.id}`)}>
              <TableCell>{c.nomeCompleto}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.telefone ?? '-'}</TableCell>
              <TableCell>{c.ativo ? 'Sim' : 'Não'}</TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/consultores/${c.id}`)
                  }}
                  aria-label="Editar"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
