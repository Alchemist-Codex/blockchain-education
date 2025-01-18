import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import { userTypes } from '../utils/schema'
import toast from 'react-hot-toast'

/**
 * Navbar Component
 * Main navigation component with responsive design and mobile menu
 * Handles user authentication state and role-based navigation
 */
function Navbar() {
  // State and hooks
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, setUser, userType } = useAuth()
  const navigate = useNavigate()

  /**
   * Handles user sign out and navigation
   */
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      // Clear user data from context
      setUser(null)
      // Clear local storage
      localStorage.removeItem('userType')
      localStorage.removeItem('authSession')
      localStorage.removeItem('walletConnected')
      // Show success message
      toast.success('Signed out successfully')
      // Redirect to signin page
      navigate('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  /**
   * Determines dashboard path based on user type
   */
  const getDashboardPath = () => {
    if (userType === userTypes.STUDENT) {
      return '/student/dashboard'
    }
    if (userType === userTypes.INSTITUTE) {
      return '/institution/dashboard'
    }
    return '/'
  }

  /**
   * Determines profile path based on user type
   */
  const getProfilePath = () => {
    if (userType === userTypes.STUDENT) {
      return '/student/profile'
    }
    if (userType === userTypes.INSTITUTE) {
      return '/institution/profile'
    }
    return '/'
  }

  // Navigation links configuration
  const getNavLinks = () => {
    const commonLinks = [
      ['Dashboard', getDashboardPath()],
      ['Profile', getProfilePath()],
      ['About', '/about'],
      ['FAQ', '/faq']
    ];

    if (userType === userTypes.INSTITUTE) {
      return [
        ...commonLinks,
        ['Upload Credential', '/institution/upload-credential']
      ];
    }

    if (userType === userTypes.STUDENT) {
      return [
        ...commonLinks,
        ['Verify Credential', '/verify']
      ];
    }

    return commonLinks;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link 
              to="/home" 
              className="flex items-center"
            >
              {/* Light mode logo */}
              <img
                src="/logo-white.png"
                alt="Academic Chain Logo"
                className="h-8 w-8 mr-2 dark:hidden"
              />
              {/* Dark mode logo */}
              <img
                src="/logo-dark.png"
                alt="Academic Chain Logo"
                className="h-8 w-8 mr-2 hidden dark:block"
              />
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Academic Chain
              </span>
            </Link>
          </div>
  
          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {user && getNavLinks().map(([title, path]) => (
              <Link
                key={path}
                to={path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {title}
              </Link>
            ))}
          </div>
  
          {/* User Controls Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Authenticated user display and controls
              <div className="flex items-center space-x-4">
                {/* User avatar and name */}
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User avatar'} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            {user && (
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 sm:hidden"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
  
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && user && (
          <motion.div 
            className="sm:hidden fixed inset-0 bg-gray-800/50 dark:bg-gray-900/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 space-y-3">
                {getNavLinks().map(([title, path]) => (
                  <Link
                    key={path}
                    to={path}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {title}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar;