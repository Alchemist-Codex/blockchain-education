import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider, 
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  query,
  where,
  collection,
  getDocs 
} from 'firebase/firestore';
import { useWeb3 } from './Web3Context';
import { userTypes } from '../utils/schema';
import toast from 'react-hot-toast';

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

// Initialize Firestore with single tab persistence
const db = initializeFirestore(app, {
  cache: persistentLocalCache({
    tabManager: persistentSingleTabManager()
  })
});

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const AuthContext = createContext();

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.walletAddress !== account) {
              await signOut(auth);
              toast.error('Wallet address mismatch');
              setUser(null);
              return;
            }
            setUserType(userData.userType);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [account]);

  const signInWithGoogle = async (selectedUserType) => {
    try {
      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (userDoc.exists()) {
        // Verify wallet address
        const userData = userDoc.data();
        if (userData.walletAddress !== account) {
          await signOut(auth);
          throw new Error('Incorrect wallet address for this account');
        }
        setUserType(userData.userType);
      } else {
        // Create new user profile
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          userType: selectedUserType,
          walletAddress: account,
          createdAt: new Date().toISOString()
        });
        setUserType(selectedUserType);
      }

      toast.success('Successfully signed in!');
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userType,
    loading,
    signInWithGoogle,
    signOut: () => signOut(auth),
    getCurrentUser: () => auth.currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };