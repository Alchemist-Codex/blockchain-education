import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createOrUpdateUser, getUserProfile } from '../services/userService';

function AuthCallback() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoading && isAuthenticated && user) {
        try {
          const userType = localStorage.getItem('userType');
          
          // Get or create user profile
          let userProfile = await getUserProfile(user.email, userType);
          
          if (!userProfile) {
            // Create new user profile if doesn't exist
            userProfile = await createOrUpdateUser({
              email: user.email,
              displayName: user.name,
              picture: user.picture
            }, userType);
          }

          // Set user in context
          setUser({ ...user, ...userProfile });

          // Navigate based on user type
          if (userType === 'student') {
            navigate('/student/dashboard');
          } else if (userType === 'institute') {
            navigate('/institution/dashboard');
          } else {
            navigate('/signin');
          }
        } catch (error) {
          console.error('Error in callback:', error);
          navigate('/signin');
        }
      } else if (!isLoading && !isAuthenticated) {
        navigate('/signin');
      }
    };

    handleCallback();
  }, [isLoading, isAuthenticated, user, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}

export default AuthCallback; 