const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '..', '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}

const supabaseUrl = env.VITE_PUBLIC_SUPABASE_URL;
const anonKey = env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const secret = env.VITE_PUBLIC_PUBLISH_SECRET;

const C_OK = '\x1b[32m\x1b[1m[OK]\x1b[0m';
const C_FAIL = '\x1b[31m\x1b[1m[FALLO]\x1b[0m';
const C_INFO = '\x1b[36m[i]\x1b[0m';
const C_SEP = '  ' + '-'.repeat(60);

function logOk(msg) { console.log('  ' + C_OK + ' ' + msg); }
function logFail(msg) { console.log('  ' + C_FAIL + ' ' + msg); }
function logInfo(msg) { console.log('  ' + C_INFO + ' ' + msg); }
function logSep() { console.log(C_SEP); }

function parseArgs(argv) {
  const args = { title: '', ref: '', body: '', id: '', token: '', interactive: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--title': case '-t': args.title = next(); break;
      case '--ref': case '-r': args.ref = next(); break;
      case '--body': case '-b': args.body = next(); break;
      case '--id': args.id = next(); break;
      case '--token': case '-k': args.token = next(); break;
      case '--interactive': args.interactive = true; break;
      case '--help': case '-h':
        printHelp();
        process.exit(0);
    }
  }
  return args;
}

function printHelp() {
  console.log('');
  console.log('  Uso: npm run test:push -- [opciones]');
  console.log('');
  console.log('  Sin opciones  : envía a TODOS los dispositivos suscritos (topic reflexiones)');
  console.log('                  usando la última reflexión publicada.');
  console.log('');
  console.log('  Opciones:');
  console.log('    -t, --title   "Título"        Título del push');
  console.log('    -r, --ref     "Juan 3:16"      Referencia (cuerpo del push)');
  console.log('    -b, --body    "Texto"          Cuerpo alterno si no hay referencia');
  console.log('    --id          <reflexionId>    Para que al tocar el push abra esa reflexión');
  console.log('    -k, --token   <fcm token>      Envía solo a UN dispositivo específico');
  console.log('    --interactive                Pregunta los datos paso a paso');
  console.log('    -h, --help                     Muestra esta ayuda');
  console.log('');
  console.log('  Ejemplos:');
  console.log('    npm run test:push');
  console.log('    npm run test:push -- -t "Hola" -r "Juan 3:16"');
  console.log('    npm run test:push -- -k "fcm-token-del-celular" -t "Prueba" -r "Salmo 23"');
  console.log('');
}

function prompt(rl, question) {
  return new Promise((resolve) => rl.question('  ' + question + ': ', resolve));
}

async function getLatestReflexion() {
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/reflexiones?select=id,titulo,referencia,contenido&order=created_at.desc&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  if (!res.ok) throw new Error(`GET reflexiones falló (${res.status})`);
  const rows = await res.json();
  return rows && rows[0] ? rows[0] : null;
}

function makePayload(args, latest) {
  if (args.interactive) {
    return { useLatest: true, payload: null };
  }
  const hasCustom = args.title || args.ref || args.body;
  if (hasCustom || args.id || args.token) {
    return {
      useLatest: false,
      payload: {
        titulo: args.title,
        referencia: args.ref,
        contenido: args.body,
        reflexionId: args.id || null,
        token: args.token || null,
      },
    };
  }
  return { useLatest: true, payload: null };
}

