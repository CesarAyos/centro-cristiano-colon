/**
 * Descargas que funcionan igual en web y dentro de la app Android.
 *
 * El atributo `download` de un <a> solo se respeta en same-origin, y las URLs
 * de Supabase son cross-origin respecto a https://localhost de Capacitor, por
 * lo que el WebView navega en otra pestaña en vez de descargar. Por eso en
 * Android los bytes se convierten a base64 y se entregan por bloques al puente
 * `CentroCristiano` de MainActivity, que los escribe en Descargas.
 *
 * En web se usa el blob nativo del navegador y, para varias imágenes, un ZIP
 * real armado aquí mismo (método STORE, sin dependencias).
 */

const PUENTE = 'CentroCristiano';
const TAMANO_BLOQUE = 192 * 1024;

/** ¿Estamos dentro de la app Android? */
export function esAndroid() {
  return /android/i.test(globalThis.navigator?.userAgent || '');
}

function puenteNativo() {
  const puente = globalThis[PUENTE];
  return puente && typeof puente.iniciar === 'function' ? puente : null;
}

function blobABase64PorBloques(blob, alProgresar) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
    lector.onload = () => {
      try {
        resolve(lector.result);
      } catch (e) {
        reject(e);
      }
    };
    lector.readAsDataURL(blob);
  });
}

function sinPrefijo(dataUrl) {
  const coma = dataUrl.indexOf(',');
  return coma >= 0 ? dataUrl.slice(coma + 1) : dataUrl;
}

async function escribirPorBloques(puente, base64) {
  const total = base64.length;
  const trozos = Math.max(1, Math.ceil(total / TAMANO_BLOQUE));

  for (let i = 0; i < trozos; i++) {
    puente.escribir(base64.slice(i * TAMANO_BLOQUE, (i + 1) * TAMANO_BLOQUE));
    if (alProgresar) alProgresar((i + 1) / trozos);
  }
}

function mimeDe(nombre, contenido) {
  if (contenido?.type) return contenido.type;
  const n = String(nombre).toLowerCase();
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.webp')) return 'image/webp';
  if (n.endsWith('.gif')) return 'image/gif';
  if (n.endsWith('.zip')) return 'application/zip';
  if (n.endsWith('.pdf')) return 'application/pdf';
  return 'image/jpeg';
}

/**
 * Guarda un blob en el dispositivo.
 * En Android va por el puente nativo; en web por el blob del navegador.
 */
export async function guardarBlob(blob, nombre) {
  const puente = puenteNativo();
  const tipo = mimeDe(nombre, blob);

  if (puente) {
    const dataUrl = await blobABase64PorBloques(blob);
    puente.iniciar(nombre, tipo, blob.size);
    await escribirPorBloques(puente, sinPrefijo(dataUrl));
    const ok = puente.finalizar();
    if (!ok) {
      puente.cancelar();
      throw new Error('No se pudo escribir el archivo en Descargas.');
    }
    return { modo: 'android' };
  }

  guardarComo(blob, nombre);
  return { modo: 'web' };
}

