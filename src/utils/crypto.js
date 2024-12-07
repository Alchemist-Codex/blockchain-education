import { ethers } from 'ethers'

export const generateHash = async (data) => {
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['string', 'string', 'string', 'string'],
    [data.type, data.studentName, data.institution, data.ipfsHash]
  )
  return ethers.utils.keccak256(encoded)
}

export const verifyCredentialHash = async (hash, data) => {
  const generatedHash = await generateHash(data)
  return hash === generatedHash
}
