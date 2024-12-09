import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
        {user.firstName?.charAt(0).toUpperCase() || user.displayName?.charAt(0).toUpperCase() || 'U'}
      </div>
      <span className="text-gray-700 dark:text-gray-300">
        {user.firstName || user.displayName?.split(' ')[0] || 'User'}
      </span>
    </div>
  );
}

export default UserProfile; 