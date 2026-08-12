<script>
  import { onMount, onDestroy } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import Footer from '../../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import { radioStore, getRadioAudio, toggleRadio } from '$lib/radioPlayer.js';
  import { tvStore, attachTv, detachTv, startTv } from '$lib/tvPlayer.js';
  import '$lib/public.css';

  let tvHost;
  let volume = 1;
  let isFullscreen = false;
  let destroyReveals = () => {};

  function setVolume() {
    const a = getRadioAudio();
    if (a) a.volume = volume;
  }

  function toggleFullscreen() {
    const host = tvHost;
    if (!host) return;
    if (!isFullscreen) {
      if (host.requestFullscreen) host.requestFullscreen();
      else if (host.webkitRequestFullscreen) host.webkitRequestFullscreen();
      else if (host.msRequestFullscreen) host.msRequestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  onMount(() => {
    attachTv(tvHost);
    destroyReveals = setupReveals();
    const onFsChange = () => {
      isFullscreen = Boolean(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      );
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('msfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.removeEventListener('msfullscreenchange', onFsChange);
    };
  });

  beforeNavigate(() => {
    detachTv();
  });

  onDestroy(() => {
    detachTv();
  });
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">Frecuencia F</span>
      <h1>En Vivo</h1>
      <p>Mira nuestro canal de televisión y escucha la radio en tiempo real.</p>
    </div>
  </section>

  <section class="cc-section">
    <div class="cc-container">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="cc-live cc-reveal cc-d1">
            <header class="cc-live__head">
              <span class="cc-live__badge">
                <span class="cc-live__dot"></span>EN VIVO
              </span>
              <span class="cc-live__title">
                <i class="fa-solid fa-tv"></i>Canal Frecuencia F
              </span>
            </header>
            <div class="cc-live__video" bind:this={tvHost}>
              {#if !$tvStore.playing}
                <button
                  class="cc-live__start"
                  type="button"
                  on:click={startTv}
                  aria-label="Reproducir el canal en vivo"
                >
                  {#if $tvStore.loading}
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Conectando...</span>
                  {:else if $tvStore.error}
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>Reintentar señal</span>
                  {:else}
                    <i class="fa-solid fa-play"></i>
                    <span>Ver canal en vivo</span>
                  {/if}
                </button>
              {:else}
                <button
                  class="cc-live__fs"
                  type="button"
                  on:click={toggleFullscreen}
                  aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
                >
                  <i class="fa-solid" class:fa-expand={!isFullscreen} class:fa-compress={isFullscreen}></i>
                </button>
              {/if}
            </div>
            <p class="cc-live__note">
              <i class="fa-solid fa-broadcast-tower"></i>
              {#if $tvStore.error}
                No se pudo conectar a la señal. Verifica tu conexión e inténtalo de nuevo.
              {:else if $tvStore.playing}
                Transmisión en curso. La señal continúa al navegar por el sitio.
              {:else}
                Transmisión del canal en vivo por internet. Pulsa para comenzar.
              {/if}
            </p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="cc-radio cc-reveal cc-d2">
            <div class="cc-radio__art">
              <i class="fa-solid fa-tower-broadcast"></i>
            </div>
            <h3>Radio Frecuencia F</h3>
            <p>La emisora 1370 AM en vivo, con programas de fe y acompañamiento.</p>
            <div class="cc-radio__player">
              <button
                class="cc-radio__play"
                class:is-playing={$radioStore.playing}
                type="button"
                on:click={toggleRadio}
                aria-label={$radioStore.playing ? 'Pausar radio' : 'Reproducir radio'}
              >
                {#if $radioStore.loading}
                  <i class="fa-solid fa-circle-notch fa-spin"></i>
                {:else if $radioStore.playing}
                  <i class="fa-solid fa-pause"></i>
                {:else}
                  <i class="fa-solid fa-play"></i>
                {/if}
              </button>
              <div class="cc-radio__status">
                <strong>
                  {#if $radioStore.error}
                    Sin señal
                  {:else if $radioStore.playing}
                    Sonando ahora
                  {:else}
                    Listo para reproducir
                  {/if}
                </strong>
                <span class:is-error={$radioStore.error}>
                  {#if $radioStore.error}
                    No se pudo conectar a la señal. Intenta de nuevo.
                  {:else if $radioStore.loading}
                    Conectando...
                  {:else if $radioStore.playing}
                    Radio Frecuencia F · 1370 AM
                  {:else}
                    Pulsa reproducir para escucharla aquí
                  {/if}
                </span>
              </div>
              <input
                class="cc-radio__volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                title="Volumen"
                aria-label="Volumen"
                bind:value={volume}
                on:input={setVolume}
              />
            </div>
            <a
              class="cc-btn cc-btn--gold cc-radio__link"
              href="https://www.frecuenciaf.com/radio"
              target="_blank"
              rel="noopener"
            >
              <i class="fa-solid fa-up-right-from-square"></i>Abrir en Frecuencia F
            </a>
          </div>

          <div class="cc-radio cc-radio--info cc-reveal cc-d3">
            <h3>
              <i class="fa-solid fa-calendar-days"></i>
              Programación
            </h3>
            <p>Consulta la programación completa del canal y la radio.</p>
            <a
              class="cc-link"
              href="https://www.frecuenciaf.com/"
              target="_blank"
              rel="noopener"
            >
              Ver programación<i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</div>

<style>
  .cc-live,
  .cc-radio {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 20px;
    height: 100%;
    overflow: hidden;
  }

  .cc-live__head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 22px;
    border-bottom: 1px solid var(--cc-border);
  }

  .cc-live__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Jost', sans-serif;
    font-weight: 600;
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    color: #1d1a15;
    background: linear-gradient(135deg, #e07a5f, #d6573f);
    border-radius: 999px;
    padding: 5px 12px;
  }

  .cc-live__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    animation: cc-pulse 1.4s infinite;
  }

  @keyframes cc-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }

  .cc-live__title {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: var(--cc-cream);
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .cc-live__title i {
    color: var(--cc-primary);
  }

  .cc-live__video {
    position: relative;
    background: #000;
    aspect-ratio: 16 / 9;
    max-height: 62vh;
    width: 100%;
  }

  .cc-live__video:fullscreen,
  .cc-live__video:-webkit-full-screen {
    width: 100vw;
    height: 100vh;
    max-height: none;
    aspect-ratio: auto;
  }

  .cc-live__fs {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 6;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    color: var(--cc-cream);
    font-size: 1.05rem;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease;
  }

  .cc-live__fs:hover {
    background: rgba(200, 169, 126, 0.85);
    color: #1d1a15;
    transform: scale(1.07);
  }

  .cc-live__start {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    height: 100%;
    border: none;
    background: rgba(0, 0, 0, 0.35);
    color: var(--cc-cream);
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    transition: background 0.3s ease;
  }

  .cc-live__start:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .cc-live__start i {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #c8a97e, #92ae83);
    color: #1d1a15;
    font-size: 1.4rem;
    box-shadow: 0 12px 30px rgba(200, 169, 126, 0.4);
    transition: transform 0.3s ease;
  }

  .cc-live__start:hover i {
    transform: scale(1.08);
  }

  .cc-live__start span {
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  }

  .cc-live__note {
    margin: 0;
    padding: 14px 22px 16px;
    color: var(--cc-muted);
    font-size: 0.82rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cc-live__note i {
    color: var(--cc-accent);
  }

  .cc-radio {
    padding: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    height: auto;
  }

  .cc-radio__art {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(200, 169, 126, 0.18), rgba(146, 174, 131, 0.18));
    border: 1px solid var(--cc-border);
    color: var(--cc-accent);
    font-size: 1.7rem;
  }

  .cc-radio h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--cc-cream);
  }

  .cc-radio p {
    color: var(--cc-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }

  .cc-radio__player {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 4px 0;
  }

  .cc-radio__play {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #c8a97e, #92ae83);
    color: #1d1a15;
    font-size: 1.25rem;
    cursor: pointer;
    box-shadow: 0 10px 26px rgba(200, 169, 126, 0.35);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .cc-radio__play:hover {
    transform: scale(1.06);
    box-shadow: 0 14px 32px rgba(200, 169, 126, 0.5);
  }

  .cc-radio__play.is-playing {
    background: linear-gradient(135deg, #5f7d52, #92ae83);
  }

  .cc-radio__status {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .cc-radio__status strong {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--cc-cream);
  }

  .cc-radio__status span {
    color: var(--cc-muted);
    font-size: 0.82rem;
  }

  .cc-radio__status span.is-error {
    color: #e07a5f;
  }

  .cc-radio__volume {
    width: 100%;
    max-width: 220px;
    accent-color: #c8a97e;
    cursor: pointer;
  }

  .cc-radio__link {
    width: 100%;
    justify-content: center;
  }

  .cc-radio--info {
    margin-top: 24px;
    align-items: flex-start;
    text-align: left;
    height: auto;
  }

  .cc-radio--info h3 i {
    color: var(--cc-primary);
    margin-right: 8px;
  }

  .cc-link {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: var(--cc-accent);
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    transition: gap 0.3s ease, color 0.3s ease;
  }

  .cc-link:hover {
    color: var(--cc-accent);
    gap: 13px;
  }

  @media (max-width: 992px) {
    .cc-live__video {
      max-height: none;
    }
  }
</style>