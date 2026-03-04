import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Stack, Alert, Button, Snackbar } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            🎯 GeoEngage Admin Dashboard
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 2, mb: 4 }}
          >
            Indoor Location-Based Campaign Management
          </Typography>

          {/* Auth Section */}
          <Paper
            variant="outlined"
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: 'background.paper',
              borderColor: 'primary.main',
              borderWidth: 2,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              🔐 Authentication
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              <Alert severity="info">
                <Typography variant="body2">
                  Sign in with your Google account to continue
                </Typography>
              </Alert>

              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                disabled={signingIn}
                fullWidth
                size="large"
              >
                {signingIn ? 'Signing in...' : 'Sign In with Google'}
              </Button>
            </Stack>
          </Paper>
        </Paper>

        {/* Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default HomePage;
