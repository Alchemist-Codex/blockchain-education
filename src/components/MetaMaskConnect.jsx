import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';

/**
 * MetaMaskConnect Component
 * Handles MetaMask wallet connection and user authentication
 * Displays different states: Not installed, Connected, Not Connected
 */
function MetaMaskConnect() {
  // Hooks for wallet connection and authentication
  const { account, connect } = useWeb3();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  /**
   * Handles MetaMask wallet connection
   * Clears any previous errors before attempting connection
   */
  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles user sign out
   * Redirects to signin page after successful logout
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out');
    }
  };

  return (
    // Fixed position container in top-right corner
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
      {/* Show user profile if logged in */}
      {user && <UserProfile />}
      
      {/* Sign out button for authenticated users */}
      {user && (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                   rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Sign Out
        </button>
      )}
      
      {/* Conditional rendering based on MetaMask state */}
      {!window.ethereum ? (
        // MetaMask not installed - show install link
        <a 
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Install MetaMask
        </a>
      ) : account ? (
        // Wallet connected - show truncated address
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
        </div>
      ) : (
        // Wallet not connected - show connect button
        <motion.button
          onClick={handleConnect}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Connect Wallet
        </motion.button>
      )}
      
      {/* Error message display */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default MetaMaskConnect; 