import { createTheme } from '@mui/material/styles';

/**
 * Custom MUI theme for GeoEngage Admin Dashboard
 * 
 * Design principles:
 * - Primary blue color (#1976d2) for admin actions and highlights
 * - Clean, professional appearance matching modern admin panels
 * - Responsive typography and spacing
 * - Accessible color contrasts
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Modern blue - main brand color
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6', // Purple - for secondary elements
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Green - for active campaigns, success states
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444', // Red - for errors, delete actions
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b', // Amber - for warnings
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6', // Blue - for info messages
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#0f172a', // Dark slate background
      paper: '#1e293b', // Slightly lighter for cards
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      disabled: '#64748b',
    },
    divider: '#334155',
  },
  
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none', // Don't uppercase button text
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 8, // Consistent border radius for cards, buttons
  },

  spacing: 8, // Base spacing unit (8px)

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },

  components: {
    // Button component overrides
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
      },
    },

    // Card component overrides
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          backgroundColor: '#1e293b',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          },
          transition: 'box-shadow 0.3s ease-in-out',
        },
      },
    },

    // Paper component overrides
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#1e293b',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
        },
        elevation3: {
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
        },
      },
    },

    // Table component overrides
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #334155',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#0f172a',
          color: '#f1f5f9',
        },
      },
    },

    // TextField overrides
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b82f6',
          },
        },
      },
    },

    // Chip overrides
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },

    // AppBar overrides
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          backgroundColor: '#1e293b',
        },
      },
    },

    // Drawer overrides
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #334155',
          backgroundColor: '#1e293b',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
