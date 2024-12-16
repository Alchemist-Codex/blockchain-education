import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlockchainVideo from '../components/BlockchainVideo';
import { uploadToIPFS } from '../utils/ipfs';
import certificateContractABI from '../abi/CertificateContract.json';

function CredentialUpload() {
  const [formData, setFormData] = useState({
    name: '',
    credentialType: '',
    institution: '',
    file: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ipfsDetails, setIpfsDetails] = useState({
    imageHash: '',
    metadataHash: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG or PNG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB. Please upload a smaller image.');
      return;
    }

    setFormData({ ...formData, file });
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      credentialType: '',
      institution: '',
      file: null
    });
    setImagePreview(null);
    setIpfsDetails({ imageHash: '', metadataHash: '' });
    setIsLoading(false);
    setIsCompleted(false);
  };

  const uploadAndMint = async () => {
    const { name, credentialType, institution, file } = formData;

    if (!name || !credentialType || !institution || !file) {
      toast.error('Please fill in all fields and upload a valid image.');
      return;
    }

    setIsLoading(true);
    try {
      const imageHash = await uploadToIPFS(file);

      const metadata = {
        name,
        credentialType,
        institution,
        imageHash,
        issuedAt: new Date().toISOString()
      };

      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataHash = await uploadToIPFS(metadataBlob);

      setIpfsDetails({ imageHash, metadataHash });
      
      // Blockchain interaction
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const certificateContract = new ethers.Contract(
        process.env.REACT_APP_CERTIFICATE_CONTRACT_ADDRESS,
        certificateContractABI,
        signer
      );

      const tx = await certificateContract.issueCertificate(
        name,
        metadataHash,
        institution
      );

      await tx.wait();
      setIsCompleted(true);
      toast.success('Certificate issued successfully!');
    } catch (error) {
      console.error('Error during upload or blockchain interaction:', error);
      toast.error('Failed to issue certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">Upload and Issue Credential</h1>

          {!isLoading && !isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Recipient Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="credentialType" className="block text-sm font-medium text-gray-700">
                  Credential Type
                </label>
                <input
                  type="text"
                  id="credentialType"
                  name="credentialType"
                  value={formData.credentialType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                  Issuing Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Upload Credential Image
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-4 max-w-xs rounded-md" />
                )}
              </div>

              <button
                onClick={uploadAndMint}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Issue Credential
              </button>
            </motion.div>
          )}

          {isLoading && (
            <BlockchainVideo />
          )}

          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-xl font-semibold text-green-600 mb-4">Credential Issued Successfully!</h2>
              <p className="mb-2">IPFS Image Hash: {ipfsDetails.imageHash}</p>
              <p className="mb-4">IPFS Metadata Hash: {ipfsDetails.metadataHash}</p>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Issue Another Certificate
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CredentialUpload;
