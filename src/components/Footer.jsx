/**
 * Footer Component
 * Displays the website footer with navigation links and social connections
 * Uses a responsive grid layout that adapts from 1 to 3 columns
 */
import CurrentYear from './CurrentYear';

function Footer() {
  return (
    // Main footer container with dark theme support
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
      {/* Content wrapper with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid container - 1 column on mobile, 3 columns on medium screens and up */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Academic Chain</h4>
            <p className="text-gray-400 dark:text-gray-300">
              Revolutionizing academic credential verification through blockchain technology
            </p>
          </div>

          {/* Quick Links Section - Internal Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {/* Internal navigation links with hover effects */}
              <a href="/about" className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                About Us
              </a>
              <a href="/faq" className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="/contact" className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Connect Section - External Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-2">
              {/* External links with security attributes */}
              <a 
                href="https://github.com/Alchemist-Codex/blockchain-education" 
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer" // Security best practice for external links
              >
                Github
              </a>
              {/* Team member social links */}
              <a 
                href="https://linktr.ee/ritaban06" 
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Ritaban's Socials
              </a>
              <a 
                href="https://linktr.ee/koustaavs" 
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Koustav's Socials
              </a>
              {/* Placeholder links for team members */}
              <a 
                href="https://linktr.ee/Lykus691" 
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Sougata's Socials
              </a>
              <a 
                href="https://linktr.ee/rayyyanjali" 
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Anjali's Socials
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 dark:border-gray-600 mt-8 pt-8 text-center text-gray-400 dark:text-gray-300">
          <p>&copy; <CurrentYear /> Academic Chain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
