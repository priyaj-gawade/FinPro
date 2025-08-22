import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Track Your Finances',
      description: 'Monitor your income and expenses with intuitive visualizations and reports.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and never shared with third parties.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations to improve your financial health.'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f5f5'
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: { xs: 2, md: 4 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold"
                gutterBottom
                sx={{ 
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                FinTooz
              </Typography>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}
              >
                Smart Financial Management
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  mb: 4, 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  maxWidth: { md: '90%', lg: '80%' },
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                Take control of your finances with our AI-powered personal finance management system. 
                Track expenses, set budgets, and get insights to improve your financial health.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 2,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  textTransform: 'none'
                }}
              >
                Get Started
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper 
              elevation={6} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: { xs: 320, sm: 400 },
                height: { xs: 240, sm: 300 },
                bgcolor: 'primary.main',
                color: 'white'
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: { xs: 80, sm: 120 } }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: { xs: 5, md: 8 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ 
            mb: { xs: 4, md: 6 },
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Why Choose FinTooz?
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: { xs: 3, md: 4 }, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{ fontWeight: 'medium' }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: '90%', mx: 'auto' }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          mt: 'auto',
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'primary.main',
          color: theme.palette.mode === 'dark' ? 'text.primary' : 'white'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ fontWeight: 'medium' }}>
            © {new Date().getFullYear()} FinTooz. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;