import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { PageTransition } from '../components/PageTransition';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

function SignIn() {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in!');
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Welcome to Academic Chain
            </h2>

            <div className="mt-8">
              <motion.button
                onClick={handleGoogleSignIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 
                         text-gray-600 rounded-lg border border-gray-300
                         transition-all duration-300 font-medium
                         flex items-center justify-center space-x-2
                         dark:bg-gray-700 dark:border-gray-600 
                         dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <FcGoogle className="text-2xl" />
                <span>Continue with Google</span>
              </motion.button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default SignIn; 