import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  CheckCircle as ActiveIcon,
  Block as InactiveIcon,
  Place as ZoneIcon,
  Notifications as NotificationsIcon,
  TouchApp as ClickIcon,
  TrendingUp as CTRIcon,
} from '@mui/icons-material';
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

interface ZonePerformance {
  zoneId: string;
  totalCampaigns: number;
  activeCampaigns: number;
  inactiveCampaigns: number;
}

/**
 * AnalyticsPage
 * Dashboard showing zone performance metrics and analytics
 */
const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
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
  const [zonePerformance, setZonePerformance] = useState<ZonePerformance[]>([]);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
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

        // Calculate zone performance
        const zoneStats: { [key: string]: ZonePerformance } = {};
        
        // Initialize all zones
        zones.forEach((zone: any) => {
          const zoneId = zone.id || zone.zone_id || zone.zoneId;
          if (zoneId) {
            zoneStats[zoneId] = {
              zoneId,
              totalCampaigns: 0,
              activeCampaigns: 0,
              inactiveCampaigns: 0,
            };
          }
        });

        // Count campaigns per zone
        campaigns.forEach((campaign: any) => {
          const zoneId = campaign.zone_id || campaign.zoneId;
          if (zoneId && zoneStats[zoneId]) {
            zoneStats[zoneId].totalCampaigns++;
            if (campaign.active) {
              zoneStats[zoneId].activeCampaigns++;
            } else {
              zoneStats[zoneId].inactiveCampaigns++;
            }
          }
        });

        setZonePerformance(Object.values(zoneStats));
      } catch (error) {
        console.error('Failed to load analytics metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Campaigns"
            value={metrics.totalCampaigns}
            icon={<CampaignIcon sx={{ fontSize: 32, color: 'primary.main' }} />}
            color="primary.main"
            bgColor="background.default"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Active Campaigns"
            value={metrics.activeCampaigns}
            icon={<ActiveIcon sx={{ fontSize: 32, color: 'success.main' }} />}
            color="success.main"
            bgColor="background.default"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Inactive Campaigns"
            value={metrics.inactiveCampaigns}
            icon={<InactiveIcon sx={{ fontSize: 32, color: 'warning.main' }} />}
            color="warning.main"
            bgColor="background.default"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Zones"
            value={metrics.totalZones}
            icon={<ZoneIcon sx={{ fontSize: 32, color: 'secondary.main' }} />}
            color="secondary.main"
            bgColor="background.default"
          />
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
              value={`${notificationMetrics.ctr.toFixed(2)}%`}
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
                  contentStyle={{ borderRadius: 8 }}
                />
                <Legend />
                <Bar dataKey="Triggered" fill="#1976d2" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Clicked" fill="#2e7d32" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
              <Typography variant="body2" color="text.secondary">
                No notification data available
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Zone Performance Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Zone Performance
        </Typography>
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Zone ID
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Total Campaigns
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Active
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Inactive
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zonePerformance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No zones available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                zonePerformance.map((zone) => (
                  <TableRow
                    key={zone.zoneId}
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {zone.zoneId.length > 12
                          ? `${zone.zoneId.substring(0, 12)}...`
                          : zone.zoneId}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {zone.totalCampaigns}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={zone.activeCampaigns}
                        size="small"
                        color="success"
                        sx={{
                          fontWeight: 600,
                          minWidth: 50,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={zone.inactiveCampaigns}
                        size="small"
                        color="warning"
                        sx={{
                          fontWeight: 600,
                          minWidth: 50,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {zone.totalCampaigns === 0 ? (
                        <Chip
                          label="No Campaigns"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        />
                      ) : zone.activeCampaigns > 0 ? (
                        <Chip
                          label="Active"
                          size="small"
                          color="success"
                        />
                      ) : (
                        <Chip
                          label="Inactive"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
