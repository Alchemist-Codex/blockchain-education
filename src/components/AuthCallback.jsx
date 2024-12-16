import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function AuthCallback() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoading && isAuthenticated && user) {
        try {
          // Get the stored user type
          const userType = localStorage.getItem('userType');
          
          if (!userType) {
            toast.error('User type not found');
            navigate('/signin');
            return;
          }

          // Create user object with type
          const userData = {
            ...user,
            userType,
            email: user.email,
            name: user.name,
            picture: user.picture
          };

          // Set user in context
          setUser(userData);

          // Store auth session
          localStorage.setItem('authSession', 'true');

          // Navigate based on user type
          if (userType === 'student') {
            toast.success('Welcome Student!');
            navigate('/student/dashboard');
          } else if (userType === 'institute') {
            toast.success('Welcome Institution!');
            navigate('/institution/dashboard');
          } else {
            toast.error('Invalid user type');
            navigate('/signin');
          }
        } catch (error) {
          console.error('Error in callback:', error);
          toast.error('Authentication failed');
          navigate('/signin');
        }
      } else if (!isLoading && !isAuthenticated) {
        toast.error('Authentication failed');
        navigate('/signin');
      }
    };

    handleCallback();
  }, [isLoading, isAuthenticated, user, navigate, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return null;
}

export default AuthCallback; 