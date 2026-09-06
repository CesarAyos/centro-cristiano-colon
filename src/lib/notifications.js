import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { version as appVersion } from '$app/environment';
import { supabase } from '$lib/supabaseClient';
import { getSiteUrl } from '$lib/siteUrl';

const NOTIF_PERM_KEY = 'cc-notifications-enabled';
const SEEN_REFLECTIONS_KEY = 'cc-seen-reflexiones';
const APP_VERSION_KEY = 'cc-app-version';
const FCM_TOPIC = 'reflexiones';

let pollingTimer = null;
let realtimeChannel = null;
let lastReflexionId = null;
let fcmToken = null;
let handlersRegistered = false;
let subscribedToTopic = false;
let statusListeners = new Set();

const status = {
  supported: false,
  enabled: false,
  permission: 'unknown',
  token: false,
  error: '',
};

function emitStatus() {
  const snap = { ...status };
  for (const fn of statusListeners) {
    try {
      fn(snap);
    } catch (e) {
      console.error('Error en listener de estado de notificaciones:', e);
    }
  }
}

function setStatus(patch) {
  let changed = false;
  for (const k of Object.keys(patch)) {
    if (status[k] !== patch[k]) {
      status[k] = patch[k];
      changed = true;
    }
  }
  if (changed) emitStatus();
}

export function onNotificationStatusChange(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

export function getNotificationStatus() {
  return { ...status };
}

export async function getFcmToken() {
  const FirebaseMessaging = await getMessaging();
  if (!FirebaseMessaging) return null;
  try {
    const result = await Promise.race([
      FirebaseMessaging.getToken(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT: Firebase no respondió al obtener el token. Generalmente significa que FirebaseApp no se inicializó en el APK (revisar google-services.json / plugin google-services) o Google Play Services está desactualizado.')), 8000)
      ),
    ]);
    const token = result && result.token ? result.token : null;
    if (token) console.log('[FCM] token obtenido:', token.slice(0, 24) + '...');
    return token;
  } catch (e) {
    console.error('Error obteniendo token FCM:', e);
    throw e;
  }
}

export function isNative() {
  return Capacitor.isNativePlatform();
}

async function getMessaging() {
  if (!isNative()) return null;
  try {
    const { FirebaseMessaging } = await import('@capacitor-firebase/messaging');
    return FirebaseMessaging;
  } catch (e) {
    console.error('No se pudo cargar FirebaseMessaging:', e);
    return null;
  }
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') return false;
  if (!isNative()) {
    setStatus({ supported: false, enabled: false, permission: 'unsupported' });
    return false;
  }
  setStatus({ supported: true });
  try {
    const stored = notificationsEnabled();
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'granted' || permStatus.display === 'limited') {
      setStatus({ permission: 'granted', enabled: stored });
      return true;
    }
    if (permStatus.display === 'prompt') {
      const req = await LocalNotifications.requestPermissions();
      if (req.display === 'granted' || req.display === 'limited') {
        setStatus({ permission: 'granted', enabled: stored });
        return true;
      }
    }
    setStatus({ permission: permStatus.display || 'denied', enabled: false });
    return false;
  } catch (e) {
    console.error('Error solicitando permiso de notificaciones:', e);
    setStatus({ permission: 'denied', enabled: false, error: e.message });
    return false;
  }
}

export function notificationsEnabled() {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(NOTIF_PERM_KEY) === 'true';
}

export async function setNotificationsEnabled(enabled) {
  if (!isNative()) {
    setStatus({ enabled: false, error: 'Esta función solo está disponible en la aplicación móvil.' });
    return false;
  }

  if (!enabled) {
    localStorage.removeItem(NOTIF_PERM_KEY);
    subscribedToTopic = false;
    const FirebaseMessaging = await getMessaging();
    if (FirebaseMessaging && fcmToken) {
      try {
        await FirebaseMessaging.unsubscribeFromTopic({ topic: FCM_TOPIC });
      } catch (e) {
        console.error('Error al desuscribir del tema FCM:', e);
      }
    }
    setStatus({ enabled: false });
    return true;
  }

  const granted = await requestNotificationPermission();
  if (!granted) {
    setStatus({
      enabled: false,
      error: 'Debes permitir las notificaciones en los ajustes del dispositivo.',
    });
    return false;
  }

  localStorage.setItem(NOTIF_PERM_KEY, 'true');

  try {
    const FirebaseMessaging = await getMessaging();
    if (FirebaseMessaging) {
      registerFcmHandlers(FirebaseMessaging);
      await subscribeToFcmTopic(FirebaseMessaging);
    }
    setStatus({ enabled: true, token: !!fcmToken, error: '' });
    return true;
  } catch (e) {
    console.error('Error activando notificaciones:', e);
    setStatus({ enabled: true, token: false, error: '' });
    return true;
  }
}

async function ensureChannel(FirebaseMessaging) {
  try {
    await LocalNotifications.createChannel({
      id: 'reflexiones',
      name: 'Nuevas Reflexiones',
      description: 'Notificaciones cuando se publica una nueva reflexión',
      importance: 5,
      vibration: true,
      sound: 'default',
      visibility: 1,
    });
  } catch (e) {
    console.error('Error creando canal de notificaciones:', e);
  }
  if (FirebaseMessaging) {
    try {
      await FirebaseMessaging.createChannel({
        id: 'reflexiones',
        name: 'Nuevas Reflexiones',
        importance: 5,
        vibration: true,
        sound: 'default',
        description: 'Notificaciones cuando se publica una nueva reflexión',
      });
    } catch (e) {
      console.error('Error creando canal FCM:', e);
    }
  }
}

async function ensureFcmToken(FirebaseMessaging) {
  if (!FirebaseMessaging) return;
  try {
    await ensureChannel(FirebaseMessaging);
    const perm = await FirebaseMessaging.checkPermissions();
    if (perm.receive === 'prompt' || perm.receive === 'denied') {
      try {
        await FirebaseMessaging.requestPermissions();
      } catch (e) {
        /* el usuario puede haber denegado el diálogo nativo */
      }
    }
    const token = await getFcmToken().catch(() => null);
    if (token) {
      fcmToken = token;
      setStatus({ token: true });
    } else {
      setStatus({ token: false, error: 'No se pudo obtener el token FCM nativo.' });
    }
  } catch (e) {
    console.error('Error obteniendo token FCM:', e);
    setStatus({ token: false, error: e.message });
  }
}

export async function displayRemoteNotification(title, body, reflexionId) {
  if (!isNative()) return;
  try {
    await ensureChannel(null);
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now() % 2147483647,
          title: title || 'Nueva Reflexión',
          body: body,
          channelId: 'reflexiones',
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#c8a97e',
          vibration: true,
          sound: 'default',
          schedule: { at: new Date() },
          extra: { reflexionId: reflexionId },
        },
      ],
    });
  } catch (e) {
    console.error('Error programando notificación:', e);
  }
}

export async function scheduleReflexionNotification(title, body, reflexionId) {
  if (!notificationsEnabled()) return;
  await displayRemoteNotification(title, body, reflexionId);
}

function rememberReflexionIds(ids) {
  try {
    localStorage.setItem(SEEN_REFLECTIONS_KEY, JSON.stringify(ids));
  } catch (e) {
    /* noop */
  }
}

function getRememberedIds() {
  try {
    const raw = localStorage.getItem(SEEN_REFLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function checkNewReflexiones() {
  if (!notificationsEnabled() || !isNative()) return;
  try {
    const { data, error } = await supabase
      .from('reflexiones')
      .select('id, titulo, referencia, contenido')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    if (!data || data.length === 0) return;

    const currentIds = data.map((r) => r.id);
    const remembered = getRememberedIds();

    const newestId = currentIds[0];
    if (lastReflexionId !== null && lastReflexionId !== newestId && !remembered.includes(newestId)) {
      const newest = data[0];
      const title = (newest.titulo && String(newest.titulo).trim()) || 'Nueva Reflexión';
      const body =
        (newest.referencia && String(newest.referencia).trim()) ||
        newest.titulo ||
        'Nueva reflexión publicada';
      await scheduleReflexionNotification(title, body, newest.id);
      rememberReflexionIds(currentIds);
    }

    if (remembered.length === 0) {
      rememberReflexionIds(currentIds);
    }

    lastReflexionId = newestId;
  } catch (e) {
    console.error('Error verificando nuevas reflexiones:', e);
  }
}

async function subscribeToFcmTopic(FirebaseMessaging) {
  try {
    const lastVersion = localStorage.getItem(APP_VERSION_KEY);
    if (lastVersion !== appVersion) {
      try {
        await FirebaseMessaging.deleteToken();
        console.log('[FCM] Token anterior eliminado (cambio de versión de la app)');
      } catch (e) {
        console.log('[FCM] deleteToken:', e.message || e);
      }
      localStorage.setItem(APP_VERSION_KEY, appVersion);
    }
    const result = await FirebaseMessaging.getToken();
    const token = result && result.token ? result.token : null;
    if (token) {
      fcmToken = token;
      setStatus({ token: true });
      console.log('[FCM] token:', token.slice(0, 24) + '...');
    } else {
      setStatus({ token: false, error: 'No se pudo obtener el token FCM nativo.' });
    }
    await FirebaseMessaging.subscribeToTopic({ topic: FCM_TOPIC });
    subscribedToTopic = true;
    setStatus({ enabled: notificationsEnabled(), token: !!token });
    console.log('[FCM] Suscrito al topic', FCM_TOPIC);
    return true;
  } catch (e) {
    console.error('[FCM] Error en suscripción al topic:', e);
    setStatus({ token: false, error: e.message });
    return false;
  }
}

function registerFcmHandlers(FirebaseMessaging) {
  if (handlersRegistered) return;
  handlersRegistered = true;

  try {
    FirebaseMessaging.addListener('tokenReceived', async ({ token }) => {
      if (token) {
        fcmToken = token;
        setStatus({ token: true });
        if (!subscribedToTopic) {
          await subscribeToFcmTopic(FirebaseMessaging);
        }
        console.log('[FCM] Token renovado:', token.slice(0, 24) + '...');
      }
    });
  } catch (e) {
    console.error('[FCM] Error en listener de token:', e);
  }

  FirebaseMessaging.addListener('notificationReceived', (notification) => {
    console.log('[FCM] notificationReceived recibido:', JSON.stringify(notification).slice(0, 200));
    const title = notification.title || 'Nueva Reflexión';
    const body = notification.body || '';
    const reflexionId = notification.data && notification.data.reflexionId;
    displayRemoteNotification(title, body, reflexionId);
  });

  FirebaseMessaging.addListener('notificationActionPerformed', (notification) => {
    const reflexionId =
      notification.notification &&
      notification.notification.data &&
      notification.notification.data.reflexionId;
    if (reflexionId && typeof window !== 'undefined') {
      window.location.href = `${getSiteUrl()}/reflexiones?id=${reflexionId}`;
    }
  });
}

export function watchNewReflexiones() {
  if (typeof window === 'undefined') return () => {};
  const cleanupAll = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  };

  if (!isNative()) {
    setStatus({ supported: false });
    return cleanupAll;
  }

  const userEnabled = notificationsEnabled();
  setStatus({
    supported: true,
    enabled: userEnabled,
    permission: 'unknown',
  });

  getMessaging().then((FirebaseMessaging) => {
    if (!FirebaseMessaging) return;
    registerFcmHandlers(FirebaseMessaging);
    if (userEnabled) {
      ensureChannel(FirebaseMessaging).then(() => subscribeToFcmTopic(FirebaseMessaging));
    } else {
      console.log('[FCM] Toggle apagado: sin suscripción al topic');
    }
  });

  requestNotificationPermission().then((granted) => {
    if (!granted) {
      setStatus({ permission: 'denied' });
      return;
    }
    setStatus({ permission: 'granted', enabled: userEnabled });

    if (!userEnabled) return;

    checkNewReflexiones();

    pollingTimer = setInterval(checkNewReflexiones, 2 * 60 * 1000);

    realtimeChannel = supabase
      .channel('realtime-reflexiones')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reflexiones' },
        async (payload) => {
          const r = payload.new;
          const title = (r.titulo && String(r.titulo).trim()) || 'Nueva Reflexión';
          const body =
            (r.referencia && String(r.referencia).trim()) ||
            r.titulo ||
            'Nueva reflexión publicada';
          await displayRemoteNotification(title, body, r.id);
          const remembered = getRememberedIds();
          if (r.id && !remembered.includes(r.id)) {
            rememberReflexionIds([r.id, ...remembered].slice(0, 50));
          }
        }
      )
      .subscribe();
  });

  return cleanupAll;
}
