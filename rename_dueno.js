const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const appDir = path.join(baseDir, 'src', 'app');
const gerenciaDir = path.join(appDir, 'gerencia');
const gerenciaDir = path.join(appDir, 'gerencia');

if (fs.existsSync(gerenciaDir)) {
  fs.renameSync(gerenciaDir, gerenciaDir);
  console.log('Renamed gerencia to gerencia folder');
}

function walkAndReplace(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (['node_modules', '.git', '.next', 'public'].includes(entry)) continue;
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndReplace(fullPath);
    } else {
      if (!fullPath.match(/\.(ts|tsx|js|mjs|json|md)$/)) continue;
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content
        .replace(/\/gerencia/g, '/gerencia')
        .replace(/\/gerencia/g, '/gerencia')
        .replace(/gerencia/g, 'gerencia')
        .replace(/Gerencia/g, 'Gerencia')
        .replace(/gerencia/g, 'gerencia')
        .replace(/Gerencia/g, 'Gerencia');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

walkAndReplace(baseDir);
