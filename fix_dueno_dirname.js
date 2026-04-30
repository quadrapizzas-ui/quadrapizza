const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const dirs = fs.readdirSync(srcApp);

const target = dirs.find(d => d.startsWith('due'));

if (target) {
    const oldPath = path.join(srcApp, target);
    const newPath = path.join(srcApp, 'dueno');
    if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${target} to dueno`);
    } else {
        console.log('Path is already dueno');
    }
} else {
    console.log('No directory starting with "due" found');
}
