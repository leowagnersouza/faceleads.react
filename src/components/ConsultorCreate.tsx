import { Box, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ConsultorForm from './ConsultorForm'

export default function ConsultorCreate() {
  const navigate = useNavigate()

  function onCreated() {
    navigate('/')
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
        <Stack spacing={2}>
          <Typography variant="h5">Adicionar Consultor</Typography>
          <ConsultorForm onCreated={onCreated} />
        </Stack>
      </Paper>
    </Box>
  )
}
