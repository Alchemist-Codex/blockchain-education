import { motion } from 'framer-motion'
import { useTheme } from './ThemeProvider'

/**
 * ThemeToggle Component
 * Animated toggle button for switching between light and dark themes
 * Uses Framer Motion for smooth transitions
 */
function ThemeToggle() {
  // Get theme state and setter from context
  const { isDark, setIsDark } = useTheme()

  return (
    // Animated button container
    <motion.button
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
      onClick={() => setIsDark(!isDark)}
      whileTap={{ scale: 0.95 }} // Slight scale reduction on click
    >
      {/* Animated toggle circle */}
      <motion.span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
        animate={{
          x: isDark ? 20 : 2, // Move circle based on theme state
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }} // Springy movement
      >
        {/* Animated icon container */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          animate={{
            rotate: isDark ? 360 : 0 // Rotate icon on theme change
          }}
          transition={{ duration: 0.4 }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {/* Conditional icon rendering */}
          {isDark ? (
            // Moon icon for dark theme
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          ) : (
            // Sun icon for light theme
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          )}
        </motion.svg>
      </motion.span>
    </motion.button>
  )
}

export default ThemeToggle 