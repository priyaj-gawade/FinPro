import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EmailVerification from '../components/EmailVerification';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';
import { useTranslation } from '../i18n/i18n';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate form
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login(formData);
      
      if (response && response.requiresVerification) {
        setUserEmail(formData.email);
        setRequiresVerification(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVerificationSuccess = () => {
    // Redirect to dashboard after successful verification
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (requiresVerification) {
    return <EmailVerification email={userEmail} onVerificationSuccess={handleVerificationSuccess} />;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AccountBalanceIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
          <Typography component="h1" variant="h5">
            Login to FinTooz
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
            Your AI-powered personal finance management system
          </Typography>

          {(error || formError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {formError || error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;