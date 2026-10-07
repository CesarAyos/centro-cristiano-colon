<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let src = '';
  export let titulo = '';
  export let pie = '';

  const dispatch = createEventDispatcher();

  const ESCALA_MIN = 1;
  const ESCALA_MAX = 5;
  const ESCALA_PASO = 0.5;

  let escala = 1;
  let x = 0;
  let y = 0;
  let cargando = true;
  let fallando = false;

  let area;
  let marco;
  let distanciaInicial = 0;
  let escalaInicial = 1;
  let moviendo = false;
  let inicioPan = { x: 0, y: 0 };

  $: transform = `translate(${x}px, ${y}px) scale(${escala})`;
  $: instruccion = escala > 1
    ? 'Arrastra para mover · doble toque para ajustar'
    : 'Doble toque o rueda para acercar';

  function limitar() {
    escala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, escala));
    if (escala <= 1) {
      x = 0;
      y = 0;
      return;
    }
    if (!marco || !area) return;
    const limiteX = Math.max(0, (marco.clientWidth * escala - area.clientWidth) / 2);
    const limiteY = Math.max(0, (marco.clientHeight * escala - area.clientHeight) / 2);
    x = Math.min(limiteX, Math.max(-limiteX, x));
    y = Math.min(limiteY, Math.max(-limiteY, y));
  }

  function acercar(factor, centroX, centroY) {
    const previo = escala;
    escala = escala + factor;
    limitar();

    if (escala > previo && centroX !== undefined) {
      const k = escala / previo;
      x = centroX - (centroX - x) * k;
      y = centroY - (centroY - y) * k;
      limitar();
    }
  }

  function reiniciar() {
    escala = 1;
    x = 0;
    y = 0;
  }

  function alternarZoom() {
    if (escala > 1) reiniciar();
    else {
      escala = 2;
      limitar();
    }
  }

  function alRueda(e) {
    e.preventDefault();
    if (!area) return;
    const caja = area.getBoundingClientRect();
    acercar(e.deltaY < 0 ? ESCALA_PASO : -ESCALA_PASO, e.clientX - caja.left - caja.width / 2, e.clientY - caja.top - caja.height / 2);
  }

  function distancia(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function alTocarInicio(e) {
    if (e.touches.length === 2) {
      moviendo = false;
      distanciaInicial = distancia(e.touches[0], e.touches[1]);
      escalaInicial = escala;
    } else if (e.touches.length === 1 && escala > 1) {
      moviendo = true;
      inicioPan = { x: e.touches[0].clientX - x, y: e.touches[0].clientY - y };
    }
  }

  function alTocarMover(e) {
    if (e.touches.length === 2 && distanciaInicial > 0) {
      e.preventDefault();
      const nueva = distancia(e.touches[0], e.touches[1]);
      const factor = escalaInicial * (nueva / distanciaInicial);
      escala = Math.min(ESCALA_MAX, Math.max(1, factor));
      limitar();
      return;
    }
    if (moviendo && e.touches.length === 1) {
      e.preventDefault();
      x = e.touches[0].clientX - inicioPan.x;
      y = e.touches[0].clientY - inicioPan.y;
      limitar();
    }
  }

  function alTocarFin(e) {
    if (e.touches.length < 2) distanciaInicial = 0;
    if (e.touches.length === 0) moviendo = false;
  }

  function alDobleToque() {
    alternarZoom();
  }

  function cerrar() {
    dispatch('cerrar');
  }

  function alTecla(e) {
    if (e.key === 'Escape') cerrar();
    if (e.key === '+' || e.key === '=') acercar(ESCALA_PASO);
    if (e.key === '-') acercar(-ESCALA_PASO);
    if (e.key === '0') reiniciar();
  }

  function alClic(e) {
    if (e.target === e.currentTarget) cerrar();
  }

  onMount(() => {
    const alTeclear = (e) => alTecla(e);
    document.addEventListener('keydown', alTeclear);
    const bloquear = (e) => e.preventDefault();
    document.addEventListener('gesturestart', bloquear);

    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.removeEventListener('gesturestart', bloquear);
    };
  });
</script>

