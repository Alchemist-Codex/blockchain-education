import { useState, useEffect } from 'react';
import { ipfsService } from '../services/ipfsService';

function IPFSTest() {
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [testFile, setTestFile] = useState(null);
  const [uploadedHash, setUploadedHash] = useState('');
  const [retrievedData, setRetrievedData] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const isConnected = await ipfsService.testConnection();
      setConnectionStatus(isConnected ? 'Connected to IPFS' : 'Failed to connect to IPFS');
    } catch (error) {
      setConnectionStatus('Error connecting to IPFS');
      console.error('Connection test failed:', error);
    }
  };

  const handleFileChange = (e) => {
    setTestFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!testFile) return;
    
    try {
      setConnectionStatus('Uploading...');
      const hash = await ipfsService.uploadFile(testFile);
      setUploadedHash(hash);
      setConnectionStatus('File uploaded successfully!');
    } catch (error) {
      setConnectionStatus('Upload failed');
      console.error('Upload error:', error);
    }
  };

  const handleRetrieve = async () => {
    if (!uploadedHash) return;
    
    try {
      setConnectionStatus('Retrieving...');
      const data = await ipfsService.getFile(uploadedHash);
      setRetrievedData(data);
      setConnectionStatus('File retrieved successfully!');
    } catch (error) {
      setConnectionStatus('Retrieval failed');
      console.error('Retrieval error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">IPFS Connection Test</h2>
      
      <div className="mb-4">
        <p className="text-lg">Status: <span className={
          connectionStatus.includes('Connected') ? 'text-green-600' : 
          connectionStatus.includes('Failed') ? 'text-red-600' : 
          'text-yellow-600'
        }>{connectionStatus}</span></p>
      </div>

      <div className="space-y-4">
        <div>
          <input 
            type="file" 
            onChange={handleFileChange}
            className="mb-2"
          />
          <button 
            onClick={handleUpload}
            disabled={!testFile}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Upload Test File
          </button>
        </div>

        {uploadedHash && (
          <div className="break-all">
            <p className="font-semibold">Uploaded File Hash:</p>
            <p className="text-sm">{uploadedHash}</p>
            <button 
              onClick={handleRetrieve}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Retrieve File
            </button>
          </div>
        )}

        {retrievedData && (
          <div>
            <p className="font-semibold">Retrieved Data:</p>
            <p className="text-sm break-all">{retrievedData.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IPFSTest; 