import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';

const Layout = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkTheme(prefersDark);

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkTheme(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div>
      <ParticleBackground isDarkTheme={isDarkTheme} />
      {children}
    </div>
  );
};

export default Layout; 