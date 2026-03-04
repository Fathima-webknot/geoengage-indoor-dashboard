import { Component, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * ErrorBoundary Component
 * Catches React errors and displays a fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details to console
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    
    this.setState({
      errorInfo: errorInfo.componentStack || null,
    });

    // TODO: Send error to logging service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  /**
   * Reload the application
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Go back to home page
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Copy error details to clipboard
   */
  handleCopyError = () => {
    const errorText = `
Error: ${this.state.error?.message}

Stack Trace:
${this.state.error?.stack}

Component Stack:
${this.state.errorInfo}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      alert('Error details copied to clipboard!');
    }).catch(() => {
      console.error('Failed to copy error details');
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 600,
              width: '100%',
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2,
              }}
            />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry for the inconvenience. An unexpected error occurred in the application.
            </Typography>

            {/* Error Message */}
            {this.state.error && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: 'error.light',
                  border: '1px solid',
                  borderColor: 'error.main',
                  textAlign: 'left',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1, color: 'error.dark' }}
                >
                  Error Details:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'error.dark',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.message}
                </Typography>
              </Paper>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                sx={{ minWidth: 140 }}
              >
                Reload Page
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={this.handleGoHome}
                sx={{ minWidth: 140 }}
              >
                Go to Home
              </Button>
            </Stack>

            <Button
              variant="text"
              size="small"
              startIcon={<BugReportIcon />}
              onClick={this.handleCopyError}
              sx={{ mt: 1 }}
            >
              Copy Error Details
            </Button>

            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 3 }}
            >
              If this problem persists, please contact support with the error details.
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
