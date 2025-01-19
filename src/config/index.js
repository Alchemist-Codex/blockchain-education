/**
 * Application Configuration
 * Contains blockchain and network settings
 */
const config = {
    // Local blockchain RPC endpoint (Ganache default)
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    networkId: 43113,
    networkName: 'Fuji',
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
  };
  
  export default config;