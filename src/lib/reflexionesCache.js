const DATABASE_NAME = 'ccolon-offline';
const STORE_NAME = 'content';
const CACHE_KEY = 'reflexiones';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      resolve(null);
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedReflexiones() {
  let database;
  try {
    database = await openDatabase();
    if (!database) return null;

    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(CACHE_KEY);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
      transaction.onabort = () => database.close();
    });
  } catch (error) {
    database?.close();
    console.warn('No se pudo leer la copia local de las reflexiones:', error);
    return null;
  }
}

export async function cacheReflexiones(reflexiones) {
  let database;
  try {
    database = await openDatabase();
    if (!database) return;

    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(reflexiones, CACHE_KEY);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn('No se pudo guardar la copia local de las reflexiones:', error);
  } finally {
    database?.close();
  }
}