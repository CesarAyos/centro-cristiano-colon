import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

const DATABASE_NAME = 'ccolon-offline';
const CACHE_STORE = 'content';
const COLA_STORE = 'outbox';
const DB_VERSION = 2;

export const hayConexion = writable(true);
export const enCola = writable(0);
export const sincronizando = writable(false);

const suscriptores = new Set();
let sincronizandoInterno = false;

function abrirBaseDeDatos() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      resolve(null);
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CACHE_STORE)) db.createObjectStore(CACHE_STORE);
      if (!db.objectStoreNames.contains(COLA_STORE)) {
        db.createObjectStore(COLA_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function conBaseDeDatos(modo, operacion) {
  let db = null;
  try {
    db = await abrirBaseDeDatos();
    if (!db) return null;

    return await new Promise((resolve, reject) => {
      const transaccion = db.transaction([CACHE_STORE, COLA_STORE], modo);
      operacion({
        cache: transaccion.objectStore(CACHE_STORE),
        cola: transaccion.objectStore(COLA_STORE),
      });
      transaccion.oncomplete = () => {
        db.close();
        resolve(true);
      };
      transaccion.onerror = () => {
        db.close();
        reject(transaccion.error);
      };
      transaccion.onabort = () => {
        db.close();
        reject(transaccion.error);
      };
    });
  } catch (e) {
    db?.close();
    console.warn('No se pudo usar la base local:', e);
    return null;
  }
}

/* ---------------- Contenido público en caché ---------------- */

export async function leerDeCache(clave) {
  let db = null;
  try {
    db = await abrirBaseDeDatos();
    if (!db) return null;

    return await new Promise((resolve, reject) => {
      const transaccion = db.transaction(CACHE_STORE, 'readonly');
      const request = transaccion.objectStore(CACHE_STORE).get(clave);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
      transaccion.oncomplete = () => db.close();
      transaccion.onabort = () => db.close();
    });
  } catch (e) {
    db?.close();
    console.warn('No se pudo leer la copia local:', e);
    return null;
  }
}

export async function guardarEnCache(clave, valor) {
  await conBaseDeDatos('readwrite', ({ cache }) => cache.put(valor, clave));
}

/* ---------------- Cola de envíos pendientes ---------------- */

export async function encolarEnvio(tabla, datos) {
  const item = {
    id: `off-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    tabla,
    datos,
    creadoEn: new Date().toISOString(),
  };

  const guardado = await conBaseDeDatos('readwrite', ({ cola }) => cola.put(item));
  if (!guardado) return false;

  await refrescarContador();
  return true;
}

export async function listarCola() {
  let db = null;
  try {
    db = await abrirBaseDeDatos();
    if (!db) return [];

    return await new Promise((resolve, reject) => {
      const transaccion = db.transaction(COLA_STORE, 'readonly');
      const request = transaccion.objectStore(COLA_STORE).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
      transaccion.oncomplete = () => db.close();
      transaccion.onabort = () => db.close();
    });
  } catch (e) {
    db?.close();
    console.warn('No se pudo leer la cola local:', e);
    return [];
  }
}

export async function quitarDeCola(id) {
  await conBaseDeDatos('readwrite', ({ cola }) => cola.delete(id));
  await refrescarContador();
}

export async function refrescarContador() {
  const items = await listarCola();
  enCola.set(items.length);
  return items.length;
}

/* ---------------- Sincronización ---------------- */

export function estaEnLinea() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

/**
 * Envía todo lo que quedó en la cola. Si un envío falla se conserva para
 * el siguiente intento.
 */
export async function sincronizarPendientes() {
  if (sincronizandoInterno) return 0;
  if (!estaEnLinea()) {
    hayConexion.set(false);
    return 0;
  }

  const items = await listarCola();
  if (!items.length) {
    enCola.set(0);
    return 0;
  }

  sincronizandoInterno = true;
  sincronizando.set(true);

  let enviados = 0;
  try {
    for (const item of items) {
      try {
        const { error } = await supabase.from(item.tabla).insert([item.datos]);
        if (error) {
          console.warn(`No se pudo enviar "${item.tabla}" (${item.id}):`, error.message);
          continue;
        }
        await quitarDeCola(item.id);
        enviados++;
        suscriptores.forEach((fn) => fn({ tipo: 'enviado', item }));
      } catch (e) {
        console.warn(`Falló el envío de "${item.tabla}" (${item.id}):`, e);
        break;
      }
    }
  } finally {
    sincronizandoInterno = false;
    sincronizando.set(false);
    hayConexion.set(true);
    await refrescarContador();
    if (enviados) suscriptores.forEach((fn) => fn({ tipo: 'sincronizado', total: enviados }));
  }

  return enviados;
}

/**
 * Intenta enviar en línea. Si no hay red o falla, guarda el envío en la cola
 * local para entregarlo más tarde.
 */
export async function enviarConRespaldo(tabla, datos) {
  if (estaEnLinea()) {
    try {
      const { error } = await supabase.from(tabla).insert([datos]);
      if (!error) return { entregado: true, enCola: false };
      console.warn(`No se pudo guardar en "${tabla}", se enviará luego:`, error.message);
    } catch (e) {
      console.warn(`Error de red al guardar en "${tabla}", se enviará luego:`, e);
    }
    hayConexion.set(false);
  } else {
    hayConexion.set(false);
  }

  const guardado = await encolarEnvio(tabla, datos);
  return { entregado: false, enCola: guardado };
}

export function alSincronizar(fn) {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

/**
 * Activa la sincronización automática y el aviso de conexión.
 * Devuelve la función de limpieza.
 */
export function iniciarSincronizacion() {
  if (typeof window === 'undefined') return () => {};

  hayConexion.set(estaEnLinea());

  const alVolverOnline = () => {
    hayConexion.set(true);
    void sincronizarPendientes();
  };
  const alIrOffline = () => hayConexion.set(false);
  const alAbrir = () => void sincronizarPendientes();

  window.addEventListener('online', alVolverOnline);
  window.addEventListener('offline', alIrOffline);
  window.addEventListener('focus', alAbrir);
  document.addEventListener('visibilitychange', alAbrir);

  void refrescarContador();
  void sincronizarPendientes();

  return () => {
    window.removeEventListener('online', alVolverOnline);
    window.removeEventListener('offline', alIrOffline);
    window.removeEventListener('focus', alAbrir);
    document.removeEventListener('visibilitychange', alAbrir);
  };
}
