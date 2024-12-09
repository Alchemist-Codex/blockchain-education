import { create } from 'ipfs-http-client'

const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' })

export const uploadToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file)
    return {
      hash: added.path,
      size: added.size
    }
  } catch (error) {
    throw new Error('IPFS upload failed')
  }
}

export const fetchFromIPFS = async (hash) => {
  try {
    const stream = ipfs.cat(hash)
    let data = ''
    
    for await (const chunk of stream) {
      data += chunk.toString()
    }
    
    return JSON.parse(data)
  } catch (error) {
    throw new Error('IPFS fetch failed')
  }
}
