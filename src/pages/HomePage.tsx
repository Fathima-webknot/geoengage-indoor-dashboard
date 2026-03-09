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
import GELogo from '@/components/common/GELogo';

// Colors matching the splash screen
const COLORS = {
  gradientStart: '#0F172A',
  gradientEnd: '#1E293B',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  textGray: '#94A3B8',
};

/**
 * HomePage (Login Page)
 * Shows split-screen: animated splash on left, sign-in on right
 * Features section below
 */
const HomePage = () => {
  const { currentUser, login, error, clearError, verifying } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderTimer, setReminderTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Transition to split-screen after splash animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 2800); // Wait for splash animation to complete (logo + text + tagline)
    return () => clearTimeout(timer);
  }, []);

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

  // Cleanup reminder timer on unmount
  useEffect(() => {
    return () => {
      if (reminderTimer) {
        clearTimeout(reminderTimer);
      }
    };
  }, [reminderTimer]);

  const handleLogin = async () => {
    setSigningIn(true);
    setReminderOpen(false); // Close any existing reminder
    
    // Set a reminder after 15 seconds if login is still pending
    const timer = setTimeout(() => {
      if (signingIn) {
        setReminderOpen(true);
      }
    }, 15000); // 15 seconds
    setReminderTimer(timer);
    
    try {
      await login();
      // Navigation will happen via useEffect after currentUser is set
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      // Clear reminder timer
      if (reminderTimer) {
        clearTimeout(reminderTimer);
        setReminderTimer(null);
      }
      // Always reset loading state when login completes
      // (whether successful, cancelled, or failed)
      setSigningIn(false);
      setReminderOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    clearError(); // Clear error from AuthContext when snackbar is dismissed
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

  // Particle positions for animated splash - reduced for cleaner look
  const particlePositions = [
    { left: '15%', top: '25%', size: 5 },
    { left: '85%', top: '30%', size: 6 },
    { left: '20%', top: '70%', size: 4 },
    { left: '40%', top: '15%', size: 5 },
    { left: '65%', top: '75%', size: 4 },
    { left: '10%', top: '55%', size: 6 },
    { left: '90%', top: '60%', size: 5 },
    { left: '50%', top: '40%', size: 4 },
    { left: '75%', top: '20%', size: 5 },
    { left: '30%', top: '85%', size: 6 },
    { left: '55%', top: '10%', size: 4 },
    { left: '8%', top: '38%', size: 5 },
    { left: '92%', top: '78%', size: 6 },
    { left: '45%', top: '65%', size: 4 },
    { left: '72%', top: '45%', size: 5 },
    { left: '28%', top: '52%', size: 4 },
    { left: '62%', top: '88%', size: 6 },
    { left: '18%', top: '12%', size: 5 },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.gradientStart} 0%, ${COLORS.gradientEnd} 100%)`,
        position: 'relative',
        overflow: 'auto',
        // Hide scrollbar
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Chrome, Safari, Edge
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 40%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      <style>
        {`
          @keyframes splashLogoEnter {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes splashFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes splashParticleFloat {
            0%, 100% { transform: translateY(0); opacity: 0; }
            50% { transform: translateY(-30px); opacity: 0.2; }
          }
          @keyframes popFromCenter {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .splash-logo-container {
            animation: splashLogoEnter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            margin-bottom: 20px;
          }
          
          .splash-text-container {
            opacity: 0;
            animation: splashFadeIn 0.6s ease-out 1.0s forwards;
            display: flex;
            flex-direction: row;
            margin-top: 10px;
          }
          
          .splash-tagline-container {
            opacity: 0;
            animation: splashFadeIn 0.6s ease-out 1.6s forwards;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .splash-particle {
            position: absolute;
            background-color: ${COLORS.cyan};
            border-radius: 50%;
            opacity: 0;
          }
        `}
      </style>

      {/* Hero Section - Centered then Split Screen */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative',
        }}
      >
        {/* Left Side / Center - Animated Splash */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: '50vh', md: '100vh' },
            p: 4,
            marginRight: { md: splashComplete ? 0 : 'auto' },
            marginLeft: { md: splashComplete ? 0 : 'auto' },
            maxWidth: { md: splashComplete ? '50%' : '100%' },
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        >
          {/* Floating particles */}
          {particlePositions.map((pos, index) => (
            <div
              key={index}
              className="splash-particle"
              style={{
                left: pos.left,
                top: pos.top,
                width: `${pos.size}px`,
                height: `${pos.size}px`,
                animation: `splashParticleFloat 4s ease-in-out infinite ${index * 0.2}s`,
              }}
            />
          ))}

          {/* Main content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            {/* Animated logo */}
            <div className="splash-logo-container">
              <GELogo size={180} animated={true} showText={false} />
            </div>

            {/* App name with color split */}
            <div className="splash-text-container">
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.purple, letterSpacing: '1px' }}>
                Geo
              </span>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.cyan, letterSpacing: '1px' }}>
                Engage
              </span>
            </div>

            {/* Tagline */}
            <div className="splash-tagline-container">
              <div style={{ fontSize: '18px', color: COLORS.textGray, marginTop: '12px', letterSpacing: '0.5px', textAlign: 'center' }}>
                Navigate Indoors. Discover More.
              </div>
            </div>
          </Box>

          {/* Bottom accent line */}
          <Box 
            className="splash-tagline-container"
            sx={{ position: 'absolute', bottom: '60px', width: '60%', display: 'flex', justifyContent: 'center' }}
          >
            <Box sx={{
              height: '3px',
              width: '100%',
              borderRadius: '2px',
              background: `linear-gradient(to right, ${COLORS.purple}, ${COLORS.cyan})`
            }} />
          </Box>
        </Box>

        {/* Right Side - Sign In Card */}
        <Box
          sx={{
            flex: 1,
            display: splashComplete ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '50vh', md: '100vh' },
            p: 4,
            position: 'relative',
            opacity: splashComplete ? 1 : 0,
            transform: splashComplete ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)`,
              top: '20%',
              right: '10%',
              pointerEvents: 'none',
            },
          }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 7,
              width: '100%',
              maxWidth: 600,
              textAlign: 'center',
              borderRadius: 4,
              background: `linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)`,
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              boxShadow: `0 20px 60px ${COLORS.purple}55`,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.purple} 0%, ${COLORS.cyan} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: `0 8px 24px ${COLORS.purple}66`,
              }}
            >
              <SecurityIcon sx={{ fontSize: 56, color: 'white' }} />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
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
                fontSize: '1.1rem',
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
                  background: `linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)`,
                  backdropFilter: 'blur(5px)',
                  border: '1px solid',
                  borderColor: 'rgba(139, 92, 246, 0.4)',
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
                    background: `linear-gradient(45deg, ${COLORS.purple} 30%, ${COLORS.cyan} 90%)`,
                    boxShadow: `0 4px 20px ${COLORS.purple}66`,
                    '&:hover': {
                      background: `linear-gradient(45deg, #7c3aed 30%, #0891b2 90%)`,
                      boxShadow: `0 6px 24px ${COLORS.cyan}99`,
                    },
                    '&:disabled': {
                      background: 'rgba(100, 116, 139, 0.5)',
                    },
                  }}
                >
                  {verifying ? 'Verifying admin access...' : signingIn ? 'Signing in...' : 'Sign In with Google'}
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
      </Box>

      {/* Features Section - Scroll Down */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
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
                    borderColor: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: COLORS.cyan,
                      boxShadow: `0 8px 24px ${COLORS.cyan}33`,
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

      {/* Reminder Snackbar - shown after 15 seconds if login popup is still open */}
      <Snackbar
        open={reminderOpen}
        autoHideDuration={10000}
        onClose={() => setReminderOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setReminderOpen(false)}
          severity="info"
          sx={{
            width: '100%',
            backgroundColor: 'info.main',
            color: 'white',
          }}
        >
          Please complete the Google sign-in in the popup window. If you don't see it, check for a minimized window or try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
