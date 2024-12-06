import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('issued')
  
  const credentials = {
    issued: [
      {
        id: '1',
        name: 'Bachelor of Science in Computer Science',
        recipient: 'John Doe',
        date: '2024-02-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Web Development Certificate',
        recipient: 'Jane Smith',
        date: '2024-01-20',
        status: 'active'
      }
    ],
    received: [
      {
        id: '3',
        name: 'Blockchain Development Certificate',
        issuer: 'Tech Academy',
        date: '2024-03-01',
        status: 'active'
      }
    ]
  }

  const stats = [
    { label: 'Credentials Issued', value: 24 },
    { label: 'Credentials Received', value: 12 },
    { label: 'Verifications', value: 156 },
    { label: 'Institution Score', value: '4.9/5' }
  ]

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Section */}
        <motion.div 
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 50 - 25],
                  x: [0, Math.random() * 50 - 25],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </motion.div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Ritaban!</h1>
            <p className="text-primary-100">Here's what's happening with your credentials</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <Link to="/upload">
            <motion.div 
              className="bg-primary-50 p-6 rounded-xl hover:bg-primary-100 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-primary-900 font-semibold mb-2">Issue New Credential</h3>
              <p className="text-primary-700">Create and issue a new academic credential</p>
            </motion.div>
          </Link>
          <Link to="/verify">
            <motion.div 
              className="bg-primary-50 p-6 rounded-xl hover:bg-primary-100 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-primary-900 font-semibold mb-2">Verify Credential</h3>
              <p className="text-primary-700">Verify the authenticity of a credential</p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Credentials Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm p-6"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            {['issued', 'received'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} Credentials
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    layoutId="activeTab"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Credentials List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {credentials[activeTab].map((credential, index) => (
                  <motion.div
                    key={credential.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{credential.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {activeTab === 'issued' ? `Recipient: ${credential.recipient}` : `Issuer: ${credential.issuer}`}
                        </p>
                        <p className="text-sm text-gray-500">Date: {credential.date}</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {credential.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard 