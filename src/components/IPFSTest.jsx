import { useState, useEffect } from 'react';
import { ipfsService } from '../services/ipfsService';

function IPFSTest() {
  const [connectionStatus, setConnectionStatus] = useState('Checking...');

  useEffect(() => {
    testConnection();
  }, []);

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
        <p className="text-lg">Status: <span className={
          connectionStatus.includes('Connected') ? 'text-green-600' : 
          connectionStatus.includes('Failed') ? 'text-red-600' : 
          'text-yellow-600'
        }>{connectionStatus}</span></p>
      </div>
    </div>
  );
}

export default IPFSTest; 