import { useAuth0 } from '@auth0/auth0-react';
import { studentSchema, instituteSchema, userTypes } from '../utils/schema';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const createOrUpdateUser = async (userData, userType) => {
  const { getAccessTokenSilently } = useAuth0();
  try {
    const token = await getAccessTokenSilently();
    
    // First, create/update in users table
    const userResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        userType: userType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    });

    if (!userResponse.ok) throw new Error('Failed to create user');

    // Then, create/update in specific type table
    const specificTableData = userType === userTypes.STUDENT 
      ? {
          ...studentSchema,
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      : {
          ...instituteSchema,
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

    const specificResponse = await fetch(`${API_URL}/${userType}s`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(specificTableData)
    });

    if (!specificResponse.ok) throw new Error(`Failed to create ${userType} profile`);

    return await specificResponse.json();
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    throw error;
  }
};

export const getUserProfile = async (email, userType) => {
  const { getAccessTokenSilently } = useAuth0();
  try {
    const token = await getAccessTokenSilently();
    
    const response = await fetch(`${API_URL}/${userType}s/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Updates a user's profile in Auth0
 * @param {Object} data - The data to update in the user's profile
 * @returns {Promise<boolean>} True if update was successful
 */
export const updateUserProfile = async (data) => {
  const { user, getAccessTokenSilently } = useAuth0();
  try {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Fetches a user's credentials from their metadata
 * @returns {Promise<Array>} Array of user credentials
 */
export const getUserCredentials = async () => {
  const { user } = useAuth0();
  try {
    return user?.['https://your-namespace/credentials'] || [];
  } catch (error) {
    console.error('Error fetching user credentials:', error);
    throw error;
  }
}; 