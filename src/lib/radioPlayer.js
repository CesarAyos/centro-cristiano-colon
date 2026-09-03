import { writable } from 'svelte/store';
import { enableBackgroundMode, disableBackgroundMode, updateBackgroundNotification } from '$lib/backgroundMode';

export const RADIO_STREAM = 'https://radio.frecuenciaf.com/envivo';

export const radioStore = writable({
  playing: false,
  loading: false,
  error: false,
});

let audio = null;

function setState(patch) {
  radioStore.update((s) => ({ ...s, ...patch }));
}

function setupMediaSession() {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    const a = audio;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Radio Frecuencia F',
      artist: 'Centro Cristiano',
      album: 'En Vivo',
      artwork: [{ src: '/logo.png', sizes: '512x512', type: 'image/png' }],
    });
    navigator.mediaSession.setActionHandler('play', () => a && a.play());
    navigator.mediaSession.setActionHandler('pause', () => a && a.pause());
    navigator.mediaSession.setActionHandler('stop', () => {
      if (a) a.pause();
    });
  } catch (e) {
    console.error('Error configurando media session:', e);
  }
}

export function getRadioAudio() {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio(RADIO_STREAM);
    audio.preload = 'none';

    audio.addEventListener('play', () => {
      setState({ playing: true, loading: false, error: false });
      enableBackgroundMode({
        title: 'Radio Frecuencia F',
        text: 'Transmitiendo en vivo',
        subText: 'Centro Cristiano',
        color: '#92ae83',
      });
      setupMediaSession();
    });
    audio.addEventListener('pause', () => {
      setState({ playing: false });
      disableBackgroundMode();
    });
    audio.addEventListener('waiting', () => setState({ loading: true }));
    audio.addEventListener('playing', () => setState({ loading: false, error: false }));
    audio.addEventListener('error', () => setState({ loading: false, error: true }));
  }
  return audio;
}

export function playRadio() {
  const a = getRadioAudio();
  if (!a) return;
  setState({ playing: true, loading: true, error: false });
  a.play().catch(() => {
    setState({ playing: false, loading: false, error: true });
    disableBackgroundMode();
  });
}

export function pauseRadio() {
  const a = getRadioAudio();
  if (!a) return;
  a.pause();
}

export function toggleRadio() {
  const a = getRadioAudio();
  if (!a) return;
  if (a.paused) playRadio();
  else pauseRadio();
}
