# 🔄 Event Flow - Frontend to Backend Mapping

## Complete Event-to-Action Mapping

This document maps every user action to the frontend events and backend API calls.

---

## 1. 🔐 Login Flow

### User Action: Click "Sign in with Google"

**Frontend Events:**
```typescript
Component: HomePage
Handler: handleLogin()
Location: src/pages/HomePage.tsx
```

**Code Path:**
```typescript
onClick={() => handleLogin()}
  ↓
await login()  // From AuthContext
  ↓
signInWithPopup(auth, googleProvider)  // Firebase popup
  ↓
User selects Google account
  ↓
Firebase returns user + token
  ↓
await verifyAdmin(user)
```

**Backend API Call:**
```
GET /verify-admin
Headers: {
  Authorization: Bearer <firebase-token>
}
```

**Backend Actions:**
1. Extract token from header
2. Verify token with Firebase Admin SDK
3. Extract email from token
4. Query database: `SELECT * FROM admins WHERE email = ?`
5. Return success or error

**Frontend Response Handling:**
```typescript
if (isAdmin) {
  setCurrentUser(user)
  navigate('/campaigns')  // Redirect to campaigns
} else {
  setError('Access denied')
  await signOut()  // Log out
}
```

**Data Stored:**
- Frontend: User object in AuthContext state
- Backend: Nothing (just verification)
- Firebase: Auth session (in browser)

---

## 2. 📋 View Campaigns

### User Action: Navigate to /campaigns or page loads

**Frontend Events:**
```typescript
Component: CampaignsPage
Hook: useEffect(() => { loadCampaigns() }, [])
Location: src/pages/CampaignsPage.tsx
```

**Code Path:**
```typescript
useEffect(() => {
  loadCampaigns()
}, [])
  ↓
const loadCampaigns = async () => {
  const campaigns = await campaignService.getAllCampaigns()
  const zones = await zoneService.getAllZones()
  // Merge and set state
}
```

**Backend API Calls:**
```
1. GET /campaigns
   Headers: { Authorization: Bearer <token> }

2. GET /zones
   Headers: { Authorization: Bearer <token> }
```

**Backend Actions (for /campaigns):**
1. Verify token
2. Check if user is admin
3. Query database:
   ```sql
   SELECT * FROM campaigns 
   ORDER BY active DESC, trigger ASC
   ```
4. Return JSON array of campaigns

**Backend Actions (for /zones):**
1. Verify token
2. Check if user is admin
3. Query database:
   ```sql
   SELECT * FROM zones
   ```
4. Return JSON array of zones

**Frontend Response Handling:**
```typescript
const campaigns = await campaignService.getAllCampaigns()
const zones = await zoneService.getAllZones()

// Create zone lookup map
const zoneMap = new Map()
zones.forEach(zone => zoneMap.set(zone.id, zone.name))

// Enrich campaigns with zone names
const enriched = campaigns.map(campaign => ({
  ...campaign,
  zone_name: zoneMap.get(campaign.zone_id)
}))

setCampaigns(enriched)
```

**Data Stored:**
- Frontend: Campaigns array in React state
- Backend: Nothing changes
- Display: CampaignList component renders table

---

## 3. ➕ Create Campaign

### User Action: Fill form and click "Create Campaign"

**Frontend Events:**
```typescript
Component: CreateCampaignForm
Handler: handleSubmit(e)
Location: src/components/campaigns/CreateCampaignForm.tsx
```

**Code Path:**
```typescript
onSubmit={handleSubmit}
  ↓
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Validate
  if (!validateForm()) return
  
  // Build payload
  const payload = {
    zone_id: selectedZone,
    message: notificationMessage,
    trigger: triggerType,
    name: campaignName
  }
  
  // API call
  await campaignService.createCampaign(payload)
  
  // Success
  setSuccess(true)
  onSuccess()  // Refreshes campaign list
}
```

**Backend API Call:**
```
POST /campaigns
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
Body: {
  "zone_id": "zone-123",
  "message": "Welcome to our store!",
  "trigger": "zone_entry",
  "name": "Welcome Campaign"
}
```

**Backend Actions:**
1. Verify token and admin status
2. Validate request body:
   - zone_id exists
   - message is 10-200 characters
   - trigger is 'zone_entry' or 'zone_exit'
   - name is provided
3. Insert into database:
   ```sql
   INSERT INTO campaigns (zone_id, message, trigger, name, active, created_at)
   VALUES (?, ?, ?, ?, false, NOW())
   RETURNING *
   ```
