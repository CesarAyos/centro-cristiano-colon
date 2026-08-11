<script>
  import { onMount } from 'svelte';
  import { radioStore, getRadioAudio, toggleRadio, pauseRadio } from '$lib/radioPlayer.js';

  onMount(() => {
    getRadioAudio();
  });
</script>

{#if $radioStore.playing}
  <div class="cc-radio-bar" role="region" aria-label="Radio Frecuencia F en reproducción">
    <span class="cc-radio-bar__live">
      <span class="cc-radio-bar__dot" class:is-loading={$radioStore.loading}></span>
      EN VIVO
    </span>
    <i class="fa-solid fa-tower-broadcast cc-radio-bar__icon"></i>
    <span class="cc-radio-bar__name">Radio Frecuencia F</span>
    <button class="cc-radio-bar__btn" type="button" on:click={toggleRadio} aria-label="Pausar radio">
      <i class="fa-solid fa-pause"></i>
    </button>
    <button class="cc-radio-bar__btn" type="button" on:click={pauseRadio} aria-label="Cerrar radio">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
{/if}

<style>
  .cc-radio-bar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 18px;
    z-index: 2000;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 999px;
    background: rgba(14, 13, 6, 0.92);
    border: 1px solid rgba(200, 169, 126, 0.35);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #f5f1e8;
    font-family: 'Jost', sans-serif;
  }

  .cc-radio-bar__live {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 2px;
    color: #c8a97e;
  }

  .cc-radio-bar__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e07a5f;
    animation: cc-bar-pulse 1.4s infinite;
  }

  .cc-radio-bar__dot.is-loading {
    animation: none;
    background: #c8a97e;
    opacity: 0.6;
  }

  @keyframes cc-bar-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }

  .cc-radio-bar__icon {
    color: #92ae83;
    font-size: 1rem;
  }

  .cc-radio-bar__name {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .cc-radio-bar__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: rgba(200, 169, 126, 0.14);
    color: #c8a97e;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease;
  }

  .cc-radio-bar__btn:hover {
    background: #c8a97e;
    color: #1d1a15;
  }

  @media (max-width: 480px) {
    .cc-radio-bar {
      bottom: 10px;
      width: calc(100% - 24px);
      justify-content: center;
    }
  }
</style>