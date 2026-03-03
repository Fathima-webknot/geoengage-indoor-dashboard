import { Box, Typography } from '@mui/material';

/**
 * CampaignsPage
 * Main page for managing campaigns (create, view, activate/deactivate)
 */
const CampaignsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Campaigns
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Campaign management will be implemented here.
      </Typography>
    </Box>
  );
};

export default CampaignsPage;
