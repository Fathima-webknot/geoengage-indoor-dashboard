# 📘 Main Entry Points - Line-by-Line Explanation

## 📄 File: `src/main.tsx`

**Purpose:** Application entry point - where React starts rendering

### Line-by-Line Breakdown:

```typescript
import React from 'react'
```
- **Line 1:** Import React library (required for JSX syntax)

```typescript
import ReactDOM from 'react-dom/client'
```
- **Line 2:** Import ReactDOM for rendering React to the browser DOM
- `react-dom/client` is the React 18+ API for rendering

```typescript
import App from './App.tsx'
```
- **Line 3:** Import the main App component
- This is the root component of our entire application

```typescript
import { AuthProvider } from '@/contexts/AuthContext'
```
- **Line 4:** Import AuthProvider to provide authentication state globally
- `@/` is an alias for `src/` directory (configured in tsconfig.json)

```typescript
ReactDOM.createRoot(document.getElementById('root')!)
```
- **Line 6:** Create a React root attached to HTML element with id="root"
- `document.getElementById('root')!` finds the div in index.html
- `!` is TypeScript's non-null assertion (we know it exists)

```typescript
.render(
  <React.StrictMode>
```
- **Line 7-8:** Start rendering and enable StrictMode
- StrictMode helps catch common mistakes during development

```typescript
    <AuthProvider>
```
- **Line 9:** Wrap app in AuthProvider
- This makes authentication state available to all child components

```typescript
      <App />
```
- **Line 10:** Render the main App component
- This contains all routing and pages

```typescript
    </AuthProvider>
  </React.StrictMode>,
)
```
- **Lines 11-13:** Close tags and complete render call

### What This File Does (Layman):

Think of this as the **"power button"** of your app. It:
1. Finds the empty `<div id="root">` in your HTML
2. Tells React to start rendering inside it
3. Wraps everything in an authentication "bubble" so login works everywhere
4. Starts up the entire application

### Technical Flow:

```
Browser loads index.html → 
Finds <div id="root"> → 
main.tsx executes → 
ReactDOM creates root → 
Wraps in AuthProvider → 
Renders App component → 
App shows on screen
```

---

## 📄 File: `src/App.tsx`

**Purpose:** Root component that sets up routing, theme, and layout

