import React, { useState, useContext } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  Grid
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../i18n/i18n';
import { authAPI } from '../services/api';

const EmailVerification = ({ email, onVerificationSuccess }) => {
  const { t } = useTranslation();
  const { setUser } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerifyEmail = async () => {
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // For development, accept hardcoded OTP
      if (otp === '123456') {
        setSuccess('Email verified successfully with test code');
        
        // Simulate successful verification
        setTimeout(() => {
          if (onVerificationSuccess) {
            onVerificationSuccess();
          }
        }, 1000);
        
        return;
      }
      
      // Use real API call for OTP verification
      const response = await authAPI.verifyOtp({ email, otp });
      setSuccess(response.data.message || 'Email verified successfully');
      
      // Update user context with verified status
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // For development, just show success message
      setSuccess('Test verification code sent to ' + email + '. Use 123456 to verify.');
      setIsSubmitting(false);
      
      // Uncomment to use real API
      // const response = await authAPI.sendOtp({ email });
      // setSuccess(response.data.message || 'Verification code sent to ' + email);
      // setIsSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        {t('email_verification')}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }} align="center">
        {t('email_verification_message')}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3 }} align="center">
        {t('verification_code_sent_to')} <strong>{email}</strong>
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        For testing, use code: 123456
      </Alert>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={t('verification_code')}
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isSubmitting}
              margin="normal"
              placeholder="Enter 6-digit code"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleVerifyEmail}
              disabled={isSubmitting || !otp}
              fullWidth
              sx={{ mt: 1 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : t('verify_email')}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={isSubmitting}
              fullWidth
              sx={{ mt: 1 }}
            >
              {t('resend_verification_code')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EmailVerification;
export default EmailVerification;
