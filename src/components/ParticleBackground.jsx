import { useEffect } from 'react';

const ParticleBackground = ({ isDarkTheme }) => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 120,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: isDarkTheme ? '#ffffff' : '#000000'
          },
          shape: {
            type: 'circle'
          },
          opacity: {
            value: isDarkTheme ? 0.9 : 0.8,
            random: false,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: isDarkTheme ? 0.6 : 0.5,
              sync: false
            }
          },
          size: {
            value: isDarkTheme ? 5 : 4,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: isDarkTheme ? 3 : 2,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: isDarkTheme ? '#ffffff' : '#000000',
            opacity: isDarkTheme ? 0.7 : 0.6,
            width: isDarkTheme ? 2 : 1.5
          },
          move: {
            enable: true,
            speed: 2.5,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'grab'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: isDarkTheme ? 1 : 0.8
              }
            }
          }
        },
        retina_detect: true
      });
    }
  }, [isDarkTheme]);

  return (
    <div
      id="particles-js"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'transparent'
      }}
    />
  );
};

export default ParticleBackground; 