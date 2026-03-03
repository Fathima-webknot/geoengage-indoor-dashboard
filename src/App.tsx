import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, Typography, Paper, Chip, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import theme from './theme/theme'

function App() {
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
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 4, fontStyle: 'italic' }}
            >
              Theme includes custom colors, typography, and component overrides
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
