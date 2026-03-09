# 📊 Flowcharts - Visual Process Diagrams

## Complete System Flowcharts

This document provides visual representations of all major processes in both technical and layman terms.

---

## 1. 🔐 Authentication Flow

### Technical Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                     USER OPENS APP                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         App.tsx renders, checks AuthContext                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Is Logged In? │
                  └──────┬───────┘
                         │
           ┌─────────────┴─────────────┐
           │ NO                        │ YES
           ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Show HomePage       │    │ Navigate to          │
│  (Login Screen)      │    │ /campaigns           │
└──────────┬───────────┘    └──────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  User clicks "Sign in with Google"                           │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  Google OAuth Popup Opens                                     │
│  User selects Google account                                  │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  Firebase Authentication                                      │
│  - Verifies Google account                                    │
│  - Generates JWT token                                        │
│  - Returns user object (email, name, photo)                   │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  Frontend shows "Verifying admin status..."                   │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  API Request: GET /verify-admin                               │
│  Headers: Authorization: Bearer <firebase-token>              │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  Backend:                                                     │
│  1. Verify token with Firebase Admin SDK                      │
│  2. Extract email from token                                  │
│  3. Query: SELECT * FROM admins WHERE email = ?              │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
      ┌────────────┐
      │ Is Admin?  │
      └─────┬──────┘
            │
    ┌───────┴────────┐
    │ NO             │ YES
    ▼                ▼
┌──────────────┐  ┌──────────────────────────────────┐
│ Backend:     │  │ Backend:                         │
│ Return 403   │  │ Return { success: true, user }   │
└──────┬───────┘  └──────┬───────────────────────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────────────────────────┐
│ Frontend:    │  │ Frontend:                        │
│ Show error   │  │ Set currentUser in AuthContext   │
│ Sign out     │  │ Navigate to /campaigns           │
│ Stay on /    │  │ Show admin dashboard             │
└──────────────┘  └──────────────────────────────────┘
```

### Layman Flowchart

```
You open the website
    ↓
Website checks: "Are you already logged in?"
    ↓
┌─────────────┬──────────────┐
│ No          │ Yes          │
│ Show login  │ Go to main   │
│ page        │ dashboard    │
└─────────────┴──────────────┘
    ↓
You click "Sign in with Google"
    ↓
Google popup appears
    ↓
You select your Google account
    ↓
Google says "Yes, this is really them"
    ↓
Website checks: "Are they an admin?"
    ↓
┌──────────────┬─────────────┐
│ No           │ Yes         │
│ Show error:  │ Welcome!    │
│ "No access"  │ Show admin  │
│ Log them out │ dashboard   │
└──────────────┴─────────────┘
```

---

## 2. 📋 Campaign List Flow

### Technical Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│         User navigates to /campaigns                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  ProtectedRoute checks authentication                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │ Logged  │
                    │   in?   │
                    └────┬────┘
                         │
           ┌─────────────┴──────────────┐
           │ NO                         │ YES
           ▼                            ▼
┌──────────────────┐      ┌──────────────────────────────────┐
│  Redirect to /   │      │  Render CampaignsPage            │
└──────────────────┘      └──────┬───────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│  useEffect runs: loadCampaigns()                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Set loading = true (show skeleton loaders)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Parallel API Calls:                                         │
│  1. GET /campaigns (with token in header)                    │
│  2. GET /zones (with token in header)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (for each request):                                 │
│  1. Verify Firebase token                                    │
│  2. Check admin status                                       │
│  3. Query database                                           │
│  4. Return data                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend receives data                                      │
│  - campaigns: [{id, name, message, trigger, zone_id, ...}]  │
│  - zones: [{id, name, ...}]                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Process data:                                               │
│  1. Create zone map: {zone_id → zone_name}                  │
│  2. Enrich campaigns with zone names                         │
│  3. Sort: active first, then by trigger type                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Update state: setCampaigns(enrichedCampaigns)               │
│  Set loading = false                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  CampaignList renders table with campaigns                   │
│  - Status chip (Active/Inactive)                            │
│  - Campaign name                                             │
│  - Trigger type (Entry/Exit)                                │
│  - Zone name                                                 │
│  - Action buttons (Activate/Deactivate/Delete)              │
└─────────────────────────────────────────────────────────────┘
```

### Layman Flowchart

