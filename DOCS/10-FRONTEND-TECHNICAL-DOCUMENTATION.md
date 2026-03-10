# GeoEngage Admin Web Frontend Technical Documentation

Version: 1.0  
Last Updated: 2026-03-10  
Application: GeoEngage Admin Web (Frontend)

## 1. Purpose and Scope

This document is the consolidated technical specification for the GeoEngage Admin frontend application. It is intended for:

- Frontend engineers
- Backend engineers integrating with the web client
- QA engineers
- DevOps and release engineers
- Product and technical stakeholders

It covers architecture, module responsibilities, data flow, API integration, authentication, configuration, deployment, and troubleshooting for the production-ready frontend currently in the repository.

## 2. System Overview

GeoEngage Admin Web is a React + TypeScript single-page application used by admin users to:

- Authenticate through Firebase Google Sign-In
- Access protected admin routes
- Create, list, activate, deactivate, and delete campaigns
- View campaign and notification analytics
- View profile and account metadata

The app is structured into feature pages and reusable service/component layers, with clear separation of concerns between UI rendering, route protection, and API access.

## 3. Technology Stack

- Runtime: Node.js 18+
- Framework: React 18
- Language: TypeScript 5
- Bundler/Dev Server: Vite 5
- Routing: react-router-dom 6
- UI: MUI 7 + Emotion
- Charts: Recharts
- HTTP: Axios
- Authentication: Firebase Auth (Google Provider)
- Linting: ESLint + TypeScript ESLint

## 4. Repository Structure

Top-level frontend structure:

- `src/main.tsx`: App bootstrap and provider wiring
- `src/App.tsx`: Routing and shell composition
- `src/contexts/AuthContext.tsx`: Authentication lifecycle and role verification
- `src/components/layout/AdminLayout.tsx`: Protected layout shell
- `src/components/routes/ProtectedRoute.tsx`: Auth gate for protected pages
- `src/pages/HomePage.tsx`: Login entry
- `src/pages/CampaignsPage.tsx`: Campaign management
- `src/pages/AnalyticsPage.tsx`: Analytics dashboard
- `src/pages/ProfilePage.tsx`: User profile
- `src/services/*.ts`: API integration layer
- `src/types/*.ts`: Domain contracts and DTO types
- `src/utils/errorMessages.ts`: Error normalization and user-facing messaging
- `src/theme/theme.ts`: MUI theme definition
- `src/config/firebase.ts`: Firebase initialization

## 5. Application Boot Sequence

1. `main.tsx` mounts the React root.
2. `AuthProvider` wraps the app and starts auth state monitoring.
3. `App.tsx` applies:
   - `ErrorBoundary`
   - MUI `ThemeProvider`
   - `CssBaseline`
   - `OfflineBanner`
   - `BrowserRouter`
4. Routes are resolved:
   - Public route: `/`
   - Protected routes under `ProtectedRoute` + `AdminLayout`:
     - `/campaigns`
     - `/analytics`
     - `/profile`
5. If auth state is pending, `ProtectedRoute` shows a centered spinner.
6. If not authenticated, protected navigation redirects to `/`.

## 6. Authentication and Authorization

### 6.1 Identity Provider

Firebase Auth with Google popup login is used for identity.

### 6.2 Access Control Model

Authentication alone is not sufficient. Each session must also pass backend admin verification via:

- `GET /verify-admin`

Only verified admin users can access protected pages.

### 6.3 AuthContext Responsibilities

`AuthContext.tsx` manages:

- `currentUser` (frontend user profile)
- `firebaseUser` (raw Firebase object)
- `loading` and `verifying` states
- Login timeout handling (30s)
- Abort controller for in-flight verification cancellation
- Token refresh every 55 minutes
- Error reporting through local state and snackbars/alerts in consuming UI

### 6.4 Login Flow

1. User initiates Google login on Home page.
2. Firebase popup completes identity challenge.
3. Frontend calls `adminService.verifyAdmin()`.
4. If verified:
   - User is allowed into protected routes.
5. If non-admin:
   - User is signed out and denied access.
6. If backend unavailable (404 or network/no response):
   - Session behavior degrades gracefully with backend-down alert handling.

## 7. Routing and Navigation

### 7.1 Route Map

- `/` -> HomePage (public)
- `/campaigns` -> CampaignsPage (protected)
- `/analytics` -> AnalyticsPage (protected)
- `/profile` -> ProfilePage (protected)
- `*` -> Redirect to `/`

