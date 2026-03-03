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
import { CampaignType } from '@/types/campaign.types';
import { Zone } from '@/types/zone.types';
import { campaignService } from '@/services/campaignService';
import { zoneService } from '@/services/zoneService';

interface CreateCampaignFormProps {
  onSuccess?: () => void;
}

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSuccess }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [campaignName, setCampaignName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load zones on component mount
  useEffect(() => {
    const loadZones = async () => {
      try {
        setZonesLoading(true);
        console.log('Fetching zones from API...');
        const response = await zoneService.getAllZones();
        console.log('Zones API response:', response);
        
        // Handle different response formats
        let zonesData: Zone[] = [];
        if (Array.isArray(response)) {
          // Backend returns array directly
          zonesData = response;
        } else if (response && Array.isArray(response.zones)) {
          // Backend returns { zones: [...] }
          zonesData = response.zones;
        } else if (response && Array.isArray((response as any).data)) {
          // Backend returns { data: [...] }
          zonesData = (response as any).data;
        }
        
        console.log('Parsed zones array:', zonesData);
        setZones(zonesData);
      } catch (err: any) {
        console.error('Failed to load zones - Full error:', err);
        console.error('Error response:', err.response);
        setError(`Failed to load zones: ${err.response?.status || ''} ${err.response?.data?.message || err.message}`);
      } finally {
        setZonesLoading(false);
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
      // Backend expects snake_case field names
      const payload: any = {
        name: campaignName,
        zone_id: selectedZone, // Backend expects singular zone_id, not zoneIds array
        message: notificationMessage, // Backend expects 'message', not 'contentMessage'
        type: CampaignType.PROMOTIONAL,
      };

      console.group('📤 Creating Campaign');
      console.log('Payload:', payload);
      console.groupEnd();

      await campaignService.createCampaign(payload);
      setSuccess(true);
      
      // Reset form after a delay to show success message
      setTimeout(() => {
        setCampaignName('');
        setSelectedZone('');
        setNotificationMessage('');
        setSuccess(false);
        
        if (onSuccess) {
          onSuccess();
        }
      }, 2000); // Show success message for 2 seconds
    } catch (err: any) {
      console.group('❌ Campaign Creation Error');
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      console.groupEnd();
      
      // Extract detailed error message
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error
        || (typeof err.response?.data === 'string' ? err.response?.data : null)
        || err.message 
        || 'Failed to create campaign';
      
      setError(errorMsg);
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
                disabled={zonesLoading}
              >
                {zonesLoading ? (
                  <MenuItem disabled>Loading zones...</MenuItem>
                ) : zones.length === 0 ? (
                  <MenuItem disabled>No zones available</MenuItem>
                ) : (
                  zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </MenuItem>
                  ))
                )}
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
