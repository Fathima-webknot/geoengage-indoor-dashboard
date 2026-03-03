import { Box, Typography } from '@mui/material';

/**
 * ProfilePage
 * Admin profile management page
 */
const ProfilePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Profile management will be implemented here.
      </Typography>
    </Box>
  );
};

export default ProfilePage;