const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[i] = c >>> 0;
  }
  return tabla;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = TABLA_CRC[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function textoABytes(texto) {
  return new TextEncoder().encode(texto);
}

function escribirU16(vista, offset, valor) {
  vista.setUint16(offset, valor, true);
}

function escribirU32(vista, offset, valor) {
  vista.setUint32(offset, valor >>> 0, true);
}

/** Convierte una fecha JS al formato MS-DOS que usa el ZIP. */
function tiempoDos(fecha) {
  const anio = Math.max(1980, fecha.getFullYear());
  return {
    hora: (fecha.getHours() << 11) | (fecha.getMinutes() << 5) | (fecha.getSeconds() >> 1),
    fecha: ((anio - 1980) << 9) | ((fecha.getMonth() + 1) << 5) | fecha.getDate(),
  };
}

/**
 * Construye un ZIP (sin compresión) con los archivos recibidos.
 * `archivos` = [{ nombre, datos: Uint8Array }]
 */
export function construirZip(archivos) {
  const trozos = [];
  const central = [];
  let desplazamiento = 0;

  for (const archivo of archivos) {
    const nombreBytes = textoABytes(archivo.nombre);
    const datos = archivo.datos;
    const suma = crc32(datos);
    const { hora, fecha } = tiempoDos(archivo.fecha || new Date());

    const local = new Uint8Array(30 + nombreBytes.length);
    const lv = new DataView(local.buffer);
    escribirU32(lv, 0, 0x04034b50);
    escribirU16(lv, 4, 20);
    escribirU16(lv, 6, 0x0800);
    escribirU16(lv, 8, 0);
    escribirU16(lv, 10, hora);
    escribirU16(lv, 12, fecha);
    escribirU32(lv, 14, suma);
    escribirU32(lv, 18, datos.length);
    escribirU32(lv, 22, datos.length);
    escribirU16(lv, 26, nombreBytes.length);
    escribirU16(lv, 28, 0);
    local.set(nombreBytes, 30);

    trozos.push(local, datos);

    const registro = new Uint8Array(46 + nombreBytes.length);
    const cv = new DataView(registro.buffer);
    escribirU32(cv, 0, 0x02014b50);
    escribirU16(cv, 4, 20);
    escribirU16(cv, 6, 20);
    escribirU16(cv, 8, 0x0800);
    escribirU16(cv, 10, 0);
    escribirU16(cv, 12, hora);
    escribirU16(cv, 14, fecha);
    escribirU32(cv, 16, suma);
    escribirU32(cv, 20, datos.length);
    escribirU32(cv, 24, datos.length);
    escribirU16(cv, 28, nombreBytes.length);
    escribirU16(cv, 30, 0);
    escribirU16(cv, 32, 0);
    escribirU16(cv, 34, 0);
    escribirU16(cv, 36, 0);
    escribirU32(cv, 38, 0);
    escribirU32(cv, 42, desplazamiento);
    registro.set(nombreBytes, 46);
    central.push(registro);

    desplazamiento += local.length + datos.length;
  }

  const tamanoCentral = central.reduce((suma, r) => suma + r.length, 0);
  const fin = new Uint8Array(22);
  const fv = new DataView(fin.buffer);
  escribirU32(fv, 0, 0x06054b50);
  escribirU16(fv, 8, archivos.length);
  escribirU16(fv, 10, archivos.length);
  escribirU32(fv, 12, tamanoCentral);
  escribirU32(fv, 16, desplazamiento);
  escribirU16(fv, 20, 0);

  return new Blob([...trozos, ...central, fin], { type: 'application/zip' });
}

function guardarComo(contenido, nombre) {
  const url = URL.createObjectURL(contenido);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.rel = 'noopener';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  setTimeout(() => URL.revokeObjectURL(url), 20000);
}

/**
 * Descarga un archivo individual.
 *
 * En Android se resuelve de forma nativa (DownloadManager), sin depender de CORS
 * ni de traer los bytes con fetch. En web se usa fetch + blob del navegador.
 */
export async function descargarArchivo(url, nombre) {
  const puente = puenteNativo();

  if (puente && typeof puente.descargarUrl === 'function') {
    const error = puente.descargarUrl(url, nombre);
    if (error) throw new Error(error);
    return { modo: 'android' };
  }

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}. Puede que el archivo ya no exista.`);
  }
  const blob = await respuesta.blob();
  return guardarBlob(blob, nombre);
}

/**
 * Descarga varias imágenes juntas como un único ZIP, en web y en Android.
 */
export async function descargarConjunto(archivos, nombreZip) {
  if (!archivos.length) return { modo: 'ninguno', total: 0 };

  const puente = puenteNativo();

  if (puente && typeof puente.descargarZip === 'function') {
    const error = puente.descargarZip(
      JSON.stringify(archivos.map((a) => a.url)),
      JSON.stringify(archivos.map((a) => a.nombre)),
      nombreZip
    );
    if (error) throw new Error(error);
    return { modo: 'zip-android', total: archivos.length, omitidas: 0 };
  }

  const cargados = [];
  for (const archivo of archivos) {
    try {
      const r = await fetch(archivo.url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      cargados.push({
        nombre: archivo.nombre,
        datos: new Uint8Array(await r.arrayBuffer()),
        fecha: new Date(),
      });
    } catch (e) {
      console.warn(`No se pudo incluir ${archivo.nombre} en el ZIP:`, e);
    }
  }

  if (!cargados.length) throw new Error('No se pudo descargar ninguna imagen.');

  const zip = construirZip(cargados);
  guardarComo(zip, nombreZip);
  return { modo: 'zip', total: cargados.length, omitidas: archivos.length - cargados.length };
}
