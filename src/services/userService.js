import { auth0Config } from '../config/auth0';

export const getUserProfile = async (token, email) => {
  try {
    // Encode the email for URL
    const encodedEmail = encodeURIComponent(email);
    
    // Construct the correct Management API URL
    const url = `https://${auth0Config.domain}/api/v2/users-by-email?email=${encodedEmail}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    // Auth0 returns an array of users, we want the first one
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Add this function to get the Management API token
export const getManagementApiToken = async () => {
  try {
    const response = await fetch(`https://${auth0Config.domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: auth0Config.clientId,
        client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET,
        audience: `https://${auth0Config.domain}/api/v2/`,
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get management token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting management token:', error);
    throw error;
  }
}; 