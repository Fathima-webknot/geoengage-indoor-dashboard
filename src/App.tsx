import { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, Typography, Paper, Chip, Stack, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import theme from './theme/theme'

function App() {
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'configured' | 'missing'>('loading')

  useEffect(() => {
    // Check if Firebase environment variables are configured
    const checkFirebaseConfig = () => {
      const requiredVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID',
      ]

      const allConfigured = requiredVars.every(
        (varName) => import.meta.env[varName] && import.meta.env[varName] !== 'your-api-key'
      )

      setFirebaseStatus(allConfigured ? 'configured' : 'missing')
    }

    checkFirebaseConfig()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              🎯 GeoEngage Admin Dashboard
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: 2, mb: 4 }}
            >
              Project initialized successfully! Ready for Phase 1 development.
            </Typography>

            <Stack spacing={2} sx={{ mt: 4 }}>
              <Chip
                icon={<CheckCircleIcon />}
                label="Commit 1: React + Vite + TypeScript Setup"
                color="success"
                sx={{ fontSize: '0.95rem', py: 2.5 }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label="Commit 2: Material-UI Theme Configured"
                color="primary"
                sx={{ fontSize: '0.95rem', py: 2.5 }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label="Commit 3: Firebase Authentication Configured"
                color="success"
                sx={{ fontSize: '0.95rem', py: 2.5 }}
              />
            </Stack>

            {firebaseStatus === 'missing' && (
              <Alert 
                severity="warning" 
                icon={<WarningIcon />}
                sx={{ mt: 3, textAlign: 'left' }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Firebase Not Configured
                </Typography>
                <Typography variant="body2">
                  Please create a <code>.env</code> file and add your Firebase credentials.
                  See <code>.env.example</code> and README.md for instructions.
                </Typography>
              </Alert>
            )}

            {firebaseStatus === 'configured' && (
              <Alert severity="success" sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="body2">
                  ✅ Firebase configuration detected. Authentication is ready!
                </Typography>
              </Alert>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 4, fontStyle: 'italic' }}
            >
              Phase 1 (Commits 1-4) in progress...
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
