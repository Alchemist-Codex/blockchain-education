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
      throw error;
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
        fileType: file.type
      });

      // Convert file to buffer
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

      const data = await response.arrayBuffer();
      return Buffer.from(data);
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