import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getUserProfile } from '../services/userService'
import { PageTransition } from '../components/PageTransition'

/**
 * InstituteDashboard Component
 * Dashboard for educational institutions to manage credentials
 */
function InstituteDashboard() {
  // Authentication and state management
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('issued')

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      }
    };
    fetchUserProfile();
  }, [user]);

  // Mock statistics data
  const stats = [
    { label: 'Total Issued', value: '120' },
    { label: 'This Month', value: '15' },
    { label: 'Pending', value: '5' },
    { label: 'Verified', value: '100' }
  ]

  return (
    <PageTransition>
      <div className="relative min-h-screen p-6">
        {/* Main Content Container */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Welcome Banner with Gradient Background */}
          <motion.div 
            className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {userProfile?.instituteName || 'Institution'}!
            </h1>
            <p className="text-primary-100">
              Manage and issue academic credentials
            </p>
          </motion.div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Issue New Credential Button */}
            <motion.button
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Issue New Credential</h3>
              <p className="text-gray-500 dark:text-gray-400">Create and issue a new academic credential</p>
            </motion.button>
            {/* Batch Processing Button */}
            <motion.button
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Batch Processing</h3>
              <p className="text-gray-500 dark:text-gray-400">Issue multiple credentials at once</p>
            </motion.button>
          </div>

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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            {/* Activity List */}
            <div className="space-y-4">
              {[
                { action: 'Credential Issued', student: 'John Doe', date: '2 hours ago' },
                { action: 'Batch Upload', count: '25 credentials', date: '1 day ago' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Activity Item Content */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {activity.student || activity.count} • {activity.date}
                      </p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                      Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default InstituteDashboard; 