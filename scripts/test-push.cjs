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
const C_WARN = '\x1b[33m\x1b[1m[!]\x1b[0m';
const C_SEP = '  ' + '-'.repeat(60);

function logOk(msg) { console.log('  ' + C_OK + ' ' + msg); }
function logFail(msg) { console.log('  ' + C_FAIL + ' ' + msg); }
function logInfo(msg) { console.log('  ' + C_INFO + ' ' + msg); }
function logWarn(msg) { console.log('  ' + C_WARN + ' ' + msg); }
function logSep() { console.log(C_SEP); }

function parseArgs(argv) {
  const args = { title: '', ref: '', body: '', id: '', token: '', interactive: false, check: false, logs: false };
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
      case '--check': args.check = true; break;
      case '--logs': args.logs = true; break;
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
  console.log('  Sin opciones  : envía a TODOS los dispositivos registrados.');
  console.log('                  Usa la última reflexión publicada.');
  console.log('');
  console.log('  Opciones:');
  console.log('    -t, --title   "Título"        Título del push');
  console.log('    -r, --ref     "Juan 3:16"      Referencia (cuerpo del push)');
  console.log('    -b, --body    "Texto"          Cuerpo alterno si no hay referencia');
  console.log('    --id          <reflexionId>    Para que al tocar el push abra esa reflexión');
  console.log('    -k, --token   <fcm token>      Envía solo a UN dispositivo específico');
  console.log('    --logs                         Muestra los logs de diagnóstico de la app');
  console.log('    --check                        Solo lista dispositivos registrados');
  console.log('    --interactive                  Pregunta los datos paso a paso');
  console.log('    -h, --help                     Muestra esta ayuda');
  console.log('');
  console.log('  Ejemplos:');
  console.log('    npm run test:push');
  console.log('    npm run test:push -- --logs');
  console.log('    npm run test:push -- -t "Hola" -r "Juan 3:16"');
  console.log('    npm run test:push -- -k "fcm-token-del-celular" -t "Prueba"');
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

async function getRegisteredTokens() {
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/fcm_tokens?select=device_id,token,created_at&order=created_at.desc`;
  const res = await fetch(url, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  if (!res.ok) return [];
  return await res.json();
}

async function getFcmLogs() {
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/fcm_logs?select=device_id,message,created_at&order=created_at.asc&limit=50`;
  const res = await fetch(url, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  if (!res.ok) return null;
  return await res.json();
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
    const token = (await prompt(rl, 'FCM token (vacío = todos los registrados)')).trim();
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

  // Verificar dispositivos registrados
  logSep();
  logInfo('Consultando dispositivos registrados...');
  const tokens = await getRegisteredTokens();
  if (tokens.length === 0) {
    logWarn('No hay dispositivos registrados en fcm_tokens.');
    logInfo('Abre la app en tu celular para que registre su token FCM.');
    logInfo('Si la tabla fcm_tokens no existe, ejecuta este SQL en Supabase Dashboard > SQL Editor:');
    console.log('');
    console.log('    create table if not exists public.fcm_tokens (');
    console.log('      id uuid default gen_random_uuid() primary key,');
    console.log('      device_id text not null unique,');
    console.log('      token text not null,');
    console.log('      created_at timestamptz default now()');
    console.log('    );');
    console.log('    alter table public.fcm_tokens enable row level security;');
    console.log('    create policy "Anyone can insert or update own device token"');
    console.log('      on public.fcm_tokens for all using (true) with check (true);');
    console.log('');
    if (!args.check) {
      logInfo('Continuando de todas formas (el push irá al topic como fallback)...');
    }
  } else {
    logOk(`${tokens.length} dispositivo(s) registrado(s):`);
    for (const t of tokens) {
      console.log(`    ${t.device_id}  →  ${t.token.slice(0, 20)}...`);
    }
  }
  logSep();

  if (args.logs) {
    logInfo('Logs de diagnóstico de la app (fcm_logs):');
    const logs = await getFcmLogs();
    if (!logs) {
      logWarn('No se pudo leer fcm_logs (¿existe la tabla?).');
    } else if (logs.length === 0) {
      logWarn('Sin logs todavía. La app debe abrirse para escribir diagnósticos.');
    } else {
      for (const l of logs) {
        const ts = (l.created_at || '').replace('T', ' ').slice(0, 19);
        console.log(`    [${ts}] ${l.device_id || '?'}: ${l.message}`);
      }
    }
  }

  if (args.check || args.logs) {
    process.exit(0);
  }

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

  const destino = payload.token
    ? `dispositivo específico (${payload.token.slice(0, 16)}...)`
    : `${tokens.length} dispositivo(s) registrado(s)`;
  logSep();
  logInfo(`Enviando push a ${destino}...`);
  console.log(`    Título  : ${payload.titulo || '(vacío)'}`);
  console.log(`    Refer.  : ${(payload.referencia || '').slice(0, 80)}${(payload.referencia || '').length > 80 ? '...' : ''}`);
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
    logFail('¿Está desplegada? Corre: supabase functions deploy notificar-reflexion');
    process.exit(1);
  }

  const bodyText = await res.text();

  if (res.ok) {
    let parsed;
    try { parsed = JSON.parse(bodyText); } catch { parsed = null; }

    if (parsed && parsed.sent !== undefined) {
      if (parsed.sent === 0) {
        logWarn('No se envió a ningún dispositivo.');
        if (parsed.message) logInfo(parsed.message);
        logInfo('Abre la app en tu celular y vuelve a ejecutar test:push');
      } else if (parsed.sent === 'topic') {
        logOk('Enviado al topic "reflexiones" (fallback).');
      } else {
        logOk(`Push enviado a ${parsed.sent} dispositivo(s).`);
        if (parsed.invalidCleaned > 0) {
          logInfo(`${parsed.invalidCleaned} token(es) inválido(s) eliminado(s).`);
        }
      }
    } else if (parsed && parsed.response) {
      logOk('FCM aceptó el mensaje.');
      let fcmResp;
      try { fcmResp = JSON.parse(parsed.response); } catch { fcmResp = null; }
      if (fcmResp && fcmResp.name) {
        logOk(`FCM message_id: ${fcmResp.name}`);
      }
    } else {
      logOk('Respuesta del servidor: ' + bodyText.slice(0, 200));
    }

    console.log('');
    if (!payload.token && tokens.length > 0) {
      logInfo('Si el push no llegó al celular, verifica:');
      console.log('    1. La app está abierta o en segundo plano (no cerrada)');
      console.log('    2. Google Play Services está actualizado');
      console.log('    3. Revisa logs: adb logcat | grep -i "fcm\\|notification"');
    } else if (!payload.token && tokens.length === 0) {
      logInfo('Para probar en tu celular:');
      console.log('    1. Instala/abre la app (se registra automáticamente)');
      console.log('    2. Ejecuta: npm run test:push');
      console.log('    3. Verifica: adb logcat | grep -i "fcm\\|token"');
    }
    console.log('');
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
        logFail('Configura FIREBASE_SERVICE_ACCOUNT en las secrets de la función.');
      }
      if (String(bodyText).includes('Secreto de publicación')) {
        logFail('PUBLISH_SECRET de Supabase no coincide con .env.');
      }
    } catch {
      console.log('  Respuesta: ' + bodyText.slice(0, 700));
    }
    process.exit(1);
  }
}

main();
