import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

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

// Create Google Auth Provider with specific configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
  login_hint: 'user@example.com',
  // Make sure this matches your authorized domain
  hd: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
});

export const firebaseService = {
  auth,
  async signInWithGoogle() {
    try {
      console.log('Starting Google sign in...');
      console.log('Current config:', {
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
      });
      
      // Force auth domain to match Firebase settings
      auth.config.authDomain = firebaseConfig.authDomain;
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign in successful:', result.user);
      return result.user;
    } catch (error) {
      console.error('Detailed sign in error:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential,
        authDomain: firebaseConfig.authDomain
      });
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
};

// Log configuration on initialization
console.log('Firebase initialized with auth domain:', firebaseConfig.authDomain);

export default app; 