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
  const { user } = useAuth();
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" />;
  }

  if (requiredUserType && user.userType !== requiredUserType) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;