import { writable } from 'svelte/store';

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

export function getRadioAudio() {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio(RADIO_STREAM);
    audio.preload = 'none';

    audio.addEventListener('play', () => setState({ playing: true, loading: false, error: false }));
    audio.addEventListener('pause', () => setState({ playing: false }));
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
  a.play().catch(() => setState({ playing: false, loading: false, error: true }));
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
