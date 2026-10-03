const fs = require('fs');
const os = require('os');
const path = require('path');

function ensureJava(commandName) {
  const candidates = [];
  const gradlePropertiesPath = path.join(os.homedir(), '.gradle', 'gradle.properties');

  if (fs.existsSync(gradlePropertiesPath)) {
    const properties = fs.readFileSync(gradlePropertiesPath, 'utf-8');
    const match = properties.match(/^org\.gradle\.java\.home\s*=\s*(.+)\s*$/m);
    if (match) candidates.push(match[1].trim().replace(/\\\\/g, '\\'));
  }

  candidates.push(process.env.JAVA_HOME);

  const adoptiumDir = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Eclipse Adoptium');
  if (fs.existsSync(adoptiumDir)) {
    candidates.push(...fs.readdirSync(adoptiumDir)
      .filter((name) => name.startsWith('jdk-'))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      .map((name) => path.join(adoptiumDir, name)));
  }

  const javaExecutable = process.platform === 'win32' ? 'java.exe' : 'java';
  const javacExecutable = process.platform === 'win32' ? 'javac.exe' : 'javac';
  for (const candidate of candidates.filter(Boolean)) {
    const javaHome = path.resolve(candidate);
    const releasePath = path.join(javaHome, 'release');
    if (!fs.existsSync(path.join(javaHome, 'bin', javaExecutable)) ||
        !fs.existsSync(path.join(javaHome, 'bin', javacExecutable)) ||
        !fs.existsSync(releasePath)) continue;

    const release = fs.readFileSync(releasePath, 'utf-8');
    const version = release.match(/^JAVA_VERSION="(\d+)/m);
    const majorVersion = version ? Number(version[1]) : 0;
    if (majorVersion >= 17 && majorVersion <= 21) {
      process.env.JAVA_HOME = javaHome;
      process.env.PATH = `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.PATH || ''}`;
      console.log(`[${commandName}] Usando JDK ${majorVersion}: ${javaHome}`);
      return true;
    }
  }

  console.error(`[${commandName}] No se encontró un JDK 17–21. Configura JAVA_HOME o instala Temurin JDK.`);
  return false;
}

module.exports = { ensureJava };