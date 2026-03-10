import { useState, useEffect } from 'react';
import { Snackbar, Alert, AlertTitle, Button } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

/**
 * OfflineBanner Component
 * Detects network status and displays a banner when offline
 */
const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);

  useEffect(() => {
    /**
     * Handle online event
     */
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      setShowOnlineBanner(true);

      // Auto-hide "Back Online" banner after 3 seconds
      setTimeout(() => {
        setShowOnlineBanner(false);
      }, 3000);
    };

    /**
     * Handle offline event
     */
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      setShowOnlineBanner(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    if (!navigator.onLine) {
      setShowOfflineBanner(true);
    }

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Handle retry button click
   */
  const handleRetry = () => {
    if (isOnline) {
      window.location.reload();
    } else {
      alert('Still offline. Please check your internet connection and try again.');
    }
  };

  return (
    <>
      {/* Offline Banner */}
      <Snackbar
        open={showOfflineBanner}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 16, sm: 24 } }}
      >
        <Alert
          severity="error"
          icon={<WifiOffIcon />}
          sx={{
            width: '100%',
            boxShadow: 3,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetry}
              sx={{ fontWeight: 600 }}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle sx={{ fontWeight: 700 }}>No Internet Connection</AlertTitle>
          You're offline. Please check your internet connection and try again.
        </Alert>
      </Snackbar>

      {/* Back Online Banner */}
      <Snackbar
        open={showOnlineBanner}
        autoHideDuration={3000}
        onClose={() => setShowOnlineBanner(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 16, sm: 24 } }}
      >
        <Alert
          severity="success"
          icon={<WifiIcon />}
          onClose={() => setShowOnlineBanner(false)}
          sx={{
            width: '100%',
            boxShadow: 3,
          }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>Back Online</AlertTitle>
          Your internet connection has been restored.
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineBanner;
