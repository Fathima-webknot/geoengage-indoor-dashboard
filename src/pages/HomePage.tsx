import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Stack, Alert, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '@/contexts/AuthContext';

/**
 * HomePage (Login Page)
 * Shows login UI if not authenticated
 * Redirects to /campaigns if already authenticated
 */
const HomePage = () => {
  const { currentUser, login } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to campaigns if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/campaigns', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      await login();
      // Navigation will happen via useEffect after currentUser is set
    } catch (error) {
      console.error('Login failed:', error);
      setAuthLoading(false);
    }
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
                disabled={authLoading}
                fullWidth
                size="large"
              >
                {authLoading ? 'Signing in...' : 'Sign In with Google'}
              </Button>
            </Stack>
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
