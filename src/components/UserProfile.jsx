import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { user, getUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
        {profile?.displayName?.charAt(0).toUpperCase()}
      </div>
      <span className="text-gray-700 dark:text-gray-300">
        {profile?.displayName || 'User'}
      </span>
    </div>
  );
}

export default UserProfile; 