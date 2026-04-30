const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('\\`') || content.includes('\\$')) {
    // Replace \` with ` and \$ with $
    const updated = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    fs.writeFileSync(filePath, updated);
    console.log(`Fixed ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fixFile(fullPath);
    }
  }
}

traverse(path.join(__dirname, 'src', 'app'));
