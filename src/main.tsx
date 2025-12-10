import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#1976d2' },
          secondary: { main: '#9c27b0' },
        },
      })}
    >
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
