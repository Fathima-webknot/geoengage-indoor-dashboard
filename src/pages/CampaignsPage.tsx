import { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Alert, ToggleButtonGroup, ToggleButton, Chip } from '@mui/material';
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignService.getAllCampaigns();
      console.log('📋 Campaigns API response:', response);
      
      // Handle different response formats
      let campaignsData: Campaign[] = [];
      if (Array.isArray(response)) {
        campaignsData = response;
      } else if (response && Array.isArray(response.campaigns)) {
        campaignsData = response.campaigns;
      } else if (response && response.data && Array.isArray(response.data)) {
        campaignsData = response.data;
      }
      
      console.log('📊 Parsed campaigns:', campaignsData.map(c => ({ id: c.id, active: c.active })));
      
      // Sort campaigns: Active first, then Inactive
      const sortedCampaigns = campaignsData.sort((a, b) => {
        // Active campaigns (true) come before inactive (false)
        if (a.active === b.active) return 0;
        return a.active ? -1 : 1;
      });
      
      console.log('✅ After sorting:', sortedCampaigns.map(c => ({ id: c.id, active: c.active })));
      setCampaigns(sortedCampaigns);
    } catch (error: any) {
      console.error('Failed to load campaigns:', error);
      console.error('Error details:', error.response?.data);
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
    setActionLoading(id);
    try {
      console.group('🟢 ACTIVATING CAMPAIGN');
      console.log('Campaign ID to activate:', id);
      console.log('Current active campaigns:', campaigns.filter(c => c.active).map(c => ({ id: c.id, message: c.message })));
      console.log('Total active count BEFORE:', campaigns.filter(c => c.active).length);
      
      const result = await campaignService.activateCampaign(id);
      console.log('✅ Backend activation response:', result);
      
      setSnackbar({
        open: true,
        message: 'Campaign activated successfully!',
        severity: 'success',
      });
      
      await loadCampaigns();
      console.log('Total active count AFTER refresh:', campaigns.filter(c => c.active).length);
      console.groupEnd();
    } catch (error: any) {
      console.error('❌ Failed to activate campaign:', error);
      console.groupEnd();
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to activate campaign',
        severity: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (id: string) => {
    setActionLoading(id);
    try {
      console.log('🔴 Deactivating campaign ID:', id);
      const result = await campaignService.deactivateCampaign(id);
      console.log('✅ Deactivation response:', result);
      setSnackbar({
        open: true,
        message: 'Campaign deactivated successfully!',
        severity: 'success',
      });
      await loadCampaigns();
    } catch (error: any) {
      console.error('Failed to deactivate campaign:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to deactivate campaign',
        severity: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStatusFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: 'all' | 'active' | 'inactive' | null,
  ) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };

  // Filter campaigns based on selected status
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return campaign.active === true;
    if (statusFilter === 'inactive') return campaign.active === false;
    return true;
  });

  // Count active campaigns
  const activeCount = campaigns.filter(c => c.active).length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Campaigns
      </Typography>

      <CreateCampaignForm onSuccess={handleCampaignCreated} />

      {/* Active Campaign Count Warning */}
      {activeCount >= 3 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Note:</strong> You currently have <strong>{activeCount} active campaigns</strong>. 
            Your backend may have a limit on concurrent active campaigns. If you activate another campaign, 
            one of the existing active campaigns may be automatically deactivated.
          </Typography>
        </Alert>
      )}

      {/* Status Filter Toggle Buttons */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
          Filter by status:
        </Typography>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleStatusFilterChange}
          aria-label="campaign status filter"
          size="small"
        >
          <ToggleButton value="all" aria-label="all campaigns">
            All
          </ToggleButton>
          <ToggleButton value="active" aria-label="active campaigns">
            Active
          </ToggleButton>
          <ToggleButton value="inactive" aria-label="inactive campaigns">
            Inactive
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ({filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'})
        </Typography>
      </Box>

      <CampaignList
        campaigns={filteredCampaigns}
        loading={loading}
        actionLoading={actionLoading}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignsPage;
