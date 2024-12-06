import { motion, AnimatePresence } from 'framer-motion'

function Toast({ message, type = 'success', onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <div className="flex items-center space-x-2">
          <span>{message}</span>
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