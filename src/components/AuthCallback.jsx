import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthCallback() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Set user in your auth context
      setUser(user);
      
      // Get stored user type
      const userType = localStorage.getItem('userType');
      
      // Navigate based on user type
      if (userType === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (userType === 'INSTITUTE') {
        navigate('/institution/dashboard');
      } else {
        navigate('/signin');
      }
    } else if (!isLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isLoading, isAuthenticated, user, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}

export default AuthCallback; 