import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeb3 } from '../contexts/Web3Context'
import { ipfsService } from '../services/ipfsService'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

function CredentialUpload() {
  const { account, web3Service } = useWeb3();
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileError, setFileError] = useState('')
  const [formData, setFormData] = useState({
    studentAddress: '',
    studentName: '',
    credentialType: '',
    institution: '',
  })

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFileError('')
    
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setFileError('Please upload a PDF or image file (JPEG, PNG, GIF)')
        setPreview(null)
        return
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10MB')
        setPreview(null)
        return
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        // For PDFs, show an icon or placeholder
        setPreview('/pdf-icon.png') // Add a PDF icon to your public folder
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const file = e.target.querySelector('input[type="file"]').files[0];
      if (!file) throw new Error('No file selected');

      // Show upload starting toast
      toast.loading('Uploading credential...');

      // 1. Upload file to IPFS
      const fileHash = await ipfsService.uploadFile(file);
      console.log('File uploaded to IPFS:', fileHash);
      
      // 2. Create credential metadata
      const metadata = {
        studentName: formData.studentName,
        studentAddress: formData.studentAddress,
        credentialType: formData.credentialType,
        institution: formData.institution,
        issuerAddress: account,
        fileHash: fileHash,
        issueDate: new Date().toISOString(),
        fileName: file.name,
        fileType: file.type
      };
      
      // 3. Upload metadata to IPFS
      const metadataHash = await ipfsService.uploadJSON(metadata);
      console.log('Metadata uploaded to IPFS:', metadataHash);
      
      // 4. Generate certificate hash for blockchain
      const certificateHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(metadata))
      );
      
      // 5. Send to smart contract
      const tx = await web3Service.contract.issueCredential(
        formData.studentAddress,
        certificateHash,
        fileHash,
        metadataHash
      );
      
      await tx.wait();
      toast.dismiss();
      toast.success('Credential uploaded successfully!');
      setStep(2);
    } catch (error) {
      console.error('Error uploading credential:', error);
      toast.dismiss();
      toast.error(error.message || 'Error uploading credential');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          {...fadeIn}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Academic Credential
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Issue new academic credentials securely on the blockchain
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2].map((number) => (
              <div key={number} className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= number 
                      ? 'bg-primary-600 dark:bg-primary-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                  animate={{
                    scale: step === number ? 1.1 : 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {number}
                </motion.div>
                {number === 1 && (
                  <div className={`h-1 w-24 mx-2 ${
                    step > 1 
                      ? 'bg-primary-600 dark:bg-primary-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Sections */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Credential Type
                  </label>
                  <select 
                    name="credentialType"
                    value={formData.credentialType}
                    onChange={handleInputChange}
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
                    Student Wallet Address
                  </label>
                  <input 
                    type="text"
                    name="studentAddress"
                    value={formData.studentAddress}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                                border-gray-300 dark:border-gray-600 rounded-md">
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <div className="mb-4">
                          {preview.startsWith('data:image') ? (
                            <img
                              src={preview}
                              alt="Preview"
                              className="mx-auto h-32 w-auto rounded-lg"
                            />
                          ) : (
                            <img
                              src={preview}
                              alt="PDF"
                              className="mx-auto h-16 w-auto"
                            />
                          )}
                        </div>
                      ) : (
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
                      )}
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png,.gif"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF or Image up to 10MB
                      </p>
                      {fileError && (
                        <p className="text-red-500 text-xs mt-2">{fileError}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md
                             hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
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