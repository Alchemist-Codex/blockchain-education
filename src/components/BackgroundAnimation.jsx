import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "particles.js";

export const BackgroundAnimation = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary-600/10 dark:bg-primary-400/10"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 50 - 25],
                x: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>
        
        {/* Content with fade-in animation */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

const AnimatedPage = () => {
  const navigate = useNavigate();
  const [particlesLoaded, setParticlesLoaded] = useState(false);

  useEffect(() => {
    // Initialize particles.js
    window.particlesJS("particles-js", {
      particles: {
        number: { value: 6, density: { enable: true, value_area: 800 } },
        color: { value: "#1b1e34" },
        shape: {
          type: "polygon",
          stroke: { width: 0, color: "#000" },
          polygon: { nb_sides: 6 },
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 160,
          random: false,
          anim: { enable: true, speed: 10, size_min: 40, sync: false },
        },
        line_linked: {
          enable: false,
          distance: 200,
          color: "#ffffff",
          opacity: 1,
          width: 2,
        },
        move: {
          enable: true,
          speed: 8,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false, mode: "grab" },
          onclick: { enable: false, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });

    // Set particlesLoaded to true after particles.js has loaded
    window.particlesJS.onload = () => {
      setParticlesLoaded(true);
    };
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: -50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 50 },
  };

  const pageTransition = {
    duration: 0.8,
  };

  return (
    <motion.div
      className="animated-page"
      initial="initial"
      animate={particlesLoaded ? "in" : "initial"}
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ position: "relative", overflow: "hidden", height: "100vh" }}
    >
      <div id="particles-js" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}></div>
      <div
        className="content"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1>Welcome to the Animated Page</h1>
        <p>Enjoy the particle effects and smooth animations!</p>
        <button
          onClick={() => navigate("/next-page")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#1b1e34",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Go to Next Page
        </button>
      </div>
    </motion.div>
  );
};

export default AnimatedPage;