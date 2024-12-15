import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * ProtectedRoute Component
 * Handles route protection based on authentication state and user type
 * @param {ReactNode} children - The protected content to render
 * @param {string} requiredUserType - The user type required to access this route
 */
function ProtectedRoute({ children, requiredUserType }) {
  const { user, isLoading: contextLoading } = useAuth();
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();

  // Show loading state while checking authentication
  if (auth0Loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Check for required user type
  if (requiredUserType && user.userType !== requiredUserType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;