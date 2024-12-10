import { createContext, useContext, useState, useEffect } from 'react';
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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account, connect } = useWeb3();

  useEffect(() => {
    console.log('AuthProvider mounted');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data:', userData);
            setUserType(userData.userType);
            
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

  const signInWithGoogle = async (selectedUserType) => {
    try {
      if (!account) {
        await connect();
      }

      // Configure Google Auth Provider
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Use signInWithPopup with error handling
      try {
        const result = await signInWithPopup(auth, provider);
        
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
            displayName: result.user.displayName,
            userType: selectedUserType,
            walletAddress: account,
            createdAt: serverTimestamp()
          });

          // Create type-specific profile
          const profileData = {
            userId: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            walletAddress: account,
            createdAt: serverTimestamp()
          };

          if (selectedUserType === userTypes.STUDENT) {
            await setDoc(doc(db, 'students', result.user.uid), profileData);
          } else {
            await setDoc(doc(db, 'institutions', result.user.uid), profileData);
          }

          setUserType(selectedUserType);
        }

        toast.success('Successfully signed in!');
        return result.user;
      } catch (popupError) {
        // If popup fails, try redirect
        console.log('Popup failed, trying redirect:', popupError);
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  // Add this useEffect to handle the redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // Handle user data after successful sign-in
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
          if (userDoc.exists()) {
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
              displayName: result.user.displayName,
              userType: selectedUserType,
              walletAddress: account,
              createdAt: serverTimestamp()
            });

            setUserType(selectedUserType);
          }
          toast.success('Successfully signed in!');
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        toast.error(error.message);
      }
    };

    handleRedirectResult();
  }, []);

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

  const testDatabaseConnection = async () => {
    try {
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Test connection',
        timestamp: serverTimestamp()
      });
      console.log('Database connection successful, test document ID:', testDoc.id);
      toast.success('Firebase connection successful!');
      
      // Clean up test document
      await deleteDoc(doc(db, 'test', testDoc.id));
    } catch (error) {
      console.error('Database connection failed:', error);
      toast.error('Firebase connection failed: ' + error.message);
    }
  };

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