### 7.2 Layout Behavior

`AdminLayout` provides:

- Left permanent drawer with nav entries:
  - Campaigns
  - Analytics
- Top app bar with profile quick access
- Logout confirmation dialog
- Outlet render area for nested page content

## 8. API Integration Architecture

### 8.1 Axios Client

`src/services/api.ts` creates a shared Axios instance with:

- Base URL from `VITE_API_BASE_URL` (fallback to `http://localhost:3000/api/v1`)
- Default timeout: 30 seconds
- JSON headers
- Request interceptor: inject Firebase ID token in `Authorization: Bearer <token>`
- Response interceptor: centralized logging by HTTP class/status

### 8.2 Service Modules

- `campaignService.ts`
  - `getAllCampaigns(filters?)`
  - `getCampaignById(id)`
  - `createCampaign(payload)`
  - `updateCampaign(id, payload)`
  - `activateCampaign(id)`
  - `deactivateCampaign(id)`
  - `deleteCampaign(id)`

- `zoneService.ts`
  - `getAllZones(filters?)`
  - `getZoneById(id)`
  - `createZone(payload)`
  - `updateZone(id, payload)`
  - `activateZone(id)`
  - `deactivateZone(id)`
  - `getZonePerformance()`
  - `getZonesByCampaign(campaignId)`

- `analyticsService.ts`
  - `getNotificationAnalytics()`
  - maps snake_case backend response to camelCase UI metrics

- `adminService.ts`
  - `verifyAdmin()`

### 8.3 API Contract Expectations

Current frontend expects backend endpoints under `/api/v1`:

- `GET /verify-admin`
- `GET /campaigns`
- `POST /campaigns`
- `PUT /campaigns/{id}`
- `DELETE /campaigns/{id}`
- `GET /zones`
- `GET /analytics`

## 9. Data Models

### 9.1 Campaign

Core fields (`campaign.types.ts`):

- `id: number`
- `zone_id: string`
- `message: string`
- `name?: string | null`
- `active: boolean`
- `trigger: zone_entry | zone_exit_no_txn`
- `created_at: string`
- `zone_name?: string` (frontend-enriched field)

### 9.2 Zone

Core fields (`zone.types.ts`):

- `id: string`
- `name: string`
- `type: ZoneType`
- `floorLevel: number`
- `coordinates: { latitude, longitude }`
- `radius: number`
- `isActive: boolean`
- `createdAt: string`
- `updatedAt: string`

### 9.3 User/Auth

Core fields (`auth.types.ts`):

- `uid`
- `email`
- `displayName`
- `photoURL`
- `emailVerified`

## 10. Page-Level Functional Specification

### 10.1 Home Page

Responsibilities:

- Present login entry point
- Trigger `AuthContext.login()`
- Display auth/loading/error feedback states

### 10.2 Campaigns Page

Responsibilities:

- Load campaigns and zones in parallel
- Enrich campaign objects with resolved zone names
- Sort campaigns: active first, then trigger
- Render filter controls:
  - Active/Inactive/All
  - Trigger type
- Support campaign actions:
  - Create
  - Activate
  - Deactivate
  - Delete (confirm dialog)
- Handle reconnection event (`window.online`) and trigger refresh
- Render user-friendly failure messages

### 10.3 Analytics Page

Responsibilities:

- Aggregate data from campaigns, zones, and analytics endpoints
- Render KPI cards and chart visualizations
- Support retry action on failure
- Handle delayed loading timeout warnings
- Refresh automatically after connectivity restoration

### 10.4 Profile Page

Responsibilities:

- Display authenticated user details
- Show provider/account metadata
- Show role badge and verification status

## 11. Error Handling and UX Standards

### 11.1 Global Error Patterns

- Network failures and HTTP failures are normalized through `utils/errorMessages.ts`
- Components may override with contextual messages when needed
- API layer logs technical details in console for debugging

### 11.2 Recent UX Improvements

The current implementation includes user-readable messaging for campaign and zone loading failures:

- Technical backend/internal details are not shown directly to end users
- Retry affordances are provided where appropriate
- Connection-restored notifications trigger auto-refresh flows

### 11.3 Connectivity and Proxy Failure Behavior

If Vite proxy target is unreachable (for example DNS `ENOTFOUND` for a stale ngrok URL), frontend requests fail before reaching backend business logic. User-visible result may appear as generic loading/API failure depending on route and request path.

