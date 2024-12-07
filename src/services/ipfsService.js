import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

class IPFSService {
  constructor() {
    try {
      this.ipfs = create({
        host: 'localhost',
        port: 5001,
        protocol: 'http'
      });
      console.log('IPFS service initialized');
    } catch (error) {
      console.error('IPFS initialization failed:', error);
      this.handleIPFSError(error);
      throw error;
    }
  }

  handleIPFSError(error) {
    if (error.message.includes('CORS')) {
      console.error('CORS Error Details:', {
        message: error.message,
        origin: window.location.origin,
        ipfsEndpoint: 'http://localhost:5001'
      });
      
      const corsHelp = `
        CORS Error Detected. Please check:
        1. IPFS Desktop is running
        2. IPFS Config has correct CORS headers:
           - Access-Control-Allow-Origin: ["*", "http://localhost:5173"]
           - Access-Control-Allow-Methods: ["PUT", "POST", "GET", "OPTIONS"]
           - Access-Control-Allow-Headers: ["Authorization", "Content-Type"]
        3. IPFS Desktop has been restarted after config changes
      `;
      console.info(corsHelp);
    }
    return error;
  }

  async testConnection() {
    try {
      // Use the proxied endpoint
      const response = await fetch('/ipfs-api/version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('IPFS version:', data);
      return true;
    } catch (error) {
      console.error('IPFS connection test failed:', error);
      this.handleIPFSError(error);
      return false;
    }
  }

  async uploadFile(file) {
    if (!this.ipfs) {
      throw new Error('IPFS not initialized');
    }

    try {
      console.log('Starting file upload to IPFS...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        endpoint: this.ipfsEndpoint
      });

      const buffer = await file.arrayBuffer();

      // Create form data
      const formData = new FormData();
      formData.append('file', new Blob([buffer]));

      // Make the request
      const response = await fetch('http://localhost:5001/api/v0/add', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // IPFS returns one JSON object per line, we need to parse the last line
      const text = await response.text();
      const lines = text.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const result = JSON.parse(lastLine);

      console.log('Upload result:', result);

      // Pin the file
      await fetch(`http://localhost:5001/api/v0/pin/add?arg=${result.Hash}`, {
        method: 'POST'
      });

      // Log the gateway URL
      const gatewayUrl = `http://localhost:8080/ipfs/${result.Hash}`;
      console.log('File available at:', gatewayUrl);

      return result.Hash;

    } catch (error) {
      console.error('Upload error:', error);
      this.handleIPFSError(error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async uploadJSON(jsonData) {
    if (!this.ipfs) {
      throw new Error('IPFS not initialized');
    }

    try {
      const jsonString = JSON.stringify(jsonData);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', new Blob([jsonString], { type: 'application/json' }));

      // Make the request
      const response = await fetch('http://localhost:5001/api/v0/add', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response the same way as file upload
      const text = await response.text();
      const lines = text.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const result = JSON.parse(lastLine);

      console.log('JSON upload successful:', result);

      // Pin the JSON
      await fetch(`http://localhost:5001/api/v0/pin/add?arg=${result.Hash}`, {
        method: 'POST'
      });

      return result.Hash;
    } catch (error) {
      console.error('JSON upload error:', error);
      throw error;
    }
  }

  async getFile(hash) {
    if (!this.ipfs) {
      throw new Error('IPFS not initialized');
    }

    try {
      console.log('Retrieving file with hash:', hash);
      
      const response = await fetch(`http://localhost:5001/api/v0/cat?arg=${hash}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('File retrieval error:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const response = await fetch('http://localhost:5001/api/v0/id', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      const data = JSON.parse(text.trim());
      console.log('IPFS node info:', data);
      return true;
    } catch (error) {
      console.error('IPFS connection test failed:', error);
      return false;
    }
  }
}

export const ipfsService = new IPFSService(); 