import { createTheme } from '@mui/material/styles';
import { DefaultTheme } from 'styled-components';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  status: {
    danger: '#e53e3e',
  },
});

export default muiTheme;

export const styledTheme: DefaultTheme = {
    colors: {
        primary: '#4a90e2',
        primaryDark: '#357abd',
        secondary: '#82ca9d',
        error: '#f44336',
        success: '#4caf50',
        warning: '#ffd54f',
        textPrimary: '#333',
        textSecondary: '#666',
        borderColor: '#e0e0e0',
        backgroundLight: '#f5f5f5',
        backgroundWhite: '#ffffff'
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '24px'
        },
        fontWeight: {
            regular: 400,
            medium: 500,
            bold: 600
        }
    },
    shadows: {
        sm: '0 2px 4px rgba(0,0,0,0.1)',
        md: '0 4px 8px rgba(0,0,0,0.1)',
        lg: '0 8px 16px rgba(0,0,0,0.1)'
    },
    transitions: {
        default: '0.2s ease-in-out',
        fast: '0.1s ease-in-out',
        slow: '0.3s ease-in-out'
    },
    breakpoints: {
        xs: '320px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px'
    },
    zIndex: {
        modal: 1000,
        dropdown: 100,
        tooltip: 500
    }
};

export const theme = {
  colors: {
    primary: '#2196f3',
    primaryDark: '#1976d2',
    textPrimary: '#333333',
    backgroundLight: 'rgba(0, 0, 0, 0.04)',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

export type Theme = typeof theme; 