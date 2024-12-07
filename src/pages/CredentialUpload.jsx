import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeb3 } from '../contexts/Web3Context'
import { ipfsService } from '../services/ipfsService'
import { ethers } from 'ethers'

function CredentialUpload() {
  const { account, web3Service } = useWeb3();
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    studentAddress: '',
    studentName: '',
    credentialType: '',
    institution: '',
    imageHash: '',
    imageUrl: ''
  })

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      // Show preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }

      // Upload to IPFS
      const { hash, url } = await ipfsService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        imageHash: hash,
        imageUrl: url
      }));
    } catch (error) {
      console.error('File upload failed:', error);
      setImagePreview(null);
    } finally {
      setUploading(false);
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
    e.preventDefault()
    setUploading(true)
    
    try {
      // Create credential metadata with image
      const metadata = {
        studentName: formData.studentName,
        studentAddress: formData.studentAddress,
        credentialType: formData.credentialType,
        institution: formData.institution,
        issuerAddress: account,
        imageHash: formData.imageHash,
        imageUrl: formData.imageUrl,
        issueDate: new Date().toISOString()
      };
      
      // Upload metadata to IPFS
      const metadataHash = await ipfsService.uploadJSON(metadata);
      
      // Generate certificate hash
      const certificateHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(metadata))
      );
      
      // Send to smart contract
      const tx = await web3Service.contract.issueCredential(
        formData.studentAddress,
        certificateHash,
        formData.imageHash,
        metadataHash
      );
      
      await tx.wait();
      setStep(2);
    } catch (error) {
      console.error('Error uploading credential:', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Issue New Certificate</h2>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
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
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                              border-gray-300 dark:border-gray-600 rounded-md">
                  <div className="space-y-1 text-center">
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
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange}
                          accept="image/*,.pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Image or PDF/DOC up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-2 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Certificate preview"
                    className="max-h-48 rounded shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({
                        ...prev,
                        imageHash: '',
                        imageUrl: ''
                      }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {uploading && (
                <div className="text-sm text-gray-500">
                  Uploading...
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md
                           hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  disabled={uploading}
                >
                  {uploading ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center"
            >
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your credential has been successfully uploaded to the blockchain
              </p>
              <motion.button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md
                          hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Upload Another
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CredentialUpload 