import { ethers } from 'ethers';
import AcademicCredentials from '../../artifacts/contracts/AcademicCredentials/AcademicCredentials.json';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  async connect() {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      // Connect to MetaMask
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Initialize contract with proper error handling
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("Contract address not found in environment variables");
      }

      console.log('Initializing contract with:', {
        address: contractAddress,
        hasABI: !!AcademicCredentials.abi,
        signer: this.signer
      });

      this.contract = new ethers.Contract(
        contractAddress,
        AcademicCredentials.abi,
        this.signer
      );

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

  async isInstitution(address) {
    try {
      return await this.contract.isInstitution(address);
    } catch (error) {
      console.error("Error checking institution status:", error);
      return false;
    }
  }

  // Add a method to get the contract instance
  getContract() {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect first.");
    }
    return this.contract;
  }
}

export const web3Service = new Web3Service(); 