/**
 * Application Configuration
 * Contains blockchain and network settings
 */
const networks = {
  ganache: {
    rpcUrl: 'http://localhost:7545',
    wsUrl: 'ws://localhost:7545', // If your Ganache supports WebSocket
    networkId: 1337,
    networkName: 'Ganache',
  },
  sepolia: {
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
    wsUrl: import.meta.env.VITE_SEPOLIA_WS_URL,
    networkId: 11155111,
    networkName: 'Sepolia',
  }
};

const currentNetwork = import.meta.env.VITE_NETWORK || 'ganache';

const config = {
  ...networks[currentNetwork],
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
};

export default config;