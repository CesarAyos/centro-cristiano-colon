const fs = require('fs');
const os = require('os');
const path = require('path');

// Ensures android/local.properties exists with a valid sdk.dir so Gradle
// doesn't fail with "SDK location not found" when ANDROID_HOME is unset.
function ensureAndroidSdk() {
  const projectRoot = path.join(__dirname, '..');
  const localProps = path.join(projectRoot, 'android', 'local.properties');

  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk'),
    path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk'),
    path.join(os.homedir(), 'Library', 'Android', 'sdk'),
  ].filter(Boolean);

  let sdkDir = null;
  for (const c of candidates) {
    try {
      if (c && fs.existsSync(path.join(c, 'platforms'))) {
        sdkDir = c;
        break;
      }
    } catch (e) {
      /* ignore */
    }
  }

  if (!sdkDir) {
    console.error(
      '\n[ensure-android-sdk] No se encontró el SDK de Android.\n' +
        '  Instala Android Studio o define la variable ANDROID_HOME.\n'
    );
    return false;
  }

  const escaped = sdkDir.replace(/\\/g, '\\\\');
  const content = `sdk.dir=${escaped}\n`;

  try {
    const existing = fs.existsSync(localProps) ? fs.readFileSync(localProps, 'utf8') : '';
    if (existing.trim() === content.trim()) {
      console.log('[ensure-android-sdk] SDK configurado correctamente.');
      return true;
    }
    fs.writeFileSync(localProps, content, 'utf8');
    console.log(`[ensure-android-sdk] local.properties actualizado -> ${sdkDir}`);
    return true;
  } catch (e) {
    console.error('[ensure-android-sdk] No se pudo escribir local.properties:', e.message);
    return false;
  }
}

module.exports = { ensureAndroidSdk };
