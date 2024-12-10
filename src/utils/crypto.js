// Import ethers library for cryptographic functions
import { ethers } from 'ethers'

/**
 * Generates a Keccak-256 hash of credential data
 * @param {Object} data - Credential data to hash
 * @param {string} data.type - Type of credential
 * @param {string} data.studentName - Name of the student
 * @param {string} data.institution - Name of the issuing institution
 * @param {string} data.ipfsHash - IPFS hash of the credential metadata
 * @returns {Promise<string>} Keccak-256 hash of the encoded data
 */
export const generateHash = async (data) => {
  // Encode the credential data using Ethereum's ABI encoder
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['string', 'string', 'string', 'string'],  // Types of the parameters
    [data.type, data.studentName, data.institution, data.ipfsHash]  // Values to encode
  )
  // Generate and return Keccak-256 hash of the encoded data
  return ethers.utils.keccak256(encoded)
}

/**
 * Verifies if a given hash matches the hash of provided credential data
 * @param {string} hash - Original hash to verify against
 * @param {Object} data - Credential data to verify
 * @returns {Promise<boolean>} True if hashes match, false otherwise
 */
export const verifyCredentialHash = async (hash, data) => {
  // Generate hash from provided data
  const generatedHash = await generateHash(data)
  // Compare original hash with generated hash
  return hash === generatedHash
}
