import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

const CLAVE_RESPALDO = 'cc-supabase-respaldo';

function leerRespaldo() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_RESPALDO) || 'null');
  } catch {
    return null;
  }
}

function guardarRespaldo(valor) {
  try {
    if (valor) localStorage.setItem(CLAVE_RESPALDO, JSON.stringify(valor));
    else localStorage.removeItem(CLAVE_RESPALDO);
  } catch {
    /* almacenamiento no disponible */
  }
}

const memoria = new Map();

const almacenamiento = {
  supported: true,
  async getItem(key) {
    try {
      const valor = localStorage.getItem(key);
      if (valor !== null) return valor;
    } catch {
      /* seguimos con el respaldo en memoria */
    }
    const guardado = memoria.get(key);
    if (guardado !== undefined) return guardado;
    const respaldo = leerRespaldo();
    return respaldo && respaldo.key === key ? respaldo.valor : null;
  },
  async setItem(key, value) {
    memoria.set(key, value);
    guardarRespaldo({ key, valor: value });
    try {
      localStorage.setItem(key, value);
    } catch {
      /* seguimos con el respaldo en memoria */
    }
  },
  async removeItem(key) {
    memoria.delete(key);
    guardarRespaldo(null);
    try {
      localStorage.removeItem(key);
    } catch {
      /* seguimos con el respaldo en memoria */
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: almacenamiento,
  },
});
