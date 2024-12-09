import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Configure provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const firebaseService = {
  app,
  auth,
  db,
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Firebase auth error:', {
        code: error.code,
        message: error.message,
        domain: window.location.hostname,
        authDomain: firebaseConfig.authDomain
      });
      throw error;
    }
  },
  signOut: () => signOut(auth)
};

export default firebaseService; 