import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
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
  const [error, setError] = useState<string | null>(null);
  const [tokenRefreshInterval, setTokenRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  /**
   * Verify if user is admin
   */
  const verifyAdmin = async (user: FirebaseUser, signal?: AbortSignal): Promise<boolean> => {
    try {
      console.log('Verifying admin for user:', user.email);
      
      const response = await adminService.verifyAdmin();
      
      // Check if request was aborted
      if (signal?.aborted) {
        console.log('Admin verification aborted');
        return false;
      }
      
      console.log('Admin verification response:', response);
      
      if (response.success) {
        setError(null);
        return true;
      } else {
        setError('Access denied. You need admin permissions to access this dashboard.');
        await signOut(auth);
        return false;
      }
    } catch (error: any) {
      console.error('Admin verification failed:', error);
      setError(error.response?.data?.message || 'Failed to verify admin status');
      await signOut(auth);
      return false;
    }
  };

  /**
   * Login with Google using Firebase popup
   */
  const login = async (): Promise<void> => {
    try {
      // Clear any previous errors on new login attempt
      setError(null);
      
      // Create new abort controller for this login attempt
      const controller = new AbortController();
      setAbortController(controller);
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in:', result.user.email);
      
      // Verify admin status
      const isAdmin = await verifyAdmin(result.user, controller.signal);
      if (!isAdmin) {
        throw new Error('Admin verification failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
      console.log('User signed out');
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
          console.log('🔄 Auto-refreshing Firebase token...');
          await firebaseUser.getIdToken(true);
          console.log('✅ Token refreshed successfully');
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
        console.log('Auth state changed: User logged in', firebaseUser.email);
        setFirebaseUser(firebaseUser);
        
        const isAdmin = await verifyAdmin(firebaseUser);
        if (isAdmin) {
          setCurrentUser(mapFirebaseUser(firebaseUser));
        } else {
          setCurrentUser(null);
        }
      } else {
        // User is signed out
        setFirebaseUser(null);
        setCurrentUser(null);
        console.log('Auth state changed: User logged out');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      
      // Cancel any pending API requests
      if (abortController) {
        console.log('Aborting pending auth requests on unmount');
        abortController.abort();
      }
      
      // Clear token refresh interval
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
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
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