### Line-by-Line Breakdown:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
```
- **Line 1:** Import React Router components for navigation
- `BrowserRouter`: Enables routing using browser URL
- `Routes`: Container for all routes
- `Route`: Defines a single route
- `Navigate`: Redirects to a different route

```typescript
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
```
- **Lines 2-4:** Import Material-UI theme setup
- `ThemeProvider`: Applies custom theme (colors, fonts, etc.)
- `CssBaseline`: Normalizes CSS across browsers
- `theme`: Our custom theme configuration

```typescript
import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
```
- **Lines 5-6:** Import custom routing and layout components
- `ProtectedRoute`: Checks if user is logged in before showing page
- `AdminLayout`: Sidebar + main content area for logged-in users

```typescript
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineBanner from '@/components/OfflineBanner';
```
- **Lines 7-8:** Import error handling and offline detection
- `ErrorBoundary`: Catches JavaScript errors and shows friendly message
- `OfflineBanner`: Shows banner when internet connection is lost

```typescript
import HomePage from '@/pages/HomePage';
import CampaignsPage from '@/pages/CampaignsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ProfilePage from '@/pages/ProfilePage';
```
- **Lines 9-12:** Import all page components
- Each page handles a specific URL route

```typescript
function App() {
  return (
```
- **Lines 14-15:** Define App component and start return statement

```typescript
    <ErrorBoundary>
```
- **Line 16:** Wrap everything in ErrorBoundary
- If any error occurs anywhere, it gets caught here instead of crashing

```typescript
      <ThemeProvider theme={theme}>
        <CssBaseline />
```
- **Lines 17-18:** Apply Material-UI theme and CSS reset
- All MUI components inside will use our custom colors/fonts

```typescript
        <OfflineBanner />
```
- **Line 19:** Show offline indicator when no internet
- Automatically appears/disappears based on connection status

```typescript
        <BrowserRouter>
```
- **Line 20:** Enable routing - connects URL to components

```typescript
          <Routes>
```
- **Line 21:** Container for all route definitions

```typescript
            {/* Public route - Home/Login page */}
            <Route path="/" element={<HomePage />} />
```
- **Lines 22-23:** Define homepage route
- URL: `http://localhost:5173/`
- Component: `HomePage` (login page)
- **Public** - anyone can access without login

```typescript
            {/* Protected routes with AdminLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
```
- **Lines 25-32:** Define protected routes that require login
- All child routes will:
  1. Check authentication (ProtectedRoute)
  2. Show sidebar layout (AdminLayout)

```typescript
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
```
- **Lines 33-35:** Define protected page routes
- `/campaigns` → Campaign management page
- `/analytics` → Analytics dashboard
- `/profile` → User profile page
- All require login (parent ProtectedRoute checks this)

```typescript
            </Route>
```
- **Line 36:** Close protected routes group

```typescript
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
```
- **Lines 38-39:** Catch-all route for invalid URLs
- Any undefined URL redirects to homepage
- `path="*"` matches anything not defined above
- `replace` replaces history entry instead of adding new one

```typescript
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```
- **Lines 40-44:** Close all tags

```typescript
export default App;
```
- **Line 47:** Export App component so main.tsx can import it

---

### What This File Does (Layman):

This is the **"blueprint"** of your app. It:
1. Sets up the color scheme (theme)
2. Defines all pages and their URLs
3. Decides which pages need login (protected routes)
4. Adds the sidebar to logged-in pages
5. Catches errors so app doesn't crash
6. Shows offline indicator when internet is down

### Routing Flow Diagram:

```
User visits URL
     ↓
BrowserRouter checks path
     ↓
┌─────────────┬─────────────────┬────────────────┬─────────────┬──────────┐
│    /        │   /campaigns    │  /analytics    │  /profile   │  Other   │
│  HomePage   │  ProtectedRoute │ ProtectedRoute │ Protected   │ Redirect │
│  (Public)   │  + AdminLayout  │ + AdminLayout  │ + Layout    │ to /     │
└─────────────┴─────────────────┴────────────────┴─────────────┴──────────┘
```

### Protection Flow:

```
User navigates to /campaigns
     ↓
ProtectedRoute checks authentication
     ↓
┌─────────────────┬────────────────────┐
│  Logged In?     │  Not Logged In?    │
│  ✅ YES         │  ❌ NO              │
│  Show page      │  Redirect to /     │
└─────────────────┴────────────────────┘
```

---

## 🔄 Startup Sequence

**When app loads:**

1. Browser loads `index.html`
2. `index.html` loads `main.tsx` via `<script>` tag
3. `main.tsx` creates React root on `<div id="root">`
4. `main.tsx` wraps everything in `AuthProvider`
5. `main.tsx` renders `App` component
6. `App.tsx` sets up:
   - Error boundary (catches errors)
   - Theme (colors, fonts)
   - Offline detection
   - Router (URL → Page mapping)
7. Router checks current URL
8. Router shows appropriate page
9. If protected page: `ProtectedRoute` checks login
10. If logged in: Show page with `AdminLayout` (sidebar)
11. If not logged in: Redirect to homepage

---

## 📊 Visual Hierarchy

```
main.tsx
  └── AuthProvider (provides login state)
       └── App.tsx
            ├── ErrorBoundary (catches errors)
            │    └── ThemeProvider (colors/fonts)
            │         ├── CssBaseline (CSS reset)
            │         ├── OfflineBanner (shows when offline)
            │         └── BrowserRouter (routing)
            │              └── Routes
            │                   ├── Route "/" → HomePage (public)
            │                   ├── Route group (protected)
            │                   │    ├── ProtectedRoute (auth check)
            │                   │    └── AdminLayout (sidebar)
            │                   │         ├── /campaigns → CampaignsPage
            │                   │         ├── /analytics → AnalyticsPage
            │                   │         └── /profile → ProfilePage
            │                   └── Route "*" → Navigate to "/"
```

---

**Next:** See [02-AUTHENTICATION.md](./02-AUTHENTICATION.md) for authentication flow details.
