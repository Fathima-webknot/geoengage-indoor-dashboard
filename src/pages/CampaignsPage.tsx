import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Snackbar, Alert, ToggleButtonGroup, ToggleButton, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Campaign as CampaignIcon } from '@mui/icons-material';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { EmptyState } from '@/components/EmptyState';
import { Campaign } from '@/types/campaign.types';
import { campaignService } from '@/services/campaignService';
import { zoneService } from '@/services/zoneService';
import { getErrorMessage, getSuccessMessage } from '@/utils/errorMessages';

/**
 * CampaignsPage
 * Main page for managing campaigns (create, view, activate/deactivate)
 */
const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    campaignId: string | null;
  }>({ open: false, campaignId: null });

  const loadCampaigns = async () => {
    setLoading(true);
    setLoadingTimeout(false);
    
    // Set timeout to show error if loading takes too long
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 15000); // 15 seconds
    
    try {
      // Fetch both campaigns and zones
      const [campaignsResponse, zonesResponse] = await Promise.all([
        campaignService.getAllCampaigns(),
        zoneService.getAllZones(),
      ]);
      
      console.log('📋 Campaigns API response:', campaignsResponse);
      console.log('🗺️ Zones API response:', zonesResponse);
      
      // Handle different response formats for campaigns
      let campaignsData: any[] = [];
      if (Array.isArray(campaignsResponse)) {
        campaignsData = campaignsResponse;
      } else if (campaignsResponse && Array.isArray(campaignsResponse.campaigns)) {
        campaignsData = campaignsResponse.campaigns;
      } else if (campaignsResponse && campaignsResponse.data && Array.isArray(campaignsResponse.data)) {
        campaignsData = campaignsResponse.data;
      }
      
      // Handle different response formats for zones
      let zonesData: any[] = [];
      if (Array.isArray(zonesResponse)) {
        zonesData = zonesResponse;
      } else if (zonesResponse && Array.isArray(zonesResponse.zones)) {
        zonesData = zonesResponse.zones;
      } else if (zonesResponse && zonesResponse.data && Array.isArray(zonesResponse.data)) {
        zonesData = zonesResponse.data;
      }
      
      // Create zone lookup map (zone_id -> zone_name)
      const zoneMap = new Map<string, string>();
      zonesData.forEach((zone: any) => {
        const zoneId = zone.id || zone.zone_id || zone.zoneId;
        const zoneName = zone.name || zone.zone_name || zone.zoneName;
        if (zoneId && zoneName) {
          zoneMap.set(zoneId, zoneName);
        }
      });
      
      // Enrich campaigns with zone names
      const enrichedCampaigns = campaignsData.map((campaign: any) => {
        const zoneId = campaign.zone_id || campaign.zoneId;
        return {
          ...campaign,
          zone_name: zoneId ? zoneMap.get(zoneId) || 'Unknown Zone' : null,
        };
      });
      
      console.log('📊 Parsed campaigns:', enrichedCampaigns.map(c => ({ id: c.id, active: c.active, zone_name: c.zone_name })));
      
      // Sort campaigns: Active first, then Inactive
      const sortedCampaigns = enrichedCampaigns.sort((a, b) => {
        // Active campaigns (true) come before inactive (false)
        if (a.active === b.active) return 0;
        return a.active ? -1 : 1;
      });
      
      console.log('✅ After sorting:', sortedCampaigns.map(c => ({ id: c.id, active: c.active, zone_name: c.zone_name })));
      setCampaigns(sortedCampaigns);
    } catch (error: any) {
      console.error('Failed to load campaigns:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      clearTimeout(timeoutId);
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
        message: getSuccessMessage('campaign-activated'),
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
        message: getErrorMessage(error),
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
        message: getSuccessMessage('campaign-deactivated'),
        severity: 'success',
      });
      await loadCampaigns();
    } catch (error: any) {
      console.error('Failed to deactivate campaign:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ open: true, campaignId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.campaignId) return;

    setActionLoading(deleteDialog.campaignId);
    try {
      await campaignService.deleteCampaign(deleteDialog.campaignId);
      setSnackbar({
        open: true,
        message: getSuccessMessage('campaign-deleted'),
        severity: 'success',
      });
      await loadCampaigns();
    } catch (error: any) {
      console.error('Failed to delete campaign:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error',
      });
    } finally {
      setActionLoading(null);
      setDeleteDialog({ open: false, campaignId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, campaignId: null });
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

  // Filter campaigns based on selected status (memoized to prevent re-renders)
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return campaign.active === true;
      if (statusFilter === 'inactive') return campaign.active === false;
      return true;
    });
  }, [campaigns, statusFilter]);

  // Count active campaigns (memoized)
  const activeCount = useMemo(() => {
    return campaigns.filter(c => c.active).length;
  }, [campaigns]);

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

      {/* Show loading timeout error */}
      {loadingTimeout && loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Loading is taking longer than expected. Please check your connection or try refreshing the page.
          </Typography>
        </Alert>
      )}

      {/* Show empty state when no campaigns and not loading */}
      {!loading && filteredCampaigns.length === 0 && (
        <EmptyState
          icon={<CampaignIcon />}
          title={statusFilter === 'all' ? 'No Campaigns Yet' : `No ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Campaigns`}
          description={
            statusFilter === 'all'
              ? 'Get started by creating your first location-based campaign. Target specific zones and engage users with personalized notifications.'
              : `There are currently no ${statusFilter} campaigns. Try changing the filter or create a new campaign.`
          }
          action={{
            label: 'Scroll Up to Create Campaign',
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          }}
        />
      )}

      {/* Show campaign list when there are campaigns */}
      {(loading || filteredCampaigns.length > 0) && (
        <CampaignList
          campaigns={filteredCampaigns}
          loading={loading}
          actionLoading={actionLoading}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Campaign?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this campaign? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 3,
            '& .MuiAlert-icon': {
              fontSize: '24px',
            },
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
              fontWeight: 500,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignsPage;
