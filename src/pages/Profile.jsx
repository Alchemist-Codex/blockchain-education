import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Ritaban Ghosh',
    walletAddress: '0x1234...5678',
    email: 'ghoshritaban@gmail.com',
    institution: 'Techno Main Salt Lake',
    role: 'Student',
    joinedDate: 'March 2024'
  })

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 rounded-3xl p-8 text-white mb-8 relative overflow-hidden"
          {...fadeIn}
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
                  width: Math.random() * 200 + 50,
                  height: Math.random() * 200 + 50,
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

          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl text-primary-600 dark:text-primary-400">
                {profile.name.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
            <motion.p 
              className="text-primary-100 dark:text-primary-200 bg-primary-700/30 dark:bg-primary-800/30 px-4 py-1 rounded-full inline-block font-mono text-sm"
              whileHover={{ scale: 1.05 }}
            >
              {profile.walletAddress}
            </motion.p>
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Details */}
          <motion.div 
            className="md:col-span-2"
            {...fadeIn}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Details</h2>
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSave}
                    className="space-y-4"
                  >
                    {Object.entries(profile).map(([key, value]) => (
                      key !== 'walletAddress' && (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="text"
                            defaultValue={value}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                          />
                        </div>
                      )
                    ))}
                    <div className="flex justify-end">
                      <motion.button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md
                                 hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {Object.entries(profile).map(([key, value]) => (
                      key !== 'walletAddress' && (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-gray-900 dark:text-white">{value}</span>
                        </div>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Activity & Stats */}
          <motion.div className="space-y-8" {...fadeIn}>
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Credentials Issued', value: '24' },
                  { label: 'Credentials Verified', value: '156' },
                  { label: 'Active Since', value: profile.joinedDate }
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Issued Credential', time: '2 hours ago' },
                  { action: 'Verified Credential', time: '5 hours ago' },
                  { action: 'Updated Profile', time: '1 day ago' }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-gray-900 dark:text-white">{activity.action}</span>
                    <span className="text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile 