# 🚀 Quick Reference Guide

## Developer Cheat Sheet

This is your go-to reference for quickly finding code, understanding data flow, and debugging issues.

---

## 📁 File Location Quick Finder

| I need to... | Look at this file |
|--------------|-------------------|
| **Authentication** |
| Login/logout logic | `src/contexts/AuthContext.tsx` |
| Firebase config | `src/config/firebase.ts` |
| Check if user is logged in | `useAuth()` hook from AuthContext |
| **API Calls** |
| Make HTTP request | `src/services/api.ts` |
| Campaign operations | `src/services/campaignService.ts` |
| Zone operations | `src/services/zoneService.ts` |
| Analytics data | `src/services/analyticsService.ts` |
| Admin verification | `src/services/adminService.ts` |
| **Pages** |
| Login page | `src/pages/HomePage.tsx` |
| Campaigns management | `src/pages/CampaignsPage.tsx` |
| Analytics dashboard | `src/pages/AnalyticsPage.tsx` |
| User profile | `src/pages/ProfilePage.tsx` |
| **Components** |
| Campaign table | `src/components/campaigns/CampaignList.tsx` |
| Create campaign form | `src/components/campaigns/CreateCampaignForm.tsx` |
| Sidebar navigation | `src/components/layout/AdminLayout.tsx` |
| Route protection | `src/components/routes/ProtectedRoute.tsx` |
| Error handling | `src/components/ErrorBoundary.tsx` |
| Offline detection | `src/components/OfflineBanner.tsx` |
| **Types** |
| Campaign types | `src/types/campaign.types.ts` |
| Zone types | `src/types/zone.types.ts` |
| Auth types | `src/types/auth.types.ts` |
| **Configuration** |
| Routes setup | `src/App.tsx` |
| App entry point | `src/main.tsx` |
| Theme/colors | `src/theme/theme.ts` |
| Vite config | `vite.config.ts` |
| TypeScript config | `tsconfig.json` |

---

## 🔐 Authentication Snippets

### Check if user is logged in

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in</div>;
  
  return <div>Welcome, {currentUser.displayName}!</div>;
}
```

### Implement login/logout

```typescript
const { login, logout, error } = useAuth();

// Login
const handleLogin = async () => {
  try {
    await login();
    // User will be redirected automatically
  } catch (err) {
    console.error('Login failed');
  }
};

// Logout
const handleLogout = async () => {
  try {
    await logout();
    // User will be redirected to homepage
  } catch (err) {
    console.error('Logout failed');
  }
};
```

### Get current user info

```typescript
const { currentUser } = useAuth();

console.log(currentUser?.email);        // "user@example.com"
console.log(currentUser?.displayName);  // "John Doe"
console.log(currentUser?.photoURL);     // "https://..."
console.log(currentUser?.uid);          // "abc123xyz"
```

---

## 📡 API Call Snippets

### Fetch campaigns

```typescript
import { campaignService } from '@/services/campaignService';

// Get all campaigns
const campaigns = await campaignService.getAllCampaigns();

// Get campaigns filtered by zone
const campaigns = await campaignService.getAllCampaigns({ 
  zone_id: 'zone-001' 
});

// Get campaigns filtered by trigger
const campaigns = await campaignService.getAllCampaigns({ 
  trigger: CampaignTrigger.ZONE_ENTRY 
});
```

### Create campaign

```typescript
import { campaignService } from '@/services/campaignService';
import { CampaignTrigger } from '@/types/campaign.types';

const newCampaign = await campaignService.createCampaign({
  zone_id: 'zone-001',
  name: 'Welcome Campaign',
  message: 'Welcome to our store!',
  trigger: CampaignTrigger.ZONE_ENTRY
});

console.log('Created campaign:', newCampaign.id);
```

### Activate/Deactivate campaign

```typescript
// Activate (backend auto-deactivates others)
await campaignService.activateCampaign(campaignId);

// Deactivate
await campaignService.deactivateCampaign(campaignId);
```

### Delete campaign

```typescript
await campaignService.deleteCampaign(campaignId);
```

### Fetch zones

```typescript
import { zoneService } from '@/services/zoneService';

// Get all zones
const zones = await zoneService.getAllZones();

// Get zone by ID
const zone = await zoneService.getZoneById('zone-001');

// Get zone performance
const performance = await zoneService.getZonePerformance();
```

### Fetch analytics

```typescript
import { analyticsService } from '@/services/analyticsService';

