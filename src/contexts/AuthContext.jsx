import { useState, useEffect, createContext, useContext } from 'react';
import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useWeb3 } from './Web3Context';
import toast from 'react-hot-toast';

// Define constants at the top
const USER_TYPES = {
  STUDENT: 'student',
  INSTITUTE: 'institute'
};

const COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  INSTITUTIONS: 'institutions'
};

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();
  const googleProvider = new GoogleAuthProvider();

  const handleSignInError = (error) => {
    console.error('Sign in error:', error);
    if (error.code === 'auth/popup-blocked') {
      toast.error('Please allow popups for this site');
    } else if (error.code === 'auth/cancelled-popup-request') {
      toast.error('Sign in was cancelled');
    } else if (error.code === 'auth/popup-closed-by-user') {
      toast.error('Sign in window was closed');
    } else {
      toast.error(error.message || 'Failed to sign in');
    }
  };

  const signInWithGoogle = async (selectedUserType) => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      // Store user type in localStorage
      localStorage.setItem('userType', selectedUserType);
      localStorage.setItem('authSession', JSON.stringify({ timestamp: Date.now() }));
      
      // Base user data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        userType: selectedUserType,
        walletAddress: account || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Create or update user document in users collection
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, userData, { merge: true });

      // Create or update type-specific profile
      if (selectedUserType === USER_TYPES.STUDENT) {
        const studentRef = doc(db, COLLECTIONS.STUDENTS, user.uid);
        await setDoc(studentRef, {
          ...userData,
          userType: USER_TYPES.STUDENT,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } else {
        const instituteRef = doc(db, COLLECTIONS.INSTITUTIONS, user.uid);
        await setDoc(instituteRef, {
          ...userData,
          instituteName: user.displayName || '',
          userType: USER_TYPES.INSTITUTE,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      setUser(user);
      setUserType(selectedUserType);
      toast.success('Signed in successfully');
      return user;
    } catch (error) {
      handleSignInError(error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            const storedUserType = localStorage.getItem('userType');
            setUser(user);
            setUserType(storedUserType);
            
            // Update last login time
            const userRef = doc(db, COLLECTIONS.USERS, user.uid);
            await setDoc(userRef, {
              lastLogin: new Date().toISOString()
            }, { merge: true });
          } else {
            setUser(null);
            setUserType(null);
            localStorage.removeItem('userType');
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, [account]);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      localStorage.removeItem('userType');
      localStorage.removeItem('authSession');
      localStorage.removeItem('walletConnected');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    userType,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}