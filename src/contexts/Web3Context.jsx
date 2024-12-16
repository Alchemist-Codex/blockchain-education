import { createContext, useContext, useState, useEffect } from 'react'
import { web3Service } from '../services/web3Service'

// Create context for Web3 functionality
const Web3Context = createContext()

/**
 * Web3Provider Component
 * Manages Web3 connection state and provides blockchain interaction capabilities
 */
export function Web3Provider({ children }) {
  // State management for Web3 connection
  const [account, setAccount] = useState(null)         // Connected wallet address
  const [isInstitution, setIsInstitution] = useState(false) // Institution status
  const [loading, setLoading] = useState(true)         // Loading state
  const [contract, setContract] = useState(null)       // Smart contract instance

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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      localStorage.setItem('walletConnected', 'true');
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider value={{ 
      account,           // Connected wallet address
      isInstitution,     // Institution status
      loading,           // Loading state
      contract,          // Smart contract instance
      web3Service,       // Web3 service utilities
      connect: connect  // Connection function
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