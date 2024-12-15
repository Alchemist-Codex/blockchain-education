import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useWeb3 } from './Web3Context';
import { userTypes } from '../utils/schema';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { account } = useWeb3();
  const {
    isAuthenticated,
    user: auth0User,
    loginWithPopup,
    logout,
    isLoading,
    getAccessTokenSilently
  } = useAuth0();

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSignInError = (error) => {
    console.error('Sign in error:', error);
    toast.error(error.message || 'Failed to sign in');
  };

  const signIn = async (selectedUserType) => {
    try {
      await loginWithPopup();
      localStorage.setItem('userType', selectedUserType);
      setUserType(selectedUserType);
    } catch (error) {
      handleSignInError(error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await logout({ returnTo: window.location.origin });
      setUser(null);
      setUserType(null);
      localStorage.removeItem('userType');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && auth0User) {
      const storedUserType = localStorage.getItem('userType');
      setUser(auth0User);
      setUserType(storedUserType);
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading, isAuthenticated, auth0User]);

  const value = {
    user,
    userType,
    loading: loading || isLoading,
    signIn,
    signOut: signOutUser,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
