import { useEffect } from 'react';

const ParticleBackground = ({ isDarkTheme }) => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: isDarkTheme ? '#ffffff' : '#000000'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: isDarkTheme ? 2 : 1,
              color: isDarkTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)'
            }
          },
          opacity: {
            value: isDarkTheme ? 0.8 : 0.3,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: isDarkTheme ? 0.4 : 0.1,
              sync: false
            }
          },
          size: {
            value: isDarkTheme ? 20 : 15,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: isDarkTheme ? 8 : 5,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'top',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'bubble'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 200,
              size: isDarkTheme ? 30 : 20,
              duration: 2,
              opacity: isDarkTheme ? 1 : 0.8,
              speed: 3
            },
            push: {
              particles_nb: 4
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