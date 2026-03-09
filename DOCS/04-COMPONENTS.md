# 🎨 Components - Complete Explanation

## Overview
Components are reusable UI pieces. This app uses Material-UI (MUI) for styling and follows React best practices.

---

## 📄 File: `src/components/routes/ProtectedRoute.tsx`

**Purpose:** Protect routes that require authentication

### Complete Code Breakdown:

```typescript
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
```
- **Lines 1-3:** Imports
- `Navigate`: Redirect component from React Router
- `CircularProgress`: Loading spinner from MUI
- `useAuth`: Get authentication state

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```
- **Lines 5-7:** TypeScript interface
- `children`: The components to show if authenticated

```typescript
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
```
- **Lines 14-15:** Component definition
- Extract `currentUser` and `loading` from AuthContext

```typescript
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
```
- **Lines 18-26:** While checking auth status
- Show centered loading spinner
- Full viewport height (`100vh`)

```typescript
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
```
- **Lines 29-31:** If not logged in
- Redirect to homepage
- `replace` replaces history entry (back button won't go to protected page)

```typescript
  return <>{children}</>;
};
```
- **Lines 34-35:** If logged in
- Render protected content
- `<>` is React Fragment (renders children without extra DOM element)

### How It Works (Layman):

This component is a **"security guard"** for pages:

1. **First check:** "Wait, let me verify your identity" (loading spinner)
2. **Not logged in?** "Sorry, you can't enter. Go to login page" (redirect)
3. **Logged in?** "Welcome! Come on in" (show page)

### Flow Diagram:

```
User tries to access /campaigns
     ↓
ProtectedRoute checks authentication
     ↓
┌─────────────────┬────────────────┬──────────────────┐
│  Still Loading  │  Not Logged In │  Logged In       │
│  Show Spinner   │  Redirect to / │  Show Page       │
└─────────────────┴────────────────┴──────────────────┘
```

---

## 📄 File: `src/components/layout/AdminLayout.tsx`

**Purpose:** Layout with sidebar navigation for logged-in admins

### Key Sections:

#### 1. Navigation Items

```typescript
const navItems: NavItem[] = [
  { label: 'Campaigns', path: '/campaigns', icon: <CampaignIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
];
```
- **Lines 36-39:** Define sidebar menu items
- Each has label, path, and icon

#### 2. State Management

```typescript
const { currentUser, logout } = useAuth();
const navigate = useNavigate();
const location = useLocation();
const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
```
- **Lines 43-46:** Component state
- `currentUser, logout`: From AuthContext
- `navigate`: Function to change routes
- `location`: Current URL path
- `logoutDialogOpen`: Show/hide logout confirmation dialog

#### 3. Layout Structure

```typescript
<Box sx={{ display: 'flex', height: '100vh' }}>
  <Drawer>
    {/* Sidebar with navigation */}
  </Drawer>
  
  <Box component="main">
    <AppBar>
      {/* Top bar with user info */}
    </AppBar>
    <Box>
      <Outlet /> {/* Page content renders here */}
    </Box>
  </Box>
</Box>
```

**Structure visualization:**
```
┌────────────────────────────────────────────┐
│ ┌──────────┐ ┌──────────────────────────┐ │
│ │          │ │ Top Bar (User info)      │ │
│ │ Sidebar  │ ├──────────────────────────┤ │
│ │          │ │                          │ │
│ │ Nav      │ │  Page Content (Outlet)   │ │
│ │ Items    │ │                          │ │
│ │          │ │                          │ │
│ └──────────┘ └──────────────────────────┘ │
└────────────────────────────────────────────┘
```

#### 4. Sidebar Content

```typescript
<List>
  {navItems.map((item) => (
    <ListItemButton
      selected={location.pathname === item.path}
      onClick={() => handleNavigation(item.path)}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItemButton>
  ))}
</List>
```
- **Lines 134-149:** Render navigation buttons
- Highlight current page (`selected`)
- Click navigates to page

#### 5. Logout Button

```typescript
<ListItemButton onClick={handleLogoutClick}>
  <ListItemIcon><LogoutIcon /></ListItemIcon>
  <ListItemText primary="Logout" />
</ListItemButton>
```
- Shows logout icon and text
- Opens confirmation dialog when clicked

#### 6. Logout Confirmation Dialog

```typescript
<Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
  <DialogTitle>Confirm Logout</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to logout?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleLogoutCancel}>Cancel</Button>
    <Button onClick={handleLogoutConfirm}>Logout</Button>
  </DialogActions>
</Dialog>
```
- Modal dialog asking for confirmation
- Two buttons: Cancel and Logout

#### 7. Main Content Area

```typescript
<Box component="main">
  <AppBar>
    {/* Top bar with title and user info */}
  </AppBar>
  <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
    <Outlet /> {/* This is where page content appears */}
  </Box>
