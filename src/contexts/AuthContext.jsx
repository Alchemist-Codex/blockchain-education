import { createContext, useContext, useState, useEffect } from 'react';
// Firebase imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { useWeb3 } from './Web3Context';
import { userTypes } from '../utils/schema';
import toast from 'react-hot-toast';

/**
 * Firebase configuration from environment variables
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create context for authentication
const AuthContext = createContext();

/**
 * Custom hook to use authentication context
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * AuthProvider Component
 * Manages authentication state and provides auth-related functionality
 */
export function AuthProvider({ children }) {
  // State management
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account, connect } = useWeb3();

  // Monitor authentication state changes
  useEffect(() => {
    console.log('AuthProvider mounted');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user);
      if (user) {
        try {
          // Fetch user data and verify wallet address
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data:', userData);
            setUserType(userData.userType);
            
            // Verify wallet address match
            if (account && userData.walletAddress !== account) {
              await signOut(auth);
              toast.error('Wallet address mismatch');
              setUser(null);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserType(null);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [account]);

  /**
   * Handle Google Sign In
   * Creates user profile if new user
   */
  const signInWithGoogle = async (selectedUserType) => {
    try {
      // Ensure wallet is connected
      if (!account) {
        await connect();
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider.setCustomParameters({
        prompt: 'select_account'
      }));

      if (result.user) {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        
        if (userDoc.exists()) {
          // Verify existing user's wallet
          const userData = userDoc.data();
          if (userData.walletAddress !== account) {
            await signOut(auth);
            throw new Error('Incorrect wallet address for this account');
          }
          setUserType(userData.userType);
        } else {
          // Create new user profile
          const profileData = {
            userId: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            walletAddress: account,
            createdAt: serverTimestamp()
          };

          // Create user document
          await setDoc(doc(db, 'users', result.user.uid), {
            ...profileData,
            userType: selectedUserType,
          });

          // Create type-specific profile
          if (selectedUserType === userTypes.STUDENT) {
            await setDoc(doc(db, 'students', result.user.uid), profileData);
          } else {
            await setDoc(doc(db, 'institutions', result.user.uid), profileData);
          }

          setUserType(selectedUserType);
        }

        toast.success('Successfully signed in!');
        return result.user;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-blocked') {
        toast.error('Please allow popups for this site');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign in was cancelled');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
      
      throw error;
    }
  };

  // Handle redirect result after authentication
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.walletAddress !== account) {
              await signOut(auth);
              throw new Error('Wallet address mismatch');
            }
            setUserType(userData.userType);
          }
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        toast.error(error.message || 'Authentication failed');
      }
    };

    handleRedirectResult();
  }, [account]);

  /**
   * Handle user sign out
   */
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  /**
   * Test Firebase database connection
   */
  const testDatabaseConnection = async () => {
    try {
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Test connection',
        timestamp: serverTimestamp()
      });
      console.log('Database connection successful, test document ID:', testDoc.id);
      toast.success('Firebase connection successful!');
      
      await deleteDoc(doc(db, 'test', testDoc.id));
    } catch (error) {
      console.error('Database connection failed:', error);
      toast.error('Firebase connection failed: ' + error.message);
    }
  };

  // Context value
  const value = {
    user,
    userType,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
    testDatabaseConnection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}