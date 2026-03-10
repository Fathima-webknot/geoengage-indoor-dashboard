import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Firebase Configuration for GeoEngage Admin Dashboard
 * 
 * Uses Google Sign-In for admin authentication.
 * Environment variables must be set in .env file.
 */

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
const validateFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      '❌ Missing Firebase configuration variables:',
      missingVars.join(', ')
    );
    console.error('Please check your .env file and ensure all variables are set.');
    console.error('Refer to .env.example for required variables.');
  }

  return missingVars.length === 0;
};

// Initialize Firebase only if configuration is valid
let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

try {
  if (validateFirebaseConfig()) {
    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication
    auth = getAuth(app);
    
    // Configure Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account', // Always show account selection
    });
  } else {
    throw new Error('Firebase configuration is incomplete');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Export Firebase instances
export { app, auth, googleProvider };

// Re-export Firebase Auth functions for convenience
export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
