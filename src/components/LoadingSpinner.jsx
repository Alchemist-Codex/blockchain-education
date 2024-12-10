import { motion } from 'framer-motion' // Import for animation capabilities

/**
 * LoadingSpinner Component
 * A simple animated loading spinner using Framer Motion
 * Displays a rotating circle with primary color border
 */
export function LoadingSpinner() {
  return (
    // Container with centered content
    <div className="flex items-center justify-center p-4">
      {/* Animated spinner circle */}
      <motion.div
        // Styling for the spinner
        className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full"
        // Animation properties
        animate={{ rotate: 360 }} // Rotate 360 degrees
        transition={{ 
          duration: 1,           // One rotation per second
          repeat: Infinity,      // Loop forever
          ease: "linear"         // Smooth, constant speed
        }}
      />
    </div>
  )
} 

export default LoadingSpinner;