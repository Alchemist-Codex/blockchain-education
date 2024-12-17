import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const IntroAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-r from-primary-600 to-primary-800 z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Animated background particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          ))}

          {/* Connecting lines animation */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(10)].map((_, i) => (
              <motion.line
                key={i}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                initial={{
                  x1: Math.random() * window.innerWidth,
                  y1: Math.random() * window.innerHeight,
                  x2: Math.random() * window.innerWidth,
                  y2: Math.random() * window.innerHeight
                }}
                animate={{
                  x1: Math.random() * window.innerWidth,
                  y1: Math.random() * window.innerHeight,
                  x2: Math.random() * window.innerWidth,
                  y2: Math.random() * window.innerHeight
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </svg>

          {/* Title animation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.h1 
              className="text-4xl text-white font-bold text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Academic Chain
            </motion.h1>
            <motion.p
              className="text-white/80 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Securing Academic Credentials
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation; 