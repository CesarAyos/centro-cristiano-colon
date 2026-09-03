const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

let [major, minor] = pkg.version.split('.').map(Number);

if (major === 0 && minor <= 1) {
  major = 1;
  minor = 1;
} else if (major < 1) {
  major = 1;
  minor = 1;
} else {
  minor++;
}

const newVersion = `${major}.${minor}`;
pkg.version = newVersion;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n', 'utf-8');

console.log(`\n  Version bumped: ${newVersion}\n`);

module.exports = { version: newVersion };
