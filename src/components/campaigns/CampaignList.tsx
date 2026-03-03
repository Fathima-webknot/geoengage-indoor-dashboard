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
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as ActivateIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Campaign, CampaignStatus, CampaignType } from '@/types/campaign.types';

interface CampaignListProps {
  campaigns: Campaign[];
  loading?: boolean;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getStatusColor = (status: CampaignStatus): 'default' | 'success' | 'warning' | 'error' => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return 'success';
    case CampaignStatus.PAUSED:
      return 'warning';
    case CampaignStatus.DRAFT:
      return 'default';
    case CampaignStatus.COMPLETED:
      return 'error';
    default:
      return 'default';
  }
};

const getTypeLabel = (type: CampaignType): string => {
  switch (type) {
    case CampaignType.PROMOTIONAL:
      return 'Promotional';
    case CampaignType.INFORMATIONAL:
      return 'Informational';
    case CampaignType.NAVIGATIONAL:
      return 'Navigational';
    case CampaignType.EMERGENCY:
      return 'Emergency';
    default:
      return type;
  }
};

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  loading = false,
  onActivate,
  onDeactivate,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No campaigns found. Create your first campaign above!
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 600 }}>Campaign Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Zones</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Metrics
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow
              key={campaign.id}
              sx={{
                '&:hover': { backgroundColor: '#fafafa' },
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {campaign.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {campaign.description}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={getTypeLabel(campaign.type)} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Chip
                  label={campaign.status.toUpperCase()}
                  size="small"
                  color={getStatusColor(campaign.status)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(campaign.startDate)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {campaign.endDate ? formatDate(campaign.endDate) : 'No end date'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={`${campaign.zoneIds.length} zones`} size="small" />
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant="caption" display="block">
                    👁️ {campaign.impressions}
                  </Typography>
                  <Typography variant="caption" display="block">
                    🖱️ {campaign.clicks}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  {campaign.isActive ? (
                    <Tooltip title="Pause Campaign">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onDeactivate?.(campaign.id)}
                      >
                        <PauseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Activate Campaign">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => onActivate?.(campaign.id)}
                      >
                        <ActivateIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Campaign">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(campaign.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
