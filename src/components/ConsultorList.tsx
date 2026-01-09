import { useCallback } from 'react'
import { Button, CircularProgress, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import useConsultores from '../hooks/useConsultores'
import apiClient from '../services/api'
import type { Consultor, Result } from '../types/api'

// Basic list with actions: create (via external handler), ativar/desativar, excluir
export default function ConsultorList(props: { onCreate?: () => void }) {
  const { data, loading, error, refresh } = useConsultores()

  const toggleAtivo = useCallback(
    async (c: Consultor) => {
      const path = c.Ativo ? 'desativar' : 'ativar'
      await apiClient.patch(`/api/v1/consultores/${c.Id}/${path}`)
      await refresh()
    },
    [refresh],
  )

  const excluir = useCallback(
    async (c: Consultor) => {
      await apiClient.delete(`/api/v1/consultores/${c.Id}`)
      await refresh()
    },
    [refresh],
  )

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
        <Button variant="contained" onClick={props.onCreate}>
          Novo Consultor
        </Button>
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
            <TableRow key={c.Id} hover>
              <TableCell>{c.NomeCompleto}</TableCell>
              <TableCell>{c.Email}</TableCell>
              <TableCell>{c.Telefone ?? '-'}</TableCell>
              <TableCell>{c.Ativo ? 'Sim' : 'Não'}</TableCell>
              <TableCell align="right">
                <IconButton color={c.Ativo ? 'warning' : 'success'} onClick={() => toggleAtivo(c)} aria-label={c.Ativo ? 'Desativar' : 'Ativar'}>
                  {c.Ativo ? <CloseIcon /> : <CheckIcon />}
                </IconButton>
                <IconButton color="error" onClick={() => excluir(c)} aria-label="Excluir">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
