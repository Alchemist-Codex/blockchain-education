import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getUserProfile } from '../services/userService'
import { PageTransition } from '../components/PageTransition'

/**
 * Dashboard Component
 * Main user interface showing credentials overview and recent activity
 */
function Dashboard() {
  // Authentication and user state
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('issued') // Track active credentials tab

  // Fetch user profile data on mount or user change
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      }
    };
    fetchUserProfile();
  }, [user]);

  // Animation configuration
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  // Mock statistics data
  const stats = [
    { label: 'Total Credentials', value: profile.credentials.length },
    { label: 'Issued', value: profile.credentials.length },
  ]

  return (
    <PageTransition>
      <div className="relative min-h-screen p-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Welcome Banner with animated background */}
          <motion.div 
            className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
            {...fadeIn}
          >
            {/* Floating background circles animation */}
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

            {/* Welcome message with loading state */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={user?.firstName || 'loading'} 
                  className="text-3xl font-bold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  Welcome back, {loading ? (
                    <motion.span
                      className="inline-block w-24 h-8 bg-white/20 rounded animate-pulse"
                    />
                  ) : (
                    user?.firstName || 'User'
                  )}!
                </motion.h1>
              </AnimatePresence>
              <p className="text-primary-100 dark:text-primary-200">
                Here's what's happening with your credentials
              </p>
            </div>
          </motion.div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8"
            {...fadeIn}
          >
            {/* Activity List with status indicators */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'Credential Issued', date: '2 hours ago', status: 'success' },
                { action: 'Verification Request', date: '5 hours ago', status: 'pending' },
                { action: 'Credential Received', date: '1 day ago', status: 'success' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    View
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Credentials Section with Tabs */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6"
            {...fadeIn}
          >
            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              {['issued', 'received'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-4 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab} Credentials
                  {/* Animated tab indicator */}
                  {activeTab === tab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                      layoutId="activeTab"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Credentials List with animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Sample credential cards with hover effects */}
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Bachelor of Science in Computer Science
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Issued on: March 15, 2024
                        </p>
                      </div>
                      <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default Dashboard 
