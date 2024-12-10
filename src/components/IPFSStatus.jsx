import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ipfsService } from '../services/ipfsService';

/**
 * IPFSStatus Component
 * Displays a floating status indicator for IPFS connection
 * Includes detailed troubleshooting information and connection checking
 */
function IPFSStatus() {
  // State management for component
  const [status, setStatus] = useState('checking');        // Current connection status
  const [lastChecked, setLastChecked] = useState(null);    // Timestamp of last check
  const [showDetails, setShowDetails] = useState(false);   // Controls detail panel visibility
  const [errorMessage, setErrorMessage] = useState('');    // Stores error messages
  const [corsError, setCorsError] = useState(false);       // Specific flag for CORS errors

  /**
   * Attempts to connect to IPFS node and updates status
   * Handles different types of errors, including CORS issues
   */
  const checkConnection = async () => {
    try {
      const nodeInfo = await ipfsService.testConnection();
      if (nodeInfo) {
        setStatus('connected');
        setErrorMessage('');
        setCorsError(false);
      } else {
        throw new Error('Cannot connect to IPFS node');
      }
    } catch (error) {
      console.error('IPFS connection error:', error);
      setStatus('error');
      
      // Special handling for CORS errors
      if (error.message.includes('CORS')) {
        setCorsError(true);
        setErrorMessage('CORS Error: IPFS connection blocked. Check IPFS Desktop settings.');
      } else {
        setCorsError(false);
        setErrorMessage(error.message);
      }
    } finally {
      setLastChecked(new Date());
    }
  };

  // Set up periodic connection checking
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  /**
   * Helper function to determine status indicator color
   */
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  /**
   * Helper function to get human-readable status text
   */
  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'IPFS Connected';
      case 'error': return 'IPFS Error';
      default: return 'Checking IPFS...';
    }
  };

  /**
   * Renders appropriate troubleshooting steps based on error type
   */
  const getTroubleshootingSteps = () => (
    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      <p className="font-medium mb-2">Troubleshooting Steps:</p>
      <ol className="list-decimal list-inside space-y-1">
        {corsError ? (
          // CORS-specific troubleshooting steps
          <>
            <li>Open IPFS Desktop Settings</li>
            <li>Add these CORS headers:
              <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
                {JSON.stringify({
                  "Access-Control-Allow-Origin": ["*", "http://localhost:5173"],
                  "Access-Control-Allow-Methods": ["PUT", "POST", "GET", "OPTIONS"],
                  "Access-Control-Allow-Headers": ["Authorization", "Content-Type"]
                }, null, 2)}
              </pre>
            </li>
            <li>Save settings and restart IPFS Desktop</li>
          </>
        ) : (
          // General troubleshooting steps
          <>
            <li>Ensure IPFS Desktop is running</li>
            <li>Check your internet connection</li>
            <li>Try restarting IPFS Desktop</li>
          </>
        )}
      </ol>
    </div>
  );

  return (
    // Fixed position container for status indicator
    <div className="fixed bottom-4 right-4 z-50">
      {/* Animated container with hover effect */}
      <motion.div
        className="relative"
        whileHover={{ scale: showDetails ? 1 : 1.05 }}
      >
        {/* Status button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full 
                     ${status === 'error' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-white dark:bg-gray-800'} 
                     shadow-lg hover:shadow-xl transition-shadow`}
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {getStatusText()}
          </span>
        </button>

        {/* Animated details panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 w-80 p-4 
                         bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                IPFS Status Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Status: {getStatusText()}
                </p>
                {errorMessage && (
                  <p className="text-red-500 dark:text-red-400 break-words">
                    Error: {errorMessage}
                  </p>
                )}
                {lastChecked && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Last Checked: {lastChecked.toLocaleTimeString()}
                  </p>
                )}
                {status === 'error' && getTroubleshootingSteps()}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    checkConnection();
                  }}
                  className="w-full mt-2 px-3 py-1.5 bg-primary-500 text-white rounded-md 
                           hover:bg-primary-600 transition-colors"
                >
                  Check Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default IPFSStatus; 