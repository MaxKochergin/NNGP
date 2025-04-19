import { createTheme } from '@mui/material/styles';

// Цвета из вашего index.css
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
      dark: '#2563eb',
    },
    secondary: {
      main: '#64748b',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#22c55e',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    background: {
      default: '#ffffff',
      paper: '#f1f5f9',
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Open Sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.25rem',
          padding: '0.5rem 1rem',
          textTransform: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

// Вариант с поддержкой темной темы
export const getTheme = (mode: 'light' | 'dark') => createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode,
    ...(mode === 'dark' && {
      text: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
      },
      background: {
        default: '#0f172a',
        paper: '#1e293b',
      },
    }),
  },
});

export default theme;