import { motion } from 'framer-motion';

function BlockchainAnimation({ type = 'upload' }) {
  const blocks = Array(5).fill(null);

  const blockVariants = {
    upload: (index) => ({
      y: [0, -20, 0],
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: index * 0.2,
      },
    }),
    verify: (index) => ({
      scale: [1, 1.2, 1],
      borderColor: ['#0284c7', '#10b981', '#0284c7'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: index * 0.15,
      },
    }),
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex space-x-3">
        {blocks.map((_, index) => (
          <motion.div
            key={index}
            custom={index}
            animate={blockVariants[type](index)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center
                      ${type === 'upload' 
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                        : 'border-2 border-primary-500 bg-white dark:bg-gray-800'}`}
          >
            {type === 'upload' ? (
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
                />
              </svg>
            ) : (
              <svg 
                className="w-6 h-6 text-primary-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default BlockchainAnimation;