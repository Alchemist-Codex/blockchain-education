import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useWeb3 } from './Web3Context';
import { toast } from 'react-hot-toast';
import { userTypes } from '../utils/schema';
import { initializeApp } from 'firebase/app';
import { auth, db } from '../config/firebase';

// Your web app's Firebase configuration
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

const SESSION_DURATION = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account, connect } = useWeb3();

  // Check for existing user session in Firestore
  const checkExistingUser = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if session is still valid
        const sessionData = localStorage.getItem('authSession');
        if (sessionData) {
          const { timestamp } = JSON.parse(sessionData);
          const isValid = Date.now() - timestamp < SESSION_DURATION;
          
          if (isValid && userData.walletAddress === account) {
            setUserType(userData.userType);
            setUser({ uid, ...userData });
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking existing user:', error);
      return false;
    }
  };

  // Auto-login check on mount
  useEffect(() => {
    const autoLogin = async () => {
      const sessionData = localStorage.getItem('authSession');
      if (sessionData) {
        const { uid } = JSON.parse(sessionData);
        const isExistingUser = await checkExistingUser(uid);
        if (!isExistingUser) {
          localStorage.removeItem('authSession');
        }
      }
      setLoading(false);
    };

    autoLogin();
  }, [account]);

  // Monitor authentication state changes
  useEffect(() => {
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence);
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get stored user type from localStorage
        const storedUserType = localStorage.getItem('userType');
        setUser(user);
        setUserType(storedUserType);
      } else {
        setUser(null);
        setUserType(null);
        localStorage.removeItem('userType');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (selectedUserType) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Store user type in localStorage
      localStorage.setItem('userType', selectedUserType);
      setUserType(selectedUserType);
      return result.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      localStorage.removeItem('authSession');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleSignInError = (error) => {
    if (error.code === 'auth/popup-blocked') {
      toast.error('Please allow popups for this site');
    } else if (error.code === 'auth/cancelled-popup-request') {
      toast.error('Sign in was cancelled');
    } else {
      toast.error(error.message || 'Failed to sign in');
    }
  };

  const value = {
    user,
    userType,
    loading,
    signInWithGoogle,
    signOut: signOutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}