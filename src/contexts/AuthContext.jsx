import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseService } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseService.auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const user = await firebaseService.signInWithGoogle();
      
      // Store user data in Firestore
      await setDoc(doc(firebaseService.db, 'users', user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: firebaseService.signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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