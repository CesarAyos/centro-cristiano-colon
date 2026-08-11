import { writable } from 'svelte/store';

export const TV_STREAM = 'https://tv.frecuenciaf.com/live/envivo.m3u8';
export const TV_POSTER = 'https://www.frecuenciaf.com/img/FrecuenciaFTV.png';

export const tvStore = writable({
  playing: false,
  loading: false,
  error: false,
  inPage: false,
});

let videoEl = null;
let hostEl = null;
let pendingContainer = null;
let hls = null;
let HlsLib = null;

function setState(patch) {
  tvStore.update((s) => ({ ...s, ...patch }));
}

function wireEvents(el) {
  if (el.__tvWired) return;
  el.__tvWired = true;
  el.addEventListener('play', () => setState({ playing: true, loading: false, error: false }));
  el.addEventListener('pause', () => setState({ playing: false }));
  el.addEventListener('waiting', () => setState({ loading: true }));
  el.addEventListener('playing', () => setState({ loading: false, error: false }));
  el.addEventListener('error', () => setState({ loading: false, error: true }));
}

export function bindTvVideo(el) {
  if (el !== videoEl) {
    if (hls) {
      try {
        hls.destroy();
      } catch {
        /* noop */
      }
      hls = null;
    }
    videoEl = el;
    if (el) {
      wireEvents(el);
      if (pendingContainer && el.parentNode !== pendingContainer) {
        pendingContainer.appendChild(el);
        pendingContainer = null;
        setState({ inPage: true });
      }
    }
  }
}

export function bindTvHost(el) {
  hostEl = el;
}

export function getTvVideo() {
  return videoEl;
}

async function ensureHls() {
  if (typeof window === 'undefined') return null;
  if (!HlsLib) {
    const mod = await import('hls.js');
    HlsLib = mod.default;
  }
  return HlsLib;
}

async function initTv() {
  if (!videoEl || hls || videoEl.src) return;
  const Hls = await ensureHls();
  if (Hls && Hls.isSupported()) {
    hls = new Hls({ liveDurationInfinity: true });
    hls.loadSource(TV_STREAM);
    hls.attachMedia(videoEl);
    hls.on(Hls.Events.ERROR, (_evt, data) => {
      if (!data.fatal) return;
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
        hls = null;
      }
    });
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = TV_STREAM;
  }
}

export async function startTv() {
  if (!videoEl) return;
  await initTv();
  setState({ playing: true, loading: true, error: false });
  try {
    await videoEl.play();
  } catch {
    setState({ playing: false, loading: false, error: true });
  }
}

export function pauseTv() {
  if (videoEl) videoEl.pause();
}

export async function toggleTv() {
  if (!videoEl) return;
  if (videoEl.paused) await startTv();
  else pauseTv();
}

export function attachTv(container) {
  if (!container) return;
  if (videoEl) {
    if (videoEl.parentNode !== container) {
      container.appendChild(videoEl);
    }
    setState({ inPage: true });
  } else {
    pendingContainer = container;
  }
}

export function detachTv() {
  pendingContainer = null;
  if (videoEl && hostEl && videoEl.parentNode !== hostEl) {
    hostEl.appendChild(videoEl);
  }
  setState({ inPage: false });
}
