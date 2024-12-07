import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../contexts/Web3Context';
import UserProfile from './UserProfile';

function MetaMaskConnect() {
  const { account, connect } = useWeb3();
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      setError(err.message);
    }
  };

  const addGanacheNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x539', // 1337 in hex
          chainName: 'Ganache',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['http://127.0.0.1:7545'],
          blockExplorerUrls: null
        }]
      });
    } catch (error) {
      console.error('Error adding Ganache network:', error);
      setError('Failed to add Ganache network');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
      <UserProfile />
      
      {!window.ethereum ? (
        <a 
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Install MetaMask
        </a>
      ) : account ? (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-gray-700 dark:text-gray-300">Connected</span>
        </div>
      ) : (
        <div className="flex flex-col items-end">
          <motion.button
            onClick={handleConnect}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect Wallet
          </motion.button>
          <motion.button
            onClick={addGanacheNetwork}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Ganache Network
          </motion.button>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MetaMaskConnect; 