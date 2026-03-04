import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  Skeleton,
} from '@mui/material';
import {
  PowerSettingsNew as ActivateIcon,
  Block as DeactivateIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface CampaignListProps {
  campaigns: any[]; // Backend returns snake_case fields
  loading?: boolean;
  actionLoading?: string | null; // ID of campaign currently being updated
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  loading = false,
  actionLoading = null,
  onActivate,
  onDeactivate,
  onDelete,
}) => {
  // Debug: Log first campaign to see backend structure
  React.useEffect(() => {
    if (campaigns.length > 0) {
      console.group('📋 Backend Campaign Structure');
      console.log('First campaign:', campaigns[0]);
      console.log('Available fields:', Object.keys(campaigns[0]));
      console.log('Name field value:', campaigns[0].name);
      console.log('All name-like fields:', {
        name: campaigns[0].name,
        campaign_name: campaigns[0].campaign_name,
        title: campaigns[0].title,
      });
      console.groupEnd();
    }
  }, [campaigns]);

  // Skeleton loader rows
  const renderSkeletonRows = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton variant="rounded" width={70} height={24} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="80%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="60%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        Active & Past Campaigns
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Campaign
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Zone
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Message
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No campaigns yet. Create your first campaign above!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => {
              // Backend returns: id, zone_id, message, active, created_at
              const isActive = campaign.active || false;
              const status = isActive ? 'Active' : 'Inactive';
              
              return (
                <TableRow
                  key={campaign.id}
                  sx={{
                    '&:hover': { backgroundColor: '#fafafa' },
                  }}
                >
                  <TableCell>
                    <Chip
                      label={status}
                      size="small"
                      color={isActive ? 'success' : 'default'}
                      sx={{ 
                        minWidth: 70,
                        bgcolor: isActive ? '#e8f5e9' : '#f5f5f5',
                        color: isActive ? '#2e7d32' : '#757575',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Campaign #{campaign.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {campaign.zone_id ? campaign.zone_id.substring(0, 8) + '...' : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {campaign.message || 'No message'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {isActive ? (
                        <Tooltip title="Deactivate Campaign">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onDeactivate && onDeactivate(campaign.id)}
                              disabled={actionLoading === campaign.id}
                              sx={{ 
                                color: actionLoading === campaign.id ? '#ccc' : '#f57c00',
                              }}
                            >
                              {actionLoading === campaign.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <DeactivateIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activate Campaign">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onActivate && onActivate(campaign.id)}
                              disabled={actionLoading === campaign.id}
                              sx={{ 
                                color: actionLoading === campaign.id ? '#ccc' : '#4caf50',
                              }}
                            >
                              {actionLoading === campaign.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <ActivateIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete Campaign">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onDelete && onDelete(campaign.id)}
                            disabled={actionLoading === campaign.id}
                            sx={{ 
                              color: actionLoading === campaign.id ? '#ccc' : '#d32f2f',
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
