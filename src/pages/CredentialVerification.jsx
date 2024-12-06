import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function CredentialVerification() {
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [hash, setHash] = useState('')

  const handleVerification = async (e) => {
    e.preventDefault()
    setIsVerifying(true)
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus('valid') // or 'invalid'
      setIsVerifying(false)
    }, 2000)
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <motion.div 
        className="max-w-4xl mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Academic Credentials
          </h1>
          <p className="text-xl text-gray-600">
            Instantly verify the authenticity of academic credentials on the blockchain
          </p>
        </motion.div>

        {/* Verification Form */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="p-8">
            <form onSubmit={handleVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential Hash or ID
                </label>
                <input
                  type="text"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="input focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter credential hash..."
                />
              </div>
              
              <div className="flex items-center justify-center">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.button
                    type="submit"
                    className="btn bg-primary-600 text-white hover:bg-primary-700 px-8"
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Credential'}
                  </motion.button>
                  {isVerifying && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* File Upload Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="p-8">
            <div className="text-center">
              <motion.div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer hover:border-primary-500 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-4 text-sm text-gray-600">
                  Drag and drop your credential file here, or click to select
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Verification Result */}
        <AnimatePresence mode="wait">
          {verificationStatus && (
            <motion.div
              key={verificationStatus}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-2xl p-6 ${
                verificationStatus === 'valid' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  verificationStatus === 'valid' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {verificationStatus === 'valid' ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-medium ${
                    verificationStatus === 'valid' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationStatus === 'valid' ? 'Valid Credential' : 'Invalid Credential'}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    verificationStatus === 'valid' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationStatus === 'valid' 
                      ? 'This credential has been verified on the blockchain.' 
                      : 'This credential could not be verified. Please check the hash and try again.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CredentialVerification