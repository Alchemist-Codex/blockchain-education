import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from '@firebase/auth';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { auth, db } from '../config/firebase'; // Import both auth and db
import { useWeb3 } from './Web3Context';
import { userTypes, studentSchema, instituteSchema, collections } from '../utils/schema';
import toast from 'react-hot-toast';

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
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      // Store user type and session in localStorage
      localStorage.setItem('userType', selectedUserType);
      localStorage.setItem('authSession', JSON.stringify({ timestamp: Date.now() }));
      
      // Create or update user document in users collection
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        userType: selectedUserType,
        walletAddress: account || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }, { merge: true });

      // Create or update type-specific profile
      if (selectedUserType === userTypes.STUDENT) {
        const studentRef = doc(db, collections.STUDENTS, user.uid);
        await setDoc(studentRef, {
          ...studentSchema,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          walletAddress: account || ''
        }, { merge: true });
      } else {
        const instituteRef = doc(db, collections.INSTITUTIONS, user.uid);
        await setDoc(instituteRef, {
          ...instituteSchema,
          uid: user.uid,
          email: user.email,
          instituteName: user.displayName || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          walletAddress: account || ''
        }, { merge: true });
      }

      setUser(user);
      setUserType(selectedUserType);
      return user;
    } catch (error) {
      handleSignInError(error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);

        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            const storedUserType = localStorage.getItem('userType');
            setUser(currentUser);
            setUserType(storedUserType);
            
            // Update last login time
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, {
              lastLogin: new Date().toISOString()
            }, { merge: true });
          } else {
            setUser(null);
            setUserType(null);
            localStorage.removeItem('userType');
            localStorage.removeItem('authSession');
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing authentication:', error);
      }
    };

    initializeAuth();
  }, [auth]);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      localStorage.removeItem('authSession');
      localStorage.removeItem('userType');
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
