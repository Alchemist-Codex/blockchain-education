import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function UploadCredential() {
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    credentialType: '',
    issueDate: '',
    expiryDate: '',
    institution: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setStep(3)
      setIsUploading(false)
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
            Issue New Credential
          </h1>
          <p className="text-xl text-gray-600">
            Create and issue blockchain-verified academic credentials
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center">
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= item ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {item}
                </motion.div>
                {item < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    step > item ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm text-gray-600">
            <span>Details</span>
            <span>Upload</span>
            <span>Confirm</span>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              {...fadeIn}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      className="input focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Email
                    </label>
                    <input
                      type="email"
                      value={formData.studentEmail}
                      onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                      className="input focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential Type
                    </label>
                    <select
                      value={formData.credentialType}
                      onChange={(e) => setFormData({...formData, credentialType: e.target.value})}
                      className="input focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="degree">Degree</option>
                      <option value="certificate">Certificate</option>
                      <option value="diploma">Diploma</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({...formData, institution: e.target.value})}
                      className="input focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                      className="input focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="input focus:ring-primary-500 focus:border-primary-500"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="input focus:ring-primary-500 focus:border-primary-500 h-32"
                    required
                  />
                </motion.div>

                <motion.div 
                  className="flex justify-end"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="submit"
                    className="btn bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Next Step
                  </button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              {...fadeIn}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
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
                    Upload supporting documents (PDF, Images)
                  </p>
                </motion.div>

                <div className="mt-8 flex justify-between">
                  <motion.button
                    onClick={() => setStep(1)}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Previous Step
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    className="btn bg-primary-600 text-white hover:bg-primary-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </div>
                    ) : (
                      'Issue Credential'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              {...fadeIn}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Credential Issued Successfully!
              </h3>
              <p className="text-gray-600 mb-8">
                The credential has been securely stored on the blockchain
              </p>
              <motion.button
                onClick={() => window.location.reload()}
                className="btn bg-primary-600 text-white hover:bg-primary-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Issue Another Credential
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default UploadCredential 