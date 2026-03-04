import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Stack, Button, Snackbar, Alert, Grid, Divider } from '@mui/material';
import {
  Login as LoginIcon,
  Campaign as CampaignIcon,
  Analytics as AnalyticsIcon,
  Place as LocationIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

/**
 * HomePage (Login Page)
 * Shows login UI if not authenticated
 * Redirects to /campaigns if already authenticated
 */
const HomePage = () => {
  const { currentUser, login, error } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect to campaigns if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/campaigns', { replace: true });
    }
  }, [currentUser, navigate]);

  // Show error snackbar when error changes
  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
      setSigningIn(false);
    }
  }, [error]);

  const handleLogin = async () => {
    setSigningIn(true);
    try {
      await login();
      // Navigation will happen via useEffect after currentUser is set
    } catch (error) {
      console.error('Login failed:', error);
      setSigningIn(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Don't render anything if user is already logged in (will redirect)
  if (currentUser) {
    return null;
  }

  const features = [
    {
      icon: <CampaignIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Campaign Management',
      description: 'Create and manage location-based campaigns with ease',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Zone Targeting',
      description: 'Target specific indoor zones with precision',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Real-time Analytics',
      description: 'Track performance and engagement metrics',
    },
    {
      icon: <NotificationIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Push Notifications',
      description: 'Send targeted notifications to users in zones',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Fast & Reliable',
      description: 'High-performance infrastructure for instant delivery',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Secure Access',
      description: 'Enterprise-grade security with Google OAuth',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'auto',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Branding Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            GeoEngage
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              mb: 2,
            }}
          >
            Indoor Location-Based Campaign Management Platform
          </Typography>
        </Box>

        {/* Sign In Card */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
          <Paper
            elevation={8}
            sx={{
              p: 5,
              width: '100%',
              maxWidth: 480,
              textAlign: 'center',
              borderRadius: 4,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'primary.main',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              }}
            >
              <SecurityIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
              }}
            >
              Sign in to access your admin dashboard
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Stack spacing={3}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Secure authentication powered by Google OAuth
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  disabled={signingIn}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                      boxShadow: '0 6px 24px rgba(59, 130, 246, 0.6)',
                    },
                    '&:disabled': {
                      background: 'rgba(100, 116, 139, 0.5)',
                    },
                  }}
                >
                  {signingIn ? 'Signing in...' : 'Sign In with Google'}
                </Button>
              </Box>

              <Box sx={{ pt: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  By signing in, you agree to our Terms of Service
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  © 2026 GeoEngage. All rights reserved.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Platform Features
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Empower your business with precise indoor location targeting. Create engaging campaigns,
            track real-time analytics, and deliver personalized notifications to users based on their
            exact location within your venue.
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'primary.main',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{
            width: '100%',
            backgroundColor: 'error.main',
            color: 'white',
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
