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
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const { isAuthenticated, user: auth0User, isLoading } = useAuth0();

  useEffect(() => {
    // Update user when Auth0 authentication state changes
    if (isAuthenticated && auth0User) {
      const userType = localStorage.getItem('userType');
      const userData = {
        ...auth0User,
        userType,
        email: auth0User.email,
        name: auth0User.name,
        picture: auth0User.picture
      };
      
      setUser(userData);
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authSession', 'true');
    } else if (!isLoading && !isAuthenticated) {
      // Clear user data when not authenticated
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authSession');
      localStorage.removeItem('userType');
    }
  }, [isAuthenticated, auth0User, isLoading]);

  const value = {
    user,
    setUser,
    userType: user?.userType,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
