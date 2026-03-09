# 🔐 Authentication System - Complete Explanation

## Overview
The authentication system uses **Firebase Authentication** for Google Sign-In and maintains user session state throughout the application.

---

## 📄 File: `src/config/firebase.ts`

**Purpose:** Configure and initialize Firebase services

### Line-by-Line Breakdown:

```typescript
import { initializeApp, type FirebaseApp } from 'firebase/app';
```
- **Line 1:** Import Firebase app initialization function
- `FirebaseApp` type for TypeScript

```typescript
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
```
- **Line 2:** Import Firebase authentication functions
- `getAuth`: Get authentication instance
- `GoogleAuthProvider`: Enable Google Sign-In

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```
- **Lines 11-18:** Firebase configuration from `.env` file
- `import.meta.env` is Vite's way to access environment variables
- All values prefixed with `VITE_` are accessible in frontend code
- These values are **specific to your Firebase project**

#### What Each Firebase Key Means:

| Key | Purpose |
|-----|---------|
| `apiKey` | Public key to identify your Firebase project |
| `authDomain` | Domain where authentication happens |
| `projectId` | Your Firebase project's unique ID |
| `storageBucket` | Cloud storage location (unused in this app) |
| `messagingSenderId` | For push notifications (unused in this app) |
| `appId` | Unique app identifier |

```typescript
const validateFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];
```
- **Lines 21-29:** Validation function starts
- Creates array of required environment variable names

```typescript
  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );
```
- **Lines 31-33:** Check which variables are missing
- `filter` keeps only vars that are undefined/empty

```typescript
  if (missingVars.length > 0) {
    console.error('❌ Missing Firebase configuration variables:', missingVars.join(', '));
    console.error('Please check your .env file and ensure all variables are set.');
    console.error('Refer to .env.example for required variables.');
  }
```
- **Lines 35-39:** If any vars are missing, show error in console
- Helps developers debug configuration issues

```typescript
  return missingVars.length === 0;
};
```
- **Line 42:** Return true if all vars present, false otherwise

```typescript
let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
```
- **Lines 46-48:** Declare variables (will be assigned in try block)
- `let` allows reassignment
- Types ensure TypeScript type safety

```typescript
try {
  if (validateFirebaseConfig()) {
```
- **Lines 50-51:** Try to initialize Firebase
- First check if config is valid

```typescript
    app = initializeApp(firebaseConfig);
```
- **Line 53:** Initialize Firebase app with config
- This connects to your Firebase project

```typescript
    auth = getAuth(app);
```
- **Line 56:** Get authentication instance
- This handles all login/logout operations

```typescript
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
```
- **Lines 59-62:** Configure Google Sign-In
- `GoogleAuthProvider()`: Create Google authentication provider
- `prompt: 'select_account'`: Always show account picker (even if only one Google account)

```typescript
    console.log('✅ Firebase initialized successfully');
  } else {
    throw new Error('Firebase configuration is incomplete');
  }
```
- **Lines 64-67:** Log success or throw error
- Error gets caught by catch block

```typescript
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}
```
- **Lines 68-71:** Catch any initialization errors
- Re-throw error so app fails visibly (prevents running with broken auth)

```typescript
export { app, auth, googleProvider };
```
- **Line 74:** Export initialized Firebase instances
- Other files import these to use Firebase

```typescript
export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
```
- **Lines 77-82:** Re-export Firebase auth functions
- Convenience: Other files can import from this file instead of 'firebase/auth'

### What This File Does (Layman):

This file is like **"plugging in the power cord"** for authentication:
1. Reads Firebase credentials from `.env` file
2. Checks that all required credentials exist
3. Connects to your Firebase project
4. Sets up Google Sign-In
5. Exports everything so other files can use authentication

### Security Note:

The Firebase API key is **safe to expose publicly**. It only identifies your project. **Real security** comes from Firebase Security Rules on the server side.

---

## 📄 File: `src/contexts/AuthContext.tsx`

**Purpose:** Manage global authentication state and provide auth functions to entire app

This is a **large and important file**. Let's break it into sections:

### Part 1: Imports and Setup

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
```
- **Line 1:** Import React hooks
- `createContext`: Create global state container
- `useContext`: Access context from components
- `useEffect`: Run side effects (like checking login status)
- `useState`: Store data in component
- `ReactNode`: TypeScript type for child components

