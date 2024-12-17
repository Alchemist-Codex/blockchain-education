import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/PageTransition'
import { useAuth } from '../contexts/AuthContext'
import { useWeb3 } from '../contexts/Web3Context'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import BackgroundAnimation from '../components/BackgroundAnimation'

function Profile() {
  const { user, loading } = useAuth()
  const { account } = useWeb3()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.displayName || 'User',
        walletAddress: account || '0x1234...5678',
        email: user.email || 'user@example.com',
        institution: 'Not Set',
        role: localStorage.getItem('userType') || 'Student',
        joinedDate: new Date().toLocaleDateString(),
        photoURL: user.photoURL
      })
    }
  }, [user, account])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!profile) {
    return <LoadingSpinner />
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to update profile')
    }
  }

  return (
    <PageTransition>
      <BackgroundAnimation>
        {/* Main container with responsive padding */}
        <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Animated card container with fade-in effect */}
            <motion.div
              className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Profile Header with gradient background */}
              <div className="px-6 py-8 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900">
                <div className="flex items-center">
                  {/* Avatar circle with image or first letter */}
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={profile.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-primary-600">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  {/* Name and role display */}
                  <div className="ml-6">
                    <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                    <p className="text-primary-100">{profile.role}</p>
                  </div>
                </div>
              </div>

              {/* Profile Content Section */}
              <div className="px-6 py-8">
                {/* Animated transition between edit and view modes */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form
                      key="edit-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSave}
                      className="space-y-6"
                    >
                      {/* Name input field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>

                      {/* Email input field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>

                      {/* Institution input field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={profile.institution}
                          onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>

                      {/* Join date input field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Joined Date
                        </label>
                        <input
                          type="text"
                          value={profile.joinedDate}
                          onChange={(e) => setProfile({ ...profile, joinedDate: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>

                      {/* Save button */}
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Save
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <div className="mt-6">
                      {/* Edit profile button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md 
                          hover:bg-blue-600 transition-colors duration-200 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </BackgroundAnimation>
    </PageTransition>
  )
}

export default Profile 
