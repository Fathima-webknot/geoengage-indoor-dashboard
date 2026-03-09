# Pages Documentation

This document provides line-by-line explanations of all page components in the GeoEngage application.

---

## Table of Contents
1. [HomePage.tsx](#homepagetsx)
2. [CampaignsPage.tsx](#campaignspagetsx)
3. [AnalyticsPage.tsx](#analyticspagetsx)
4. [ProfilePage.tsx](#profilepagetsx)

---

## HomePage.tsx

**Purpose**: Landing page of the application with welcome message and navigation.

### Line-by-Line Analysis

```typescript
import { Box, Typography, Button } from '@mui/material';
```
- **Line 1**: Imports Material-UI components
  - `Box`: Flexbox container component
  - `Typography`: Text rendering with theme styling
  - `Button`: Interactive button component

```typescript
import { useNavigate } from 'react-router-dom';
```
- **Line 2**: React Router hook for programmatic navigation

```typescript
import { useAuth } from '@/contexts/AuthContext';
```
- **Line 3**: Custom hook to access authentication context

```typescript
const HomePage = () => {
```
- **Line 5**: React functional component definition

```typescript
  const navigate = useNavigate();
  const { currentUser } = useAuth();
```
- **Lines 6-7**: 
  - Initialize navigate function for routing
  - Extract current authenticated user from context

```typescript
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      gap: 3,
    }}>
```
- **Lines 9-17**: Main container with centered layout
  - Flexbox column layout
  - Centered both horizontally and vertically
  - Minimum height to fill viewport (minus header/footer)
  - Gap of 3 spacing units between children

```typescript
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Welcome to GeoEngage
      </Typography>
```
- **Lines 18-20**: Main heading
  - Renders as H1 semantic HTML but styled as H2 from theme
  - Bold font weight (700)
  - Bottom margin applied automatically

```typescript
      <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: 600 }}>
        Manage your location-based notification campaigns with ease
      </Typography>
```
- **Lines 21-23**: Subtitle
  - Secondary text color for visual hierarchy
  - Center-aligned
  - Max width of 600px for readability

```typescript
      {currentUser && (
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/campaigns')}
          sx={{ mt: 2, px: 5, py: 1.5, fontSize: '1.1rem' }}
        >
          Go to Campaigns
        </Button>
      )}
```
- **Lines 25-34**: Conditional "Go to Campaigns" button
  - **Line 25**: Only shows when user is authenticated
  - **Line 27**: Solid button with theme primary color
  - **Line 28**: Large size variant
  - **Line 29**: Navigate to campaigns page on click
  - **Line 30**: Custom spacing - margin top, horizontal/vertical padding

**Layman Explanation**: This is your app's home screen. When you first open the app, you see a welcome message. If you're logged in, there's a big button that takes you to the campaigns section where you can manage your notifications.

---

## CampaignsPage.tsx

**Purpose**: Main campaign management interface with list view, create form, and edit functionality.

### Imports Section

```typescript
import { useState, useEffect } from 'react';
```
- **Line 1**: React hooks for state management and side effects

```typescript
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
```
- **Lines 2-3**: UI components and icons
  - `Alert`: For error/success messages
  - `CircularProgress`: Loading spinner
  - `AddIcon`: Plus icon for "Create Campaign" button

```typescript
import { CampaignList } from '@/components/campaigns/CampaignList';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';
import { EmptyState } from '@/components/EmptyState';
```
- **Lines 4-6**: Custom components
  - Campaign list display
  - Campaign creation form
  - Empty state UI when no campaigns exist

```typescript
import { campaignService } from '@/services/campaignService';
import { Campaign } from '@/types/campaign.types';
```
- **Lines 7-8**: API service and TypeScript type definitions

### Component State

```typescript
const [campaigns, setCampaigns] = useState<Campaign[]>([]);
```
- **Line 11**: Array of all campaigns loaded from backend

```typescript
const [loading, setLoading] = useState(true);
```
- **Line 12**: Loading state - `true` during API calls

```typescript
const [error, setError] = useState<string | null>(null);
```
- **Line 13**: Error message string or null if no error

```typescript
const [openCreateForm, setOpenCreateForm] = useState(false);
```
- **Line 14**: Controls visibility of campaign creation dialog

```typescript
const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
```
- **Line 15**: Campaign being edited (null when creating new campaign)

### Load Campaigns Effect

```typescript
useEffect(() => {
  loadCampaigns();
}, []);
```
- **Lines 17-19**: Fetch campaigns when component first mounts
  - Empty dependency array `[]` means run only once on mount

```typescript
const loadCampaigns = async () => {
  setLoading(true);
  setError(null);
```
- **Lines 21-23**: Function to fetch campaigns
  - Set loading state
  - Clear previous errors

```typescript
  try {
    const data = await campaignService.getAllCampaigns();
    let campaignArray: Campaign[] = [];
    
    if (Array.isArray(data)) {
      campaignArray = data;
    } else if (data?.campaigns) {
      campaignArray = data.campaigns;
    }
```
- **Lines 25-32**: API call with response normalization
  - **Line 26**: Call backend API
  - **Lines 29-31**: Handle different response structures
    - Some APIs return array directly: `[{...}, {...}]`
    - Some wrap in object: `{ campaigns: [...] }`

```typescript
    setCampaigns(campaignArray);
  } catch (err: any) {
    console.error('Failed to load campaigns:', err);
    setError(err.response?.data?.message || 'Failed to load campaigns');
  } finally {
    setLoading(false);
  }
};
```
- **Lines 34-40**: Handle success/failure
  - **Line 34**: Update state with fetched campaigns
  - **Lines 35-37**: Catch errors, log to console, extract error message
  - **Lines 38-40**: Always set loading to false (even if error occurs)

### Campaign Update Handler

```typescript
const handleCampaignUpdate = async (campaignId: number, updates: Partial<Campaign>) => {
  try {
    await campaignService.updateCampaign(campaignId, updates);
```
- **Lines 42-44**: Function to update campaign
  - Takes campaign ID and partial updates object
  - Calls backend update API

```typescript
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, ...updates } : c))
    );
```
- **Lines 45-47**: Optimistic UI update
  - **Layman**: Update the campaign in your local list immediately
  - Find campaign by ID, merge with updates
  - Leave other campaigns unchanged

```typescript
  } catch (err: any) {
    console.error('Failed to update campaign:', err);
    throw err;
  }
};
```
- **Lines 48-52**: Error handling
  - Log error
  - Re-throw so calling component can handle it

### Campaign Delete Handler

```typescript
const handleCampaignDelete = async (campaignId: number) => {
  try {
    await campaignService.deleteCampaign(campaignId);
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
```
- **Lines 54-57**: Delete campaign
  - Call backend delete API
  - Remove from local state using filter (keeps all except deleted one)

### Create/Edit Success Handler

```typescript
const handleCreateSuccess = () => {
  setOpenCreateForm(false);
  setEditingCampaign(null);
  loadCampaigns();
};
```
- **Lines 61-65**: Called after successful create/edit
  - Close the dialog
  - Clear editing state
  - Reload campaigns from backend to get latest data

### UI Rendering

```typescript
return (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
        Campaigns
      </Typography>
```
- **Lines 69-74**: Header section
  - Flexbox with space-between for title on left, button on right
  - H1 semantic heading styled as H4

```typescript
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setEditingCampaign(null);
          setOpenCreateForm(true);
        }}
      >
        Create Campaign
      </Button>
```
- **Lines 76-85**: Create button
  - Plus icon on the left
  - Clears editing state (ensures we're creating, not editing)
  - Opens dialog

```typescript
    {error && (
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
        {error}
      </Alert>
    )}
```
- **Lines 88-92**: Error alert banner
  - Red error styling
  - Shows error message
  - Can be dismissed by clicking X

```typescript
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
```
- **Lines 94-97**: Loading spinner
  - Shows while fetching campaigns
  - Centered with vertical padding

```typescript
    ) : campaigns.length === 0 ? (
      <EmptyState
        title="No campaigns yet"
        description="Create your first campaign to start sending location-based notifications."
        actionLabel="Create Campaign"
        onAction={() => setOpenCreateForm(true)}
      />
```
- **Lines 98-104**: Empty state
  - Shows when no campaigns exist yet
  - Friendly message
  - Button to create first campaign

```typescript
    ) : (
      <CampaignList
        campaigns={campaigns}
        onUpdate={handleCampaignUpdate}
        onDelete={handleCampaignDelete}
        onEdit={(campaign) => {
          setEditingCampaign(campaign);
          setOpenCreateForm(true);
        }}
      />
    )}
```
- **Lines 105-115**: Campaign list
  - Shows when campaigns exist and loading is complete
  - Passes campaigns data and handler functions as props
  - Edit handler sets editing state and opens form

```typescript
    <CreateCampaignForm
      open={openCreateForm}
      onClose={() => {
        setOpenCreateForm(false);
        setEditingCampaign(null);
      }}
      onSuccess={handleCreateSuccess}
      editingCampaign={editingCampaign}
    />
```
- **Lines 117-125**: Create/Edit dialog
  - Always rendered, visibility controlled by `open` prop
  - Close handler clears states
  - Passes campaign object when editing (null when creating)

**Layman Explanation**: This page is your campaign control center. When you open it, it loads all your notification campaigns from the server. You can see a list of campaigns, create new ones by clicking the "Create Campaign" button, edit existing ones, or delete them. If anything goes wrong (like no internet connection), you'll see a red error message. If you have no campaigns yet, you'll see a helpful empty state screen.

---

## AnalyticsPage.tsx

**Purpose**: Dashboard showing metrics and statistics about campaigns and notifications.

### Imports & Types

```typescript
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  Skeleton,
} from '@mui/material';
```
- **Lines 1-9**: Core React and UI components
  - `Paper`: Card-like container with elevation
  - `Skeleton`: Loading placeholder animation

```typescript
import {
  Campaign as CampaignIcon,
  CheckCircle as ActiveIcon,
  Block as InactiveIcon,
  Place as ZoneIcon,
  Notifications as NotificationsIcon,
  TouchApp as ClickIcon,
  TrendingUp as CTRIcon,
} from '@mui/icons-material';
```
- **Lines 10-18**: Icons for metric cards

```typescript
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}
```
- **Lines 25-31**: TypeScript interface for metric card props
  - **title**: Label like "Total Campaigns"
  - **value**: The number or percentage to display
  - **icon**: React element (e.g., `<CampaignIcon />`)
  - **color**: Text color for the value
  - **bgColor**: Background color for icon container

### MetricCard Component

```typescript
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, bgColor }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
```
- **Lines 33-49**: Metric card with hover animation
  - **elevation={2}**: Drop shadow depth
  - **p: 3**: Padding of 24px (3 * 8px spacing unit)
  - **transition**: Smooth animation
  - **'&:hover'**: Lifts card up 4px on hover

```typescript
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h3" component="div" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
        </Box>
```
- **Lines 50-58**: Left side - title and value
  - **body2**: Small text for title
  - **h3**: Large bold text for value
  - **color prop**: Custom color passed from parent

```typescript
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
```
- **Lines 59-69**: Right side - icon container
  - Square box with rounded corners
  - Centers icon inside

### AnalyticsPage Component State

```typescript
const [loading, setLoading] = useState(true);
const [loadingTimeout, setLoadingTimeout] = useState(false);
```
- **Lines 77-78**: Loading states
  - **loading**: True while fetching data
  - **loadingTimeout**: True if loading takes >15 seconds

```typescript
const [metrics, setMetrics] = useState({
  totalCampaigns: 0,
  activeCampaigns: 0,
  inactiveCampaigns: 0,
  totalZones: 0,
});
```
- **Lines 79-84**: Campaign and zone metrics

```typescript
const [notificationMetrics, setNotificationMetrics] = useState({
  totalTriggered: 0,
  totalClicked: 0,
  ctr: 0,
});
```
- **Lines 85-89**: Notification performance metrics
  - **totalTriggered**: How many notifications were sent
  - **totalClicked**: How many users clicked notifications
  - **ctr**: Click-through rate percentage

### Load Metrics Effect

```typescript
useEffect(() => {
  const loadMetrics = async () => {
    setLoading(true);
    setLoadingTimeout(false);
    
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 15000);
```
- **Lines 91-98**: Start loading with 15-second timeout
  - If API takes >15 seconds, show warning message
  - **Layman**: Like a "this is taking longer than usual" message

```typescript
    try {
      const campaignsResponse = await campaignService.getAllCampaigns();
      let campaigns: any[] = [];
      
      if (Array.isArray(campaignsResponse)) {
        campaigns = campaignsResponse;
      } else if (campaignsResponse?.campaigns) {
        campaigns = campaignsResponse.campaigns;
      }
```
- **Lines 100-108**: Fetch campaigns with response normalization
  - Same pattern as CampaignsPage - handles different API response formats

```typescript
      const zonesResponse = await zoneService.getAllZones();
      let zones: any[] = [];
      
      if (Array.isArray(zonesResponse)) {
        zones = zonesResponse;
      } else if (zonesResponse?.zones) {
        zones = zonesResponse.zones;
      }
```
- **Lines 110-117**: Fetch zones with normalization

```typescript
      try {
        const notificationAnalytics = await analyticsService.getNotificationAnalytics();
        setNotificationMetrics({
          totalTriggered: notificationAnalytics.totalTriggered || 0,
          totalClicked: notificationAnalytics.totalClicked || 0,
          ctr: notificationAnalytics.ctr || 0,
        });
      } catch (error) {
        console.error('Failed to load notification analytics:', error);
        setNotificationMetrics({
          totalTriggered: 0,
          totalClicked: 0,
          ctr: 0,
        });
      }
```
- **Lines 119-133**: Fetch notification analytics
  - Nested try-catch for graceful degradation
  - **Layman**: If notification stats fail to load, show zeros instead of breaking the page
  - Uses `|| 0` to default to zero if values are undefined

```typescript
      const activeCampaigns = campaigns.filter(c => c.active).length;
      const inactiveCampaigns = campaigns.filter(c => !c.active).length;

      setMetrics({
        totalCampaigns: campaigns.length,
        activeCampaigns,
        inactiveCampaigns,
        totalZones: zones.length,
      });
```
- **Lines 135-143**: Calculate metrics
  - **filter()**: Creates new array with only active/inactive campaigns
  - **.length**: Counts how many items

```typescript
    } catch (error) {
      console.error('Failed to load analytics metrics:', error);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  loadMetrics();
}, []);
```
- **Lines 144-152**: Error handling and cleanup
  - **finally**: Runs whether success or error
  - Clears timeout to prevent memory leak
  - Runs once on component mount

### UI Rendering

```typescript
return (
  <Box>
    <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
      Analytics Dashboard
    </Typography>

    {loadingTimeout && loading && (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Loading taking longer than expected. Please check your connection.
      </Alert>
    )}
```
- **Lines 154-165**: Page header and timeout warning
  - **loadingTimeout && loading**: Shows only when both are true
  - Yellow warning banner

```typescript
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        {loading ? (
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
          </Paper>
        ) : (
          <MetricCard
            title="Total Campaigns"
            value={metrics.totalCampaigns}
            icon={<CampaignIcon sx={{ fontSize: 32, color: 'primary.main' }} />}
            color="primary.main"
            bgColor="background.default"
          />
        )}
      </Grid>
```
- **Lines 167-183**: First metric card - Total Campaigns
  - **Grid responsive sizing**:
    - **xs: 12**: Full width on mobile
    - **sm: 6**: Half width on tablets
    - **md: 3**: Quarter width on desktop
  - **Skeleton**: Animated loading placeholder
  - Shows actual data when loading completes

The pattern repeats for other metric cards:
- **Active Campaigns** (green checkmark icon)
- **Inactive Campaigns** (red block icon)
- **Total Zones** (location pin icon)
- **Notifications Triggered** (bell icon)
- **Notifications Clicked** (tap icon)
- **Click-Through Rate** (trending up icon with percentage)

**Layman Explanation**: This is your statistics dashboard. When you open it, it fetches numbers from your campaigns (how many you have, which are active), your zones (geographic areas), and notification performance (how many notifications were sent and clicked). Each number is displayed in a nice card with an icon. While loading, you see animated placeholder boxes. If the internet is slow and it takes too long, you'll see a warning message. The cards lift up slightly when you hover over them for a nice interactive feel.

---

## ProfilePage.tsx

**Purpose**: Display admin user profile information.

### Imports

```typescript
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
```
- **Lines 1-12**: UI components
  - **Card/CardContent**: Container for profile sections
  - **Avatar**: Circular profile picture
  - **Chip**: Small labeled badges (e.g., "Administrator", "Email Verified")
  - **Divider**: Horizontal line separator
  - **Stack**: Vertical/horizontal flex container with gap

```typescript
import {
  VerifiedUser as VerifiedIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
```
- **Lines 13-17**: Icons for profile badges and information

```typescript
import { useAuth } from '@/contexts/AuthContext';
```
- **Line 18**: Auth context hook to access current user

### Helper Functions

```typescript
const formatDate = (timestamp: string | undefined) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
```
- **Lines 26-35**: Format timestamps
  - Returns "N/A" if no timestamp
  - Formats as "January 15, 2024, 02:30 PM"
  - **toLocaleDateString()**: Built-in JavaScript date formatter

### Component Logic

```typescript
const { currentUser, firebaseUser } = useAuth();
```
- **Line 37**: Extract user objects from auth context
  - **currentUser**: Simplified user object stored in state
  - **firebaseUser**: Full Firebase user object

```typescript
if (!currentUser || !firebaseUser) {
  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Typography variant="h6" color="text.secondary">
        Loading profile...
      </Typography>
    </Box>
  );
}
```
- **Lines 39-47**: Loading state
  - Shows centered loading message if user data not yet available
  - Guards against null reference errors

### UI Rendering - Page Header

```typescript
return (
  <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
    <Typography 
      variant="h4" 
      component="h1" 
      gutterBottom 
      sx={{ 
        mb: 4, 
        fontWeight: 700,
        color: 'primary.main',
      }}
    >
      My Profile
    </Typography>
```
- **Lines 49-62**: Constrained container with header
  - **maxWidth: 1100**: Maximum 1100px wide
  - **mx: 'auto'**: Horizontal margin auto (centers the box)
  - Blue primary color for heading

### Main Profile Card

```typescript
    <Card 
      sx={{ 
        mb: 3, 
        borderRadius: 3,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
```
- **Lines 64-73**: Card with hover effect
  - Rounded corners (24px radius)
  - Lifts 2px on hover

```typescript
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size="auto">
            <Avatar
              src={currentUser?.photoURL ?? undefined}
              alt={currentUser?.displayName ?? undefined}
              sx={{ 
                width: 100, 
                height: 100, 
                border: '3px solid',
                borderColor: 'primary.main',
              }}
            >
```
- **Lines 74-86**: Avatar section
  - **size="auto"**: Grid item width determined by content
  - **src**: Profile photo URL from Google (if available)
  - 100x100px circle with blue border
  - **?? operator**: Nullish coalescing - use right side if left is null/undefined

```typescript
              {!currentUser?.photoURL && (
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                  {currentUser?.displayName?.[0] ?? currentUser?.email?.[0]?.toUpperCase() ?? 'A'}
                </Typography>
              )}
            </Avatar>
```
- **Lines 87-92**: Fallback initial
  - Shows first letter of name (or email, or 'A') if no photo
  - **[0]**: Gets first character of string
  - **toUpperCase()**: Converts to capital letter

```typescript
          <Grid size={{ xs: 12 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {currentUser?.displayName ?? 'Admin User'}
            </Typography>
```
- **Lines 94-97**: User's display name
  - Falls back to "Admin User" if no name set

```typescript
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <EmailIcon fontSize="small" color="primary" />
              <Typography variant="body1" color="text.secondary">
                {currentUser?.email ?? 'No email'}
              </Typography>
            </Stack>
```
- **Lines 98-103**: Email display
  - **Stack**: Horizontal container with 8px gap
  - Email icon + email text
  - **alignItems="center"**: Vertically center icon with text

```typescript
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {currentUser?.emailVerified && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Email Verified"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
```
- **Lines 104-113**: Email verification badge
  - Only shows if **emailVerified** is true
  - Green chip with checkmark icon

```typescript
              <Chip
                icon={<VerifiedIcon />}
                label="Administrator"
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
```
- **Lines 114-121**: Administrator badge
  - Always shows (profile page only accessible to admins)
  - Blue chip with shield icon

### Account Information Card

```typescript
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                Account Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
```
- **Lines 126-141**: Account info card
  - **xs: 12**: Full width on mobile
  - **md: 6**: Half width on desktop (two columns)
  - **height: '100%'**: Match height with adjacent card
  - Heading with horizontal divider

```typescript
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    User ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                    {currentUser?.uid ?? 'N/A'}
                  </Typography>
                </Box>
```
- **Lines 143-151**: User ID field
  - **caption**: Small uppercase label
  - **body1**: Larger value text
  - **wordBreak: 'break-all'**: Long UIDs wrap to next line

The remaining fields follow the same pattern:
- **Email Address**: User's email with overflow prevention
- **Email Status**: "Verified" or "Not Verified"
- **Account Created**: Formatted timestamp
- **Last Sign In**: Formatted timestamp

**Layman Explanation**: This is your profile page. It shows your Google profile picture (or your first initial if no picture), your name, email, and some badges showing you're an admin with a verified email. Below that are two cards side by side (on desktop) showing your account details like when you created your account and when you last logged in. Everything has a nice hover effect where cards lift up slightly when you move your mouse over them. All data comes from your Google account and Firebase authentication.

---

## Key Patterns Across All Pages

### 1. **Data Fetching Pattern**
```typescript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await service.getData();
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```
- Standard async pattern: loading → fetch → success/error → stop loading

### 2. **Conditional Rendering**
```typescript
{loading ? (
  <LoadingSpinner />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataList />
)}
```
- Three states: loading, empty, and content

### 3. **Responsive Grid Layout**
```typescript
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
```
- **xs**: Extra small (mobile) - full width
- **sm**: Small (tablet) - half width
- **md**: Medium (small desktop) - third width
- **lg**: Large (big desktop) - quarter width

### 4. **Error Handling**
```typescript
try {
  await apiCall();
} catch (err: any) {
  console.error('Error:', err);
  setError(err.response?.data?.message || 'Generic error message');
}
```
- Extract backend error message if available
- Fallback to generic message

### 5. **Optimistic Updates**
```typescript
// Update UI immediately (optimistic)
setData(prev => updateFn(prev));

// Then save to backend
try {
  await service.update(data);
} catch (err) {
  // Revert on failure
  setData(previousState);
}
```
- Makes UI feel snappier
- Revert if backend fails

---

## Frontend → Backend API Calls by Page

### HomePage
- **No API calls** - purely presentational

### CampaignsPage
- **GET /api/campaigns** - Load all campaigns
- **POST /api/campaigns** - Create new campaign
- **PUT /api/campaigns/:id** - Update campaign
- **DELETE /api/campaigns/:id** - Delete campaign

### AnalyticsPage
- **GET /api/campaigns** - Count campaigns
- **GET /api/zones** - Count zones
- **GET /api/analytics/notifications** - Get notification metrics

### ProfilePage
- **No API calls** - uses data from AuthContext (Firebase)

---

## Common User Flows

### 1. **View Campaigns**
1. Navigate to /campaigns
2. CampaignsPage loads
3. `useEffect` triggers API call to GET /api/campaigns
4. Display loading spinner
5. Receive response, display campaign list
6. Each campaign shows name, zone, status, trigger type

### 2. **Create Campaign**
1. Click "Create Campaign" button
2. Dialog opens with form
3. Select zone from dropdown (loads from GET /api/zones)
4. Enter campaign name and message
5. Choose trigger type (entry or exit)
6. Click "Create"
7. POST /api/campaigns with form data
8. On success: close dialog, reload campaigns

### 3. **Edit Campaign**
1. Click edit icon on campaign card
2. Same dialog opens, pre-filled with campaign data
3. Modify fields
4. Click "Save"
5. PUT /api/campaigns/:id with updates
6. On success: update local state, close dialog

### 4. **View Analytics**
1. Navigate to /analytics
2. AnalyticsPage loads
3. Three parallel API calls:
   - GET /api/campaigns
   - GET /api/zones
   - GET /api/analytics/notifications
4. Calculate metrics from responses
5. Display in metric cards with icons

### 5. **View Profile**
1. Navigate to /profile
2. ProfilePage loads
3. Reads currentUser from AuthContext (no API call needed)
4. Displays user info from Firebase authentication

---

## Summary

These four pages form the core user interface:

- **HomePage**: Landing page with welcome message
- **CampaignsPage**: Main functionality - CRUD operations for campaigns
- **AnalyticsPage**: Read-only dashboard showing statistics
- **ProfilePage**: User information display

All pages follow consistent patterns:
- Material-UI component library
- React hooks for state management
- Service layer for API calls
- Error handling with user feedback
- Loading states with skeletons/spinners
- Responsive designs that work on mobile, tablet, and desktop
- Hover effects and smooth transitions for polish

**Navigation Flow**: 
Home → Campaigns (create/edit/delete) → Analytics (view stats) → Profile (user info)

Protected by `ProtectedRoute` component - redirects to login if not authenticated.
