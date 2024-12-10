import { ethers } from 'ethers';
import AcademicCredentials from '../../artifacts/contracts/AcademicCredentials.sol/AcademicCredentials.json';

/**
 * Service class for handling Web3 interactions with Ethereum blockchain
 */
class Web3Service {
  // Initialize service with null values for Web3 components
  constructor() {
    this.provider = null;    // Ethereum provider (MetaMask)
    this.signer = null;      // Account signer for transactions
    this.contract = null;    // Smart contract instance
  }

  /**
   * Connects to MetaMask and initializes the smart contract
   * @returns {Promise<Object>} Connection details including address, provider, signer, and contract
   */
  async connect() {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      // Initialize provider and signer with MetaMask
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Get contract address from environment variables
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("Contract address not found in environment variables");
      }

      // Log initialization parameters for debugging
      console.log('Initializing contract with:', {
        address: contractAddress,
        hasABI: !!AcademicCredentials.abi,
        signer: this.signer
      });

      // Initialize the smart contract instance
      this.contract = new ethers.Contract(
        contractAddress,
        AcademicCredentials.abi,
        this.signer
      );

      // Return connection details
      return {
        address: await this.signer.getAddress(),
        provider: this.provider,
        signer: this.signer,
        contract: this.contract
      };
    } catch (error) {
      console.error("Web3 connection error:", error);
      throw error;
    }
  }

  /**
   * Checks if an address belongs to a registered institution
   * @param {string} address - Ethereum address to check
   * @returns {Promise<boolean>} Whether the address is a registered institution
   */
  async isInstitution(address) {
    try {
      return await this.contract.isInstitution(address);
    } catch (error) {
      console.error("Error checking institution status:", error);
      return false;
    }
  }

  /**
   * Returns the initialized contract instance
   * @returns {ethers.Contract} The smart contract instance
   * @throws {Error} If contract is not initialized
   */
  getContract() {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect first.");
    }
    return this.contract;
  }
}

// Create and export a singleton instance of the service
export const web3Service = new Web3Service(); 