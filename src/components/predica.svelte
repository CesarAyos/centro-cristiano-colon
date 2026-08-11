<script>
  import { onMount, tick } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { setupReveals } from '$lib/reveal.js';

  let videos = [];
  let playing = [];

  async function fetchVideoData() {
    try {
      const { data, error } = await supabase.from('video').select('*');
      if (error) throw error;
      videos = data || [];
      await tick();
      setupReveals();
    } catch (error) {
      console.error('Error fetching video data:', error);
    }
  }

  function getYoutubeVideoId(url) {
    const match = (url || '').match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([^#\&\?]*)/
    );
    return match && match[1] ? match[1] : null;
  }

  function togglePlay(id) {
    if (playing.includes(id)) {
      playing = playing.filter((x) => x !== id);
    } else {
      playing = [...playing, id];
    }
  }

  function isPlaying(id) {
    return playing.includes(id);
  }

  onMount(() => {
    fetchVideoData();
  });
</script>

<div class="cc-videos">
  {#if videos.length}
    <div class="row g-4">
      {#each videos as video, i}
        {@const vid = getYoutubeVideoId(video.Url)}
        <div class="col-lg-4 col-md-6">
          <article class="cc-video cc-reveal cc-d{(i % 3) + 1}">
            <div class="cc-video__media">
              {#if isPlaying(i) && vid}
                <iframe
                  src={`https://www.youtube.com/embed/${vid}?autoplay=1`}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title={`Video de ${video.Titulo}`}
                ></iframe>
              {:else if vid}
                <img
                  src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`}
                  alt={video.Titulo}
                  loading="lazy"
                />
                <button
                  class="cc-video__play"
                  type="button"
                  on:click={() => togglePlay(i)}
                  aria-label={`Reproducir ${video.Titulo}`}
                >
                  <i class="fa-solid fa-play"></i>
                </button>
              {:else}
                <div class="cc-video__empty"><i class="fa-solid fa-video-slash"></i></div>
              {/if}
            </div>

            <div class="cc-video__body">
              <h3 class="cc-video__title">{video.Titulo}</h3>
              <div class="cc-video__meta">
                <span><i class="fa-solid fa-user-tie"></i>{video.Pastor}</span>
                <span><i class="fa-regular fa-calendar"></i>{video.Fecha}</span>
              </div>
              <button class="cc-video__link" type="button" on:click={() => togglePlay(i)}>
                {#if isPlaying(i)}
                  <i class="fa-solid fa-circle-pause"></i>Cerrar video
                {:else}
                  <i class="fa-brands fa-youtube"></i>Reproducir prédica
                {/if}
              </button>
            </div>
          </article>
        </div>
      {/each}
    </div>
  {:else}
    <div class="cc-videos__empty">
      <i class="fa-solid fa-music"></i>
      <p>Próximamente encontrarás aquí nuestras prédicas.</p>
    </div>
  {/if}
</div>

<style>
  .cc-video {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 18px;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .cc-video:hover {
    transform: translateY(-8px);
    border-color: rgba(200, 169, 126, 0.4);
    box-shadow: var(--cc-shadow);
  }

  .cc-video__media {
    position: relative;
    aspect-ratio: 16 / 9;
    background: #0e0d06;
  }

  .cc-video__media iframe,
  .cc-video__media img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    object-fit: cover;
  }

  .cc-video__media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(14, 13, 6, 0.55), transparent 60%);
    pointer-events: none;
  }

  .cc-video__play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    border: none;
    background: rgba(14, 13, 6, 0.65);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 4px;
  }

  .cc-video__play:hover {
    background: var(--cc-gradient);
    transform: translate(-50%, -50%) scale(1.1);
  }

  .cc-video__empty {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cc-muted);
    font-size: 2rem;
  }

  .cc-video__body {
    padding: 22px 22px 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .cc-video__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 12px;
  }

  .cc-video__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 16px;
  }

  .cc-video__meta span {
    color: var(--cc-muted);
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .cc-video__meta i {
    color: var(--cc-accent);
    font-size: 0.8rem;
  }

  .cc-video__link {
    margin-top: auto;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--cc-primary);
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.92rem;
    letter-spacing: 0.4px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    transition: color 0.3s ease, gap 0.3s ease;
  }

  .cc-video__link:hover {
    color: var(--cc-accent);
    gap: 13px;
  }

  .cc-videos__empty {
    text-align: center;
    padding: 90px 20px;
    color: var(--cc-muted);
  }

  .cc-videos__empty i {
    font-size: 2.6rem;
    color: var(--cc-accent);
    margin-bottom: 14px;
    display: block;
  }
</style>
