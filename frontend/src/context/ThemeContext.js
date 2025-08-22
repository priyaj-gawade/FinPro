import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if dark mode is stored in localStorage
  const storedThemeMode = localStorage.getItem('themeMode');
  const [mode, setMode] = useState(storedThemeMode || 'light');

  // Create theme based on current mode
  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode palette
            primary: {
              main: '#2196f3',
              light: '#4dabf5',
              dark: '#1769aa',
              contrastText: '#fff',
            },
            secondary: {
              main: '#f50057',
              light: '#f73378',
              dark: '#ab003c',
              contrastText: '#fff',
            },
            success: {
              main: '#4caf50',
              light: '#81c784',
              dark: '#388e3c',
            },
            error: {
              main: '#f44336',
              light: '#e57373',
              dark: '#d32f2f',
            },
            warning: {
              main: '#ff9800',
              light: '#ffb74d',
              dark: '#f57c00',
            },
            info: {
              main: '#2196f3',
              light: '#64b5f6',
              dark: '#1976d2',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
            text: {
              primary: 'rgba(0, 0, 0, 0.87)',
              secondary: 'rgba(0, 0, 0, 0.6)',
              disabled: 'rgba(0, 0, 0, 0.38)',
            },
          }
        : {
            // Dark mode palette
            primary: {
              main: '#90caf9',
              light: '#e3f2fd',
              dark: '#42a5f5',
              contrastText: '#000',
            },
            secondary: {
              main: '#f48fb1',
              light: '#f8bbd0',
              dark: '#c2185b',
              contrastText: '#000',
            },
            success: {
              main: '#66bb6a',
              light: '#81c784',
              dark: '#388e3c',
            },
            error: {
              main: '#f44336',
              light: '#e57373',
              dark: '#d32f2f',
            },
            warning: {
              main: '#ffa726',
              light: '#ffb74d',
              dark: '#f57c00',
            },
            info: {
              main: '#29b6f6',
              light: '#4fc3f7',
              dark: '#0288d1',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: 'rgba(255, 255, 255, 0.7)',
              disabled: 'rgba(255, 255, 255, 0.5)',
            },
          }),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 500,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.08)'
              : '0 4px 6px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 7px 14px rgba(0,0,0,0.05), 0 3px 6px rgba(0,0,0,0.1)'
                : '0 7px 14px rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.2)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light'
              ? '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.08)'
              : '0 4px 6px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            boxShadow: mode === 'light'
              ? '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
              : '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.12)'
                : '0 4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)'
              : 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:last-child td': {
              borderBottom: 0,
            },
            '&:hover': {
              backgroundColor: mode === 'light'
                ? 'rgba(0, 0, 0, 0.02)'
                : 'rgba(255, 255, 255, 0.03)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  // Toggle theme mode
  const toggleThemeMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleThemeMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};