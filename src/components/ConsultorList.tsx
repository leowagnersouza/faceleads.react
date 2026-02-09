import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress, IconButton, Button } from '@mui/material'
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
        {error.message}
      </Typography>
    )

  const items = data ?? []
  const hasItems = items.length > 0

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Consultores</Typography>
        {hasItems && (
          <Button variant="contained" onClick={() => navigate('/consultores/novo')}>Adicionar consultor</Button>
        )}
      </Stack>

      {hasItems ? (
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
            {items.map((c) => (
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
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }} spacing={2}>
          <Typography variant="body1" textAlign="center">
            Opa! Ainda não achei nenhum consultor por aqui!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/consultores/novo')}>
            Clique aqui para criar o seu primeiro consultor!
          </Button>
        </Stack>
      )}
    </Paper>
  )
}