```
You click on "Campaigns" in sidebar
    ↓
Website checks: "Are you logged in?"
    ↓
┌─────────────┬──────────────┐
│ No          │ Yes          │
│ Send to     │ Load page    │
│ login page  │              │
└─────────────┴──────────────┘
    ↓
Page says: "Loading..." (shows gray placeholders)
    ↓
Website asks server: "Give me all campaigns and zones"
    ↓
Server checks: "Is this person an admin?"
    ↓
Server sends back:
  - List of campaigns
  - List of zones
    ↓
Website combines the data:
  - Adds zone names to campaigns
  - Sorts: active ones first
    ↓
Table appears with all your campaigns
Each row shows:
  ✅ Status (Active/Inactive)
  📝 Campaign name
  🎯 Trigger (Entry/Exit)
  📍 Zone
  💬 Message
  🔘 Action buttons
```

---

## 3. ➕ Create Campaign Flow

### Technical Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│  User fills out CreateCampaignForm                           │
│  - Campaign name                                             │
│  - Target zone (dropdown)                                    │
│  - Trigger type (Entry/Exit)                                │
│  - Notification message                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  User clicks "Create Campaign" button                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  handleSubmit() executes                                     │
│  - e.preventDefault() (prevent page reload)                  │
│  - Mark all fields as "touched"                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Validate form:                                              │
│  - Name: required, min 3 chars                              │
│  - Zone: required                                            │
│  - Message: required, 10-200 chars                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │  Valid? │
                    └────┬────┘
                         │
           ┌─────────────┴──────────────┐
           │ NO                         │ YES
           ▼                            ▼
┌──────────────────┐      ┌──────────────────────────────────┐
│  Show validation │      │  Set loading = true              │
│  errors          │      │  (disable button, show spinner)  │
│  Keep form open  │      └──────┬───────────────────────────┘
└──────────────────┘             │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Build payload:                                              │
│  {                                                           │
│    zone_id: selectedZone,                                    │
│    message: notificationMessage,                             │
│    trigger: triggerType,                                    │
│    name: campaignName                                       │
│  }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  API Request: POST /campaigns                                │
│  Headers: Authorization: Bearer <token>                      │
│  Body: payload (JSON)                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend:                                                    │
│  1. Verify token & admin                                     │
│  2. Validate payload                                         │
│  3. INSERT INTO campaigns (...) VALUES (...) RETURNING *     │
│  4. Return created campaign                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │ Success?│
                    └────┬────┘
                         │
           ┌─────────────┴──────────────┐
           │ YES                        │ NO
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│  Frontend:           │    │  Frontend:                   │
│  1. Show success     │    │  1. Show error message       │
│     message          │    │  2. Keep form open           │
│  2. Wait 2 seconds   │    │  3. Set loading = false      │
│  3. Reset form       │    └──────────────────────────────┘
│  4. Call onSuccess() │
│     (refreshes list) │
│  5. New campaign     │
│     appears in table │
└──────────────────────┘
```

### Layman Flowchart

```
You fill out the campaign form
  - Name your campaign
  - Pick a zone (e.g., "Entrance")
  - Choose trigger (Entry or Exit)
  - Write notification message
    ↓
You click "Create Campaign"
    ↓
Website checks: "Did you fill everything correctly?"
    ↓
┌──────────────────┬─────────────────┐
│ No               │ Yes             │
│ Show red         │ Show loading    │
│ error messages   │ spinner         │
│ under fields     │                 │
└──────────────────┴─────────────────┘
    ↓
Website tells server: "Create this campaign"
    ↓
Server checks:
  - Are you logged in?
  - Are you an admin?
  - Is the data valid?
    ↓
┌──────────────────┬─────────────────┐
│ Something wrong  │ All good        │
│ Show error       │ Create campaign │
└──────────────────┘ in database     │
                    └─────────────────┘
                         ↓
Website shows: "✅ Campaign created!"
    ↓
Form clears (ready for next campaign)
    ↓
Campaign list refreshes
    ↓
Your new campaign appears in the table!
```

---

## 4. ✅ Activate Campaign Flow

### Technical Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│  User clicks Activate button on a campaign                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  onClick handler: onActivate(campaign.id)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  CampaignsPage: handleActivate(id)                           │
│  - Set actionLoading = id (show spinner on button)           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  API Request: PUT /campaigns/:id                             │
│  Headers: Authorization: Bearer <token>                      │
│  Body: { "active": true }                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend Logic (IMPORTANT):                                  │
│  1. Verify token & admin                                     │
│  2. Get campaign to activate:                                │
│     SELECT * FROM campaigns WHERE id = ?                     │
│  3. Deactivate conflicting campaigns:                        │
│     UPDATE campaigns SET active = false                      │
│     WHERE zone_id = ? AND trigger = ? AND id != ?           │
│  4. Activate requested campaign:                             │
│     UPDATE campaigns SET active = true WHERE id = ?          │
│  5. Return updated campaign                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend:                                                   │
│  1. Set actionLoading = null (hide spinner)                  │
│  2. Show success snackbar: "Campaign activated"              │
│  3. Call loadCampaigns() to refresh list                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  UI Updates:                                                 │
│  - Activated campaign: green "Active" chip                   │
│  - Deactivate button appears                                 │
│  - Previously active campaign: gray "Inactive" chip          │
│  - Activate button appears                                   │
└─────────────────────────────────────────────────────────────┘
```

