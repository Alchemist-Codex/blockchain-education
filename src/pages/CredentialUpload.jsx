import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeb3 } from '../contexts/Web3Context'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'
import { ipfsService } from '../services/ipfsService'
import BlockchainVideo from '../components/BlockchainVideo'

function CredentialUpload() {
  const { account, contract } = useWeb3();
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    studentAddress: '',
    studentName: '',
    credentialType: '',
    institution: '',
    file: null
  })
  const [isBlockchainUploading, setIsBlockchainUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type with more explicit formats
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

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      // Only create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Store file for later upload
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!formData.file) {
      toast.error('Please upload a certificate file first');
      return;
    }

    // Check MetaMask connection first
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

      // Request MetaMask account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No authorized account found');
      }

      // First upload file to IPFS
      const { hash, url } = await ipfsService.uploadImage(formData.file);

      // Create credential metadata
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

      // Generate certificate hash without using ethers.utils
      const certificateString = JSON.stringify(metadata);
      const encoder = new TextEncoder();
      const data = encoder.encode(certificateString);
      const certificateHash = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(certificateHash));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Send transaction to blockchain
      const tx = await contract.issueCredential(
        formData.studentAddress,
        hashHex,
        hash,
        metadataHash
      );

      await tx.wait();
      
      // Success! Move to next step
      setStep(2);
      toast.success('Certificate issued successfully!');

    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsBlockchainUploading(false);
    }
  };

  return (
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Issue Another Certificate
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CredentialUpload 