## 12. Configuration and Environment Variables

Required frontend environment values:

- `VITE_API_BASE_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Behavior:

- Missing Firebase variables stop authentication initialization.
- API base URL defaults to localhost when unspecified.

## 13. Local Development Setup

1. Install dependencies:

   `npm install`

2. Configure environment variables in `.env`.

3. Start development server:

   `npm run dev`

4. Build production bundle:

   `npm run build`

5. Preview built assets:

   `npm run preview`

## 14. Build and Deployment Notes

### 14.1 Build Output

- Static assets generated by Vite in `dist/`.

### 14.2 Runtime Dependency

- Frontend requires reachable backend/API and valid Firebase config at runtime.

### 14.3 Reverse Proxy/CORS

In local dev, Vite proxy is configured in `vite.config.ts` to forward `/api/v1` requests. If using ngrok, update the target URL whenever the tunnel rotates.

## 15. Security Considerations

- ID token is attached per request from Firebase auth state.
- Admin authorization is enforced by backend verification endpoint.
- Do not trust frontend role claims without backend verification.
- Never commit `.env` with real credentials.
- Prefer HTTPS endpoints in all non-local environments.

## 16. Performance Characteristics

- Campaign and zone data are loaded in parallel where beneficial.
- Heavy recomputation is reduced with `useMemo` for filtered/summarized campaign views.
- Loading timeout indicators prevent indefinite spinner-only UX.

## 17. Known Risks and Operational Caveats

- Dev proxy target hardcoded to transient ngrok domain can cause repeated DNS failures.
- Backend schema or response shape changes may require service-layer mapping updates.
- Long backend latency may surface timeout and degraded UX unless tuned.

## 18. Troubleshooting Guide

### 18.1 Symptom: "Could not load campaigns/zones"

Checks:

1. Confirm backend is up and reachable.
2. Confirm `VITE_API_BASE_URL` and/or Vite proxy target is correct.
3. If using ngrok, verify active tunnel URL has not changed.
4. Inspect browser DevTools Network tab for status code and payload.

### 18.2 Symptom: Vite log shows `ENOTFOUND <ngrok-host>`

Cause:

- DNS cannot resolve configured proxy target.

Fix:

1. Start a new ngrok tunnel.
2. Update `vite.config.ts` proxy target.
3. Restart `npm run dev`.

### 18.3 Symptom: User logs in but cannot access protected pages

Checks:

1. Verify backend `/verify-admin` returns success for that user.
2. Confirm user exists in backend admin authorization store.
3. Inspect auth token and response status (401/403).

## 19. Recommended Future Enhancements

- Introduce centralized telemetry/monitoring (Sentry or equivalent)
- Add integration tests for core user flows
- Add route-level code splitting for performance
- Add API contract tests and stricter runtime validation
- Move dev proxy target to environment variable to avoid stale ngrok configs

## 20. Frontend-Backend Handshake Summary

The frontend is considered healthy when all of the following hold:

1. Firebase initializes successfully.
2. User authentication succeeds.
3. Backend admin verification succeeds.
4. Campaigns/zones/analytics endpoints return expected payloads.
5. User receives readable error feedback and recovery paths when failures occur.

---

## Appendix A: Primary Source Files

- `src/main.tsx`
- `src/App.tsx`
- `src/contexts/AuthContext.tsx`
- `src/components/routes/ProtectedRoute.tsx`
- `src/components/layout/AdminLayout.tsx`
- `src/pages/CampaignsPage.tsx`
- `src/components/campaigns/CreateCampaignForm.tsx`
- `src/pages/AnalyticsPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/services/api.ts`
- `src/services/campaignService.ts`
- `src/services/zoneService.ts`
- `src/services/analyticsService.ts`
- `src/services/adminService.ts`
- `src/config/firebase.ts`
- `src/utils/errorMessages.ts`

## Appendix B: Related Documentation in Repository

- `DOCS/00-OVERVIEW.md`
- `DOCS/01-MAIN-ENTRY-POINTS.md`
- `DOCS/02-AUTHENTICATION.md`
- `DOCS/03-API-SERVICES.md`
- `DOCS/04-COMPONENTS.md`
- `DOCS/05-PAGES.md`
- `DOCS/06-EVENT-FLOW.md`
- `DOCS/07-FLOWCHARTS.md`
- `DOCS/08-DATA-MODELS.md`
- `DOCS/09-QUICK-REFERENCE.md`
