<script>
  import { onMount } from 'svelte';
  import {
    isNative,
    getNotificationStatus,
    setNotificationsEnabled,
    onNotificationStatusChange,
  } from '$lib/notifications';

  let supported = false;
  let enabled = false;
  let loading = false;
  let message = '';

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
    } else if (enabled) {
      message = '';
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
        ? 'Notificaciones activadas. Recibirás un aviso cuando se publique una nueva reflexión, incluso con la app cerrada.'
        : 'Notificaciones desactivadas.';
    }
    loading = false;
  }

  onMount(() => {
    refresh(getNotificationStatus());
    const off = onNotificationStatusChange(refresh);
    return off;
  });
</script>

{#if supported}
  <div class="cc-notif-bar" class:cc-notif-bar--off={!enabled}>
    <div class="cc-notif-bar__info">
      <span class="cc-notif-bar__icon"><i class="fa-solid fa-bell"></i></span>
      <div>
        <strong>Nueva reflexión</strong>
        <p>Recibe una notificación cuando se publique una nueva reflexión, incluso si la app está cerrada.</p>
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
{/if}