4. Return created campaign object

**Frontend Response Handling:**
```typescript
if (success) {
  setSuccess(true)
  // Show success message for 2 seconds
  setTimeout(() => {
    resetForm()
    onSuccess()  // Calls loadCampaigns() in parent
  }, 2000)
}

if (error) {
  setError(err.response?.data?.message || 'Failed to create')
}
```

**Data Stored:**
- Frontend: Success/error state temporarily
- Backend: New row in campaigns table
- Database: Campaign persisted permanently

**UI Updates:**
1. Success message appears
2. Form resets after 2 seconds
3. Campaign list refreshes (new campaign appears)

---

## 4. ✅ Activate Campaign

### User Action: Click activate button (green power icon)

**Frontend Events:**
```typescript
Component: CampaignList
Handler: onClick={() => onActivate(campaign.id)}
↓
Component: CampaignsPage
Handler: handleActivate(id)
```

**Code Path:**
```typescript
// In CampaignList
<IconButton onClick={() => onActivate(campaign.id)}>
  <ActivateIcon />
</IconButton>

// In CampaignsPage
const handleActivate = async (id) => {
  setActionLoading(id)  // Show spinner on this button
  
  try {
    await campaignService.activateCampaign(id)
    setSnackbar({ open: true, message: 'Campaign activated', severity: 'success' })
    await loadCampaigns()  // Refresh list
  } catch (err) {
    setSnackbar({ open: true, message: 'Failed to activate', severity: 'error' })
  } finally {
    setActionLoading(null)  // Hide spinner
  }
}
```

**Backend API Call:**
```
PUT /campaigns/:id
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
Body: {
  "active": true
}
```

**Backend Actions:**
1. Verify token and admin status
2. Get campaign to activate:
   ```sql
   SELECT * FROM campaigns WHERE id = ?
   ```
3. **Deactivate other campaigns** with same zone_id + trigger:
   ```sql
   UPDATE campaigns 
   SET active = false 
   WHERE zone_id = ? 
   AND trigger = ? 
   AND id != ?
   ```
4. Activate requested campaign:
   ```sql
   UPDATE campaigns 
   SET active = true 
   WHERE id = ?
   RETURNING *
   ```
5. Return updated campaign

**Frontend Response Handling:**
```typescript
// Show success snackbar
setSnackbar({
  open: true,
  message: 'Campaign activated successfully',
  severity: 'success'
})

// Refresh campaign list
await loadCampaigns()
// Table updates: new campaign shows green "Active" chip
// Previously active campaign for same zone+trigger shows gray "Inactive"
```

**Data Stored:**
- Frontend: Refreshed campaigns state
- Backend: Updated active status in campaigns table
- UI: Green chip for activated, gray for deactivated

**Important Business Logic:**
Only one campaign can be active per zone+trigger combination. When activating, backend automatically deactivates others.

Example:
- Zone: Entrance
- Trigger: Entry
- Active campaigns before: Campaign A
- User activates Campaign B
- Backend deactivates Campaign A
- Backend activates Campaign B
- Result: Only Campaign B is active

---

## 5. 🔴 Deactivate Campaign

### User Action: Click deactivate button (red block icon)

**Frontend Events:**
```typescript
Component: CampaignList
Handler: onClick={() => onDeactivate(campaign.id)}
↓
Component: CampaignsPage
Handler: handleDeactivate(id)
```

**Code Path:**
```typescript
const handleDeactivate = async (id) => {
  setActionLoading(id)
  
  try {
    await campaignService.deactivateCampaign(id)
    setSnackbar({ open: true, message: 'Campaign deactivated', severity: 'success' })
    await loadCampaigns()
  } catch (err) {
    setSnackbar({ open: true, message: 'Failed', severity: 'error' })
  } finally {
    setActionLoading(null)
  }
}
```

**Backend API Call:**
```
PUT /campaigns/:id
Body: { "active": false }
```

**Backend Actions:**
1. Verify token and admin
2. Update database:
   ```sql
   UPDATE campaigns SET active = false WHERE id = ?
   ```
3. Return updated campaign

**Data Stored:**
- Backend: active = false in database
- Frontend: Refreshed state
- UI: Gray "Inactive" chip

---

## 6. 🗑️ Delete Campaign

### User Action: Click delete button, confirm in dialog

