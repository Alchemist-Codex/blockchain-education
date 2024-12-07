class IPFSService {
  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY;
    this.apiSecret = import.meta.env.VITE_PINATA_API_SECRET;
    this.gateway = 'https://gateway.pinata.cloud/ipfs/';
  }

  async testConnection() {
    try {
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.apiSecret
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Pinata connection test:', data);
      return true;
    } catch (error) {
      console.error('Pinata connection test failed:', error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.apiSecret,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);

      return result.IpfsHash;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async uploadJSON(jsonData) {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.apiSecret,
        },
        body: JSON.stringify(jsonData)
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('JSON upload successful:', result);

      return result.IpfsHash;
    } catch (error) {
      console.error('JSON upload error:', error);
      throw error;
    }
  }

  getFileUrl(hash) {
    return `${this.gateway}${hash}`;
  }
}

export const ipfsService = new IPFSService(); 