</Box>
```
- `<Outlet />`: React Router component
- Renders current page (CampaignsPage, AnalyticsPage, etc.)
- Like a "placeholder" that gets filled with the current route

### What This File Does (Layman):

This is the **"container"** for logged-in pages:
- Left side: Navigation sidebar
- Top: User info and page title
- Middle: Page content (changes based on URL)
- Provides consistent layout across all admin pages

---

## 📄 File: `src/components/ErrorBoundary.tsx`

**Purpose:** Catch JavaScript errors and show friendly error page instead of crashing

### How It Works:

```typescript
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error);
    // Could send to error tracking service here
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;  // Show friendly error page
    }
    return this.props.children;  // Show normal content
  }
}
```

### What This File Does (Layman):

This is a **"safety net"** for your app:
- If any component crashes (JavaScript error)
- Instead of white screen of death
- Show friendly error page with:
  - Error message
  - Reload button
  - Go Home button
  - Copy error details (for developers)

### When It Catches Errors:

- ✅ Component crashes during render
- ✅ Error in useEffect
- ✅ Error in event handler
- ❌ NOT async errors (use try/catch for those)
- ❌ NOT errors in ErrorBoundary itself

---

## 📄 File: `src/components/OfflineBanner.tsx`

**Purpose:** Detect and display network status

### How It Works:

```typescript
const [isOnline, setIsOnline] = useState(navigator.onLine);
```
- Check initial network status
- `navigator.onLine`: Browser API for network detection

```typescript
useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    setShowOnlineBanner(true);
    setTimeout(() => setShowOnlineBanner(false), 3000);
  };

  const handleOffline = () => {
    setIsOnline(false);
    setShowOfflineBanner(true);
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```
- Listen for network events
- `online` event: Connection restored
- `offline` event: Connection lost
- Cleanup listeners when component unmounts

### UI States:

**Offline:**
```
┌──────────────────────────────────────────────┐
│ ⚠️ No Internet Connection                    │
│ You're offline. Check connection.    [Retry] │
└──────────────────────────────────────────────┘
```
- Red banner at top
- Stays visible until back online
- Retry button reloads page

**Back Online:**
```
┌──────────────────────────────────────────────┐
│ ✅ Back Online                                │
│ Your connection has been restored.           │
└──────────────────────────────────────────────┘
```
- Green banner at top
- Auto-hides after 3 seconds

### What This File Does (Layman):

This is a **"connection monitor"**:
- Watches your internet connection
- Shows warning when offline
- Shows success message when back online
- Provides retry button

---

## 📄 File: `src/components/campaigns/CampaignList.tsx`

**Purpose:** Display campaigns in a table

### Key Features:

#### 1. Table Structure

```
┌─────────┬──────────┬─────────┬──────┬─────────┬─────────┐
│ Status  │ Campaign │ Trigger │ Zone │ Message │ Actions │
├─────────┼──────────┼─────────┼──────┼─────────┼─────────┤
│ Active  │ Welcome  │ Entry   │ ...  │ ...     │ [🟢][🗑] │
│ Inactive│ Goodbye  │ Exit    │ ...  │ ...     │ [🔴][🗑] │
└─────────┴──────────┴─────────┴──────┴─────────┴─────────┘
```

#### 2. Props

```typescript
interface CampaignListProps {
  campaigns: Campaign[];           // Array of campaigns to display
  loading?: boolean;              // Show skeleton loaders
  actionLoading?: number | null;  // ID of campaign being updated
  onActivate?: (id: number) => void;
  onDeactivate?: (id: number) => void;
  onDelete?: (id: number) => void;
}
```

#### 3. Status Chip

```typescript
<Chip
  label={isActive ? 'Active' : 'Inactive'}
  color={isActive ? 'success' : 'default'}
/>
```
- Green chip for active campaigns
- Gray chip for inactive campaigns

#### 4. Trigger Display

```typescript
<Chip
  icon={trigger === 'zone_entry' ? <EntryIcon /> : <ExitIcon />}
  label={trigger === 'zone_entry' ? 'Entry' : 'Exit'}
  color={trigger === 'zone_entry' ? 'primary' : 'secondary'}
/>
```
- Blue chip with → icon for entry
- Purple chip with ← icon for exit

#### 5. Action Buttons

```typescript
{isActive ? (
  <IconButton onClick={() => onDeactivate(campaign.id)}>
    <DeactivateIcon />
  </IconButton>
) : (
  <IconButton onClick={() => onActivate(campaign.id)}>
    <ActivateIcon />
  </IconButton>
)}
```
- Active campaigns: Show deactivate button
- Inactive campaigns: Show activate button
- Loading state: Show spinner instead of icon

#### 6. Loading States

**Skeleton loaders while fetching:**
```typescript
{loading ? (
  <Skeleton variant="rounded" width={70} height={24} />
) : (
  <Chip label="Active" />
)}
```
- Gray animated placeholders
- Smooth transition when data loads

**Action loading:**
```typescript
{actionLoading === campaign.id ? (
  <CircularProgress size={20} />
) : (
  <ActivateIcon />
)}
```
- Show spinner on the button being clicked
- Other buttons remain normal

### What This Component Does (Layman):

This is the **"campaign dashboard"**:
- Shows all campaigns in a table
- Color-coded status (green = active)
- Quick actions (activate, deactivate, delete)
- Loading indicators for smooth UX
- Empty state when no campaigns

---

## 📄 File: `src/components/campaigns/CreateCampaignForm.tsx`

**Purpose:** Form to create new campaigns

### Key Features:

#### 1. Form Fields

```typescript
const [campaignName, setCampaignName] = useState('');
const [selectedZone, setSelectedZone] = useState('');
const [notificationMessage, setNotificationMessage] = useState('');
const [triggerType, setTriggerType] = useState<CampaignTrigger>(CampaignTrigger.ZONE_ENTRY);
```
- Campaign name input
- Zone dropdown
- Message textarea
- Trigger type selector (Entry/Exit)

#### 2. Validation

```typescript
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 200;

const validateForm = () => {
  const newErrors: typeof errors = {};

  if (!campaignName.trim()) {
    newErrors.campaignName = 'Campaign name is required';
  } else if (campaignName.trim().length < 3) {
    newErrors.campaignName = 'Must be at least 3 characters';
  }

  if (!selectedZone) {
    newErrors.selectedZone = 'Please select a target zone';
  }

  if (!notificationMessage.trim()) {
    newErrors.notificationMessage = 'Message is required';
  } else if (notificationMessage.length < MIN_MESSAGE_LENGTH) {
    newErrors.notificationMessage = `Must be at least ${MIN_MESSAGE_LENGTH} characters`;
  } else if (notificationMessage.length > MAX_MESSAGE_LENGTH) {
    newErrors.notificationMessage = `Must not exceed ${MAX_MESSAGE_LENGTH} characters`;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```
- Campaign name: Required, min 3 characters
- Zone: Required
- Message: Required, 10-200 characters

#### 3. Loading Zones

```typescript
useEffect(() => {
  const loadZones = async () => {
    try {
      setZonesLoading(true);
      const response = await zoneService.getAllZones();
      setZones(response);
    } catch (err) {
      setError('Failed to load zones');
    } finally {
      setZonesLoading(false);
    }
  };
  loadZones();
}, []);
```
- Fetch zones when component mounts
- Show loading state in dropdown
- Handle errors gracefully

#### 4. Form Submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Mark all fields as touched
  setTouched({ campaignName: true, selectedZone: true, notificationMessage: true });

  // Validate
  if (!validateForm()) {
    setError('Please fix validation errors');
    return;
  }

  setLoading(true);

  try {
    const payload = {
      zone_id: selectedZone,
      message: notificationMessage,
      trigger: triggerType,
      name: campaignName.trim(),
    };

    await campaignService.createCampaign(payload);
    setSuccess(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      resetForm();
      onSuccess?.();
    }, 2000);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create campaign');
  } finally {
    setLoading(false);
  }
};
```

**Submission flow:**
1. Prevent default form submission
2. Mark all fields as touched (shows validation errors)
3. Validate form
4. If valid: Make API call
5. On success: Show success message, reset form
6. On error: Show error message

### Form UI:

```
┌──────────────────────────────────────────────┐
│ Create New Campaign                          │
├──────────────────────────────────────────────┤
│ Campaign Name: [________________]            │
│ Target Zone:   [Dropdown ▼]                  │
│ Trigger Type:  [Entry ▼]                     │
│ Message:       [________________            ]│
│                [________________            ]│
│                                              │
│                    [Create Campaign]         │
└──────────────────────────────────────────────┘
```

### What This Component Does (Layman):

This is the **"campaign creation wizard"**:
- Four fields to fill: name, zone, trigger, message
- Real-time validation (shows errors as you type)
- Zone dropdown populated from backend
- Submit button creates campaign
- Success message and form reset on completion
- Error handling for all failure scenarios

---

## 🎯 Component Hierarchy

```
App
├── ErrorBoundary
│   ├── ThemeProvider
│   │   ├── OfflineBanner
│   │   └── BrowserRouter
│   │       └── Routes
│   │           ├── HomePage (public)
│   │           └── ProtectedRoute (auth guard)
│   │               └── AdminLayout (sidebar)
│   │                   ├── CampaignsPage
│   │                   │   ├── CreateCampaignForm
│   │                   │   └── CampaignList
│   │                   ├── AnalyticsPage
│   │                   └── ProfilePage
```

---

## 🔄 Component Communication

### Parent → Child (Props)

```typescript
<CampaignList 
  campaigns={campaigns}
  onActivate={handleActivate}
  onDelete={handleDelete}
/>
```
- Parent passes data and callbacks
- Child displays data and calls callbacks

### Child → Parent (Callbacks)

```typescript
// In CampaignList
<button onClick={() => onActivate(campaign.id)}>
  Activate
</button>

// In CampaignsPage
const handleActivate = (id) => {
  // Handle activation
};
```
- Child triggers callback
- Parent handles logic

### Global State (Context)

```typescript
const { currentUser, login, logout } = useAuth();
```
- Any component can access auth state
- No prop drilling needed

---

**Next:** See [05-PAGES.md](./05-PAGES.md) for page components explained.
