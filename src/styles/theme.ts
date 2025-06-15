import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#ffffff', 
    },
    background: {
      default: '#ba4949', 
      paper: 'rgba(0, 0, 0, 0.2)', 
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', 
    h1: {
      fontWeight: 700,
    },
  },
});