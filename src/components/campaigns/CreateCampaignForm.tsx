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
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CampaignTrigger } from '@/types/campaign.types';
import { Zone } from '@/types/zone.types';
import { campaignService } from '@/services/campaignService';
import { zoneService } from '@/services/zoneService';
import { getErrorMessage } from '@/utils/errorMessages';

interface CreateCampaignFormProps {
  onSuccess?: () => void;
}

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSuccess }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoneLoadError, setIsZoneLoadError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [campaignName, setCampaignName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [triggerType, setTriggerType] = useState<CampaignTrigger>(CampaignTrigger.ZONE_ENTRY);

  // Validation states
  const [errors, setErrors] = useState<{
    campaignName?: string;
    selectedZone?: string;
    notificationMessage?: string;
  }>({});
  const [touched, setTouched] = useState<{
    campaignName?: boolean;
    selectedZone?: boolean;
    notificationMessage?: boolean;
  }>({});

  // Constants for validation
  const MIN_MESSAGE_LENGTH = 10;
  const MAX_MESSAGE_LENGTH = 200;

  const getZonesLoadErrorMessage = (err: any): string => {
    if (!navigator.onLine) {
      return 'You are offline. Reconnect to the internet and try again.';
    }

    const status = err?.response?.status;
    const message = String(err?.message || '').toLowerCase();

    if (status === 500 || status === 502 || status === 503 || status === 504) {
      return 'We could not load available zones right now because the service is temporarily unavailable. Please try again shortly.';
    }

    if (
      message.includes('enotfound')
      || message.includes('econnrefused')
      || message.includes('network error')
      || message.includes('failed to fetch')
    ) {
      return 'We could not connect to the zone service. Please check your internet or backend connection and try again.';
    }

    return 'We could not load zones right now. Please try again.';
  };

  // Load zones function (extracted so it can be called on reconnection)
  const loadZones = async (clearError = false) => {
    try {
      setZonesLoading(true);
      if (clearError) {
        setError(null);
      }
      const response = await zoneService.getAllZones();

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

      setZones(zonesData);
      setIsZoneLoadError(false);
      // Clear error if zones loaded successfully
      if (clearError && zonesData.length > 0) {
        setError(null);
      }
    } catch (err: any) {
      console.error('Failed to load zones - Full error:', err);
      console.error('Error response:', err.response);
      setIsZoneLoadError(true);
      setError(getZonesLoadErrorMessage(err));
    } finally {
      setZonesLoading(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Campaign name validation
    if (!campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    } else if (campaignName.trim().length < 3) {
      newErrors.campaignName = 'Campaign name must be at least 3 characters';
    }

    // Zone validation
    if (!selectedZone) {
      newErrors.selectedZone = 'Please select a target zone';
    }

    // Message validation
    if (!notificationMessage.trim()) {
      newErrors.notificationMessage = 'Notification message is required';
    } else if (notificationMessage.trim().length < MIN_MESSAGE_LENGTH) {
      newErrors.notificationMessage = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    } else if (notificationMessage.length > MAX_MESSAGE_LENGTH) {
      newErrors.notificationMessage = `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate on field changes
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [campaignName, selectedZone, notificationMessage]);

  // Load zones on component mount
  useEffect(() => {
    loadZones();
  }, []);

  // Reload zones when network comes back online
  useEffect(() => {
    const handleOnline = () => {
      // If there's an error and no zones loaded, retry
      if (isZoneLoadError || zones.length === 0) {
        loadZones(true);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isZoneLoadError, zones.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      campaignName: true,
      selectedZone: true,
      notificationMessage: true,
    });

    // Validate form
    if (!validateForm()) {
      setIsZoneLoadError(false);
      setError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);
    setIsZoneLoadError(false);
    setError(null);
    setSuccess(false);

    try {
      // Backend expects these exact field names
      const payload = {
        zone_id: selectedZone,
        message: notificationMessage,
        trigger: triggerType,
        name: campaignName.trim(),
      };

      await campaignService.createCampaign(payload);
      setSuccess(true);

      // Reset form after a delay to show success message
      setTimeout(() => {
        setCampaignName('');
        setSelectedZone('');
        setNotificationMessage('');
        setTriggerType(CampaignTrigger.ZONE_ENTRY);
        setTouched({});
        setErrors({});
        setSuccess(false);

        if (onSuccess) {
          onSuccess();
        }
      }, 2000); // Show success message for 2 seconds
    } catch (err: any) {
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      setError(getErrorMessage(err));
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
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => {
            setError(null);
            setIsZoneLoadError(false);
          }}
          action={isZoneLoadError ? (
            <Button color="inherit" size="small" onClick={() => loadZones(true)} disabled={zonesLoading}>
              {zonesLoading ? 'Retrying...' : 'Retry'}
            </Button>
          ) : undefined}
        >
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
          {/* Campaign Name */}
          <TextField
            required
            fullWidth
            label="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            onBlur={() => setTouched({ ...touched, campaignName: true })}
            placeholder="e.g., Summer Sale, Winback Offer"
            error={touched.campaignName && !!errors.campaignName}
            helperText={touched.campaignName && errors.campaignName}
          />

          {/* Target Zone and Trigger Type */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth required error={touched.selectedZone && !!errors.selectedZone}>
              <InputLabel>Target Zone</InputLabel>
              <Select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                onBlur={() => setTouched({ ...touched, selectedZone: true })}
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
              {touched.selectedZone && errors.selectedZone && (
                <FormHelperText>{errors.selectedZone}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Trigger Type</InputLabel>
              <Select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as CampaignTrigger)}
                label="Trigger Type"
              >
                <MenuItem value={CampaignTrigger.ZONE_ENTRY}>
                  Zone Entry
                </MenuItem>
                <MenuItem value={CampaignTrigger.ZONE_EXIT_NO_TXN}>
                  Zone Exit
                </MenuItem>
              </Select>
              <FormHelperText>
                {triggerType === CampaignTrigger.ZONE_ENTRY
                  ? 'Campaign triggers when user enters the zone'
                  : 'Campaign triggers when user exits the zone'}
              </FormHelperText>
            </FormControl>
          </Stack>

          {/* Notification Message */}
          <TextField
            required
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            label="Notification Message"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            onBlur={() => setTouched({ ...touched, notificationMessage: true })}
            placeholder="Enter the push notification text..."
            error={touched.notificationMessage && !!errors.notificationMessage}
            inputProps={{
              maxLength: MAX_MESSAGE_LENGTH,
              style: {
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
              },
            }}
            helperText={
              touched.notificationMessage && errors.notificationMessage
                ? errors.notificationMessage
                : `${notificationMessage.length}/${MAX_MESSAGE_LENGTH} characters${notificationMessage.length < MIN_MESSAGE_LENGTH ? ` (minimum ${MIN_MESSAGE_LENGTH})` : ''}`
            }
            FormHelperTextProps={{
              sx: {
                mx: 0,
                mt: 0.5,
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                display: 'block',
              }
            }}
          />

          {/* Submit Button */}
          <Box sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              disabled={loading || (Object.keys(touched).length > 0 && Object.keys(errors).length > 0)}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