<div class="visor-fondo" role="presentation" transition:fade={{ duration: 200 }} on:click={alClic}>
  <div
    class="visor"
    role="dialog"
    aria-modal="true"
    aria-label={titulo || 'Vista de imagen'}
    transition:scale={{ duration: 240, start: 0.94 }}
  >
    <header class="visor__barra">
      <div class="visor__info">
        <i class="fa-solid fa-image"></i>
        <span title={titulo}>{titulo}</span>
      </div>

      <div class="visor__controles">
        <button type="button" on:click={() => acercar(-ESCALA_PASO)} disabled={escala <= ESCALA_MIN} aria-label="Alejar">
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="visor__zoom">{Math.round(escala * 100)}%</span>
        <button type="button" on:click={() => acercar(ESCALA_PASO)} disabled={escala >= ESCALA_MAX} aria-label="Acercar">
          <i class="fa-solid fa-plus"></i>
        </button>
        <button type="button" on:click={reiniciar} disabled={escala === 1} aria-label="Restablecer zoom">
          <i class="fa-solid fa-expand"></i>
        </button>
      </div>

      <button type="button" class="visor__cerrar" on:click={cerrar} aria-label="Cerrar">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </header>

    <div
      class="visor__area"
      bind:this={area}
      role="presentation"
      on:wheel={alRueda}
      on:touchstart={alTocarInicio}
      on:touchmove={alTocarMover}
      on:touchend={alTocarFin}
      on:touchcancel={alTocarFin}
      on:dblclick={alDobleToque}
    >
      {#if fallando}
        <div class="visor__fallo">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>No se pudo cargar la imagen.</p>
        </div>
      {:else if cargando}
        <div class="visor__cargando">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <span>Cargando...</span>
        </div>
      {/if}

      <img
        bind:this={marco}
        class="visor__img"
        class:es-oculta={cargando || fallando}
        style="transform: {transform};"
        src={src}
        alt={titulo || 'Imagen ampliada'}
        draggable="false"
        on:load={() => {
          cargando = false;
          fallando = false;
        }}
        on:error={() => {
          fallando = true;
          cargando = false;
        }}
      />
    </div>

    <footer class="visor__pie">
      <span>{instruccion}</span>
      {#if pie}<small>{pie}</small>{/if}
    </footer>
  </div>
</div>

<style>
  .visor-fondo {
    position: fixed;
    inset: 0;
    z-index: 1300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(6, 5, 3, 0.92);
    backdrop-filter: blur(6px);
  }

  .visor {
    width: min(1100px, 100%);
    height: min(92vh, 100%);
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    border: 1px solid rgba(200, 169, 126, 0.22);
    background: #12100b;
    box-shadow: 0 40px 90px rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }

  /* ---- Barra superior ---- */
  .visor__barra {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(200, 169, 126, 0.16);
    background: #17140f;
  }

  .visor__info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
    color: #f5f1e8;
    font-family: 'Jost', sans-serif;
    font-size: 0.95rem;
  }

  .visor__info i {
    color: #c8a97e;
  }

  .visor__info span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .visor__controles {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .visor__controles button,
  .visor__cerrar {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid rgba(200, 169, 126, 0.22);
    background: rgba(255, 255, 255, 0.04);
    color: #f5f1e8;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
  }

  .visor__controles button:hover:not(:disabled),
  .visor__cerrar:hover {
    background: rgba(200, 169, 126, 0.16);
    border-color: #c8a97e;
    color: #c8a97e;
  }

  .visor__controles button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .visor__zoom {
    min-width: 54px;
    text-align: center;
    color: #b7b0a3;
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
  }

  .visor__cerrar:hover {
    background: rgba(252, 129, 129, 0.18);
    border-color: #fc8181;
    color: #fc8181;
  }

  /* ---- Área de imagen ---- */
  .visor__area {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #0a0906;
    touch-action: none;
    cursor: zoom-in;
  }

  .visor__img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transform-origin: center center;
    transition: transform 0.18s ease-out;
    user-select: none;
    -webkit-user-drag: none;
  }

  .visor__img.es-oculta {
    visibility: hidden;
  }

  .visor__cargando,
  .visor__fallo {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #b7b0a3;
    font-family: 'Jost', sans-serif;
  }

  .visor__cargando i,
  .visor__fallo i {
    font-size: 2rem;
    color: #c8a97e;
  }

  .visor__fallo p {
    margin: 0;
  }

  /* ---- Pie ---- */
  .visor__pie {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 10px 14px;
    border-top: 1px solid rgba(200, 169, 126, 0.16);
    background: #17140f;
    color: #b7b0a3;
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
  }

  .visor__pie small {
    color: #8a8377;
  }

  @media (max-width: 768px) {
    .visor {
      height: 100%;
      border-radius: 0;
      border: none;
    }

    .visor-fondo {
      padding: 0;
    }

    .visor__info {
      font-size: 0.88rem;
    }

    .visor__zoom {
      min-width: 46px;
    }

    .visor__pie {
      font-size: 0.76rem;
      padding: 8px 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .visor__img {
      transition: none;
    }
  }
</style>
