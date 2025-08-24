import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../i18n/i18n';
import { authAPI } from '../services/api';
import PhoneVerification from '../components/PhoneVerification';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
  Alert,
  Paper,
  Avatar
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validate passwords if trying to change password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setFormError('New passwords do not match');
        return;
      }

      if (formData.newPassword.length < 6) {
        setFormError('Password must be at least 6 characters');
        return;
      }

      if (!formData.currentPassword) {
        setFormError('Current password is required to set a new password');
        return;
      }
    }

    // In a real app, you would send this to your API
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormSuccess('Profile updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setFormError('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(120deg, #3f51b5 0%, #5c6bc0 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  width: 64, 
                  height: 64, 
                  mr: 2,
                  border: '2px solid white'
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {t('profile')}
                </Typography>
                <Typography variant="body1">
                  {t('profile_description')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Profile Form */}
      <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <CardContent sx={{ p: 3 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          {formSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {formSuccess}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Account Information Section */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom fontWeight="medium">
                  {t('personal_information')}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  helperText="Email cannot be changed"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Phone Verification Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="medium" sx={{ mt: 2 }}>
                  Phone Verification
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <PhoneVerification />
              </Grid>

              {/* Password Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="medium" sx={{ mt: 2 }}>
                  Change Password
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      borderRadius: 2,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: 2
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={logout}
                    disabled={isSubmitting}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      borderRadius: 2,
                      fontWeight: 'bold',
                      textTransform: 'none'
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;