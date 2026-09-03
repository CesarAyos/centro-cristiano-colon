import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { supabase } from '$lib/supabaseClient';

const NOTIF_PERM_KEY = 'cc-notifications-enabled';
const SEEN_REFLECTIONS_KEY = 'cc-seen-reflexiones';
const FCM_TOPIC = 'reflexiones';

let pollingTimer = null;
let lastReflexionId = null;
let fcmToken = null;

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
  if (typeof localStorage !== 'undefined' && localStorage.getItem(NOTIF_PERM_KEY) === 'true') {
    return true;
  }
  if (!isNative()) return false;

  try {
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'granted') {
      localStorage.setItem(NOTIF_PERM_KEY, 'true');
      return true;
    }
    if (permStatus.display === 'prompt') {
      const req = await LocalNotifications.requestPermissions();
      if (req.display === 'granted' || req.display === 'limited') {
        localStorage.setItem(NOTIF_PERM_KEY, 'true');
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error('Error solicitando permiso de notificaciones:', e);
    return false;
  }
}

export function notificationsEnabled() {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(NOTIF_PERM_KEY) === 'true';
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
    await FirebaseMessaging.requestPermissions();
    const { token } = await FirebaseMessaging.getToken();
    if (token) {
      fcmToken = token;
    }
  } catch (e) {
    console.error('Error obteniendo token FCM:', e);
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

  if (!isNative()) return cleanupPoll;

  requestNotificationPermission().then(async (granted) => {
    if (!granted) return;

    const FirebaseMessaging = await getMessaging();

    if (FirebaseMessaging) {
      await ensureFcmToken(FirebaseMessaging);
      if (fcmToken) {
        FirebaseMessaging.subscribeToTopic({ topic: FCM_TOPIC }).catch((e) =>
          console.error('Error suscribiendo a FCM:', e)
        );
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
          window.location.href = `${window.location.origin}/reflexiones?id=${reflexionId}`;
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