const analytics = await analyticsService.getNotificationAnalytics();

console.log('Notifications sent:', analytics.totalTriggered);
console.log('Clicks:', analytics.totalClicked);
console.log('CTR:', analytics.ctr + '%');
```

---

## 🔄 State Management Snippets

### React useState

```typescript
// Simple state
const [campaigns, setCampaigns] = useState<Campaign[]>([]);

// Boolean state
const [loading, setLoading] = useState(false);

// Object state
const [filters, setFilters] = useState<CampaignFilters>({
  zone_id: undefined,
  trigger: undefined
});
```

### useEffect for data loading

```typescript
import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await campaignService.getAllCampaigns();
        setData(result);
      } catch (error) {
        console.error('Failed to load:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty array = run once on mount

  if (loading) return <div>Loading...</div>;
  return <div>Data: {data.length} items</div>;
}
```

### useNavigate for routing

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const goToCampaigns = () => {
    navigate('/campaigns');
  };

  const goBack = () => {
    navigate(-1); // Go back one page
  };

  return (
    <>
      <button onClick={goToCampaigns}>Campaigns</button>
      <button onClick={goBack}>Back</button>
    </>
  );
}
```

---

## 🎨 Common UI Patterns

### Loading state

```typescript
{loading ? (
  <CircularProgress />
) : (
  <DataDisplay data={data} />
)}
```

### Empty state

```typescript
{campaigns.length === 0 ? (
  <EmptyState
    icon={<CampaignIcon />}
    title="No campaigns yet"
    message="Create your first campaign to get started"
  />
) : (
  <CampaignList campaigns={campaigns} />
)}
```

### Error handling

```typescript
const [error, setError] = useState<string | null>(null);

try {
  await someApiCall();
} catch (err: any) {
  setError(err.message || 'Something went wrong');
}

// Display
{error && (
  <Alert severity="error" onClose={() => setError(null)}>
    {error}
  </Alert>
)}
```

### Success message

```typescript
const [success, setSuccess] = useState(false);

// After successful operation
setSuccess(true);
setTimeout(() => setSuccess(false), 3000); // Hide after 3s

// Display
{success && (
  <Alert severity="success">
    Operation completed successfully!
  </Alert>
)}
```

### Confirmation dialog

```typescript
const [dialogOpen, setDialogOpen] = useState(false);

<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to proceed?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm} color="primary">
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

---

## 🐛 Debugging Tips

### Check authentication

```typescript
// In browser console
FIREBASE_TOKEN  // Your current auth token

// In component
console.log('Current user:', useAuth().currentUser);
console.log('Is loading:', useAuth().loading);
console.log('Error:', useAuth().error);
```

### Inspect API calls

Open browser DevTools → Network tab

**Request headers:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiI...
```

**Response:**
- 200: Success
- 401: Not authenticated (token invalid)
- 403: Not authorized (not admin)
- 404: Not found
- 500: Server error

### Console logging

```typescript
// Group related logs
console.group('Campaign Activation');
console.log('Campaign ID:', id);
console.log('Current status:', campaign.active);
console.log('Zone:', campaign.zone_id);
console.groupEnd();

// Log API responses
const response = await campaignService.getAllCampaigns();
console.log('📊 Campaigns response:', response);

// Log errors
try {
  await someOperation();
} catch (error) {
  console.error('❌ Operation failed:', error);
  console.error('Error details:', error.response?.data);
}
```

### Common issues and solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "401 Unauthorized" | Token expired or invalid | Log out and log in again |
| "403 Forbidden" | User not admin | Check admin email in database |
| "Network Error" | Backend not running | Start backend server |
| Campaigns not loading | Database empty | Create campaigns in database |
| "CORS error" | Backend CORS not configured | Add CORS middleware in backend |
| Redirect loop | AuthContext issues | Check token verification logic |

---

## 📊 Backend API Endpoints Reference

### Authentication

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/verify-admin` | Verify admin status | Yes (token) |

### Campaigns

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/campaigns` | List all campaigns | Yes |
| GET | `/campaigns?zone_id=xyz` | Filter by zone | Yes |
| GET | `/campaigns?trigger=zone_entry` | Filter by trigger | Yes |
| GET | `/campaigns/:id` | Get single campaign | Yes |
| POST | `/campaigns` | Create campaign | Yes |
| PUT | `/campaigns/:id` | Update campaign | Yes |
| DELETE | `/campaigns/:id` | Delete campaign | Yes |

### Zones

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/zones` | List all zones | Yes |
| GET | `/zones/:id` | Get single zone | Yes |
| GET | `/zones/performance` | Get zone analytics | Yes |

### Analytics

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/analytics` | Get notification analytics | Yes |

---

## 🔧 Environment Variables

**.env file:**
```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const firebaseKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

---

## 🎯 Common Tasks Workflow

### Adding a new page

1. Create page component: `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
   ```typescript
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add navigation in sidebar: `src/components/layout/AdminLayout.tsx`
4. Add to protected route if needed

### Adding a new API endpoint

1. Define types in `src/types/`
2. Create service method in `src/services/`
3. Call service from component
4. Handle loading/error/success states

### Adding a new feature

1. Plan data structure (types)
2. Create service methods (API calls)
3. Create UI components
4. Add to appropriate page
5. Test with backend
6. Handle edge cases

---

## 📞 Quick Help

### Where is...?

**The login button?**
- `src/pages/HomePage.tsx` → Google Sign-In button

**The campaign table?**
- `src/components/campaigns/CampaignList.tsx`

**The campaign creation form?**
- `src/components/campaigns/CreateCampaignForm.tsx`

**The sidebar navigation?**
- `src/components/layout/AdminLayout.tsx`

**The routes?**
- `src/App.tsx` → `<Routes>` component

**The authentication logic?**
- `src/contexts/AuthContext.tsx`

**The API configuration?**
- `src/services/api.ts`

### How do I...?

**Add a new field to campaigns?**
1. Update `Campaign` interface in `src/types/campaign.types.ts`
2. Update form in `CreateCampaignForm.tsx`
3. Update backend API and database

**Change the app color scheme?**
- Edit `src/theme/theme.ts`

**Add a new admin?**
- Insert email into `admins` table in database

**Test without backend?**
- Mock the service functions to return fake data

**Deploy the app?**
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)
3. Set environment variables in hosting platform

---

## 🎓 Learning Path

### For Beginners:

1. Start with `00-OVERVIEW.md` - Understand architecture
2. Read `01-MAIN-ENTRY-POINTS.md` - See how app starts
3. Study `02-AUTHENTICATION.md` - Understand login
4. Review `07-FLOWCHARTS.md` - Visualize data flow

### For Intermediate:

1. Deep dive into `03-API-SERVICES.md` - API patterns
2. Study `04-COMPONENTS.md` - Component structure
3. Review `06-EVENT-FLOW.md` - User actions to backend
4. Explore `08-DATA-MODELS.md` - Data structures

### For Advanced:

1. Implement new features using patterns from docs
2. Optimize performance (memoization, lazy loading)
3. Add tests (Jest, React Testing Library)
4. Improve error handling and edge cases

---

## 🚀 Production Checklist

Before deploying:

- [ ] Environment variables set correctly
- [ ] Firebase project configured
- [ ] Backend API URL updated
- [ ] Admin emails added to database
- [ ] Error tracking configured (Sentry, LogRocket)
- [ ] Analytics configured (Google Analytics)
- [ ] Build tested: `npm run build`
- [ ] Production build works: `npm run preview`
- [ ] All API endpoints tested
- [ ] User permissions verified
- [ ] Security review completed

---

## 📚 Full Documentation Index

1. **[00-OVERVIEW.md](./00-OVERVIEW.md)** - Architecture overview
2. **[01-MAIN-ENTRY-POINTS.md](./01-MAIN-ENTRY-POINTS.md)** - main.tsx, App.tsx
3. **[02-AUTHENTICATION.md](./02-AUTHENTICATION.md)** - Auth system
4. **[03-API-SERVICES.md](./03-API-SERVICES.md)** - API calls
5. **[04-COMPONENTS.md](./04-COMPONENTS.md)** - UI components
6. **[06-EVENT-FLOW.md](./06-EVENT-FLOW.md)** - User actions mapping
7. **[07-FLOWCHARTS.md](./07-FLOWCHARTS.md)** - Visual diagrams
8. **[08-DATA-MODELS.md](./08-DATA-MODELS.md)** - Types and schemas
9. **[09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md)** - This file

---

**🎉 You now have complete documentation of your codebase!**

Start with the [overview](./00-OVERVIEW.md) or jump to any topic using the quick finder above.
