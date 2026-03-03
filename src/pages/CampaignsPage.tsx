import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { Campaign } from '@/types/campaign.types';
import { campaignService } from '@/services/campaignService';

/**
 * CampaignsPage
 * Main page for managing campaigns (create, view, activate/deactivate)
 */
const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignService.getAllCampaigns();
      setCampaigns(response.campaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCampaignCreated = () => {
    // Refresh campaign list after creating a new campaign
    loadCampaigns();
  };

  const handleActivate = async (id: string) => {
    try {
      await campaignService.activateCampaign(id);
      loadCampaigns();
    } catch (error) {
      console.error('Failed to activate campaign:', error);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await campaignService.deactivateCampaign(id);
      loadCampaigns();
    } catch (error) {
      console.error('Failed to deactivate campaign:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignService.deleteCampaign(id);
        loadCampaigns();
      } catch (error) {
        console.error('Failed to delete campaign:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Campaigns
      </Typography>

      <CreateCampaignForm onSuccess={handleCampaignCreated} />

      <CampaignList
        campaigns={campaigns}
        loading={loading}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default CampaignsPage;
