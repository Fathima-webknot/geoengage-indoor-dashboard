import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, Typography, Paper, Stack, Alert, Button, Avatar } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import theme from './theme/theme'
import { useAuth } from '@/contexts/AuthContext'

function App() {
  const { currentUser, login, logout } = useAuth()
  const [authLoading, setAuthLoading] = useState(false)

  const handleLogin = async () => {
    setAuthLoading(true)
    try {
      await login()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    setAuthLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

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
              Indoor Location-Based Campaign Management
            </Typography>

            {/* Auth Testing Section */}
            <Paper
              variant="outlined"
              sx={{
                mt: 4,
                p: 3,
                backgroundColor: 'background.paper',
                borderColor: 'primary.main',
                borderWidth: 2,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                🔐 Authentication
              </Typography>

              {currentUser ? (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    <Typography variant="body2" fontWeight={600}>
                      User Authenticated
                    </Typography>
                  </Alert>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={currentUser.photoURL || undefined}
                      alt={currentUser.displayName || 'User'}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {currentUser.displayName || 'No name'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentUser.email || 'No email'}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    disabled={authLoading}
                    fullWidth
                  >
                    {authLoading ? 'Logging out...' : 'Sign Out'}
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      Sign in with your Google account to continue
                    </Typography>
                  </Alert>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LoginIcon />}
                    onClick={handleLogin}
                    disabled={authLoading}
                    fullWidth
                    size="large"
                  >
                    {authLoading ? 'Signing in...' : 'Sign In with Google'}
                  </Button>
                </Stack>
              )}
            </Paper>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
