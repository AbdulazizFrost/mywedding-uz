const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
let changed = false;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:5000/api')) {
    if (!content.includes('const API_URL = import.meta.env.VITE_API_URL')) {
      content = content.replace(
        /(import .*?from .*?;\n)(?!import)/s, 
        "$1\nconst API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';\n"
      );
    }
    content = content.replace(/http:\/\/localhost:5000\/api/g, '${API_URL}');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
    changed = true;
  }
});
