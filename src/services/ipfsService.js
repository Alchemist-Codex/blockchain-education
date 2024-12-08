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

  async uploadImage(file) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const formData = new FormData();
      formData.append('file', file);

      // Keep original filename but remove spaces and special characters
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();

      // Add metadata for Pinata
      const metadata = JSON.stringify({
        name: cleanFileName,
        keyvalues: {
          type: 'certificate_image',
          originalName: file.name,
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      // Add options for Pinata
      const options = JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: false
      });
      formData.append('pinataOptions', options);

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
      return {
        hash: result.IpfsHash,
        url: this.getFileUrl(result.IpfsHash)
      };
    } catch (error) {
      console.error('Image upload error:', error);
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
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: `certificate_metadata_${Date.now()}`,
            keyvalues: {
              type: 'certificate_metadata',
              timestamp: new Date().toISOString()
            }
          },
          pinataOptions: {
            cidVersion: 1,
            wrapWithDirectory: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('JSON upload error:', error);
      throw error;
    }
  }

  async retrieveFile(hash) {
    try {
      const response = await fetch(this.getFileUrl(hash));
      if (!response.ok) {
        throw new Error(`Retrieval failed: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error('File retrieval error:', error);
      throw error;
    }
  }

  async retrieveJSON(hash) {
    try {
      const response = await this.retrieveFile(hash);
      return await response.json();
    } catch (error) {
      console.error('JSON retrieval error:', error);
      throw error;
    }
  }

  getFileUrl(hash) {
    return `${this.gateway}${hash}`;
  }
}

export const ipfsService = new IPFSService();