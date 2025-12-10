import { useState } from 'react'
import './App.css'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

function App() {
  const [leads] = useState([
    { id: '1', name: 'João Silva', source: 'Facebook', createdAt: '2025-12-09' },
    { id: '2', name: 'Maria Souza', source: 'Instagram', createdAt: '2025-12-09' },
  ])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            faceleads — Gestão de Leads
          </Typography>
          <Button color="inherit">Nova Lead</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          Leads recentes
        </Typography>
        <Paper variant="outlined">
          <List>
            {leads.map((lead) => (
              <ListItem key={lead.id} divider>
                <ListItemText
                  primary={`${lead.name} — ${lead.source}`}
                  secondary={`Recebido em ${lead.createdAt}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  )
}

export default App
