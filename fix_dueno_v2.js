const fs = require('fs-extra'); // Wait, fs-extra might not be installed. I'll use standard fs.
const fsStandard = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const dirs = fsStandard.readdirSync(srcApp);
const target = dirs.find(d => d.startsWith('due'));

if (target && target !== 'dueno') {
    const oldPath = path.join(srcApp, target);
    const newPath = path.join(srcApp, 'dueno');
    
    // Función recursiva para copiar
    function copyRecursiveSync(src, dest) {
      var exists = fsStandard.existsSync(src);
      var stats = exists && fsStandard.statSync(src);
      var isDirectory = exists && stats.isDirectory();
      if (isDirectory) {
        if (!fsStandard.existsSync(dest)) fsStandard.mkdirSync(dest);
        fsStandard.readdirSync(src).forEach(function(childItemName) {
          copyRecursiveSync(path.join(src, childItemName),
                            path.join(dest, childItemName));
        });
      } else {
        fsStandard.copyFileSync(src, dest);
      }
    };

    try {
        copyRecursiveSync(oldPath, newPath);
        console.log(`Copied ${target} to dueno`);
        // We might not be able to delete the old one if it's locked, but at least we have the new one
    } catch (e) {
        console.error('Error during copy:', e.message);
    }
} else {
    console.log('Target not found or already dueno');
}
