import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext.tsx';

const finalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3d8f8f', 
    },
    background: {
      default: '#f4f7f9', 
      paper: '#ffffff',
    },
    text: {
      primary: '#263238',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none', 
        },
        contained: {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.12)', 
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(61, 143, 143, 0.15)', 
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={finalTheme}>
      <AuthProvider>
        <CssBaseline />
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)