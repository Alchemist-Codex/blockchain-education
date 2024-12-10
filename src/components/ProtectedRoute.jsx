import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { userTypes } from '../utils/schema';

function ProtectedRoute({ children, requiredUserType }) {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute; 