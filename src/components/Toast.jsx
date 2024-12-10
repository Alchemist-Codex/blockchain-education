import { motion, AnimatePresence } from 'framer-motion' // For toast animations

/**
 * Toast Component
 * Displays animated notification messages
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('success' or 'error'), defaults to 'success'
 * @param {function} onClose - Callback function to close the toast
 */
function Toast({ message, type = 'success', onClose }) {
  return (
    // Handles animation mounting/unmounting
    <AnimatePresence>
      {/* Animated toast container */}
      <motion.div
        className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500' // Conditional styling based on type
        } text-white`}
        // Animation properties
        initial={{ opacity: 0, y: 50 }}     // Start invisible and below final position
        animate={{ opacity: 1, y: 0 }}      // Fade in and slide up
        exit={{ opacity: 0, y: 50 }}        // Fade out and slide down
      >
        {/* Toast content container */}
        <div className="flex items-center space-x-2">
          <span>{message}</span>
          {/* Close button */}
          <button 
            onClick={onClose}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Toast