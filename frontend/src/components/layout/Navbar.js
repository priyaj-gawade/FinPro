import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/mockI18n';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import logo from '../../assets/logo.svg';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { mode, toggleThemeMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const isDarkMode = mode === 'dark';
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    // Set language directly in localStorage
    localStorage.setItem('language', lng);
    // Force page reload to apply changes
    window.location.reload();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Voice recognition functionality
  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const processVoiceCommand = (command) => {
    console.log('Voice command:', command);
    
    // Simple command processing
    if (command.includes('dashboard') || command.includes('home')) {
      navigate('/dashboard');
    } else if (command.includes('transactions') || command.includes('expenses')) {
      navigate('/transactions');
    } else if (command.includes('profile') || command.includes('account')) {
      navigate('/profile');
    } else if (command.includes('logout') || command.includes('sign out')) {
      handleLogout();
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper', 
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component="img"
              src={logo}
              alt="FinTooz Logo"
              sx={{ 
                height: 32,
                width: 32,
                mr: 1
              }} 
            />
            <Typography
              variant="h6"
              component={Link}
              to={isAuthenticated ? '/dashboard' : '/'}
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              FinTooz
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <>
              {/* Desktop menu */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <Button
                  component={Link}
                  to="/dashboard"
                  color="primary"
                  variant={location.pathname === '/dashboard' ? "contained" : "text"}
                  startIcon={<DashboardIcon />}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    boxShadow: location.pathname === '/dashboard' ? 1 : 0
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/transactions"
                  color="primary"
                  variant={location.pathname === '/transactions' ? "contained" : "text"}
                  startIcon={<Box component="img" src={logo} alt="FinTooz Logo" sx={{ height: 20, width: 20 }} />}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    boxShadow: location.pathname === '/transactions' ? 1 : 0
                  }}
                >
                  Transactions
                </Button>
                <Button
                  component={Link}
                  to="/profile"
                  color="primary"
                  variant={location.pathname === '/profile' ? "contained" : "text"}
                  startIcon={<PersonIcon />}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    boxShadow: location.pathname === '/profile' ? 1 : 0
                  }}
                >
                  Profile
                </Button>
                

                
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                
                {user && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 36, 
                        height: 36,
                        border: '2px solid',
                        borderColor: 'background.paper'
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </Box>
                )}
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={toggleThemeMode}
                      color="primary"
                      size="small"
                    />
                  }
                  label={isDarkMode ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                  sx={{ mr: 2 }}
                />
                
                {/* Language Selector */}
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {t('language')}:
                  </Typography>
                  <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                    style={{ 
                      padding: '4px', 
                      borderRadius: '4px',
                      backgroundColor: isDarkMode ? '#333' : '#fff',
                      color: isDarkMode ? '#fff' : '#333',
                      border: '1px solid #ccc'
                    }}
                  >
                    <option value="en">{t('english')}</option>
                    <option value="hi">{t('hindi')}</option>
                    <option value="mr">{t('marathi')}</option>
                  </select>
                </Box>
                
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    py: 0.75
                  }}
                >
                  Logout
                </Button>
              </Box>

              {/* Mobile menu */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>

                
                <IconButton
                  color="primary"
                  onClick={handleMenu}
                  size="large"
                  edge="end"
                >
                  <MenuIcon />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: 2, mt: 1, minWidth: 200 }
                  }}
                >
                  {user && (
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box sx={{ ml: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <MenuItem 
                    onClick={() => { navigate('/dashboard'); handleClose(); }}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      '&:hover': { bgcolor: 'primary.lighter' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DashboardIcon sx={{ color: location.pathname === '/dashboard' ? 'primary.main' : 'text.secondary' }} />
                      <Typography sx={{ ml: 1.5, fontWeight: location.pathname === '/dashboard' ? 'medium' : 'regular' }}>
                        Dashboard
                      </Typography>
                    </Box>
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={() => { navigate('/transactions'); handleClose(); }}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      '&:hover': { bgcolor: 'primary.lighter' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="img" src={logo} alt="FinTooz Logo" sx={{ height: 20, width: 20, color: location.pathname === '/transactions' ? 'primary.main' : 'text.secondary' }} />
                      <Typography sx={{ ml: 1.5, fontWeight: location.pathname === '/transactions' ? 'medium' : 'regular' }}>
                        Transactions
                      </Typography>
                    </Box>
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={() => { navigate('/profile'); handleClose(); }}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      '&:hover': { bgcolor: 'primary.lighter' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ color: location.pathname === '/profile' ? 'primary.main' : 'text.secondary' }} />
                      <Typography sx={{ ml: 1.5, fontWeight: location.pathname === '/profile' ? 'medium' : 'regular' }}>
                        Profile
                      </Typography>
                    </Box>
                  </MenuItem>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <MenuItem
                    onClick={toggleThemeMode}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                        <Typography sx={{ ml: 1.5 }}>
                          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </Typography>
                      </Box>
                      <Switch
                        checked={isDarkMode}
                        onChange={toggleThemeMode}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      color: 'error.main'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LogoutIcon color="error" />
                      <Typography sx={{ ml: 1.5, fontWeight: 'medium' }}>
                        Logout
                      </Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                color="primary" 
                variant="outlined"
                component={Link} 
                to="/login"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Login
              </Button>
              <Button 
                color="primary" 
                variant="contained"
                component={Link} 
                to="/register"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: 'medium',
                  boxShadow: 2
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;