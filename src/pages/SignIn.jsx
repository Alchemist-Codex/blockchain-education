// Import necessary dependencies and components
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { userTypes } from '../utils/schema';
import { PageTransition } from '../components/PageTransition';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

function SignIn() {
  // Hooks for navigation and authentication
  const navigate = useNavigate();
  const { signInWithGoogle, loading } = useAuth();
  const { account, connect } = useWeb3();
  
  // State management for user type selection and sign-in status
  const [selectedUserType, setSelectedUserType] = useState(userTypes.STUDENT);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Handler for connecting wallet
  const handleWalletConnect = async () => {
    try {
      await connect();
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  // Handler for Google Sign In process
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      if (!account) {
        await handleWalletConnect();
      }
      const user = await signInWithGoogle(selectedUserType);
      
      // Store wallet connection in localStorage
      localStorage.setItem('walletConnected', 'true');
      
      // Navigate based on stored user type
      const userType = localStorage.getItem('userType');
      if (userType === userTypes.STUDENT) {
        navigate('/student/qa-form');
      } else if (userType === userTypes.INSTITUTE) {
        navigate('/institution/qa-form-institute');
      } else {
        navigate('/unauthorized');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <PageTransition>
      {/* Main container with responsive padding */}
      <div className="min-h-screen bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center p-4">
        {/* Animated content container */}
        <motion.div
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header section */}
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
          
          {/* Sign in form section */}
          <div className="mt-8 space-y-6">
            {/* User type selection buttons */}
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setSelectedUserType(userTypes.STUDENT)}
                className={`px-4 py-2 rounded-md ${
                  selectedUserType === userTypes.STUDENT
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-950'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setSelectedUserType(userTypes.INSTITUTE)}
                className={`px-4 py-2 rounded-md ${
                  selectedUserType === userTypes.INSTITUTE
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-950'
                }`}
              >
                Institution
              </button>
            </div>

            {/* Google Sign In button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading || isSigningIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {/* Google icon */}
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FcGoogle className="h-5 w-5" />
              </span>
              {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
            </button>     
            
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default SignIn; 