**Frontend Events:**
```typescript
// Step 1: Click delete
onClick={() => handleDeleteClick(campaign.id)}
  ↓
Opens confirmation dialog

// Step 2: Click "Delete" in dialog
onClick={handleDeleteConfirm}
  ↓
const handleDeleteConfirm = async () => {
  await campaignService.deleteCampaign(deleteDialog.campaignId)
  await loadCampaigns()
}
```

**Backend API Call:**
```
DELETE /campaigns/:id
```

**Backend Actions:**
1. Verify token and admin
2. Delete from database:
   ```sql
   DELETE FROM campaigns WHERE id = ?
   ```
3. Return success

**Data Stored:**
- Backend: Row removed from campaigns table
- Frontend: Campaign removed from state
- UI: Row disappears from table

---

## 7. 📊 View Analytics

### User Action: Navigate to /analytics

**Frontend Events:**
```typescript
Component: AnalyticsPage
Hook: useEffect(() => { loadAnalytics() }, [])
```

**Backend API Call:**
```
GET /analytics
```

**Backend Actions:**
1. Verify token and admin
2. Query analytics:
   ```sql
   SELECT 
     COUNT(*) as notifications_sent,
     COUNT(CASE WHEN clicked = true THEN 1 END) as clicks,
     (COUNT(CASE WHEN clicked = true THEN 1 END) * 100.0 / COUNT(*)) as ctr
   FROM notification_logs
   ```
3. Return analytics object

**Frontend Response Handling:**
```typescript
const { totalTriggered, totalClicked, ctr } = await analyticsService.getNotificationAnalytics()

setAnalytics({
  triggered: totalTriggered,
  clicked: totalClicked,
  ctr: ctr
})

// Display in cards and charts
```

**Data Stored:**
- Frontend: Analytics in state
- Display: Cards show metrics, charts render

---

## 8. 🚪 Logout

### User Action: Click logout in sidebar, confirm in dialog

**Frontend Events:**
```typescript
Handler: handleLogoutConfirm()
  ↓
await logout()  // From AuthContext
  ↓
await signOut(auth)  // Firebase
  ↓
navigate('/')
```

**Backend API Call:**
None (logout is client-side)

**Frontend Actions:**
1. Call Firebase signOut()
2. Clear AuthContext state (currentUser = null)
3. Navigate to homepage
4. ProtectedRoute redirects any protected routes

**Data Cleared:**
- Frontend: User state cleared
- Firebase: Auth session cleared
- Browser: No data persisted

---

## 🎯 Summary Table: All User Actions

| User Action | Frontend Handler | Backend Endpoint | Backend Action | Data Changed |
|-------------|-----------------|------------------|----------------|--------------|
| Login with Google | `login()` in AuthContext | `GET /verify-admin` | Verify token, check admin | None (verification only) |
| View Campaigns | `loadCampaigns()` | `GET /campaigns`, `GET /zones` | Fetch from database | None (read only) |
| Create Campaign | `handleSubmit()` in form | `POST /campaigns` | Insert into campaigns table | New campaign row |
| Activate Campaign | `handleActivate()` | `PUT /campaigns/:id` | Update active=true, deactivate others | Multiple campaign rows |
| Deactivate Campaign | `handleDeactivate()` | `PUT /campaigns/:id` | Update active=false | One campaign row |
| Delete Campaign | `handleDeleteConfirm()` | `DELETE /campaigns/:id` | Delete from campaigns table | Campaign deleted |
| View Analytics | `loadAnalytics()` | `GET /analytics` | Calculate metrics | None (read only) |
| Logout | `logout()` in AuthContext | None | N/A | Frontend state cleared |

---

## 🔄 Data Synchronization

### When Data Updates:

1. **User creates campaign**
   - API call creates database row
   - Frontend refreshes campaign list
   - New campaign appears in table

2. **User activates campaign**
   - API updates database (activates one, deactivates others)
   - Frontend refreshes campaign list
   - Table shows updated active/inactive status

3. **User deletes campaign**
   - API deletes database row
   - Frontend refreshes campaign list
   - Campaign row disappears

### Optimistic vs Server Updates:

This app uses **server-first approach:**
- Wait for backend confirmation
- Then refresh data from server
- Always show server truth

Alternative (not used): **Optimistic updates**
- Update UI immediately
- Make API call in background
- Revert if API call fails

---

**Next:** See [06-FLOWCHARTS.md](./06-FLOWCHARTS.md) for visual diagrams.
