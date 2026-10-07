import { guardarEnCache, leerDeCache } from './pendientes.js';

const CACHE_KEY = 'reflexiones';

export async function getCachedReflexiones() {
  return leerDeCache(CACHE_KEY);
}

export async function cacheReflexiones(reflexiones) {
  return guardarEnCache(CACHE_KEY, reflexiones);
}
