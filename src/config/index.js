/**
 * Application Configuration
 * Contains blockchain and network settings
 */
const config = {
    // Local blockchain RPC endpoint (Ganache default)
    rpcUrl: 'HTTP://127.0.0.1:7545',
    networkId: 1337,
    networkName: 'Ganache',
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
  };
  
  export default config;