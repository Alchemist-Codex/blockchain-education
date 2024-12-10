import { ethers } from 'ethers'
import AcademicCredentials from '../contracts/AcademicCredentials.json'

/**
 * Service class for interacting with the Academic Credentials smart contract
 */
export class ContractService {
  // Initialize service with null values for contract components
  constructor() {
    this.contract = null    // Smart contract instance
    this.provider = null    // Ethereum provider
    this.signer = null      // Account signer
  }

  /**
   * Initializes the connection to MetaMask and the smart contract
   * @throws {Error} If MetaMask is not installed
   */
  async init() {
    // Check for MetaMask installation
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed')
    }

    // Set up Web3 provider and request account access
    this.provider = new ethers.providers.Web3Provider(window.ethereum)
    await this.provider.send('eth_requestAccounts', [])
    this.signer = this.provider.getSigner()

    // Initialize the smart contract with address from environment variables
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    this.contract = new ethers.Contract(
      contractAddress,
      AcademicCredentials.abi,
      this.signer
    )
  }

  /**
   * Issues a new academic credential on the blockchain
   * @param {string} studentAddress - Ethereum address of the student
   * @param {string} certificateHash - Hash of the certificate
   * @param {string} ipfsHash - IPFS hash of the credential metadata
   * @param {Object} metadata - Additional credential metadata
   * @returns {Promise<TransactionReceipt>} Transaction receipt
   */
  async issueCredential(studentAddress, certificateHash, ipfsHash, metadata) {
    // Initialize contract if not already initialized
    if (!this.contract) await this.init()
    
    // Call the smart contract method to issue credential
    const tx = await this.contract.issueCredential(
      studentAddress,
      certificateHash,
      ipfsHash,
      JSON.stringify(metadata)
    )
    
    // Wait for transaction confirmation
    return await tx.wait()
  }

  /**
   * Verifies a credential by fetching its data from the blockchain
   * @param {string} credentialId - ID of the credential to verify
   * @returns {Promise<Object>} Credential data from the blockchain
   */
  async verifyCredential(credentialId) {
    // Initialize contract if not already initialized
    if (!this.contract) await this.init()
    
    // Fetch and return credential data
    return await this.contract.getCredential(credentialId)
  }
}

// Create and export a singleton instance of the contract service
export const contractService = new ContractService()
