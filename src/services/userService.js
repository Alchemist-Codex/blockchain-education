import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Initialize Firebase services
// Get Firestore database instance
const db = getFirestore();
// Get Firebase Authentication instance
const auth = getAuth();

/**
 * Fetches a user's profile from Firestore
 * @param {string} userId - The unique identifier of the user
 * @returns {Promise<Object>} The user's profile data
 */
export const getUserProfile = async (userId) => {
  try {
    // Attempt to fetch user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    // Throw error if user document doesn't exist
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    // Return the user's profile data
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Updates a user's profile in Firestore
 * @param {string} userId - The unique identifier of the user
 * @param {Object} data - The data to update in the user's profile
 * @returns {Promise<boolean>} True if update was successful
 */
export const updateUserProfile = async (userId, data) => {
  try {
    // Update the user document with new data
    await updateDoc(doc(db, 'users', userId), data);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Fetches a user's credentials from their profile
 * @param {string} userId - The unique identifier of the user
 * @returns {Promise<Array>} Array of user credentials, empty if none found
 */
export const getUserCredentials = async (userId) => {
  try {
    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    // Return empty array if user document doesn't exist
    if (!userDoc.exists()) {
      return [];
    }
    // Return credentials array from user data, or empty array if none exist
    return userDoc.data().credentials || [];
  } catch (error) {
    console.error('Error fetching user credentials:', error);
    throw error;
  }
}; 