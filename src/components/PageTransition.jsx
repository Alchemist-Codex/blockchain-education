import { motion } from 'framer-motion' // Import for animation capabilities

/**
 * PageTransition Component
 * Wraps page content with animated transitions using Framer Motion
 * @param {ReactNode} children - The page content to be animated
 */
export function PageTransition({ children }) {
  return (
    <motion.div
      // Initial state when component mounts
      initial={{ opacity: 0, y: 20 }}      // Start invisible and 20px down
      
      // Animated state after mounting
      animate={{ opacity: 1, y: 0 }}       // Fade in and move to original position
      
      // Exit state when component unmounts
      exit={{ opacity: 0, y: -20 }}        // Fade out and move 20px up
      
      // Animation configuration
      transition={{ duration: 0.3 }}       // Complete animation in 0.3 seconds
    >
      {children}
    </motion.div>
  )
} 