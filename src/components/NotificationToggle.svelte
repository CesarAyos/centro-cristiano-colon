<script>
  import { onMount } from 'svelte';
  import { isNative, getNotificationStatus, setNotificationsEnabled, onNotificationStatusChange } from '$lib/notifications';
  import { dev } from '$app/environment';

  let supported = false;
  let enabled = false;
  let loading = false;
  let message = '';
  let testing = false;
  let testMsg = '';
  let testType = '';

  function refresh(s) {
    supported = s.supported || isNative();
    enabled = s.enabled;
    setMessageFromStatus(s);
  }

  function setMessageFromStatus(s) {
    if (!supported) {
      message = 'Activa las notificaciones desde la aplicación instalada en tu celular.';
    } else if (!s.permission || s.permission === 'unknown') {
      message = '';
    } else if (s.permission === 'denied') {
      message = 'Permiso denegado. Actívalo en los ajustes del dispositivo para recibir avisos.';
    } else if (s.error) {
      message = s.error;
    } else {
      message = '';
    }
  }

  async function toggle() {
    if (loading) return;
    loading = true;
    const next = !enabled;
    const ok = await setNotificationsEnabled(next);
    if (!ok) {
      const s = getNotificationStatus();
      message = s.error || 'No se pudo cambiar el estado de las notificaciones.';
    } else {
      message = next
        ? 'Notificaciones activadas. Recibirás un aviso cuando se publique una nueva reflexión.'
        : 'Notificaciones desactivadas.';
    }
    loading = false;
  }

  function waitForNotificationReceived(FirebaseMessaging, ms) {
    return new Promise((resolve) => {
      let timer = null;
      const handler = (notification) => {
        if (timer) clearTimeout(timer);
        FirebaseMessaging.removeListener('notificationReceived', handler);
        resolve({ received: true, notification });
      };
      FirebaseMessaging.addListener('notificationReceived', handler);
      timer = setTimeout(() => {
        FirebaseMessaging.removeListener('notificationReceived', handler);
        resolve({ received: false, notification: null });
      }, ms);
    });
  }

  async function testLocalNotification() {
    if (testing) return;
    testing = true;
    testMsg = '';
    testType = '';
    console.log('[TEST] Iniciando prueba de notificación local...');

    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      console.log('[TEST] Plugin LocalNotifications cargado:', !!LocalNotifications);

      const perm = await LocalNotifications.checkPermissions();
      console.log('[TEST] Permisos actuales:', JSON.stringify(perm));

      if (perm.display !== 'granted' && perm.display !== 'limited') {
        const req = await LocalNotifications.requestPermissions();
        console.log('[TEST] Permiso tras request:', JSON.stringify(req));
        if (req.display !== 'granted' && req.display !== 'limited') {
          testMsg = `Permiso de notificaciones denegado (${req.display}). Actívalo en ajustes del sistema de tu celular.`;
          testType = 'error';
          testing = false;
          return;
        }
      }

      await LocalNotifications.createChannel({
        id: 'reflexiones',
        name: 'Nuevas Reflexiones',
        importance: 5,
        vibration: true,
        sound: 'default',
      });
      console.log('[TEST] Canal "reflexiones" creado/verificado');

      const result = await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now() % 2147483647,
            title: 'Prueba local',
            body: 'Si ves esto, las notificaciones locales funcionan',
            channelId: 'reflexiones',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#c8a97e',
            vibration: true,
            sound: 'default',
          },
        ],
      });
      console.log('[TEST] LocalNotifications.schedule resultado:', JSON.stringify(result));
      testMsg = '¡Notificación local programada! ¿La ves arriba?';
      testType = 'success';
    } catch (e) {
      console.error('[TEST] Error en notificación local:', e);
      testMsg = `Error: ${e.message || e}`;
      testType = 'error';
    }
    testing = false;
  }

  async function testFcmPush() {
    if (testing) return;
    testing = true;
    testMsg = '';
    testType = '';
    console.log('[TEST] Iniciando prueba FCM...');

    try {
      const { FirebaseMessaging } = await import('@capacitor-firebase/messaging');
      console.log('[TEST] Plugin FirebaseMessaging cargado:', !!FirebaseMessaging);

      const tokenResult = await Promise.race([
        FirebaseMessaging.getToken(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT: getToken no respondió en 8s. Firebase no está inicializado en el APK o Google Play Services falla.')), 8000)
        ),
      ]);
      console.log('[TEST] Token obtenido:', tokenResult?.token ? tokenResult.token.slice(0, 30) + '...' : 'null');

      const token = tokenResult?.token;
      if (!token) {
        testMsg = 'getToken devolvió null. Firebase no pudo registrarse en este dispositivo.';
        testType = 'error';
        testing = false;
        return;
      }

      const receiptPromise = waitForNotificationReceived(FirebaseMessaging, 20000);

      const projectRef = new URL(import.meta.env.VITE_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
      const res = await fetch(
        `https://${projectRef}.functions.supabase.co/notificar-reflexion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            'x-publish-secret': import.meta.env.VITE_PUBLIC_PUBLISH_SECRET,
          },
          body: JSON.stringify({
            titulo: 'Prueba directa',
            referencia: 'FCM push',
            contenido: 'Si ves esto, todo funciona',
            reflexionId: null,
            token,
          }),
        }
      );
      const body = await res.text();
      console.log('[TEST] FCM response:', res.status, body.slice(0, 200));
      if (!res.ok) {
        testMsg = `Servidor respondió ${res.status}: ${body.slice(0, 300)}`;
        testType = 'error';
        testing = false;
        return;
      }

      testMsg = 'Push enviado. Esperando que llegue al celular...';
      testType = '';
      const receipt = await receiptPromise;
      if (receipt.received) {
        testMsg = '¡Llegó! El mensaje FCM llegó al dispositivo y se mostró la notificación.';
        testType = 'success';
      } else {
        testMsg = 'El servidor envió el push, pero NO llegó al celular en 20s. El token puede estar desactualizado (toca "Renovar token").';
        testType = 'error';
      }
    } catch (e) {
      console.error('[TEST] Error FCM:', e);
      testMsg = `Error FCM: ${e.message || e}`;
      testType = 'error';
    }
    testing = false;
  }

  async function testFcmTopic() {
    if (testing) return;
    testing = true;
    testMsg = '';
    testType = '';
    console.log('[TEST] Iniciando prueba de envío a todos (topic)...');

    try {
      const { FirebaseMessaging } = await import('@capacitor-firebase/messaging');
      try {
        await FirebaseMessaging.subscribeToTopic({ topic: 'reflexiones' });
        console.log('[TEST] Suscrito al topic reflexiones');
      } catch (e) {
        console.error('[TEST] Error suscribiendo al topic:', e);
        testMsg = `Error al suscribirse al topic: ${e.message || e}`;
        testType = 'error';
        testing = false;
        return;
      }

      const receiptPromise = waitForNotificationReceived(FirebaseMessaging, 20000);

      const res = await fetch(
        `https://${new URL(import.meta.env.VITE_PUBLIC_SUPABASE_URL).hostname.split('.')[0]}.functions.supabase.co/notificar-reflexion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            'x-publish-secret': import.meta.env.VITE_PUBLIC_PUBLISH_SECRET,
          },
          body: JSON.stringify({
            titulo: 'Envío a todos',
            referencia: 'FCM topic',
            contenido: 'Esta notificación va al topic reflexiones',
            reflexionId: null,
          }),
        }
      );
      const body = await res.text();
      console.log('[TEST] Topic response:', res.status, body.slice(0, 200));
      if (!res.ok) {
        testMsg = `Servidor respondió ${res.status}: ${body.slice(0, 300)}`;
        testType = 'error';
        testing = false;
        return;
      }

      testMsg = 'Push enviado al topic. Esperando que llegue a este celular...';
      testType = '';
      const receipt = await receiptPromise;
      if (receipt.received) {
        testMsg = '¡Llegó! El mensaje del topic llegó al dispositivo y se mostró la notificación.';
        testType = 'success';
      } else {
        testMsg = 'El servidor envió al topic, pero NO llegó a este celular en 20s.';
        testType = 'error';
      }
    } catch (e) {
      console.error('[TEST] Error topic:', e);
      testMsg = `Error topic: ${e.message || e}`;
      testType = 'error';
    }
    testing = false;
  }

  async function renewFcmToken() {
    if (testing) return;
    testing = true;
    testMsg = '';
    testType = '';
    console.log('[TEST] Renovando token FCM...');
    try {
      const { FirebaseMessaging } = await import('@capacitor-firebase/messaging');
      try {
        await FirebaseMessaging.deleteToken();
        console.log('[TEST] Token FCM eliminado');
      } catch (e) {
        console.log('[TEST] deleteToken:', e.message || e);
      }
      const tokenResult = await Promise.race([
        FirebaseMessaging.getToken(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT: getToken no respondió en 8s.')), 8000)
        ),
      ]);
      const token = tokenResult?.token;
      try {
        await FirebaseMessaging.subscribeToTopic({ topic: 'reflexiones' });
        console.log('[TEST] Re-suscrito al topic');
      } catch (e) {
        console.error('[TEST] Error re-suscribiendo:', e);
      }
      if (token) {
        testMsg = `Token renovado: ${token.slice(0, 16)}... y suscrito al topic. Vuelve a probar los botones.`;
        testType = 'success';
      } else {
        testMsg = 'getToken no devolvió un token tras el borrado.';
        testType = 'error';
      }
    } catch (e) {
      console.error('[TEST] Error renovando token:', e);
      testMsg = `Error renovando token: ${e.message || e}`;
      testType = 'error';
    }
    testing = false;
  }

  onMount(() => {
    refresh(getNotificationStatus());
    return onNotificationStatusChange(refresh);
  });
