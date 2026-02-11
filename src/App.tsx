import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import {
  AppBar,
  Box,
  Button,
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
import useAuth from './hooks/useAuth'
import { getTenantName } from './services/auth'
import ConsultorList from './components/ConsultorList'
import LeadsKanban from './components/LeadsKanban'

const drawerWidth = 240

function App() {
  const navigate = useNavigate()
  const { logout, isAuthenticated } = useAuth()
  const [active, setActive] = useState<'consultores' | 'leads'>('consultores')
  const [tenantName, setTenantName] = useState<string | null>(getTenantName())

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setTenantName(null)
  }

  // Update tenant name when auth state changes (e.g., after login)
  // Ensures header reflects current tenant without manual refresh
  useEffect(() => {
    setTenantName(getTenantName())
  }, [isAuthenticated])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* App Bar with logout button */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h6" noWrap>
              {`LeadSaude${tenantName ? ' — ' + tenantName : ''}`}
            </Typography>
          </Box>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', marginTop: '64px' },
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
        {active === 'consultores' && <ConsultorList />}
        {active === 'leads' && <LeadsKanban />}
      </Box>
    </Box>
  )
}

export default App
