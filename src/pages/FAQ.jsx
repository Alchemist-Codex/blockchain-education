import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'

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
    <Layout>
      <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900/90 py-12 transition-colors duration-200">
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
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden"
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

            <motion.div 
              className="mt-16 text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8"
              {...fadeIn}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Need Further Assistance?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If you can't find the answer you're looking for, our dedicated support team is here to help.
              </p>
              <a href="mailto:sup.academicchain@gmail.com" className="text-decoration-none">
                <motion.button
                  className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg
                            hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in Touch with Support
                </motion.button>
              </a>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                We'll respond to your inquiry as soon as possible.
              </p>
            </motion.div> 
        </div>
      </div>
    </Layout>
  )
}

export default FAQ 