import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseService } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseService.auth, (user) => {
      console.log('Auth state changed:', user);
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setError(error);
      setLoading(false);
      toast.error('Authentication error: ' + error.message);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      console.log('Attempting Google sign in...');
      const user = await firebaseService.signInWithGoogle();
      console.log('Sign in successful:', user);
      return user;
    } catch (error) {
      console.error("Google sign in error:", error);
      setError(error);
      toast.error('Sign in failed: ' + error.message);
      throw error;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseService.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error);
      toast.error('Sign out failed: ' + error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 