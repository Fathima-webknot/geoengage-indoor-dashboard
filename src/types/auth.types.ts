import { User as FirebaseUser } from 'firebase/auth';

/**
 * Extended User interface with additional profile information
 */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Authentication Context Type
 * Provides authentication state and methods to all components
 */
export interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  verifying: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
