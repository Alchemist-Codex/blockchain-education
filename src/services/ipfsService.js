// IPFS Service class for handling interactions with Pinata IPFS
class IPFSService {
  // Initialize service with Pinata API credentials
  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY;
    this.apiSecret = import.meta.env.VITE_PINATA_API_SECRET;
    this.gateway = 'https://gateway.pinata.cloud/ipfs/';
  }

  // Test the connection to Pinata API
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

  // Upload an image file to IPFS through Pinata
  async uploadImage(file) {
    try {
      // Ensure the file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Prepare form data for upload
      const formData = new FormData();
      formData.append('file', file);

      // Clean filename for storage
      const originalFileName = file.name;
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();

      // Create metadata for the file
      const metadata = JSON.stringify({
        name: cleanFileName,
        keyvalues: {
          type: 'certificate_image',
          originalFileName: originalFileName,
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      // Set Pinata-specific options
      const options = JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: false
      });
      formData.append('pinataOptions', options);

      // Make the upload request
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

      // Return upload results with file information
      const result = await response.json();
      return {
        hash: result.IpfsHash,
        url: this.getFileUrl(result.IpfsHash),
        originalFileName: originalFileName
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  // Upload JSON data to IPFS through Pinata
  async uploadJSON(jsonData) {
    try {
      // Make request to pin JSON data
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

  // Retrieve a file from IPFS using its hash
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

  // Retrieve and parse JSON data from IPFS
  async retrieveJSON(hash) {
    try {
      const response = await this.retrieveFile(hash);
      return await response.json();
    } catch (error) {
      console.error('JSON retrieval error:', error);
      throw error;
    }
  }

  // Generate the full IPFS gateway URL for a file
  getFileUrl(hash) {
    return `${this.gateway}${hash}`;
  }
}

// Create and export a singleton instance of the service
const ipfsService = new IPFSService();
export { ipfsService };