const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}

const supabaseUrl = env.VITE_PUBLIC_SUPABASE_URL;
const anonKey = env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const secret = env.VITE_PUBLIC_PUBLISH_SECRET;

function logPass(msg) {
  console.log('  \x1b[32m\x1b[1m[OK]\x1b[0m ' + msg);
}
function logFail(msg) {
  console.log('  \x1b[31m\x1b[1m[FALLO]\x1b[0m ' + msg);
}
function logInfo(msg) {
  console.log('  \x1b[36m[i]\x1b[0m ' + msg);
}
function logSep() {
  console.log('  ' + '-'.repeat(60));
}

async function getLatestReflexion() {
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/reflexiones?select=id,titulo,referencia,contenido&order=created_at.desc&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });
  if (!res.ok) throw new Error(`GET reflexiones falló (${res.status})`);
  const rows = await res.json();
  return rows && rows[0] ? rows[0] : null;
}

async function main() {
  console.log('');
  console.log('  === TEST DE PUSH NOTIFICACIONES ===\n');

  if (!supabaseUrl || !anonKey || !secret) {
    logFail('Faltan variables en .env (VITE_PUBLIC_SUPABASE_URL / ANON_KEY / PUBLISH_SECRET).');
    process.exit(1);
  }

  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  const fnUrl = `https://${projectRef}.functions.supabase.co/notificar-reflexion`;
  logPass(`Proyecto Supabase: ${projectRef}`);
  logPass(`Función detectada: ${fnUrl}`);

  logSep();
  logInfo('Paso 1: Buscando una reflexión real para simular la publicación...');

  const ref = await getLatestReflexion().catch((e) => {
    logFail(`No se pudo consultar reflexiones: ${e.message}`);
    return null;
  });

  let titulo, referencia, contenido, reflexionId;
  if (ref) {
    titulo = ref.titulo;
    referencia = ref.referencia || '';
    contenido = ref.contenido || '';
    reflexionId = ref.id;
    logPass(`Última reflexión: "${titulo}"${referencia ? ` (${referencia})` : ''} [${reflexionId}]`);
  } else {
    logInfo('No hay reflexiones. Se usará un mensaje de prueba genérico.');
    titulo = 'PRUEBA: Push Notificaciones';
    referencia = 'Prueba de envío';
    contenido = 'Mensaje de prueba para verificar las notificaciones push.';
    reflexionId = null;
  }

  logSep();
  logInfo('Paso 2: Enviando mensaje al topic FCM "reflexiones"...');

  const payload = { titulo, referencia, contenido, reflexionId };
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
    logPass('La función de Supabase aceptó el mensaje y FCM lo recibió.');
    logSep();
    console.log('  Resultado:');
    console.log(`    Título : ${titulo}`);
    console.log(`    Refer. : ${referencia || '(vacía)'}`);
    console.log(`    Body   : ${contenido ? contenido.replace(/\s+/g, ' ').trim().slice(0, 60) : ''}`);
    console.log(`    Id     : ${reflexionId || '(ninguno)'}`);
    logSep();
    console.log('');
    console.log('  Si abres el push en el celular, debe abrir:');
    console.log('    /reflexiones?id=' + (reflexionId || '<id>'));
    console.log('');
    console.log('  NOTA: El celular SOLO lo recibe si tiene la app, permiso concedido');
    console.log('        y el toggle de notificaciones activado en /reflexiones.');
    console.log('');
  } else {
    logFail(`La función respondió HTTP ${res.status}.`);
    console.log('');
    try {
      const j = JSON.parse(bodyText);
      if (j.error) logFail('Error: ' + j.error);
      if (j.details) {
        console.log('  Detalle del servidor:');
        console.log('  ' + String(j.details).slice(0, 600));
        console.log('');
      }
      if (String(bodyText).toLowerCase().includes('FIREBASE_SERVICE_ACCOUNT')) {
        logFail('Configura FIREBASE_SERVICE_ACCOUNT (JSON de service account) en las secrets de la función.');
      }
      if (String(bodyText).toLowerCase().includes('Secreto de publicación')) {
        logFail('PUBLISH_SECRET de Supabase no coincide con VITE_PUBLIC_PUBLISH_SECRET del .env.');
      }
    } catch {
      console.log('  Respuesta: ' + bodyText.slice(0, 600));
    }
    process.exit(1);
  }
}

main();