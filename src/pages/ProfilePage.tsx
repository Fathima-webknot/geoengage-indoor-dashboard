import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
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
            <Grid size="auto">
              <Avatar
                src={currentUser?.photoURL ?? undefined}
                alt={currentUser?.displayName ?? undefined}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  border: '3px solid',
                  borderColor: 'primary.main',
                }}
              >
                {!currentUser?.photoURL && (
                  <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {currentUser?.displayName?.[0] ?? currentUser?.email?.[0]?.toUpperCase() ?? 'A'}
                  </Typography>
                )}
              </Avatar>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {currentUser?.displayName ?? 'Admin User'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body1" color="text.secondary">
                  {currentUser?.email ?? 'No email'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {currentUser?.emailVerified && (
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
        <Grid size={{ xs: 12, md: 6 }}>
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
                    Sign-in Method
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {firebaseUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    Account Created
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {formatDate(firebaseUser?.metadata?.creationTime)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    Last Sign-in
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {formatDate(firebaseUser?.metadata?.lastSignInTime)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Access */}
        <Grid size={{ xs: 12, md: 6 }}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
