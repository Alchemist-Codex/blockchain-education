import { useAuth } from '../contexts/AuthContext';

/**
 * UserProfile Component
 * Displays user avatar and name
 * Handles cases for users with and without profile photos
 */
function UserProfile() {
  // Get user data from auth context
  const { user } = useAuth();

  // Don't render anything if no user is logged in
  if (!user) return null;

  return (
    // Container for profile display
    <div className="flex items-center space-x-2">
      {user.photoURL ? (
        // Display user's profile photo if available
        <img 
          src={user.photoURL} 
          alt={user.displayName} 
          className="h-8 w-8 rounded-full"
        />
      ) : (
        // Display fallback avatar with user's initial or 'U'
        <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
          {user.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
      {/* Display user's name or fallback to 'User' */}
      <span className="text-gray-700 dark:text-gray-300">
        {user.displayName || 'User'}
      </span>
    </div>
  );
}

export default UserProfile; 