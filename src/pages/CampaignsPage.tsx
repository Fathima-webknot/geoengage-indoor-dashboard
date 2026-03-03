import { Box, Typography } from '@mui/material';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';

/**
 * CampaignsPage
 * Main page for managing campaigns (create, view, activate/deactivate)
 */
const CampaignsPage = () => {
  const handleCampaignCreated = () => {
    // Callback when campaign is created successfully
    // Will refresh campaign list in next commit
    console.log('Campaign created successfully');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Campaigns
      </Typography>

      <CreateCampaignForm onSuccess={handleCampaignCreated} />

      <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
        Campaign list table will be implemented in next commit.
      </Typography>
    </Box>
  );
};

export default CampaignsPage;
