import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Typography,
  Alert,
  Stack,
  SelectChangeEvent,
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

  const [formData, setFormData] = useState<CreateCampaignRequest>({
    name: '',
    description: '',
    type: CampaignType.PROMOTIONAL,
    contentTitle: '',
    contentMessage: '',
    contentImageUrl: '',
    contentActionUrl: '',
    contentActionText: '',
    zoneIds: [],
    startDate: '',
    endDate: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({ ...prev, type: e.target.value as CampaignType }));
  };

  const handleZoneChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      zoneIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Remove empty optional fields
      const payload: CreateCampaignRequest = {
        ...formData,
        contentImageUrl: formData.contentImageUrl || undefined,
        contentActionUrl: formData.contentActionUrl || undefined,
        contentActionText: formData.contentActionText || undefined,
        endDate: formData.endDate || undefined,
      };

      await campaignService.createCampaign(payload);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: CampaignType.PROMOTIONAL,
        contentTitle: '',
        contentMessage: '',
        contentImageUrl: '',
        contentActionUrl: '',
        contentActionText: '',
        zoneIds: [],
        startDate: '',
        endDate: '',
      });

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
    <Paper sx={{ p: 3, mb: 3 }}>
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
        <Stack spacing={3}>
          {/* Basic Information */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              required
              fullWidth
              label="Campaign Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Holiday Sale 2026"
            />

            <FormControl fullWidth required>
              <InputLabel>Campaign Type</InputLabel>
              <Select
                value={formData.type}
                onChange={handleSelectChange}
                label="Campaign Type"
              >
                <MenuItem value={CampaignType.PROMOTIONAL}>Promotional</MenuItem>
                <MenuItem value={CampaignType.INFORMATIONAL}>Informational</MenuItem>
                <MenuItem value={CampaignType.NAVIGATIONAL}>Navigational</MenuItem>
                <MenuItem value={CampaignType.EMERGENCY}>Emergency</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            required
            fullWidth
            multiline
            rows={2}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the campaign"
          />

          {/* Content */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Campaign Content
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              required
              fullWidth
              label="Content Title"
              name="contentTitle"
              value={formData.contentTitle}
              onChange={handleInputChange}
              placeholder="e.g., 50% Off All Items"
            />

            <TextField
              fullWidth
              label="Content Image URL"
              name="contentImageUrl"
              value={formData.contentImageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </Stack>

          <TextField
            required
            fullWidth
            multiline
            rows={3}
            label="Content Message"
            name="contentMessage"
            value={formData.contentMessage}
            onChange={handleInputChange}
            placeholder="Detailed message for the notification"
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Action URL"
              name="contentActionUrl"
              value={formData.contentActionUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/offer"
            />

            <TextField
              fullWidth
              label="Action Button Text"
              name="contentActionText"
              value={formData.contentActionText}
              onChange={handleInputChange}
              placeholder="e.g., Shop Now"
            />
          </Stack>

          {/* Zones and Schedule */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Target Zones & Schedule
          </Typography>

          <FormControl fullWidth required>
            <InputLabel>Target Zones</InputLabel>
            <Select
              multiple
              value={formData.zoneIds}
              onChange={handleZoneChange}
              input={<OutlinedInput label="Target Zones" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((zoneId) => {
                    const zone = zones.find((z) => z.id === zoneId);
                    return <Chip key={zoneId} label={zone?.name || zoneId} size="small" />;
                  })}
                </Box>
              )}
            >
              {zones.map((zone) => (
                <MenuItem key={zone.id} value={zone.id}>
                  {zone.name} ({zone.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              required
              fullWidth
              type="datetime-local"
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="datetime-local"
              label="End Date (Optional)"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          {/* Submit Button */}
          <Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};
