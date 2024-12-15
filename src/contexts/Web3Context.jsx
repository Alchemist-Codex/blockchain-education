import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import config from '../config'
import toast from 'react-hot-toast'

// Create context for Web3 functionality
const Web3Context = createContext()

/**
 * Web3Provider Component
 * Manages Web3 connection state and provides blockchain interaction capabilities
 */
export function Web3Provider({ children }) {
  // State management for Web3 connection
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState(null)
  const [networkId, setNetworkId] = useState(null)

  // Set up Web3 connection and MetaMask event listeners
  useEffect(() => {
    initWeb3()
    // Listen for MetaMask account changes
    window.ethereum?.on('accountsChanged', handleAccountChange)
    
    // Cleanup event listener on unmount
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountChange)
    }
  }, [])

  useEffect(() => {
    const checkPersistedConnection = async () => {
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      if (wasConnected && window.ethereum) {
        try {
          await connect();
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
          localStorage.removeItem('walletConnected');
        }
      }
    };

    checkPersistedConnection();
  }, []);

  /**
   * Initialize Web3 connection
   * Connects to wallet and sets up contract instance
   */
  const initWeb3 = async () => {
    try {
      setLoading(true)
      // Connect to Web3 and get contract instance
      const { address, contract: web3Contract } = await web3Service.connect()
      setAccount(address)
      setContract(web3Contract)
      // Check if connected address is an institution
      const institutionStatus = await web3Service.isInstitution(address)
      setIsInstitution(institutionStatus)
    } catch (error) {
      console.error('Failed to initialize web3:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle MetaMask account changes
   * Updates state when user switches accounts or disconnects
   * @param {string[]} accounts - Array of connected accounts
   */
  const handleAccountChange = async (accounts) => {
    if (accounts.length > 0) {
      // New account connected
      setAccount(accounts[0])
      const institutionStatus = await web3Service.isInstitution(accounts[0])
      setIsInstitution(institutionStatus)
    } else {
      // All accounts disconnected
      setAccount(null)
      setIsInstitution(false)
      setContract(null)
    }
  }

  const connect = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Get network ID
      const networkId = await window.ethereum.request({ 
        method: 'net_version' 
      });

      // Check if connected to correct network
      if (networkId !== config.networkId.toString()) {
        try {
          // Try to switch to the correct network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${Number(config.networkId).toString(16)}` }],
          });
        } catch (switchError) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${Number(config.networkId).toString(16)}`,
                chainName: config.networkName,
                rpcUrls: [config.rpcUrl],
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                }
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setNetworkId(networkId);

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet: ' + error.message);
    }
  };

  return (
    <Web3Context.Provider value={{ 
      provider, 
      signer, 
      account, 
      networkId,
      connect 
    }}>
      {children}
    </Web3Context.Provider>
  )
}

/**
 * Custom hook to use Web3 context
 * @returns {Object} Web3 context value
 */
export const useWeb3 = () => useContext(Web3Context) 