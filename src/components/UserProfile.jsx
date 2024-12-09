import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2">
      {user.photoURL ? (
        <img 
          src={user.photoURL} 
          alt={user.displayName} 
          className="h-8 w-8 rounded-full"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
          {user.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
      <span className="text-gray-700 dark:text-gray-300">
        {user.displayName || 'User'}
      </span>
    </div>
  );
}

export default UserProfile; 