// Import IPFS HTTP client for interacting with IPFS node
import { create } from 'ipfs-http-client'

// Create IPFS client instance connected to local node
// Note: Assumes local IPFS node is running on default port
const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' })

/**
 * Uploads a file to IPFS
 * @param {Buffer|Blob|String} file - File to upload to IPFS
 * @returns {Promise<Object>} Object containing IPFS hash and file size
 * @throws {Error} If upload fails
 */
export const uploadToIPFS = async (file) => {
  try {
    // Add file to IPFS network
    const added = await ipfs.add(file)
    // Return hash (CID) and size of uploaded file
    return {
      hash: added.path,
      size: added.size
    }
  } catch (error) {
    throw new Error('IPFS upload failed')
  }
}

/**
 * Fetches and parses JSON data from IPFS
 * @param {string} hash - IPFS hash (CID) of the content to fetch
 * @returns {Promise<Object>} Parsed JSON data from IPFS
 * @throws {Error} If fetch or parsing fails
 */
export const fetchFromIPFS = async (hash) => {
  try {
    // Get content stream from IPFS
    const stream = ipfs.cat(hash)
    let data = ''
    
    // Concatenate chunks of data from stream
    for await (const chunk of stream) {
      data += chunk.toString()
    }
    
    // Parse and return JSON data
    return JSON.parse(data)
  } catch (error) {
    throw new Error('IPFS fetch failed')
  }
}
