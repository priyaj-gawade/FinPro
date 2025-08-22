import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Box component="footer" sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ typography: 'body2' }}>
            © {new Date().getFullYear()} FinTooz - Personal Finance Manager
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;