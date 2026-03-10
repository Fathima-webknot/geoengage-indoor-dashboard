import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  AlertTitle,
  Skeleton,
  Button,
  Snackbar,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import {
  Campaign as CampaignIcon,
  CheckCircle as ActiveIcon,
  Block as InactiveIcon,
  Place as ZoneIcon,
  Notifications as NotificationsIcon,
  TouchApp as ClickIcon,
  TrendingUp as CTRIcon,
} from '@mui/icons-material';
import { EmptyState } from '@/components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { campaignService } from '@/services/campaignService';
import { zoneService } from '@/services/zoneService';
import { analyticsService } from '@/services/analyticsService';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, bgColor }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h3" component="div" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

/**
 * AnalyticsPage
 * Dashboard showing campaign and notification analytics
 */
const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [metrics, setMetrics] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    inactiveCampaigns: 0,
    totalZones: 0,
  });
  const [notificationMetrics, setNotificationMetrics] = useState({
    totalTriggered: 0,
    totalClicked: 0,
    ctr: 0,
  });

  const loadMetrics = async (showSuccessMessage = false) => {
    setLoading(true);
    setLoadingTimeout(false);
    setError(null);
    
    // Set timeout for loading indicator
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 15000);
    
    try {
      // Fetch campaigns
      const campaignsResponse = await campaignService.getAllCampaigns();
      let campaigns: any[] = [];
      
      if (Array.isArray(campaignsResponse)) {
        campaigns = campaignsResponse;
      } else if (campaignsResponse?.campaigns) {
        campaigns = campaignsResponse.campaigns;
      }

      // Fetch zones
      const zonesResponse = await zoneService.getAllZones();
      let zones: any[] = [];
      
      if (Array.isArray(zonesResponse)) {
        zones = zonesResponse;
      } else if (zonesResponse?.zones) {
        zones = zonesResponse.zones;
      }

      // Fetch notification analytics
      try {
        const notificationAnalytics = await analyticsService.getNotificationAnalytics();
        setNotificationMetrics({
          totalTriggered: notificationAnalytics.totalTriggered || 0,
          totalClicked: notificationAnalytics.totalClicked || 0,
          ctr: notificationAnalytics.ctr || 0,
        });
      } catch (error) {
        console.error('Failed to load notification analytics:', error);
        // Set default values if analytics API fails
        setNotificationMetrics({
          totalTriggered: 0,
          totalClicked: 0,
          ctr: 0,
        });
      }

      // Calculate metrics
      const activeCampaigns = campaigns.filter(c => c.active).length;
      const inactiveCampaigns = campaigns.filter(c => !c.active).length;

      setMetrics({
        totalCampaigns: campaigns.length,
        activeCampaigns,
        inactiveCampaigns,
        totalZones: zones.length,
      });

      // Show success message if requested (e.g., after reconnection)
      if (showSuccessMessage) {
        setSnackbar({
          open: true,
          message: 'Analytics data refreshed successfully',
          severity: 'success',
        });
      }
    } catch (error: any) {
      console.error('Failed to load analytics metrics:', error);
      setError('Failed to load analytics data. Try again in sometime');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // Load metrics on mount
  useEffect(() => {
    loadMetrics();
  }, []);

  // Reload metrics when network comes back online
  useEffect(() => {
    const handleOnline = () => {
      setSnackbar({
        open: true,
        message: 'Connection restored. Refreshing analytics data...',
        severity: 'info',
      });
      loadMetrics(true);
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Analytics Dashboard
      </Typography>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Error Alert with Retry */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={loadMetrics}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Failed to Load Data</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Loading timeout warning */}
      {loadingTimeout && loading && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Loading taking longer than expected. Please check your connection.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
            </Paper>
          ) : (
            <MetricCard
              title="Total Campaigns"
              value={metrics.totalCampaigns}
              icon={<CampaignIcon sx={{ fontSize: 32, color: 'primary.main' }} />}
              color="primary.main"
              bgColor="background.default"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
            </Paper>
          ) : (
            <MetricCard
              title="Active Campaigns"
              value={metrics.activeCampaigns}
              icon={<ActiveIcon sx={{ fontSize: 32, color: 'success.main' }} />}
              color="success.main"
              bgColor="background.default"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
            </Paper>
          ) : (
            <MetricCard
              title="Inactive Campaigns"
              value={metrics.inactiveCampaigns}
              icon={<InactiveIcon sx={{ fontSize: 32, color: 'warning.main' }} />}
              color="warning.main"
              bgColor="background.default"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
            </Paper>
          ) : (
            <MetricCard
              title="Total Zones"
              value={metrics.totalZones}
              icon={<ZoneIcon sx={{ fontSize: 32, color: 'secondary.main' }} />}
              color="secondary.main"
              bgColor="background.default"
            />
          )}
        </Grid>
      </Grid>

      {/* Notification Metrics */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Notification Performance
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Notifications Triggered"
              value={notificationMetrics.totalTriggered.toLocaleString()}
              icon={<NotificationsIcon sx={{ fontSize: 32, color: 'primary.main' }} />}
              color="primary.main"
              bgColor="background.default"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Notifications Clicked"
              value={notificationMetrics.totalClicked.toLocaleString()}
              icon={<ClickIcon sx={{ fontSize: 32, color: 'success.main' }} />}
              color="success.main"
              bgColor="background.default"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Click-Through Rate (CTR)"
              value={
                !isFinite(notificationMetrics.ctr) || isNaN(notificationMetrics.ctr)
                  ? '0.00%'
                  : `${(notificationMetrics.ctr * 100).toFixed(2)}%`
              }
              icon={<CTRIcon sx={{ fontSize: 32, color: 'error.main' }} />}
              color="error.main"
              bgColor="background.default"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Notification Performance Chart */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Notification Engagement Overview
          </Typography>
          {notificationMetrics.totalTriggered > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={[
                  {
                    name: 'Notifications',
                    Triggered: notificationMetrics.totalTriggered,
                    Clicked: notificationMetrics.totalClicked,
                  },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => value.toLocaleString()}
                  contentStyle={{ 
                    borderRadius: 8,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: '1px solid #e0e0e0',
                    padding: '12px',
                    transform: 'translateY(-5px)',
                  }}
                  cursor={false}
                />
                <Legend />
                <Bar dataKey="Triggered" fill="#1976d2" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Clicked" fill="#2e7d32" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyState
                icon={<NotificationsIcon />}
                title="No Notification Data"
                description="Start creating campaigns to see notification engagement metrics here."
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