### Business Logic (Important!)

```
RULE: Only ONE campaign can be active per zone + trigger combo

Example Scenario:
Zone: "Entrance"
Trigger: "Entry"

Before activation:
  Campaign A: Active ✅
  Campaign B: Inactive ❌
  Campaign C: Inactive ❌

User clicks Activate on Campaign C:
  ↓
Backend automatically:
  1. Deactivates Campaign A (same zone + trigger)
  2. Activates Campaign C
  ↓
After activation:
  Campaign A: Inactive ❌
  Campaign B: Inactive ❌
  Campaign C: Active ✅

Different zone or trigger = Independent:
Zone "Entrance" + Trigger "Entry": Campaign C active
Zone "Entrance" + Trigger "Exit": Campaign D active ← OK!
Zone "Electronics" + Trigger "Entry": Campaign E active ← OK!
```

### Layman Flowchart

```
You click the green "Activate" button on a campaign
    ↓
Button shows loading spinner
    ↓
Website tells server: "Activate campaign #5"
    ↓
Server does smart things:
  1. Finds which zone and trigger this campaign uses
  2. Turns OFF any other campaign with same zone + trigger
  3. Turns ON the campaign you clicked
    ↓
Server replies: "Done! Here's what changed"
    ↓
Website refreshes the campaign list
    ↓
You see:
  ✅ Your campaign is now green (Active)
  ❌ The old active campaign is now gray (Inactive)
    ↓
Success message appears: "Campaign activated!"
```

---

## 5. 📊 Complete System Architecture

### High-Level Technical Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   React Application                     │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │            Component Layer                       │  │ │
│  │  │  [HomePage] [CampaignsPage] [AnalyticsPage]     │  │ │
│  │  └────────────────────┬─────────────────────────────┘  │ │
│  │                       │                                 │ │
│  │  ┌────────────────────▼─────────────────────────────┐  │ │
│  │  │           Context Layer (AuthContext)            │  │ │
│  │  │  - currentUser                                    │  │ │
│  │  │  - login() / logout()                            │  │ │
│  │  └────────────────────┬─────────────────────────────┘  │ │
│  │                       │                                 │ │
│  │  ┌────────────────────▼─────────────────────────────┐  │ │
│  │  │         Service Layer (API Calls)                │  │ │
│  │  │  [campaignService] [zoneService] [analytics]     │  │ │
│  │  └────────────────────┬─────────────────────────────┘  │ │
│  │                       │                                 │ │
│  │  ┌────────────────────▼─────────────────────────────┐  │ │
│  │  │         Axios Client (api.ts)                    │  │ │
│  │  │  - Request interceptor (add token)               │  │ │
│  │  │  - Response interceptor (handle errors)          │  │ │
│  │  └────────────────────┬─────────────────────────────┘  │ │
│  └───────────────────────┼──────────────────────────────────┘
└────────────────────────┼─────────────────────────────────────┘
                         │ HTTPS Requests
                         │ (with Firebase token in header)
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                     BACKEND SERVER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Express.js API                             │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Auth Middleware                                  │  │ │
│  │  │  1. Verify Firebase token                        │  │ │
│  │  │  2. Extract user email                           │  │ │
│  │  │  3. Check admin status                           │  │ │
│  │  └────────────────────┬─────────────────────────────┘  │ │
│  │                       │                                 │ │
│  │  ┌────────────────────▼─────────────────────────────┐  │ │
│  │  │  Route Handlers                                   │  │ │
│  │  │  /verify-admin                                    │  │ │
│  │  │  /campaigns (GET, POST, PUT, DELETE)             │  │ │
│  │  │  /zones (GET)                                     │  │ │
│  │  │  /analytics (GET)                                 │  │ │
│  │  └────────────────────┬─────────────────────────────┘  │ │
│  │                       │                                 │ │
│  │  ┌────────────────────▼─────────────────────────────┐  │ │
│  │  │  Business Logic                                   │  │ │
│  │  │  - CRUD operations                                │  │ │
│  │  │  - Validation                                     │  │ │
│  │  │  - Auto-deactivation logic                       │  │ │
│  │  └────────────────────┬─────────────────────────────┘  │ │
│  └───────────────────────┼──────────────────────────────────┘
└────────────────────────┼─────────────────────────────────────┘
                         │ SQL Queries
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                   PostgreSQL Database                        │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │  admins        │  │  campaigns     │  │  zones        │ │
│  │  - id          │  │  - id          │  │  - id         │ │
│  │  - email       │  │  - zone_id     │  │  - name       │ │
│  │  - created_at  │  │  - name        │  │  - type       │ │
│  └────────────────┘  │  - message     │  │  - coords     │ │
│                      │  - trigger     │  └───────────────┘ │
│  ┌────────────────┐  │  - active      │                    │
│  │  analytics     │  │  - created_at  │                    │
│  │  - id          │  └────────────────┘                    │
│  │  - triggered   │                                         │
│  │  - clicked     │                                         │
│  └────────────────┘                                         │
└─────────────────────────────────────────────────────────────┘
```

### Layman System Diagram

```
┌───────────────────────────────────────────┐
│         YOU (using web browser)           │
│  See pages, click buttons, fill forms     │
└──────────────────┬────────────────────────┘
                   │
                   │ "Create campaign"
                   │ "Show analytics"
                   ▼
