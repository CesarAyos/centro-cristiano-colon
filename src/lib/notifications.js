import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { supabase } from '$lib/supabaseClient';

const FCM_TOPIC = 'reflexiones';
const DEVICE_ID_KEY = 'cc-device-id';

let fcmToken = null;
let handlersRegistered = false;

function getDeviceId() {
  if (typeof localStorage === 'undefined') return null;
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

async function logFcm(message) {
  if (typeof window === 'undefined') return;
  try {
    const deviceId = getDeviceId();
    await supabase.from('fcm_logs').insert([{ device_id: deviceId, message: String(message).slice(0, 400) }]);
  } catch (e) {
    console.error('[FCM] No se pudo escribir log:', e);
  }
}

async function saveTokenToSupabase(token) {
  const deviceId = getDeviceId();
  if (!deviceId || !token) return;
  try {
    const { error } = await supabase
      .from('fcm_tokens')
      .upsert({ device_id: deviceId, token }, { onConflict: 'device_id' });
    if (error) {
      console.error('[FCM] Error guardando token en Supabase:', error.message);
      await logFcm('ERROR guardando token: ' + error.message);
    } else {
      console.log('[FCM] Token guardado en Supabase para dispositivo:', deviceId);
      await logFcm('Token guardado OK: ' + token.slice(0, 20) + '...');
    }
  } catch (e) {
    console.error('[FCM] Error guardando token:', e);
    await logFcm('EXCEPTION guardando token: ' + e.message);
  }
}

export function isNative() {
  return Capacitor.isNativePlatform();
}

export async function getFcmToken() {
  if (!isNative()) return null;
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

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') return false;
  if (!isNative()) return false;
  try {
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'granted' || permStatus.display === 'limited') {
      return true;
    }
    if (permStatus.display === 'prompt') {
      const req = await LocalNotifications.requestPermissions();
      if (req.display === 'granted' || req.display === 'limited') {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error('Error solicitando permiso de notificaciones:', e);
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

export async function displayRemoteNotification(title, body, reflexionId) {
  if (!isNative()) return;
  try {
    await ensureChannel(null);
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now() % 2147483647,
          title: title || 'Centro Cristiano Mision Global Colon',
          body: body || 'Nueva reflexión para ti',
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
    console.log('[FCM] Notificación local programada');
    logFcm('Notificación local programada OK');
  } catch (e) {
    console.error('Error programando notificación:', e);
    logFcm('ERROR programando notificación local: ' + (e && e.message ? e.message : e));
  }
}

async function subscribeToFcmTopic(FirebaseMessaging) {
  try {
    const result = await FirebaseMessaging.getToken();
    const token = result && result.token ? result.token : null;
    if (token) {
      fcmToken = token;
      console.log('[FCM] token:', token.slice(0, 24) + '...');
      await logFcm('Token obtenido OK: ' + token.slice(0, 20) + '...');
      await saveTokenToSupabase(token);
    } else {
      await logFcm('ERROR: getToken devolvió null');
    }
    await FirebaseMessaging.subscribeToTopic({ topic: FCM_TOPIC });
    console.log('[FCM] Suscrito al topic', FCM_TOPIC);
    await logFcm('Suscrito al topic reflexiones');
    return true;
  } catch (e) {
    console.error('[FCM] Error en suscripción al topic:', e);
    await logFcm('EXCEPTION al suscribir/obtener token: ' + e.message);
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
        console.log('[FCM] Token renovado:', token.slice(0, 24) + '...');
        await saveTokenToSupabase(token);
      }
    });
  } catch (e) {
    console.error('[FCM] Error en listener de token:', e);
  }

  FirebaseMessaging.addListener('notificationReceived', (notification) => {
    console.log('[FCM] notificationReceived recibido:', JSON.stringify(notification).slice(0, 200));
    const title = notification.title || 'Centro Cristiano Mision Global Colon';
    const body = notification.body || 'Nueva reflexión para ti';
    const reflexionId = notification.data && notification.data.reflexionId;
    displayRemoteNotification(title, body, reflexionId);
  });

  FirebaseMessaging.addListener('notificationActionPerformed', (notification) => {
    const reflexionId =
      notification.notification &&
      notification.notification.data &&
      notification.notification.data.reflexionId;
    if (typeof window !== 'undefined') {
      const url = reflexionId ? `/reflexiones?id=${reflexionId}` : '/reflexiones';
      window.location.href = url;
    }
  });
}

export function watchNewReflexiones() {
  if (typeof window === 'undefined') return () => {};

  if (!isNative()) {
    return () => {};
  }

  logFcm('App iniciada (nativa)');

  requestNotificationPermission().then(async (granted) => {
    if (!granted) {
      console.log('[FCM] Permiso de notificaciones denegado');
      logFcm('ERROR: permiso de notificaciones NO concedido');
      return;
    }
    logFcm('Permiso de notificaciones concedido');

    try {
      await ensureChannel(FirebaseMessaging);
      registerFcmHandlers(FirebaseMessaging);
      await subscribeToFcmTopic(FirebaseMessaging);
      console.log('[FCM] Notificaciones push habilitadas automáticamente');
      logFcm('Auto-setup completado');
    } catch (e) {
      console.error('[FCM] Error en auto-setup:', e);
      logFcm('EXCEPTION en auto-setup: ' + (e && e.message ? e.message : e));
    }
  });

  return () => {};
}
