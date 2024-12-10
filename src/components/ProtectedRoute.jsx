import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute Component
 * Handles route protection based on authentication state and user type
 * @param {ReactNode} children - The protected content to render
 * @param {string} requiredUserType - The user type required to access this route
 */
function ProtectedRoute({ children, requiredUserType }) {
  // Get authentication context values
  const { user, userType, loading } = useAuth();
  
  // Debug logging for route protection
  console.log('ProtectedRoute:', { user, userType, loading, requiredUserType });

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to sign in if no user is authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Handle user type validation
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect users to their appropriate dashboard based on their type
    if (userType === userTypes.STUDENT) {
      return <Navigate to="/student/dashboard" replace />;
    } else if (userType === userTypes.INSTITUTE) {
      return <Navigate to="/institution/dashboard" replace />;
    }
    // If user type doesn't match any known type, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected content
  return children;
}

export default ProtectedRoute; 