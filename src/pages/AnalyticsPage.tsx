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
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { campaignService } from '@/services/campaignService';
import { zoneService } from '@/services/zoneService';

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
            bgcolor: bgColor,
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
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Campaigns"
            value={metrics.totalCampaigns}
            icon={<CampaignIcon sx={{ fontSize: 32, color: '#1976d2' }} />}
            color="#1976d2"
            bgColor="#e3f2fd"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Campaigns"
            value={metrics.activeCampaigns}
            icon={<ActiveIcon sx={{ fontSize: 32, color: '#2e7d32' }} />}
            color="#2e7d32"
            bgColor="#e8f5e9"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Inactive Campaigns"
            value={metrics.inactiveCampaigns}
            icon={<InactiveIcon sx={{ fontSize: 32, color: '#f57c00' }} />}
            color="#f57c00"
            bgColor="#fff3e0"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Zones"
            value={metrics.totalZones}
            icon={<ZoneIcon sx={{ fontSize: 32, color: '#7b1fa2' }} />}
            color="#7b1fa2"
            bgColor="#f3e5f5"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Campaign Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Campaign Status Distribution
            </Typography>
            {metrics.totalCampaigns > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: metrics.activeCampaigns },
                      { name: 'Inactive', value: metrics.inactiveCampaigns },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#2e7d32" />
                    <Cell fill="#f57c00" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No campaigns to display
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Campaigns Per Zone Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Campaigns Per Zone Distribution
            </Typography>
            {zonePerformance.filter(z => z.totalCampaigns > 0).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={zonePerformance
                      .filter(z => z.totalCampaigns > 0)
                      .map(z => ({
                        name: z.zoneId.substring(0, 8) + '...',
                        value: z.totalCampaigns,
                      }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#1976d2" />
                    <Cell fill="#7b1fa2" />
                    <Cell fill="#d32f2f" />
                    <Cell fill="#f57c00" />
                    <Cell fill="#388e3c" />
                    <Cell fill="#0288d1" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No zones with campaigns
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Zone Performance Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Zone Performance
        </Typography>
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
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
                    sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
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
                        sx={{
                          bgcolor: '#e8f5e9',
                          color: '#2e7d32',
                          fontWeight: 600,
                          minWidth: 50,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={zone.inactiveCampaigns}
                        size="small"
                        sx={{
                          bgcolor: '#fff3e0',
                          color: '#f57c00',
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
                          sx={{ bgcolor: '#f5f5f5', color: '#757575' }}
                        />
                      ) : zone.activeCampaigns > 0 ? (
                        <Chip
                          label="Active"
                          size="small"
                          color="success"
                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}
                        />
                      ) : (
                        <Chip
                          label="Inactive"
                          size="small"
                          sx={{ bgcolor: '#f5f5f5', color: '#757575' }}
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
