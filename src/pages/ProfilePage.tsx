import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ProfilePage
 * Admin profile management page
 */
const ProfilePage = () => {
  const { currentUser, firebaseUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [logoutDialog, setLogoutDialog] = useState(false);
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

  // Handle logout with confirmation
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to logout' });
    }
  };

  if (!currentUser || !firebaseUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Page Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        My Profile
      </Typography>

      {/* Main Profile Card */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={currentUser.photoURL || undefined}
                alt={currentUser.displayName || undefined}
                sx={{ width: 100, height: 100, border: '4px solid', borderColor: 'primary.main' }}
              >
                {!currentUser.photoURL && (
                  <Typography variant="h3">
                    {currentUser.displayName?.[0] || currentUser.email?.[0]?.toUpperCase()}
                  </Typography>
                )}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {currentUser.displayName || 'Admin User'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <EmailIcon fontSize="small" color="action" />
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
                    variant="outlined"
                  />
                )}
                <Chip
                  icon={<VerifiedIcon />}
                  label="Administrator"
                  color="primary"
                  size="small"
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Account Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    User ID
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {currentUser.uid.substring(0, 20)}...
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<CopyIcon />}
                      onClick={handleCopyUID}
                      sx={{ minWidth: 'auto' }}
                    >
                      Copy
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Sign-in Method
                  </Typography>
                  <Typography variant="body2">
                    {firebaseUser.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Account Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(firebaseUser.metadata.creationTime)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Sign-in
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(firebaseUser.metadata.lastSignInTime)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Access & Security */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* Admin Access Card */}
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Admin Access
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Alert severity="success" icon={<VerifiedIcon />}>
                  <Typography variant="body2">
                    <strong>Verified Administrator</strong>
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    You have full system access to manage campaigns, analytics, and zones.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            {/* Security Actions Card */}
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Security
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefreshToken}
                    disabled={refreshing}
                    fullWidth
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh Session'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={() => setLogoutDialog(true)}
                    fullWidth
                  >
                    Sign Out
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle>Confirm Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out? You'll need to sign in again to access the admin panel.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ProfilePage;
