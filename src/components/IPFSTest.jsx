import { useState, useEffect } from 'react';
import { ipfsService } from '../services/ipfsService';

/**
 * IPFSTest Component
 * A simple component to test and display IPFS connection status
 * Used as a basic connectivity indicator
 */
function IPFSTest() {
  // State to track the current connection status
  const [connectionStatus, setConnectionStatus] = useState('Checking...');

  // Check connection status on component mount
  useEffect(() => {
    testConnection();
  }, []);

  /**
   * Tests the connection to IPFS node
   * Updates the status message based on connection result
   */
  const testConnection = async () => {
    try {
      const isConnected = await ipfsService.testConnection();
      setConnectionStatus(isConnected ? 'Connected to IPFS' : 'Failed to connect to IPFS');
    } catch (error) {
      setConnectionStatus('Error connecting to IPFS');
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <p className="text-lg">
          Status: {/* Dynamic color based on connection status */}
          <span className={
            connectionStatus.includes('Connected') ? 'text-green-600' : // Connected = green
            connectionStatus.includes('Failed') ? 'text-red-600' :      // Failed = red
            'text-yellow-600'                                          // Checking = yellow
          }>{connectionStatus}</span>
        </p>
      </div>
    </div>
  );
}

export default IPFSTest; 