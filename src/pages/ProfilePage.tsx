import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ProfilePage
 * Admin profile management page
 */
const ProfilePage = () => {
  const { currentUser, firebaseUser } = useAuth();
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [refreshing, setRefreshing] = useState(false);

  // Format date helper
  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Copy UID to clipboard
  const handleCopyUID = async () => {
    if (currentUser?.uid) {
      try {
        await navigator.clipboard.writeText(currentUser.uid);
        setSnackbar({ open: true, message: 'UID copied to clipboard!' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to copy UID' });
      }
    }
  };

  // Refresh authentication token
  const handleRefreshToken = async () => {
    setRefreshing(true);
    try {
      if (firebaseUser) {
        await firebaseUser.getIdToken(true); // Force refresh
        setSnackbar({ open: true, message: 'Session refreshed successfully!' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to refresh session' });
    } finally {
      setRefreshing(false);
    }
  };

  if (!currentUser || !firebaseUser) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Page Header */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 700,
          color: 'primary.main',
        }}
      >
        My Profile
      </Typography>

      {/* Main Profile Card */}
      <Card 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={currentUser.photoURL || undefined}
                alt={currentUser.displayName || undefined}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  border: '3px solid',
                  borderColor: 'primary.main',
                }}
              >
                {!currentUser.photoURL && (
                  <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {currentUser.displayName?.[0] || currentUser.email?.[0]?.toUpperCase()}
                  </Typography>
                )}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {currentUser.displayName || 'Admin User'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body1" color="text.secondary">
                  {currentUser.email}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {currentUser.emailVerified && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Email Verified"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <Chip
                  icon={<VerifiedIcon />}
                  label="Administrator"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Account Information */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                Account Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    User ID
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flex: 1 }}>
                      {currentUser.uid.substring(0, 20)}...
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CopyIcon />}
                      onClick={handleCopyUID}
                      sx={{ minWidth: 'auto' }}
                    >
                      Copy
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    Sign-in Method
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {firebaseUser.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    Account Created
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {formatDate(firebaseUser.metadata.creationTime)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    Last Sign-in
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {formatDate(firebaseUser.metadata.lastSignInTime)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Access & Session Management */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* Admin Access Card */}
            <Card 
              sx={{ 
                borderRadius: 3,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  Admin Access
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Alert 
                  severity="success" 
                  icon={<VerifiedIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Verified Administrator
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Full system access to manage campaigns, analytics, and zones.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            {/* Session Management Card */}
            <Card 
              sx={{ 
                borderRadius: 3,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  Session Management
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefreshToken}
                  disabled={refreshing}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh Session'}
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                  Refresh your authentication token to extend your session
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ProfilePage;
