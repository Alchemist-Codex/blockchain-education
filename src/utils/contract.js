import { ethers } from 'ethers'
import AcademicCredentials from '../contracts/AcademicCredentials.json'

export class ContractService {
  constructor() {
    this.contract = null
    this.provider = null
    this.signer = null
  }

  async init() {
    // Connect to MetaMask
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed')
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum)
    await this.provider.send('eth_requestAccounts', [])
    this.signer = this.provider.getSigner()

    // Initialize contract
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    this.contract = new ethers.Contract(
      contractAddress,
      AcademicCredentials.abi,
      this.signer
    )
  }

  async issueCredential(studentAddress, certificateHash, ipfsHash, metadata) {
    if (!this.contract) await this.init()
    
    const tx = await this.contract.issueCredential(
      studentAddress,
      certificateHash,
      ipfsHash,
      JSON.stringify(metadata)
    )
    
    return await tx.wait()
  }

  async verifyCredential(credentialId) {
    if (!this.contract) await this.init()
    
    return await this.contract.getCredential(credentialId)
  }
}

export const contractService = new ContractService()
