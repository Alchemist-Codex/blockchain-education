import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children, requiredUserType }) {
  const { user, userType, loading } = useAuth();
  
  console.log('ProtectedRoute:', { user, userType, loading, requiredUserType });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to the correct dashboard based on user type
    if (userType === userTypes.STUDENT) {
      return <Navigate to="/student/dashboard" replace />;
    } else if (userType === userTypes.INSTITUTE) {
      return <Navigate to="/institution/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute; 