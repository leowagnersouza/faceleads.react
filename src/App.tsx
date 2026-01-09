import { useState } from 'react'
import './App.css'
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import ListAltIcon from '@mui/icons-material/ListAlt'

const drawerWidth = 240

function App() {
  const [active, setActive] = useState<'consultores' | 'leads'>('leads')

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={active === 'consultores'} onClick={() => setActive('consultores')}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Consultores" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={active === 'leads'} onClick={() => setActive('leads')}>
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            pt: 4,
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
            faceleads
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default App
