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
import { userTypes, studentSchema, instituteSchema } from '../utils/schema';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account, connect } = useWeb3();

  const googleProvider = new GoogleAuthProvider();

  const signInOrCreateUser = async (selectedUserType) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;

      // Store user type and session in localStorage
      localStorage.setItem('userType', selectedUserType);
      localStorage.setItem('authSession', JSON.stringify({ timestamp: Date.now() }));

      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          userType: selectedUserType,
          walletAddress: account || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );

      if (selectedUserType === userTypes.STUDENT) {
        const studentRef = doc(db, 'students', user.uid);
        await setDoc(
          studentRef,
          {
            ...studentSchema,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            walletAddress: account || '',
          },
          { merge: true }
        );
      } else {
        const instituteRef = doc(db, 'institutions', user.uid);
        await setDoc(
          instituteRef,
          {
            ...instituteSchema,
            uid: user.uid,
            email: user.email,
            instituteName: user.displayName || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            walletAddress: account || '',
          },
          { merge: true }
        );
      }

      setUser(user);
      setUserType(selectedUserType);
      return user;
    } catch (error) {
      console.error('Error signing in or creating user:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
  
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userRef);
  
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const { sessionToken } = userData;
  
              // Validate session token
              if (sessionToken && Date.now() - sessionToken.timestamp < 5 * 60 * 60 * 1000) {
                localStorage.setItem('authSession', JSON.stringify(sessionToken));
                setUser(currentUser);
                setUserType(userData.userType || localStorage.getItem('userType'));
              } else {
                // Clear session if expired
                await setDoc(userRef, { sessionToken: null }, { merge: true });
                localStorage.removeItem('authSession');
                setUser(null);
                setUserType(null);
              }
            }
          } else {
            setUser(null);
            setUserType(null);
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
  

  const signInWithGoogle = async (selectedUserType) => {
    return await signInOrCreateUser(selectedUserType);
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
      localStorage.removeItem('authSession');
      localStorage.removeItem('userType');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userType,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
