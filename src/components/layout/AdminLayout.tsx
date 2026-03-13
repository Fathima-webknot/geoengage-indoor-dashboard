import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import GELogo from '@/components/common/GELogo';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const navItems: NavItem[] = [
  { label: 'Campaigns', path: '/campaigns', icon: <CampaignIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
];

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const profileInitial = currentUser?.email?.trim().charAt(0).toUpperCase() || 'U';

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setLogoutDialogOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Particle positions for background animation
  const particlePositions = [
    { left: '10%', top: '20%', size: 10 },
    { left: '85%', top: '15%', size: 12 },
    { left: '25%', top: '70%', size: 9 },
    { left: '70%', top: '60%', size: 11 },
    { left: '50%', top: '85%', size: 10 },
    { left: '15%', top: '45%', size: 12 },
    { left: '92%', top: '40%', size: 9 },
    { left: '40%', top: '30%', size: 11 },
    { left: '60%', top: '10%', size: 10 },
    { left: '35%', top: '90%', size: 12 },
    { left: '78%', top: '80%', size: 9 },
    { left: '5%', top: '65%', size: 11 },
    { left: '48%', top: '22%', size: 10 },
    { left: '82%', top: '52%', size: 12 },
    { left: '22%', top: '38%', size: 9 },
    { left: '65%', top: '78%', size: 11 },
    { left: '12%', top: '8%', size: 10 },
    { left: '55%', top: '68%', size: 12 },
    { left: '88%', top: '28%', size: 9 },
    { left: '32%', top: '58%', size: 11 },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#1e293b',
            borderRight: '1px solid #334155',
            // Hide scrollbar
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Edge
            },
          },
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GELogo 
            size={45} 
            animated={true} 
            showText={false} 
            gradientStart="#3b82f6" 
            gradientEnd="#8b5cf6"
          />
        </Box>

        {/* Navigation Items */}
        <List sx={{ flexGrow: 1, pt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#334155',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'white' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <List sx={{ pb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogoutClick}
              sx={{
                mx: 2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#334155',
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 15% 25%, rgba(139, 92, 246, 0.06) 0%, transparent 40%),
              radial-gradient(circle at 85% 75%, rgba(6, 182, 212, 0.06) 0%, transparent 40%)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        {/* Floating particles */}
        <style>
          {`
            @keyframes particleFloat {
              0%, 100% { transform: translateY(0); opacity: 0; }
              50% { transform: translateY(-40px); opacity: 0.4; }
            }
            
            .bg-particle {
              position: absolute;
              background-color: #06B6D4;
              border-radius: 50%;
              opacity: 0;
              z-index: 0;
              pointer-events: none;
            }
          `}
        </style>
        {particlePositions.map((pos, index) => (
          <div
            key={index}
            className="bg-particle"
            style={{
              left: pos.left,
              top: pos.top,
              width: `${pos.size}px`,
              height: `${pos.size}px`,
              animation: `particleFloat 4s ease-in-out infinite ${index * 0.3}s`,
            }}
          />
        ))}
        {/* Top AppBar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: '#1e293b',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Toolbar 
            sx={{ 
              justifyContent: 'flex-end',
              minHeight: '64px !important',
              height: '64px',
            }}
          >
            <Box 
              onClick={() => handleNavigation('/profile')}
              sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer',
                px: 2,
                py: 1.5,
                borderRadius: 2,
                height: 'fit-content',
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {currentUser?.displayName || currentUser?.email}
              </Typography>
              <Avatar
                src={currentUser?.photoURL ?? undefined}
                alt={currentUser?.displayName || 'Profile'}
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: '1rem',
                  fontWeight: 700,
                  bgcolor: '#2196f3',
                  color: '#ffffff',
                }}
              >
                {profileInitial}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            position: 'relative',
            zIndex: 1,
            // Hide scrollbar
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Edge
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Sign Out
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to sign out? You'll need to sign in again to access the admin dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            sx={{ borderRadius: 1 }}
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