</script>

{#if supported}
  <div class="cc-notif-bar" class:cc-notif-bar--off={!enabled}>
    <div class="cc-notif-bar__info">
      <span class="cc-notif-bar__icon"><i class="fa-solid fa-bell"></i></span>
      <div>
        <strong>Nueva reflexión</strong>
        <p>Recibe una notificación cuando se publique una nueva reflexión.</p>
      </div>
    </div>
    <button
      class="cc-notif-bar__toggle"
      class:cc-notif-bar__toggle--on={enabled}
      type="button"
      role="switch"
      aria-checked={enabled}
      on:click={toggle}
      disabled={loading}
    >
      <span class="cc-notif-bar__knob"></span>
    </button>
  </div>
  {#if message}
    <p class="cc-notif-bar__msg">{message}</p>
  {/if}

  {#if dev}
    <div class="cc-notif-bar__diag">
      <p class="cc-notif-bar__diag-label">Diagnosticar notificaciones</p>
      <div class="cc-notif-bar__buttons">
        <button class="cc-notif-bar__test" type="button" disabled={testing} on:click={testLocalNotification}>
          {#if testing}
            <i class="fa-solid fa-circle-notch fa-spin"></i> Probando...
          {:else}
            <i class="fa-solid fa-bell"></i> Probar notificación local
          {/if}
        </button>
        <button class="cc-notif-bar__test" type="button" disabled={testing} on:click={testFcmPush}>
          {#if testing}
            <i class="fa-solid fa-circle-notch fa-spin"></i> Probando...
          {:else}
            <i class="fa-solid fa-paper-plane"></i> Probar push FCM
          {/if}
        </button>
        <button class="cc-notif-bar__test" type="button" disabled={testing} on:click={testFcmTopic}>
          {#if testing}
            <i class="fa-solid fa-circle-notch fa-spin"></i> Probando...
          {:else}
            <i class="fa-solid fa-users"></i> Probar envío a todos
          {/if}
        </button>
        <button class="cc-notif-bar__test" type="button" disabled={testing} on:click={renewFcmToken}>
          {#if testing}
            <i class="fa-solid fa-circle-notch fa-spin"></i> Renovando...
          {:else}
            <i class="fa-solid fa-rotate"></i> Renovar token FCM
          {/if}
        </button>
      </div>
      {#if testMsg}
        <p class="cc-notif-bar__msg cc-notif-bar__msg--{testType}">{testMsg}</p>
      {/if}
    </div>
  {/if}
{/if}

<style>
  .cc-notif-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, rgba(146, 174, 131, 0.1), rgba(200, 169, 126, 0.08));
    border: 1px solid var(--cc-border);
    border-radius: 16px;
    padding: 18px 22px;
    margin-bottom: 12px;
  }

  .cc-notif-bar--off { opacity: 0.75; }

  .cc-notif-bar__info { display: flex; gap: 14px; align-items: flex-start; }

  .cc-notif-bar__icon {
    width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px;
    background: rgba(200, 169, 126, 0.12); border: 1px solid var(--cc-border);
    color: var(--cc-accent); display: inline-flex; align-items: center;
    justify-content: center; font-size: 1.05rem;
  }

  .cc-notif-bar__info strong { color: var(--cc-cream); font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; }
  .cc-notif-bar__info p { margin: 2px 0 0; color: var(--cc-muted); font-size: 0.88rem; line-height: 1.5; }

  .cc-notif-bar__toggle {
    flex-shrink: 0; width: 52px; height: 30px; border-radius: 999px;
    border: 1px solid var(--cc-border); background: rgba(146, 174, 131, 0.15);
    position: relative; cursor: pointer; transition: background 0.3s ease, border-color 0.3s ease;
  }
  .cc-notif-bar__toggle--on { background: var(--cc-accent); border-color: var(--cc-accent); }

  .cc-notif-bar__knob {
    position: absolute; top: 3px; left: 3px; width: 22px; height: 22px;
    border-radius: 50%; background: var(--cc-cream); transition: transform 0.3s ease;
  }
  .cc-notif-bar__toggle--on .cc-notif-bar__knob { transform: translateX(22px); }

  .cc-notif-bar__msg { margin: 0 0 16px; color: var(--cc-muted); font-size: 0.88rem; line-height: 1.5; }
  .cc-notif-bar__msg--success { color: var(--cc-accent-soft); }
  .cc-notif-bar__msg--error { color: #e07a5f; }

  .cc-notif-bar__diag {
    margin: 0 0 24px; padding: 14px 18px;
    background: rgba(200, 169, 126, 0.05);
    border: 1px dashed var(--cc-border); border-radius: 14px;
  }
  .cc-notif-bar__diag-label { margin: 0 0 10px; color: var(--cc-muted); font-size: 0.82rem; }

  .cc-notif-bar__buttons { display: flex; gap: 10px; flex-wrap: wrap; }

  .cc-notif-bar__test {
    border: 1px solid var(--cc-accent); background: rgba(200, 169, 126, 0.12);
    color: var(--cc-accent-soft); font-family: 'Jost', sans-serif;
    font-weight: 500; font-size: 0.88rem; border-radius: 999px;
    padding: 8px 18px; cursor: pointer; transition: background 0.3s ease, color 0.3s ease;
  }
  .cc-notif-bar__test:hover { background: var(--cc-accent); color: #1d1a15; }
  .cc-notif-bar__test:disabled { opacity: 0.6; cursor: wait; }
</style>
