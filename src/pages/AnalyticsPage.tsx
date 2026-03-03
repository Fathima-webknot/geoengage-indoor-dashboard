import { Box, Typography } from '@mui/material';

/**
 * AnalyticsPage
 * Dashboard showing zone performance metrics and analytics
 */
const AnalyticsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Analytics dashboard will be implemented here.
      </Typography>
    </Box>
  );
};

export default AnalyticsPage;
