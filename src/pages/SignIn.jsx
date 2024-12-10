import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { userTypes } from '../utils/schema';
import { PageTransition } from '../components/PageTransition';
import toast from 'react-hot-toast';

function SignIn() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, loading } = useAuth();
  const { account, connect } = useWeb3();
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState(userTypes.STUDENT);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    instituteName: '',
    enrollmentNumber: '',
    accreditationNumber: ''
  });

  const handleWalletConnect = async () => {
    try {
      await connect();
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!account) {
        await handleWalletConnect();
      }
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!account) {
        await handleWalletConnect();
      }

      if (isSignUp) {
        const additionalData = userType === userTypes.STUDENT ? {
          displayName: formData.displayName,
          enrollmentNumber: formData.enrollmentNumber
        } : {
          instituteName: formData.instituteName,
          accreditationNumber: formData.accreditationNumber
        };

        await signInWithEmail(formData.email, formData.password, userType, additionalData);
      } else {
        await signInWithEmail(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  // Rest of the component with form UI
  // ...
}

export default SignIn; 