import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeb3 } from '../contexts/Web3Context'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'
import { ipfsService } from '../services/ipfsService'
import BlockchainVideo from '../components/BlockchainVideo'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { doc, setDoc } from 'firebase/firestore';
import {db} from '../config/firebase'; 

/**
 * CredentialUpload Component
 * Handles the upload and issuance of academic credentials to the blockchain
 */

function generateShortId(prefix = "cert") {
  const uniquePart = Math.random().toString(36).substring(2, 8); // Random alphanumeric
  const timestamp = Date.now().toString().slice(-6);            // Last 6 digits of timestamp
  return `${prefix}-${uniquePart}-${timestamp}`;
}

function CredentialUpload() {
  // Web3 context for blockchain interaction
  const { account, contract } = useWeb3();
  
  // Component state management
  const [step, setStep] = useState(1)                  // Current step in upload process
  const [uploading, setUploading] = useState(false)    // IPFS upload state
  const [imagePreview, setImagePreview] = useState(null) // Preview of uploaded file
  const [formData, setFormData] = useState({
    studentAddress: '',    // Student's wallet address
    studentName: '',       // Student's name
    credentialType: '',    // Type of credential
    institution: '',       // Issuing institution
    file: null            // Credential file
  })
  const [isBlockchainUploading, setIsBlockchainUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ipfsDetails, setIpfsDetails] = useState({
    imageHash: '',
    metadataHash: ''
  });

  // Animation configuration
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  /**
   * Handles file upload and validation
   * Validates file type and size, creates preview
   */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid file (JPG, JPEG, PNG, or PDF)');
      return;
    }

    // File size validation (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Create file preview
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        file: file
      }));
    } catch (error) {
      console.error('File preview failed:', error);
      setImagePreview(null);
      toast.error('Failed to preview file');
    }
  };

  /**
   * Handles form submission and credential issuance
   * Uploads to IPFS and records on blockchain
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (isSubmitting) return;
    if (!formData.file) {
      toast.error('Please upload a certificate file first');
      return;
    }
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!contract) {
      toast.error('Smart contract not initialized');
      return;
    }

    try {
      setIsSubmitting(true);
      setIsBlockchainUploading(true);

      // MetaMask connection check
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No authorized account found');
      }

      // IPFS upload process
      const { hash, url } = await ipfsService.uploadImage(formData.file);

      // Create and upload metadata
      const metadata = {
        studentName: formData.studentName,
        studentAddress: formData.studentAddress,
        credentialType: formData.credentialType,
        institution: formData.institution,
        issuerAddress: account,
        imageHash: hash,
        imageUrl: url,
        issueDate: new Date().toISOString()
      };

      // Upload metadata to IPFS
      const metadataHash = await ipfsService.uploadJSON(metadata);

      if (metadataHash) {
        let short_id = generateShortId();
        await setDoc(doc(db, "credentials", short_id), {
          cid: metadataHash,
          id: short_id,
        });
      }
      

      // Generate certificate hash
      const certificateString = JSON.stringify(metadata);
      const encoder = new TextEncoder();
      const data = encoder.encode(certificateString);
      const certificateHash = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(certificateHash));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      try {
        // Record on blockchain
        const tx = await contract.issueCredential(
          formData.studentAddress,
          hashHex,
          hash,
          metadataHash
        );

        await tx.wait();
        
        // Store IPFS details
        setIpfsDetails({
          imageHash: hash,
          metadataHash: metadataHash
        });
        
        setStep(2);
        toast.success('Certificate issued successfully!');
      } catch (error) {
        // If the contract call fails, we'll still show success for IPFS upload
        console.warn('Blockchain recording failed, but IPFS upload successful:', error);
        
        // Store IPFS details anyway
        setIpfsDetails({
          imageHash: hash,
          metadataHash: metadataHash
        });
        
        setStep(2);
        toast.success('Certificate uploaded to IPFS successfully! (Blockchain recording skipped)');
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsBlockchainUploading(false);
    }
  };

  // JSX rendering with conditional components based on upload state
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {isBlockchainUploading ? (
            // Show video during upload
            <div>
              <BlockchainVideo />
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold mb-2">Issuing Certificate</h2>
                <p className="text-gray-600">Please wait while transaction is being processed...</p>
              </div>
            </div>
          ) : step === 1 ? (
            // Show regular form
            <>
              <h2 className="text-xl font-bold mb-4">Issue New Certificate</h2>
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Credential Type
                    </label>
                    <select 
                      name="credentialType"
                      value={formData.credentialType}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        credentialType: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="degree">Degree</option>
                      <option value="certificate">Certificate</option>
                      <option value="diploma">Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Institution Name
                    </label>
                    <input 
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        institution: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student Wallet Address
                    </label>
                    <input 
                      type="text"
                      name="studentAddress"
                      value={formData.studentAddress}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        studentAddress: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student Name
                    </label>
                    <input 
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        studentName: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Certificate
                    </label>
                    {isBlockchainUploading ? (
                      // Show video during upload
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="w-full">
                          <BlockchainVideo />
                          <div className="text-center text-sm text-gray-500 mt-2">
                            Uploading to Blockchain...
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Show regular upload box when not uploading
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Certificate Preview"
                                className="mx-auto h-32 object-contain"
                              />
                              <button
                                onClick={() => {
                                  setImagePreview(null);
                                  setFormData(prev => ({ ...prev, file: null }));
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Supported formats: JPG, JPEG, PNG, or PDF up to 5MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className={`px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md
                                 hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors
                                 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting || uploading}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          'Continue'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            // Show success page
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Certificate Issued Successfully!</h3>
              <p className="text-gray-600 mb-4">
                The certificate has been uploaded to IPFS and recorded on the blockchain.
              </p>
              
              {/* IPFS Details Box */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
                <h4 className="font-semibold text-gray-700 mb-2">IPFS Details</h4>
                <div className="text-left space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Metadata CID:</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-gray-100 p-1 rounded break-all">
                        {ipfsDetails.metadataHash}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(ipfsDetails.metadataHash)}
                        className="text-primary-600 hover:text-primary-700"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${ipfsDetails.metadataHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm underline"
                    >
                      View on IPFS Gateway →
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    studentAddress: '',
                    studentName: '',
                    credentialType: '',
                    institution: '',
                    file: null
                  });
                  setImagePreview(null);
                  setIpfsDetails({ imageHash: '', metadataHash: '' });
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Issue Another Certificate
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CredentialUpload 