import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqItems = [
    {
      question: "What is Academic Chain?",
      answer: "Academic Chain is a blockchain-based platform that enables educational institutions to issue and verify academic credentials securely. It provides a tamper-proof system for managing educational certificates and degrees."
    },
    {
      question: "How does blockchain ensure credential security?",
      answer: "Blockchain technology creates an immutable record of each credential, making it impossible to alter or forge. Each credential is cryptographically secured and can be independently verified through the blockchain network."
    },
    {
      question: "Who can issue credentials on Academic Chain?",
      answer: "Verified educational institutions can issue credentials on Academic Chain. Institutions must go through a verification process to ensure the legitimacy of credentials issued on the platform."
    },
    {
      question: "How can I verify a credential?",
      answer: "You can verify credentials by uploading the credential file or entering the credential hash in our verification portal. The system will check the blockchain to confirm the credential's authenticity."
    },
    {
      question: "Is my personal data secure?",
      answer: "Yes, we take data security seriously. Personal information is encrypted and stored securely, while only the credential hash is stored on the blockchain, ensuring privacy and compliance with data protection regulations."
    },
    {
      question: "What types of credentials can be issued?",
      answer: "Academic Chain supports various types of credentials including degrees, diplomas, certificates, transcripts, and other academic achievements."
    },
    {
      question: "How long does verification take?",
      answer: "Credential verification is nearly instantaneous. The system checks the blockchain network and returns results within seconds."
    },
    {
      question: "What if I lose my credential access?",
      answer: "Your issuing institution can help restore access to your credentials. We recommend keeping secure backups of your credential files and access information."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <motion.div 
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about Academic Chain
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none group"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {item.question}
                </span>
                <motion.span 
                  className="ml-6 flex-shrink-0 text-primary-600"
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 border-t border-gray-100 text-gray-600 bg-gray-50/50">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-2">
            Still have questions?
          </h2>
          <p className="text-primary-100 mb-6">
            Contact our support team for additional help
          </p>
          <motion.button 
            className="btn bg-white text-primary-600 hover:bg-primary-50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default FAQ 