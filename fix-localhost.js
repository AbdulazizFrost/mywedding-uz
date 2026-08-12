import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes("'http://localhost:5000/api")) {
      // Replace with API_URL
      // First, ensure we have an API_URL defined in the file
      let newContent = content;
      if (!newContent.includes('const API_URL = import.meta.env.VITE_API_URL')) {
        // Insert it after imports
        const importMatch = newContent.match(/import.*?;?\n(?![ \t]*import)/);
        const apiUrlStr = "\nconst API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';\n";
        
        if (importMatch) {
          newContent = newContent.replace(importMatch[0], importMatch[0] + apiUrlStr);
        } else {
          newContent = apiUrlStr + newContent;
        }
      }
      
      // Replace all instances of 'http://localhost:5000/api/...' or `http://localhost:5000/api/...`
      // For string literals:
      newContent = newContent.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, 'API_URL + \'$1\'');
      // For template literals:
      newContent = newContent.replace(/`http:\/\/localhost:5000\/api([^`]+)`/g, '`${API_URL}$1`');
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
