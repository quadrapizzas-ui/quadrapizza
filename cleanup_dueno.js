const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const dirs = fs.readdirSync(srcApp);
const target = dirs.find(d => d.startsWith('due') && d !== 'gerencia');

if (target) {
    const oldPath = path.join(srcApp, target);
    
    function deleteRecursiveSync(targetPath) {
      if (fs.existsSync(targetPath)) {
        fs.readdirSync(targetPath).forEach((file, index) => {
          const curPath = path.join(targetPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteRecursiveSync(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(targetPath);
      }
    };

    try {
        deleteRecursiveSync(oldPath);
        console.log(`Deleted ${target}`);
    } catch (e) {
        console.error('Error during delete:', e.message);
    }
} else {
    console.log('Old target not found');
}
