import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

class IPFSService {
  constructor() {
    try {
      this.ipfs = create({
        host: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol.replace(':', ''),
        apiPath: '/ipfs-api',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': '*'
        }
      });
      console.log('IPFS service initialized with proxy');
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
        fileType: file.type
      });

      const buffer = await file.arrayBuffer();
      const result = await this.ipfs.add(
        buffer,
        {
          progress: (prog) => console.log(`Upload progress: ${prog}`),
          pin: true
        }
      );

      console.log('Upload successful:', result);
      return result.path;
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
      const data = JSON.stringify(jsonData);
      console.log('Uploading JSON data');
      const result = await this.ipfs.add(data);
      console.log('JSON upload successful:', result);
      return result.path;
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
      const stream = await this.ipfs.cat(hash);
      const chunks = [];
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('File retrieval error:', error);
      throw error;
    }
  }
}

export const ipfsService = new IPFSService(); 