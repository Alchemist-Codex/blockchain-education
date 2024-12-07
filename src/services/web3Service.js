import { ethers } from 'ethers';
import AcademicCredentials from '../../artifacts/contracts/AcademicCredentials.sol/AcademicCredentials.json';

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
      
      // Initialize contract
      this.contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
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
}

export const web3Service = new Web3Service(); 