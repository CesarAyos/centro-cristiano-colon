const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { ensureAndroidSdk } = require('./ensure-android-sdk.cjs');

const root = path.join(__dirname, '..');

function run(cmd) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

// 1. Bump version
require('./bump-version.cjs');

// 2. Build SvelteKit
run('npm run build');

// 3. Check if Android project exists, if not add it
const androidDir = path.join(root, 'android');
if (!fs.existsSync(androidDir)) {
  run('npx cap add android');
}

// 4. Sync web build with Capacitor
run('npx cap sync android');

// 5. Build AAB (release bundle)
if (!ensureAndroidSdk()) {
  console.error('\n  No se puede continuar sin el SDK de Android.\n');
  process.exit(1);
}
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(`cd android && ${gradlew} bundleRelease`);

const aabPath = path.join(
  root,
  'android',
  'app',
  'build',
  'outputs',
  'bundle',
  'release',
  'app-release.aab'
);

if (fs.existsSync(aabPath)) {
  const sizeMB = (fs.statSync(aabPath).size / 1024 / 1024).toFixed(2);
  console.log(`\n========================================`);
  console.log(`  AAB generated successfully!`);
  console.log(`  Size: ${sizeMB} MB`);
  console.log(`  Path: ${aabPath}`);
  console.log(`========================================\n`);
} else {
  console.error('\n  AAB not found. Check build output for errors.\n');
  process.exit(1);
}