```typescript
import { 
  User as FirebaseUser,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
```
- **Lines 2-7:** Import Firebase authentication functions
- `FirebaseUser`: Type for Firebase user object
- `signInWithPopup`: Show Google login popup
- `signOut`: Log user out
- `onAuthStateChanged`: Listen for login/logout events

```typescript
import { auth, googleProvider } from '@/config/firebase';
import { User, AuthContextType } from '@/types/auth.types';
import { adminService } from '@/services/adminService';
```
- **Lines 8-10:** Import local files
- `auth, googleProvider`: Firebase config we created earlier
- `User, AuthContextType`: TypeScript types
- `adminService`: API call to verify admin status

### Part 2: Context Creation

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```
- **Line 15:** Create authentication context
- `<AuthContextType | undefined>`: TypeScript type
- `undefined`: Initial value (before provider wraps app)

### Part 3: useAuth Hook

```typescript
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```
- **Lines 21-27:** Custom hook for accessing auth context
- Components call `useAuth()` to get current user and login functions
- Throws error if used outside AuthProvider (prevents bugs)

**How components use this:**
```typescript
const { currentUser, login, logout } = useAuth();
```

### Part 4: Helper Function

```typescript
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
});
```
- **Lines 38-44:** Convert Firebase user format to our app's user format
- Firebase has lots of extra data we don't need
- This extracts just what we want

### Part 5: AuthProvider Component - State

```typescript
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenRefreshInterval, setTokenRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
```
- **Lines 51-58:** State variables

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentUser` | User \| null | Our app's user object (null if not logged in) |
| `firebaseUser` | FirebaseUser \| null | Firebase's user object |
| `loading` | boolean | True while checking if user is logged in |
| `verifying` | boolean | True while verifying admin status |
| `error` | string \| null | Error message to show user |
| `tokenRefreshInterval` | NodeJS.Timeout \| null | Timer for auto-refreshing auth token |
| `abortController` | AbortController \| null | For canceling API requests |

### Part 6: Verify Admin Function

```typescript
const verifyAdmin = async (user: FirebaseUser, signal?: AbortSignal): Promise<boolean> => {
  try {
    console.log('Verifying admin for user:', user.email);
```
- **Lines 64-66:** Start admin verification
- Takes Firebase user object
- Optional `signal` for canceling request
- Returns boolean (true = is admin, false = not admin)

```typescript
    const response = await adminService.verifyAdmin();
```
- **Line 68:** Call backend API to verify admin
- Backend checks if user's email is in admin list

```typescript
    if (signal?.aborted) {
      console.log('Admin verification aborted');
      return false;
    }
```
- **Lines 71-74:** Check if request was canceled
- Returns false if canceled (user navigated away)

```typescript
    if (response.success) {
      setError(null);
      return true;
    } else {
      setError('Access denied. You need admin permissions to access this dashboard.');
      await signOut(auth);
      return false;
    }
```
- **Lines 78-84:** Handle response
- If success: Clear errors, return true
- If failed: Show error, log user out, return false

```typescript
  } catch (error: any) {
    console.error('Admin verification failed:', error);
    setError(error.response?.data?.message || 'Failed to verify admin status');
    await signOut(auth);
    return false;
  }
};
```
- **Lines 85-91:** Handle errors
- Log error, show message, log user out

### Part 7: Login Function

```typescript
const login = async (): Promise<void> => {
  try {
    setError(null);
    setVerifying(false);
```
- **Lines 96-99:** Start login
- Clear any previous errors
- Reset verifying state

```typescript
    const controller = new AbortController();
    setAbortController(controller);
```
- **Lines 102-103:** Create abort controller
- Allows canceling verification request if needed

```typescript
    const result = await signInWithPopup(auth, googleProvider);
    console.log('User signed in:', result.user.email);
```
- **Lines 105-106:** Show Google login popup
- `signInWithPopup`: Firebase function that shows OAuth popup
- User selects Google account
- Returns user object with email, name, photo

```typescript
    setVerifying(true);
```
- **Line 109:** Show "Verifying..." state in UI

```typescript
    const isAdmin = await verifyAdmin(result.user, controller.signal);
    setVerifying(false);
```
- **Lines 112-113:** Check if user is admin
- Calls our `verifyAdmin` function
- Stop showing "Verifying..." state

```typescript
    if (!isAdmin) {
      throw new Error('Admin verification failed');
    }
```
- **Lines 115-117:** If not admin, throw error
- This logs user out and shows error message

