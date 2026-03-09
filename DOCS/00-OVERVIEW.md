# 📚 GeoEngage Admin Web Documentation

## 🎯 Project Overview

**GeoEngage Admin Web Dashboard** is a React-based web application that allows administrators to manage location-based notification campaigns. The application uses Firebase authentication for security and communicates with a backend API to manage campaigns, zones, and analytics.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│          (React Components + Material-UI)                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                         │
│              (Firebase Auth + AuthContext)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API SERVICE LAYER                          │
│         (Axios + Request/Response Interceptors)                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND REST API                          │
│              (Express.js + PostgreSQL)                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow (Layman's Terms)

**What Happens When You Log In:**

1. **You Click "Sign in with Google"** → A Google login popup appears
2. **You Select Your Google Account** → Google verifies your identity
3. **Google Sends a Token** → A special "key" (JWT token) is created
4. **Backend Checks Your Token** → The server verifies you're an admin
5. **Access Granted** → You can now manage campaigns

**Technical Flow:**
```
User → Google OAuth Popup → Firebase Auth → Token Generated → 
Backend Verifies Token → Admin Check → AuthContext Updates → 
Redirect to Campaigns Page
```

---

## 📊 Data Flow (Technical)

### Creating a Campaign

```
User Fills Form → Validation → API Request (POST /campaigns) →
Backend Creates Record → Success Response → Refresh Campaign List →
UI Updates
```

### Activating a Campaign

```
User Clicks Activate → API Request (PUT /campaigns/:id) →
Backend Updates Active Status → Deactivates Other Campaigns (same zone+trigger) →
Success Response → Refresh Campaign List → UI Shows Updated Status
```

---

## 🗂️ Project Structure

```
src/
├── main.tsx                    # Application entry point
├── App.tsx                     # Root component with routing
├── config/
│   └── firebase.ts            # Firebase configuration
├── contexts/
│   └── AuthContext.tsx        # Global authentication state
├── services/
│   ├── api.ts                 # Axios configuration + interceptors
│   ├── adminService.ts        # Admin verification API
│   ├── campaignService.ts     # Campaign CRUD operations
│   ├── zoneService.ts         # Zone management API
│   └── analyticsService.ts    # Analytics data API
├── components/
│   ├── layout/
│   │   └── AdminLayout.tsx    # Main layout with sidebar
│   ├── campaigns/
│   │   ├── CampaignList.tsx   # Campaign table display
│   │   └── CreateCampaignForm.tsx  # Campaign creation form
│   ├── routes/
│   │   └── ProtectedRoute.tsx # Auth guard for routes
│   ├── ErrorBoundary.tsx      # Error handling wrapper
│   └── OfflineBanner.tsx      # Network status indicator
├── pages/
│   ├── HomePage.tsx           # Login/Landing page
│   ├── CampaignsPage.tsx      # Campaign management page
│   ├── AnalyticsPage.tsx      # Analytics dashboard
│   └── ProfilePage.tsx        # User profile page
├── types/
│   ├── auth.types.ts          # Authentication type definitions
│   ├── campaign.types.ts      # Campaign type definitions
│   └── zone.types.ts          # Zone type definitions
└── utils/
    └── errorMessages.ts       # Error/success message helpers
```

---

## 🔄 Complete User Journey

### 1. **Logging In**
   - User visits homepage (HomePage.tsx)
   - Sees animated splash screen
   - Clicks "Sign in with Google"
   - AuthContext handles Google OAuth
   - Backend verifies admin status
   - Redirects to /campaigns

### 2. **Creating a Campaign**
   - User fills CreateCampaignForm
   - Selects zone, trigger type, writes message
   - Form validates input
   - POST request to backend
   - Backend creates campaign in database
   - Campaign list refreshes

### 3. **Activating a Campaign**
   - User clicks activate button
   - PUT request to backend
   - Backend sets active=true
   - Backend auto-deactivates conflicting campaigns
   - UI refreshes and shows green "Active" chip

### 4. **Viewing Analytics**
   - User navigates to Analytics page
   - GET request to /analytics
   - Backend calculates metrics
   - Charts display notifications sent, clicks, CTR

---

## 📡 All API Endpoints Used

| Endpoint | Method | Purpose | Request Data | Response |
|----------|--------|---------|--------------|----------|
| `/verify-admin` | GET | Verify user is admin | Auth token (header) | `{success: true}` |
| `/campaigns` | GET | Fetch all campaigns | Query params (zone_id, trigger) | Array of campaigns |
| `/campaigns` | POST | Create new campaign | `{zone_id, message, trigger, name}` | Created campaign |
| `/campaigns/:id` | PUT | Update campaign | `{active, ...}` | Updated campaign |
| `/campaigns/:id` | DELETE | Delete campaign | - | Success message |
| `/zones` | GET | Fetch all zones | Query params | Array of zones |
| `/analytics` | GET | Fetch analytics data | - | `{notifications_sent, clicks, ctr}` |

---

## 🗄️ Data Storage (What Gets Saved)

### In Backend Database:

1. **Campaigns Table**
   - `id` (unique identifier)
   - `zone_id` (which zone this applies to)
   - `name` (campaign name)
   - `message` (notification text)
   - `trigger` (ZONE_ENTRY or ZONE_EXIT)
   - `active` (true/false)
   - `created_at` (timestamp)

2. **Zones Table**
   - `id` (unique identifier)
   - `name` (zone name like "Entrance", "Electronics")
   - `type` (zone type)
   - `coordinates` (lat/long data)

3. **Analytics Table**
   - `notification_id`
   - `triggered_at` (when notification was sent)
   - `clicked_at` (when user clicked, if any)
   - `user_id`

### In Browser (Frontend):

1. **Firebase Token** → Stored by Firebase SDK
2. **User Info** → Stored in AuthContext (memory only)
3. **Campaign List** → Fetched and stored in React state

---

## 🔌 Frontend Events → Backend Actions

| User Action | Frontend Event | API Call | Backend Action | Result |
|-------------|----------------|----------|----------------|--------|
| Click "Sign In" | `login()` in AuthContext | GET `/verify-admin` | Check if user email is admin | Access granted/denied |
| Submit campaign form | Form `onSubmit` | POST `/campaigns` | Insert into campaigns table | New campaign created |
| Click Activate | `handleActivate()` | PUT `/campaigns/:id` | Set active=true, deactivate others | Campaign activated |
| Click Deactivate | `handleDeactivate()` | PUT `/campaigns/:id` | Set active=false | Campaign deactivated |
| Delete campaign | `handleDelete()` | DELETE `/campaigns/:id` | Remove from database | Campaign deleted |
| View Analytics | Page load | GET `/analytics` | Calculate metrics from database | Charts displayed |
| View Campaigns | Page load | GET `/campaigns` | Fetch all campaigns | Table populated |

---

## 🎨 Key Features

### ✅ Authentication
- Google OAuth via Firebase
- Token-based API authentication
- Auto token refresh every 55 minutes
- Admin verification on login

### 📝 Campaign Management
- Create campaigns with zones and triggers
- Activate/deactivate campaigns
- Only one active campaign per zone+trigger combo
- Real-time status updates

### 📊 Analytics Dashboard
- Total notifications triggered
- Total clicks
- Click-through rate (CTR)
- Zone performance metrics

### 🎯 Zone Targeting
- Target specific indoor zones
- Entry vs Exit triggers
- Zone selection in campaign creation

---

## 🚀 Technology Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **UI Library:** Material-UI (MUI) v7
- **State Management:** React Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Authentication:** Firebase Auth
- **Charts:** Recharts
- **Styling:** Emotion (CSS-in-JS)

---

## 📖 Documentation Files

1. **00-OVERVIEW.md** (this file) - High-level architecture
2. **01-MAIN-ENTRY-POINTS.md** - main.tsx, App.tsx explained
3. **02-AUTHENTICATION.md** - AuthContext, Firebase config
4. **03-API-SERVICES.md** - All service files explained
5. **04-COMPONENTS.md** - Component documentation
6. **05-PAGES.md** - Page components explained
7. **06-EVENT-FLOW.md** - Frontend → Backend mappings
8. **07-FLOWCHARTS.md** - Visual diagrams
9. **08-DATA-MODELS.md** - TypeScript types explained

---

## 🔍 Quick Reference

### How to Find Code for Specific Actions:

| I want to understand... | Look at... |
|------------------------|------------|
| Login flow | `AuthContext.tsx`, `firebase.ts`, `HomePage.tsx` |
| API calls | `services/*.ts` files |
| Campaign creation | `CreateCampaignForm.tsx`, `campaignService.ts` |
| Campaign list display | `CampaignList.tsx` |
| Routing & navigation | `App.tsx`, `ProtectedRoute.tsx` |
| Layout & sidebar | `AdminLayout.tsx` |
| Error handling | `ErrorBoundary.tsx`, `utils/errorMessages.ts` |

---

**Next:** Start with [01-MAIN-ENTRY-POINTS.md](./01-MAIN-ENTRY-POINTS.md) for line-by-line code explanations.