async function collectInteractive(rl) {
  logInfo('Modo interactivo (deja vacío para usar la última reflexión)');
  const titulo = (await prompt(rl, 'Título del push [vacío = última reflexión]')).trim();
  if (titulo) {
    const referencia = (await prompt(rl, 'Referencia (cuerpo)')).trim();
    const contenido = (await prompt(rl, 'Cuerpo alternativo (si no hay referencia)')).trim();
    const refId = (await prompt(rl, 'reflexionId (vacio = sin destino)')).trim();
    const token = (await prompt(rl, 'FCM token (vacío = topic a todos)')).trim();
    return {
      titulo,
      referencia,
      contenido,
      reflexionId: refId || null,
      token: token || null,
    };
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log('');
  console.log('  === TEST DE PUSH NOTIFICACIONES ===');
  console.log('');

  if (!supabaseUrl || !anonKey || !secret) {
    logFail('Faltan variables en .env (VITE_PUBLIC_SUPABASE_URL / ANON_KEY / PUBLISH_SECRET).');
    process.exit(1);
  }

  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  const fnUrl = `https://${projectRef}.functions.supabase.co/notificar-reflexion`;
  logOk(`Proyecto Supabase: ${projectRef}`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let payload;
  if (args.interactive) {
    payload = await collectInteractive(rl);
  } else {
    const { useLatest } = makePayload(args, null);
    if (useLatest) payload = null;
    else payload = makePayload(args, null).payload;
  }
  rl.close();

  if (!payload) {
    logSep();
    logInfo('Buscando la última reflexión para simular la publicación...');
    const latest = await getLatestReflexion().catch((e) => {
      logFail(`No se pudo consultar reflexiones: ${e.message}`);
      return null;
    });
    if (latest) {
      payload = {
        titulo: latest.titulo,
        referencia: latest.referencia || '',
        contenido: latest.contenido || '',
        reflexionId: latest.id,
        token: null,
      };
      logOk(`Última reflexión: "${latest.titulo}"`);
    } else {
      logInfo('No hay reflexiones. Usando mensaje de prueba genérico.');
      payload = {
        titulo: 'Centro Cristiano Mision Global Colon',
        referencia: '',
        contenido: 'Nueva reflexión para ti',
        reflexionId: null,
        token: null,
      };
    }
  }

  const destino = payload.token ? 'dispositivo específico (fcm token)' : 'topic "reflexiones" (todos los suscritos)';
  logSep();
  logInfo(`Enviando push al ${destino}...`);
  console.log(`    Título  : ${payload.titulo || '(vacío)'}`);
  console.log(`    Refer.  : ${payload.referencia || '(vacío)'}`);
  if (payload.token) console.log(`    Token   : ${String(payload.token).slice(0, 24)}...`);
  logSep();

  let res;
  try {
    res = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        'x-publish-secret': secret,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    logFail(`No se pudo llamar a la función: ${e.message}`);
    logFail('¿Está desplegada la función? Corre: supabase functions deploy notificar-reflexion');
    process.exit(1);
  }

  const bodyText = await res.text();

  if (res.ok) {
    logOk('FCM aceptó el mensaje.');
    let parsed;
    try { parsed = JSON.parse(bodyText); } catch { parsed = null; }
    if (parsed && parsed.response) {
      let fcmResp;
      try { fcmResp = JSON.parse(parsed.response); } catch { fcmResp = null; }
      if (fcmResp && fcmResp.name) {
        logOk(`FCM message_id: ${fcmResp.name}`);
      }
    }
    if (!payload.token) {
      console.log('');
      console.log('  Si abres el push en el celular, debe abrir:');
      console.log('    /reflexiones?id=' + (payload.reflexionId || '<id>'));
      console.log('');
      console.log('  NOTA: el celular SOLO lo recibe si:');
      console.log('    1. Tiene la app instalada (APK firmado con la misma key)');
      console.log('    2. Tiene Google Play Services actualizado');
      console.log('    3. Abrió la app y activó el toggle de notificaciones');
      console.log('    4. El token FCM fue registrado (revisar adb logcat | grep -i "fcm\\|token")');
      console.log('');
      console.log('  Para enviar a UN celular exacto usa:');
      console.log('    npm run test:push -- -k <fcm-token>');
      console.log('');
      console.log('  Para ver el token del celular:');
      console.log('    adb logcat | grep -i "fcm\\|FirebaseMessaging\\|token"');
    } else {
      console.log('');
      logOk('Si el token era válido, el celular debe mostrar la notificación ya.');
      logFail('Si no aparece: token inválido/caducado o permiso de notificaciones denegado.');
    }
    console.log('');
    // Obtener el token de un dispositivo: se loguea en la app o via adb logcat:
    //   adb logcat | grep -i "fcm\|token"
  } else {
    logFail(`La función respondió HTTP ${res.status}.`);
    console.log('');
    try {
      const j = JSON.parse(bodyText);
      if (j.error) logFail('Error: ' + j.error);
      if (j.details) {
        console.log('  Detalle del servidor:');
        console.log('  ' + String(j.details).slice(0, 700));
        console.log('');
      }
      if (String(bodyText).includes('FIREBASE_SERVICE_ACCOUNT')) {
        logFail('Configura FIREBASE_SERVICE_ACCOUNT (JSON service account) en las secrets de la función.');
      }
      if (String(bodyText).includes('Secreto de publicación')) {
        logFail('PUBLISH_SECRET de Supabase no coincide con VITE_PUBLIC_PUBLISH_SECRET del .env.');
      }
    } catch {
      console.log('  Respuesta: ' + bodyText.slice(0, 700));
    }
    process.exit(1);
  }
}

main();