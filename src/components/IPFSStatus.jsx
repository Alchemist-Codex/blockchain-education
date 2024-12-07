import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ipfsService } from '../services/ipfsService';

function IPFSStatus() {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [corsError, setCorsError] = useState(false);

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
      
      // Check for CORS error
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

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'IPFS Connected';
      case 'error': return 'IPFS Error';
      default: return 'Checking IPFS...';
    }
  };

  const getTroubleshootingSteps = () => (
    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      <p className="font-medium mb-2">Troubleshooting Steps:</p>
      <ol className="list-decimal list-inside space-y-1">
        {corsError ? (
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
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        className="relative"
        whileHover={{ scale: showDetails ? 1 : 1.05 }}
      >
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