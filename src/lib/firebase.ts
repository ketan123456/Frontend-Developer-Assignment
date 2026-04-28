import { initializeApp, getApps } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  type User,
} from 'firebase/auth';
import type { AuthUser } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;

if (auth) {
  void setPersistence(auth, browserLocalPersistence);
}

export const firebaseSetupHint =
  'Add the VITE_FIREBASE_* values in your environment to enable real Firebase Authentication.';

export const mapFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  name: user.displayName || user.email?.split('@')[0] || 'Care team member',
  email: user.email || 'unknown@careaxis.health',
  role: 'Operations Lead',
  mode: 'firebase',
});

export const getFirebaseErrorMessage = (error: unknown): string => {
  if (typeof error !== 'object' || !error || !('code' in error)) {
    return 'Authentication failed. Please try again.';
  }

  const code = String(error.code);

  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid work email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many login attempts. Wait a moment before trying again.';
    default:
      return 'Authentication failed. Please verify your Firebase project configuration.';
  }
};
