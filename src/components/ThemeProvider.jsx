import { createContext, useContext, useEffect, useState } from 'react'

// Create context for theme management
const ThemeContext = createContext()

/**
 * ThemeProvider Component
 * Manages application-wide dark/light theme state
 * Persists theme preference in localStorage
 * Respects system theme preferences
 */
export function ThemeProvider({ children }) {
  // Initialize theme state from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    // Use saved preference or fall back to system preference
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    if (isDark) {
      // Apply dark theme
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      // Apply light theme
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark]) // Re-run when isDark changes

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook to access theme context
 * @returns {Object} { isDark: boolean, setIsDark: function }
 */
export const useTheme = () => useContext(ThemeContext) 