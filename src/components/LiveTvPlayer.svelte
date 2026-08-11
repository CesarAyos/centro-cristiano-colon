<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    tvStore,
    bindTvVideo,
    bindTvHost,
    toggleTv,
    pauseTv,
    TV_POSTER,
  } from '$lib/tvPlayer.js';

  let videoEl;
  let hostEl;

  onMount(() => {
    bindTvVideo(videoEl);
    bindTvHost(hostEl);
    return () => {
      bindTvVideo(null);
      bindTvHost(null);
    };
  });
</script>

<div
  class="cc-tv-mini"
  class:is-visible={$tvStore.playing && !$tvStore.inPage}
  bind:this={hostEl}
  role="region"
  aria-label="Canal Frecuencia F en reproducción"
>
  <header class="cc-tv-mini__head">
    <span class="cc-tv-mini__badge">
      <span class="cc-tv-mini__dot" class:is-loading={$tvStore.loading}></span>
      EN VIVO
    </span>
    <span class="cc-tv-mini__title">
      <i class="fa-solid fa-tv"></i>Canal Frecuencia F
    </span>
    <span class="cc-tv-mini__actions">
      <button type="button" on:click={toggleTv} aria-label="Pausar canal">
        <i class="fa-solid fa-pause"></i>
      </button>
      <button type="button" on:click={() => goto('/envivo')} aria-label="Ampliar canal">
        <i class="fa-solid fa-expand"></i>
      </button>
      <button type="button" on:click={pauseTv} aria-label="Cerrar canal">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </span>
  </header>
  <video bind:this={videoEl} playsinline poster={TV_POSTER}></video>
</div>

<style>
  .cc-tv-mini {
    position: fixed;
    bottom: 18px;
    right: 18px;
    z-index: 2000;
    width: 320px;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(14, 13, 6, 0.95);
    border: 1px solid rgba(200, 169, 126, 0.35);
    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #f5f1e8;
    font-family: 'Jost', sans-serif;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(14px);
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
  }

  .cc-tv-mini.is-visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }

  .cc-tv-mini__head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(200, 169, 126, 0.2);
  }

  .cc-tv-mini__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 2px;
    color: #c8a97e;
  }

  .cc-tv-mini__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e07a5f;
    animation: cc-tv-pulse 1.4s infinite;
  }

  .cc-tv-mini__dot.is-loading {
    animation: none;
    background: #c8a97e;
    opacity: 0.6;
  }

  @keyframes cc-tv-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }

  .cc-tv-mini__title {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    flex: 1;
    font-size: 0.78rem;
    font-weight: 500;
  }

  .cc-tv-mini__title i {
    color: #92ae83;
    font-size: 0.85rem;
  }

  .cc-tv-mini__actions {
    display: inline-flex;
    gap: 4px;
  }

  .cc-tv-mini__actions button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 50%;
    background: rgba(200, 169, 126, 0.14);
    color: #c8a97e;
    font-size: 0.7rem;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease;
  }

  .cc-tv-mini__actions button:hover {
    background: #c8a97e;
    color: #1d1a15;
  }

  .cc-tv-mini video {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
  }

  :global(.cc-live__video) video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
  }

  @media (max-width: 480px) {
    .cc-tv-mini {
      bottom: 10px;
      right: 10px;
      width: calc(100% - 20px);
    }
  }
</style>