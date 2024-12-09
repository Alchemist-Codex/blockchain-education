import fs from 'fs';
import path from 'path';

export default function restrictHTMLInPublic() {
  return {
    name: 'restrict-html-in-public',
    buildStart() {
      const publicFolder = path.resolve(__dirname, '../public'); // Adjust path as needed
      if (fs.existsSync(publicFolder)) {
        const files = fs.readdirSync(publicFolder).filter(file => file.endsWith('.html'));
        if (files.length > 0) {
          throw new Error(`Error: HTML files are not allowed in the public folder. Found: ${files.join(', ')}`);
        }
      }
    },
  };
}
