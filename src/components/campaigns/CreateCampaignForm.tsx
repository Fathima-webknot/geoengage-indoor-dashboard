import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CampaignType, CreateCampaignRequest } from '@/types/campaign.types';
import { Zone } from '@/types/zone.types';
import { campaignService } from '@/services/campaignService';
import { zoneService } from '@/services/zoneService';

interface CreateCampaignFormProps {
  onSuccess?: () => void;
}

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSuccess }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [campaignName, setCampaignName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load zones on component mount
  useEffect(() => {
    const loadZones = async () => {
      try {
        const response = await zoneService.getAllZones();
        setZones(response.zones);
      } catch (err) {
        console.error('Failed to load zones:', err);
      }
    };
    loadZones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: CreateCampaignRequest = {
        name: campaignName,
        description: notificationMessage,
        type: CampaignType.PROMOTIONAL,
        contentTitle: campaignName,
        contentMessage: notificationMessage,
        zoneIds: [selectedZone],
        startDate: new Date().toISOString(),
      };

      await campaignService.createCampaign(payload);
      setSuccess(true);
      
      // Reset form
      setCampaignName('');
      setSelectedZone('');
      setNotificationMessage('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Create New Campaign
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Campaign created successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Campaign Name and Target Zone */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              required
              fullWidth
              label="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Summer Sale"
            />

            <FormControl fullWidth required>
              <InputLabel>Target Zone</InputLabel>
              <Select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                label="Target Zone"
              >
                {zones.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Notification Message */}
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Notification Message"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder="Enter the push notification text..."
          />

          {/* Submit Button */}
          <Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
