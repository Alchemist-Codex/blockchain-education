import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Get Firestore instance from the initialized Firebase app
const db = getFirestore();
const auth = getAuth();

// Get user profile from Firestore
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user's credentials
export const getUserCredentials = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return [];
    }
    return userDoc.data().credentials || [];
  } catch (error) {
    console.error('Error fetching user credentials:', error);
    throw error;
  }
}; 