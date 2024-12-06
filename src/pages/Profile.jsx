import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Profile() {
  const [profile, setProfile] = useState({
    name: 'Ritaban Ghosh',
    email: 'ghoshritaban@gmail.com',
    institution: 'Techno Main Salt Lake',
    role: 'Student',
    walletAddress: '0x1234...5678'
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <motion.div 
            className="relative bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-16 text-center"
            initial={{ opacity: 0, y: -20 }}
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

            <motion.div 
              className="relative z-10"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 mx-auto mb-4 shadow-lg">
                {profile.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
              <motion.p 
                className="text-primary-100 bg-primary-700/30 px-4 py-1 rounded-full inline-block font-mono text-sm"
                whileHover={{ scale: 1.05 }}
              >
                {profile.walletAddress}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Profile Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div 
                  key="profile-view"
                  className="space-y-6"
                  {...fadeIn}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(profile).map(([key, value]) => (
                      key !== 'walletAddress' && (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <label className="text-sm text-gray-500 capitalize">{key}</label>
                          <p className="text-gray-900 font-medium">{value}</p>
                        </motion.div>
                      )
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => setIsEditing(true)}
                    className="w-full btn bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit Profile
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  key="profile-edit"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  {...fadeIn}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(profile).map(([key, value]) => (
                      key !== 'walletAddress' && (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {key}
                          </label>
                          {key === 'role' ? (
                            <select
                              value={value}
                              onChange={(e) => setProfile({...profile, [key]: e.target.value})}
                              className="input focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="Student">Student</option>
                              <option value="Institution">Institution</option>
                              <option value="Employer">Employer</option>
                            </select>
                          ) : (
                            <input
                              type={key === 'email' ? 'email' : 'text'}
                              value={value}
                              onChange={(e) => setProfile({...profile, [key]: e.target.value})}
                              className="input focus:ring-primary-500 focus:border-primary-500"
                            />
                          )}
                        </motion.div>
                      )
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <motion.button 
                      type="submit"
                      className="flex-1 btn bg-primary-600 text-white hover:bg-primary-700"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save Changes
                    </motion.button>
                    <motion.button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile 