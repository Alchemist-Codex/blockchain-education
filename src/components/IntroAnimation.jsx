import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const IntroAnimation = () => {
  const [showParticles, setShowParticles] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for particles.js to be loaded from CDN
    const initParticles = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-js', {
          "particles": {
            "number": {
              "value": 80,
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": "#0ea5e9"
            },
            "shape": {
              "type": "circle"
            },
            "opacity": {
              "value": 0.5,
              "random": false
            },
            "size": {
              "value": 3,
              "random": true
            },
            "line_linked": {
              "enable": true,
              "distance": 150,
              "color": "#0ea5e9",
              "opacity": 0.4,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 3,
              "direction": "none",
              "random": false,
              "straight": false,
              "out_mode": "out",
              "bounce": false
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "grab"
              },
              "resize": true
            }
          },
          "retina_detect": true
        });

        // Set timeout to navigate after animation
        const timer = setTimeout(() => {
          setShowParticles(false);
          setTimeout(() => {
            navigate('/signin');
          }, 1000);
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        // If particles.js hasn't loaded yet, try again in 100ms
        setTimeout(initParticles, 100);
      }
    };

    initParticles();
  }, [navigate]);

  return (
    <AnimatePresence>
      {showParticles && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-r from-primary-600 to-primary-800 z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div id="particles-js" className="w-full h-full absolute inset-0" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.h1 
              className="text-4xl text-white font-bold text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Academic Chain
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation; 