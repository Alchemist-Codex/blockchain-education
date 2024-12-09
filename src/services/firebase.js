import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

export const firebaseService = {
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update auth profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: displayName,
        email: email,
        createdAt: new Date().toISOString(),
        role: 'user'
      });

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  async getUserProfile(userId) {
   try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      throw error;
    }
  }
}; 