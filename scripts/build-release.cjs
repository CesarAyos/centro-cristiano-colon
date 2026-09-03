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
const { version, versionCode } = require('./bump-version.cjs');

// 2. Build SvelteKit
run('npm run build');

// 3. Check if Android project exists, if not add it
const androidDir = path.join(root, 'android');
if (!fs.existsSync(androidDir)) {
  run('npx cap add android');
}

// 4. Sync web build with Capacitor
run('npx cap sync android');

// 5. Verify signing configuration exists
const signingProps = path.join(root, 'android', 'keystore', 'signing.properties');
const keystoreFile = path.join(root, 'android', 'keystore', 'colon-release.jks');
if (!fs.existsSync(signingProps) || !fs.existsSync(keystoreFile)) {
  console.error('\n  Error: No se encontró el keystore de firma.');
  console.error('  Ejecuta primero: keytool -genkeypair ...');
  process.exit(1);
}

// 6. Update versionCode and versionName in build.gradle
const buildGradlePath = path.join(androidDir, 'app', 'build.gradle');
let buildGradle = fs.readFileSync(buildGradlePath, 'utf-8');
buildGradle = buildGradle.replace(/versionCode \d+/, `versionCode ${versionCode}`);
buildGradle = buildGradle.replace(/versionName "[^"]*"/, `versionName "${version}"`);
fs.writeFileSync(buildGradlePath, buildGradle, 'utf-8');
console.log(`\n  Version updated: ${version} (code: ${versionCode})\n`);

// 7. Build signed AAB (release bundle)
if (!ensureAndroidSdk()) {
  console.error('\n  No se puede continuar sin el SDK de Android.\n');
  process.exit(1);
}
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(`cd android && ${gradlew} bundleRelease`);

// 8. Copy AAB to root for easy access
const aabSrc = path.join(
  root,
  'android',
  'app',
  'build',
  'outputs',
  'bundle',
  'release',
  'app-release.aab'
);

const aabDst = path.join(root, `centro-cristiano-${version}.aab`);

if (fs.existsSync(aabSrc)) {
  fs.copyFileSync(aabSrc, aabDst);
  const sizeMB = (fs.statSync(aabDst).size / 1024 / 1024).toFixed(2);
  console.log(`\n========================================`);
  console.log(`  AAB firmado generado exitosamente!`);
  console.log(`  Version: ${version} (code: ${versionCode})`);
  console.log(`  Size: ${sizeMB} MB`);
  console.log(`  Path: ${aabDst}`);
  console.log(`========================================`);
  console.log(`\n  Sube este archivo a Google Play Console:`);
  console.log(`  https://play.google.com/console\n`);
} else {
  console.error('\n  AAB no encontrado. Revisa la salida del build.\n');
  process.exit(1);
}
