const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const dirs = fs.readdirSync(srcApp);
const target = dirs.find(d => d.startsWith('due'));

if (target && target !== 'gerencia') {
    const oldPath = path.join(srcApp, target);
    const newPath = path.join(srcApp, 'gerencia');
    
    // Función recursiva para copiar
    function copyRecursiveSync(src, dest) {
      var exists = fs.existsSync(src);
      var stats = exists && fs.statSync(src);
      var isDirectory = exists && stats.isDirectory();
      if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function(childItemName) {
          copyRecursiveSync(path.join(src, childItemName),
                            path.join(dest, childItemName));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };

    try {
        if (!fs.existsSync(newPath)) {
            copyRecursiveSync(oldPath, newPath);
            console.log(`Copied ${target} to gerencia`);
        } else {
            console.log('gerencia folder already exists');
        }
    } catch (e) {
        console.error('Error during copy:', e.message);
    }
} else {
    console.log('Target not found or already gerencia');
}