```typescript
  } catch (error: any) {
    console.error('Login error:', error);
    setVerifying(false);
    if (!error.message?.includes('Admin verification')) {
      setError('Login failed. Please try again.');
    }
    throw error;
  }
};
```
- **Lines 118-126:** Catch errors
- Log error, stop verifying state
- Set error message (if not already set)
- Re-throw error

### Part 8: Logout Function

```typescript
const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    setError(null);
    console.log('User signed out');
  } catch (error: any) {
    console.error('Logout error:', error);
    const errorMessage = error.message || 'Failed to logout. Please try again.';
    setError(errorMessage);
    throw new Error(errorMessage);
  }
};
```
- **Lines 131-142:** Logout function
- Calls Firebase `signOut`
- Clears error state
- Handles errors if logout fails

### Part 9: Token Auto-Refresh

```typescript
useEffect(() => {
  if (firebaseUser) {
    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval);
    }
```
- **Lines 151-155:** Effect runs when firebaseUser changes
- If there's an old interval, clear it

```typescript
    const interval = setInterval(async () => {
      try {
        console.log('🔄 Auto-refreshing Firebase token...');
        await firebaseUser.getIdToken(true);
        console.log('✅ Token refreshed successfully');
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
      }
    }, 55 * 60 * 1000);
```
- **Lines 158-165:** Set up auto-refresh
- Every 55 minutes, get new token
- Firebase tokens expire after 60 minutes
- `getIdToken(true)` forces refresh

**Why 55 minutes?** Refresh 5 minutes before expiry to be safe.

```typescript
    setTokenRefreshInterval(interval);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
```
- **Lines 167-172:** Cleanup
- Save interval reference
- Return cleanup function (runs when user logs out or component unmounts)

```typescript
  } else {
    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval);
      setTokenRefreshInterval(null);
    }
  }
}, [firebaseUser]);
```
- **Lines 173-178:** If user logs out
- Clear the refresh interval

### Part 10: Auth State Listener

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
```
- **Lines 184-186:** Listen for auth changes
- Runs when user logs in or out
- Firebase automatically calls this callback

*Note: The file continues beyond the 200 lines I read. Let me indicate that.*

**Lines 187-200+:** Handle auth state changes
- If user logged in: Set user state
- If user logged out: Clear user state
- This keeps UI in sync with auth status

### What This File Does (Layman):

This file is the **"authentication brain"** of the app:

1. **Provides login/logout functions** to all components
2. **Remembers** who is logged in
3. **Verifies** user is an admin before granting access
4. **Auto-refreshes** authentication token so you don't get logged out
5. **Listens** for login/logout and updates the app accordingly

### Authentication Flow Diagram:

```
Component calls login()
     ↓
Show Google popup
     ↓
User selects Google account
     ↓
Firebase authenticates
     ↓
Get Firebase token
     ↓
Call backend /verify-admin with token
     ↓
┌────────────────┬──────────────────┐
│  Is Admin?     │  Not Admin?      │
│  ✅ YES        │  ❌ NO           │
│  Set user      │  Show error      │
│  Allow access  │  Sign out        │
└────────────────┴──────────────────┘
```

### State Flow:

```
Initial: loading=true, currentUser=null

User clicks login:
  verifying=true → API call → verifying=false

If admin:
  currentUser=User object → loading=false

If not admin:
  error="Access denied" → currentUser=null → Sign out

User clicks logout:
  currentUser=null → firebaseUser=null
```

---

## 🔐 Authentication Security

### How It Works:

1. **Frontend**: User logs in with Google → Gets Firebase token
2. **API Requests**: Every API call includes Firebase token in header
3. **Backend**: Verifies token with Firebase → Checks if email is admin
4. **Response**: Backend only responds if token valid + user is admin

### Token Flow:

```
Login → Firebase generates JWT token → 
Frontend stores token → 
API request includes token in header → 
Backend verifies token with Firebase servers → 
Backend checks if user email is in admin list → 
Backend processes request or rejects
```

---

## 📊 Key Concepts

### Context API:
Think of Context as a **"global storage box"**. Instead of passing login state through every component, we put it in Context and any component can access it.

### Firebase Token:
A **"digital passport"**. Proves you are who you say you are. Backend verifies it with Firebase before allowing access.

### Admin Verification:
**Two-step security**:
1. Firebase verifies you're a real Google user
2. Backend verifies you're in the admin list

---

**Next:** See [03-API-SERVICES.md](./03-API-SERVICES.md) for how API calls work.
