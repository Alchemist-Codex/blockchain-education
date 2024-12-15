import { useAuth0 } from '@auth0/auth0-react';

/**
 * Fetches a user's profile from Auth0
 * @returns {Promise<Object>} The user's profile data
 */
export const getUserProfile = async () => {
  const { user, getAccessTokenSilently } = useAuth0();
  try {
    const accessToken = await getAccessTokenSilently();
    const userDetailResponse = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return await userDetailResponse.json();
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