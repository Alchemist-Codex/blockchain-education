import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * FAQ Component
 * Displays frequently asked questions in an accordion format
 */
function FAQ() {
  // Track which FAQ item is currently open
  const [openIndex, setOpenIndex] = useState(null)

  // Animation configuration for fade-in effect
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  // FAQ data organized by categories
  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is Academic Chain?",
          answer: "Academic Chain is a blockchain-based platform for issuing, managing, and verifying academic credentials. It provides a secure and transparent way to handle educational certificates and degrees."
        },
        {
          question: "How does blockchain ensure credential security?",
          answer: "Blockchain technology creates an immutable record of each credential, making it impossible to tamper with or forge. Each credential is cryptographically secured and can be independently verified."
        },
        {
          question: "Who can use Academic Chain?",
          answer: "Academic Chain is designed for educational institutions, students, and employers. Institutions can issue credentials, students can manage their academic achievements, and employers can verify credentials instantly."
        }
      ]
    },
    {
      category: "Technical",
      questions: [
        {
          question: "What blockchain technology do you use?",
          answer: "We utilize Ethereum blockchain technology, specifically leveraging smart contracts for credential issuance and verification."
        },
        {
          question: "How are credentials stored?",
          answer: "Credentials are stored as encrypted data on the blockchain, with only authorized parties having access to the full credential details."
        },
        {
          question: "Is the platform compatible with existing systems?",
          answer: "Yes, Academic Chain is designed to integrate seamlessly with existing student information systems and credential management platforms."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "How is my data protected?",
          answer: "We implement state-of-the-art encryption and follow strict data protection protocols. Personal information is stored securely and only shared with explicit consent."
        },
        {
          question: "Who can access my credentials?",
          answer: "You have full control over your credentials. Only you can decide who gets access to view or verify your academic achievements."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-16"
          {...fadeIn}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find answers to common questions about Academic Chain
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div 
          className="mb-12"
          {...fadeIn}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            />
            {/* Search Icon */}
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-400 dark:text-gray-500 hover:cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* FAQ Categories with Accordion */}
        {faqs.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            {/* Category Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {category.category}
            </h2>
            {/* Questions List */}
            <div className="space-y-4">
              {category.questions.map((faq, index) => {
                const isOpen = openIndex === `${categoryIndex}-${index}`
                
                return (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                    initial={false}
                  >
                    {/* Question Button with Toggle Arrow */}
                    <motion.button
                      className="w-full px-6 py-4 flex justify-between items-center text-left"
                      onClick={() => setOpenIndex(isOpen ? null : `${categoryIndex}-${index}`)}
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {faq.question}
                      </span>
                      {/* Animated Arrow Icon */}
                      <motion.svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </motion.button>
                    {/* Animated Answer Panel */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* Support Section */}
        <motion.div 
          className="mt-16 text-center bg-white dark:bg-gray-800 rounded-xl p-8"
          {...fadeIn}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          {/* Animated Support Button */}
          <motion.button
            className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg
                     hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQ 