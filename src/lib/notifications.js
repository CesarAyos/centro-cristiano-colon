import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { supabase } from '$lib/supabaseClient';
import { getSiteUrl } from '$lib/siteUrl';

const NOTIF_PERM_KEY = 'cc-notifications-enabled';
const SEEN_REFLECTIONS_KEY = 'cc-seen-reflexiones';
const FCM_TOPIC = 'reflexiones';

let pollingTimer = null;
let lastReflexionId = null;
let fcmToken = null;
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
    const { token } = await FirebaseMessaging.getToken();
    return token || null;
  } catch (e) {
    console.error('Error obteniendo token FCM:', e);
    return null;
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
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'granted' || permStatus.display === 'limited') {
      localStorage.setItem(NOTIF_PERM_KEY, 'true');
      setStatus({ permission: 'granted', enabled: true });
      return true;
    }
    if (permStatus.display === 'prompt') {
      const req = await LocalNotifications.requestPermissions();
      if (req.display === 'granted' || req.display === 'limited') {
        localStorage.setItem(NOTIF_PERM_KEY, 'true');
        setStatus({ permission: 'granted', enabled: true });
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

  try {
    const FirebaseMessaging = await getMessaging();
    if (!FirebaseMessaging) {
      setStatus({ enabled: false, error: 'FCM no disponible en este dispositivo.' });
      return false;
    }
    await ensureFcmToken(FirebaseMessaging);
    if (!fcmToken) {
      setStatus({
        enabled: false,
        error: 'No se pudo obtener el token de notificaciones. Revisa la config de Firebase.',
      });
      return false;
    }
    await FirebaseMessaging.subscribeToTopic({ topic: FCM_TOPIC });
    setStatus({ enabled: true, token: true, error: '' });
    return true;
  } catch (e) {
    console.error('Error activando notificaciones:', e);
    setStatus({ enabled: false, error: e.message });
    return false;
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
    const { token } = await FirebaseMessaging.getToken();
    if (token) {
      fcmToken = token;
      setStatus({ token: true });
    } else {
      setStatus({ token: false });
    }
  } catch (e) {
    console.error('Error obteniendo token FCM:', e);
    setStatus({ token: false, error: e.message });
  }
}

export async function scheduleReflexionNotification(title, body, reflexionId) {
  if (!notificationsEnabled()) return;
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
      .select('id, titulo, contenido')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    if (!data || data.length === 0) return;

    const currentIds = data.map((r) => r.id);
    const remembered = getRememberedIds();

    const newestId = currentIds[0];
    if (lastReflexionId !== null && lastReflexionId !== newestId && !remembered.includes(newestId)) {
      const newest = data[0];
      const body = newest.contenido
        ? newest.contenido.replace(/\s+/g, ' ').trim().slice(0, 180)
        : 'Nueva reflexión publicada';
      await scheduleReflexionNotification('Nueva Reflexión', body, newest.id);
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

export function watchNewReflexiones() {
  if (typeof window === 'undefined') return () => {};
  const cleanupPoll = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  };

  if (!isNative()) {
    setStatus({ supported: false });
    return cleanupPoll;
  }

  setStatus({
    supported: true,
    enabled: notificationsEnabled(),
    permission: 'unknown',
  });

  requestNotificationPermission().then(async (granted) => {
    if (!granted) return;

    const FirebaseMessaging = await getMessaging();
    if (FirebaseMessaging) {
      await ensureFcmToken(FirebaseMessaging);
      if (fcmToken) {
        try {
          await FirebaseMessaging.subscribeToTopic({ topic: FCM_TOPIC });
          setStatus({ enabled: true, token: true });
        } catch (e) {
          console.error('Error suscribiendo a FCM:', e);
          setStatus({ enabled: false, error: e.message });
        }
      }

      FirebaseMessaging.addListener('notificationReceived', (notification) => {
        const title = notification.title || 'Nueva Reflexión';
        const body = notification.body || '';
        const reflexionId = notification.data && notification.data.reflexionId;
        scheduleReflexionNotification(title, body, reflexionId);
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

    checkNewReflexiones();

    pollingTimer = setInterval(checkNewReflexiones, 2 * 60 * 1000);

    supabase
      .channel('realtime-reflexiones')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reflexiones' },
        async (payload) => {
          const r = payload.new;
          await scheduleReflexionNotification(
            'Nueva Reflexión',
            r.titulo || 'Nueva reflexión publicada',
            r.id
          );
          const remembered = getRememberedIds();
          if (r.id && !remembered.includes(r.id)) {
            rememberReflexionIds([r.id, ...remembered].slice(0, 50));
          }
        }
      )
      .subscribe();
  });

  return cleanupPoll;
}
