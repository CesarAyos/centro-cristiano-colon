import { Capacitor } from '@capacitor/core';
import { BackgroundMode } from '@anuradev/capacitor-background-mode';

let bgActive = false;

export function isNative() {
  return Capacitor.isNativePlatform();
}

export async function enableBackgroundMode({ title, text, subText, color }) {
  if (!isNative()) return;
  try {
    await BackgroundMode.enable({
      title: title || 'Reproduciendo',
      text: text || '',
      subText: subText || 'Centro Cristiano',
      bigText: true,
      resume: false,
      silent: false,
      hidden: false,
      color: color || '#92ae83',
      icon: 'icon',
      channelName: 'Reproducción',
      channelDescription: 'Reproducción en segundo plano de radio y video',
      allowClose: true,
      showWhen: false,
      disableWebViewOptimization: false,
      visibility: 'public',
    });
    bgActive = true;
  } catch (e) {
    console.error('Error activando modo segundo plano:', e);
  }
}

export async function updateBackgroundNotification(patch) {
  if (!isNative() || !bgActive) return;
  try {
    await BackgroundMode.updateNotification(patch);
  } catch (e) {
    console.error('Error actualizando notificación de segundo plano:', e);
  }
}

export async function disableBackgroundMode() {
  if (!isNative() || !bgActive) return;
  try {
    await BackgroundMode.disable();
    bgActive = false;
  } catch (e) {
    console.error('Error desactivando modo segundo plano:', e);
  }
}

export async function requestBackgroundPermission() {
  if (!isNative()) return false;
  try {
    await BackgroundMode.requestNotificationsPermission();
    return true;
  } catch (e) {
    console.error('Error pidiendo permiso de notificaciones para segundo plano:', e);
    return false;
  }
}