┌───────────────────────────────────────────┐
│      FRONTEND (React Website)             │
│  - Login page                             │
│  - Campaign manager                       │
│  - Analytics dashboard                    │
└──────────────────┬────────────────────────┘
                   │
                   │ Internet (HTTPS)
                   │ "Hi server, I'm user@email.com"
                   ▼
┌───────────────────────────────────────────┐
│      BACKEND (Server Computer)            │
│  - Checks: "Are you really you? Admin?"   │
│  - Processes: "Create campaign"           │
│  - Responds: "Here's your data"           │
└──────────────────┬────────────────────────┘
                   │
                   │ Read/Write
                   ▼
┌───────────────────────────────────────────┐
│      DATABASE (Data Storage)              │
│  - Admin emails                           │
│  - All campaigns                          │
│  - All zones                              │
│  - Analytics data                         │
└───────────────────────────────────────────┘
```

---

## 6. 🔄 Complete User Journey Map

```
┌────────────────────────────────────────────────────────────────┐
│                    TYPICAL USER SESSION                        │
└────────────────────────────────────────────────────────────────┘

STEP 1: LOGIN
  Browser ──────> Website (/)
                     │
                     ▼
              Show login page
                     │
  User clicks "Sign in with Google"
                     │
                     ▼
              Google popup
                     │
  User selects account
                     │
                     ▼
              Firebase verifies
                     │
                     ▼
  API: Verify admin ───────> Backend checks ───────> Database
                                   │                      │
                     ◄───────────────────────────────────
                     │
                     ▼
              Redirect to /campaigns

STEP 2: VIEW CAMPAIGNS
  Browser ──────> Website (/campaigns)
                     │
                     ▼
              Check: logged in? ✅
                     │
                     ▼
  API: Get campaigns ────────> Backend ────────> Database
  API: Get zones ─────────────> Backend ────────> Database
                     │
                     ◄────
                     │
                     ▼
              Display campaign table

STEP 3: CREATE CAMPAIGN
  User fills form
  User clicks "Create"
                     │
                     ▼
              Validate form ✅
                     │
  API: Create campaign ───────> Backend ────────> Database
                                          INSERT
                     │
                     ◄────
                     │
                     ▼
              Show success message
              Clear form
              Refresh campaign list

STEP 4: ACTIVATE CAMPAIGN
  User clicks Activate button
                     │
  API: Update campaign ───────> Backend ────────> Database
                                       UPDATE active=true
                                       DEACTIVATE others
                     │
                     ◄────
                     │
                     ▼
              Show success
              Refresh list
              See green "Active" chip

STEP 5: VIEW ANALYTICS
  User clicks Analytics
                     │
  Browser ──────> Website (/analytics)
                     │
  API: Get analytics ─────────> Backend ────────> Database
                                         Calculate metrics
                     │
                     ◄────
                     │
                     ▼
              Display charts and numbers

STEP 6: LOGOUT
  User clicks Logout
  Confirms in dialog
                     │
                     ▼
              Firebase signOut
              Clear user state
                     │
                     ▼
              Redirect to /
              Show login page
```

---

**Next:** See [07-DATA-MODELS.md](./07-DATA-MODELS.md) for database and type definitions.
