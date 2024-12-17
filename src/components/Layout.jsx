import ParticleBackground from './ParticleBackground';
import { useTheme } from 'next-themes';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  return (
    <div>
      <ParticleBackground isDarkTheme={isDarkTheme} />
      {children}
    </div>
  );
};

export default Layout; 