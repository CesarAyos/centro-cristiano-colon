import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

const CLAVE_SESION = 'cc-sesion-activa';

export const usuario = writable(null);
export const sesionResuelta = writable(false);

function leerSesionGuardada() {
  try {
    return localStorage.getItem(CLAVE_SESION);
  } catch {
    return null;
  }
}

function anotarSesion(id) {
  try {
    if (id) localStorage.setItem(CLAVE_SESION, id);
    else localStorage.removeItem(CLAVE_SESION);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function haySesionRecordada() {
  return Boolean(leerSesionGuardada());
}

/** Marca este dispositivo como "sesión iniciada" hasta cerrar sesión. */
export function recordarSesion(id) {
  anotarSesion(id);
}

export function olvidarSesion() {
  anotarSesion(null);
}

/**
 * Devuelve el usuario con sesión activa o null.
 * Si Supabase no tiene token en memoria pero recuerda que este dispositivo
 * inicia sesión, intenta renovar el token antes de darla por cerrada.
 */
export async function obtenerUsuario() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (!error && data?.session?.user) {
      anotarSesion(data.session.user.id);
      return data.session.user;
    }
  } catch (e) {
    console.warn('No se pudo leer la sesión:', e);
  }

  if (!haySesionRecordada()) return null;

  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data?.session?.user) {
      anotarSesion(data.session.user.id);
      return data.session.user;
    }
  } catch (e) {
    console.warn('No se pudo renovar la sesión:', e);
  }

  return null;
}

let vigilanciaActiva = null;

/**
 * Inicializa el estado global de sesión (una sola vez) y renueva el token
 * periódicamente para que la sesión no caduque sola.
 */
export function iniciarVigilanciaSesion() {
  if (vigilanciaActiva) return vigilanciaActiva;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((evento, session) => {
    if (evento === 'SIGNED_OUT') {
      usuario.set(null);
      sesionResuelta.set(true);
      return;
    }
    if (session?.user) {
      anotarSesion(session.user.id);
      usuario.set(session.user);
      sesionResuelta.set(true);
    }
  });

  void obtenerUsuario().then((u) => {
    usuario.set(u);
    sesionResuelta.set(true);
  });

  const intervalo = setInterval(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) return;
      const { data: renovada } = await supabase.auth.refreshSession();
      if (renovada?.session?.user) usuario.set(renovada.session.user);
    } catch (e) {
      console.warn('No se pudo renovar la sesión a tiempo:', e);
    }
  }, 30 * 60 * 1000);

  vigilanciaActiva = () => {
    clearInterval(intervalo);
    subscription.unsubscribe();
    vigilanciaActiva = null;
  };

  return vigilanciaActiva;
}

export async function cerrarSesion() {
  olvidarSesion();
  usuario.set(null);
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('No se pudo cerrar la sesión en el servidor:', e);
  }
}

export function nombreDeUsuario(u) {
  if (!u) return '';
  return u.user_metadata?.full_name || u.user_metadata?.name || u.email || '';
}
