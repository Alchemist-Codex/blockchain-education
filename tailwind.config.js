/** @type {import('tailwindcss').Config} */
export default {
  // Define which files Tailwind should scan for classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JS/TS/JSX/TSX files in src
  ],
  // Enable dark mode with class strategy
  darkMode: 'class',
  theme: {
    extend: {
      // Custom color palette definition
      colors: {
        primary: {
          50: '#f0f9ff',  // Lightest shade
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Base color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'  // Darkest shade
        },
      },
      // Custom animation definitions
      animation: {
        'gradient': 'gradient 8s linear infinite',    // Gradient animation
        'pulse-slow': 'pulse 3s linear infinite',     // Slow pulse animation
      },
      // Custom keyframe definitions
      keyframes: {
        gradient: {
          // Start and end state
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          // Middle state
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  // No additional plugins used
  plugins: [],
} 