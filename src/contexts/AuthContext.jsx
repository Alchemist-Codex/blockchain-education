import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';

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

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage if available
    const savedFirstName = localStorage.getItem('userFirstName');
    const currentUser = auth.currentUser;
    if (currentUser && savedFirstName) {
      return {
        ...currentUser,
        firstName: savedFirstName
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get firstName from localStorage if available, otherwise from user
        const firstName = localStorage.getItem('userFirstName') || user.displayName?.split(' ')[0] || 'User';
        setUser({
          ...user,
          firstName
        });
      } else {
        setUser(null);
        localStorage.removeItem('userName');
        localStorage.removeItem('userFirstName');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firstName = result.user.displayName?.split(' ')[0] || 'User';
      
      // Store in localStorage
      localStorage.setItem('userName', result.user.displayName);
      localStorage.setItem('userFirstName', firstName);
      
      setUser({
        ...result.user,
        firstName
      });
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: () => {
      localStorage.removeItem('userName');
      localStorage.removeItem('userFirstName');
      return signOut(auth);
    },
    getCurrentUser: () => auth.currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 