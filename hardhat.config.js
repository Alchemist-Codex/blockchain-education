// Import required Hardhat plugins and environment configuration
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: '.env', override: true });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Solidity compiler configuration
  solidity: {
    version: "0.8.19",    // Solidity version to use
    settings: {
      optimizer: {
        enabled: true,    // Enable the Solidity optimizer
        runs: 200         // Number of optimizer runs
      }
    }
  },

  // Network configurations for deployment and testing
  networks: {
    // Local Hardhat network configuration
    hardhat: {
      chainId: 1337      // Chain ID for local network
    },
    // Local Ganache network configuration
    localhost: {
      url: "http://127.0.0.1:7545",  // Ganache RPC URL
      chainId: 1337,                 // Chain ID matching Ganache
    }
  },

  // Project structure paths
  paths: {
    sources: "./contracts",     // Smart contract source files
    tests: "./test",           // Test files
    cache: "./cache",          // Compilation cache
    artifacts: "./artifacts"   // Compiled contract artifacts
  }
};

