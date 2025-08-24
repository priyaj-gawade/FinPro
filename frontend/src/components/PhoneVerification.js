import React, { useState, useContext, useEffect } from 'react';
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

const PhoneVerification = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [phone, setPhone] = useState(user?.phone || '');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerified, setIsVerified] = useState(user?.isPhoneVerified || false);

  // Mock OTP sending for demo purposes
  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // For demo purposes, simulate API call
      setTimeout(() => {
        setIsOtpSent(true);
        setSuccess('OTP sent successfully to ' + phone);
        setIsSubmitting(false);
      }, 1000);
      
      // Uncomment for real API call
      // const response = await authAPI.sendOtp({ phone });
      // setIsOtpSent(true);
      // setSuccess(response.data.message || 'OTP sent successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setIsSubmitting(false);
    }
  };

  // Mock OTP verification for demo purposes
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // For demo purposes, simulate API call and accept any 6-digit OTP
      setTimeout(() => {
        if (otp.length === 6) {
          setIsVerified(true);
          setSuccess('Phone verified successfully');
        } else {
          setError('Invalid OTP. Please enter a 6-digit code.');
        }
        setIsSubmitting(false);
      }, 1000);
      
      // Uncomment for real API call
      // const response = await authAPI.verifyOtp({ otp });
      // setSuccess(response.data.message || 'Phone verified successfully');
      // setIsVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
      setIsSubmitting(false);
    }
  };

  const handleChangePhone = () => {
    setIsOtpSent(false);
    setIsVerified(false);
    setOtp('');
    setSuccess('');
    setError('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {t('phone_verification')}
      </Typography>
      
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

      {isVerified ? (
        <Box sx={{ mb: 2 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your phone number {phone} is verified
          </Alert>
          <Button
            variant="outlined"
            onClick={handleChangePhone}
            sx={{ mt: 1 }}
          >
            {t('change_phone')}
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={t('phone_number')}
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isOtpSent || isSubmitting}
                placeholder="+1234567890"
                margin="normal"
              />
            </Grid>
            
            {!isOtpSent ? (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSendOtp}
                  disabled={isSubmitting || !phone}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : t('send_verification_code')}
                </Button>
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    label={t('verification_code')}
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isSubmitting}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting || !otp}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : t('verify')}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    onClick={handleChangePhone}
                    disabled={isSubmitting}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {t('change_phone')}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default PhoneVerification;