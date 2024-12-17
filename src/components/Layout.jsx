import { useTheme } from './ThemeProvider';
import ParticleBackground from './ParticleBackground';

const Layout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div>
      <ParticleBackground isDarkTheme={isDark} />
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
};

export default Layout; 