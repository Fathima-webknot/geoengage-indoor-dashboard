import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { Snackbar, Alert } from '@mui/material';
import { auth, googleProvider } from '@/config/firebase';
import { User, AuthContextType } from '@/types/auth.types';
import { adminService } from '@/services/adminService';

/**
 * Create Authentication Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use Auth Context
 * Throws error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Convert Firebase User to our User type
 */
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
});

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state to all children
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenRefreshInterval, setTokenRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [loginTimeout, setLoginTimeout] = useState<NodeJS.Timeout | null>(null);
  const [serverDownAlert, setServerDownAlert] = useState<boolean>(false);

  // Timeout duration for login popup (30 seconds)
  const LOGIN_TIMEOUT_MS = 30000;

  /**
   * Verify if user is admin
   * Returns: { success: boolean, isBackendDown: boolean }
   */
  const verifyAdmin = async (user: FirebaseUser, signal?: AbortSignal): Promise<{ success: boolean; isBackendDown: boolean }> => {
    try {
      const response = await adminService.verifyAdmin();
      
      // Check if request was aborted
      if (signal?.aborted) {
        return { success: false, isBackendDown: false };
      }
      
      if (response.success) {
        setError(null);
        return { success: true, isBackendDown: false };
      } else {
        setError('Access denied. You are not authorized to access this dashboard.');
        await signOut(auth);
        return { success: false, isBackendDown: false };
      }
    } catch (error: any) {
      console.error('Admin verification failed:', error);
      
      // Check if it's a 404 Not Found error (backend service down)
      if (error.response?.status === 404) {
        console.error('Backend service is unavailable (404)');
        setServerDownAlert(true);
        // Don't sign out user - keep them logged in with Firebase
        return { success: false, isBackendDown: true };
      }
      
      // Check if no response (network error - backend might be down)
      if (!error.response) {
        console.error('Network error: Backend service may be down');
        setServerDownAlert(true);
        return { success: false, isBackendDown: true };
      }
      
      // Check if it's a 403 Forbidden error (non-admin user)
      if (error.response?.status === 403) {
        setError('Access denied. You are not authorized to access this dashboard.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please try logging in again.');
      } else {
        // Other server errors
        setError(error.response?.data?.message || 'Failed to verify admin status. Please try again.');
      }
      
      await signOut(auth);
      return { success: false, isBackendDown: false };
    }
  };

  /**
   * Login with Google using Firebase popup
   */
  const login = async (): Promise<void> => {
    // Clear any existing timeout
    if (loginTimeout) {
      clearTimeout(loginTimeout);
      setLoginTimeout(null);
    }

    try {
      // Clear any previous errors on new login attempt
      setError(null);
      setVerifying(false);
      
      // Create new abort controller for this login attempt
      const controller = new AbortController();
      setAbortController(controller);
      
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('LOGIN_TIMEOUT'));
        }, LOGIN_TIMEOUT_MS);
        setLoginTimeout(timeout);
      });

      // Race between login and timeout
      const result = await Promise.race([
        signInWithPopup(auth, googleProvider),
        timeoutPromise
      ]);

      // Clear timeout if login completed
      if (loginTimeout) {
        clearTimeout(loginTimeout);
        setLoginTimeout(null);
      }

      // Show verifying state during admin check
      setVerifying(true);
      
      // Verify admin status
      const adminCheck = await verifyAdmin(result.user, controller.signal);
      
      setVerifying(false);
      
      // If backend is down, don't throw error - just show popup
      if (adminCheck.isBackendDown) {
        return;
      }
      
      if (!adminCheck.success) {
        throw new Error('Admin verification failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Clear timeout on error
      if (loginTimeout) {
        clearTimeout(loginTimeout);
        setLoginTimeout(null);
      }
      
      setVerifying(false);
      
      // Handle timeout
      if (error.message === 'LOGIN_TIMEOUT') {
        setError('Login timed out. Please try again and complete the sign-in process.');
        // Don't throw - just return so UI can reset
        return;
      }
      
      // Handle popup cancellation gracefully (user closed the popup)
      const errorCode = error?.code || '';
      if (errorCode === 'auth/popup-closed-by-user' || 
          errorCode === 'auth/cancelled-popup-request' ||
          errorCode === 'auth/user-cancelled') {
        // Don't set error or throw - user intentionally cancelled
        return;
      }
      
      // Handle other errors
      if (!error.message?.includes('Admin verification')) {
        setError('Login failed. Please try again.');
      }
      throw error;
    }
  };

  /**
   * Logout from Firebase
   */
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setError(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      // Set error state instead of throwing to provide user feedback
      const errorMessage = error.message || 'Failed to logout. Please try again.';
      setError(errorMessage);
      // Still throw to allow caller to handle if needed
      throw new Error(errorMessage);
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * Setup automatic token refresh every 55 minutes
   * Firebase tokens expire after 60 minutes
   */
  useEffect(() => {
    if (firebaseUser) {
      // Clear any existing interval
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }

      // Refresh token every 55 minutes (5 minutes before expiry)
      const interval = setInterval(async () => {
        try {
          await firebaseUser.getIdToken(true);
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
        }
      }, 55 * 60 * 1000); // 55 minutes in milliseconds

      setTokenRefreshInterval(interval);

      // Cleanup interval on unmount or user change
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      // Clear interval when user logs out
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        setTokenRefreshInterval(null);
      }
    }
  }, [firebaseUser]);

  /**
   * Listen to Firebase auth state changes
   * Runs once on mount and whenever auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - verify admin status
        setFirebaseUser(firebaseUser);
        
        const adminCheck = await verifyAdmin(firebaseUser);
        if (adminCheck.success) {
          setCurrentUser(mapFirebaseUser(firebaseUser));
        } else if (!adminCheck.isBackendDown) {
          // Only clear user if it's not a backend issue
          setCurrentUser(null);
        }
        // If backend is down, keep both firebaseUser and currentUser as-is
      } else {
        // User is signed out
        setFirebaseUser(null);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      
      // Cancel any pending API requests
      if (abortController) {
        abortController.abort();
      }
      
      // Clear token refresh interval
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
      
      // Clear login timeout
      if (loginTimeout) {
        clearTimeout(loginTimeout);
      }
    };
  }, []);

  /**
   * Context value to be provided to children
   */
  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    verifying,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      
      {/* Backend Service Down Alert */}
      <Snackbar
        open={serverDownAlert}
        autoHideDuration={6000}
        onClose={() => setServerDownAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setServerDownAlert(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Backend service is down. Please try again later.
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};
