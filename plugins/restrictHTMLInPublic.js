import fs from 'fs';
import path from 'path';

/**
 * Vite plugin to prevent HTML files in the public directory
 * @returns {import('vite').Plugin} Vite plugin configuration
 */
export default function restrictHTMLInPublic() {
  return {
    // Unique name for the plugin
    name: 'restrict-html-in-public',

    /**
     * Hook that runs when the build starts
     * Checks the public folder for HTML files and throws an error if any are found
     */
    buildStart() {
      const publicFolder = path.resolve(__dirname, '../public'); // Resolve path to public directory
      
      // Check if public folder exists
      if (fs.existsSync(publicFolder)) {
        // Get all files ending with .html
        const files = fs.readdirSync(publicFolder).filter(file => file.endsWith('.html'));
        
        // Throw error if HTML files are found
        if (files.length > 0) {
          throw new Error(`Error: HTML files are not allowed in the public folder. Found: ${files.join(', ')}`);
        }
      }
    },
  };
}
