<script>
  import { onMount, tick } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import ImageLightbox from '../../components/ImageLightbox.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { setupReveals } from '$lib/reveal.js';
  import { descargarArchivo, descargarConjunto } from '$lib/descargas.js';
  import { estaEnLinea, guardarEnCache, hayConexion, leerDeCache } from '$lib/pendientes.js';
  import '$lib/public.css';

  const CARPETA = 'bosquejo';
  const CACHE_KEY = 'bosquejos';
  const POR_PAGINA = 4;

  let imagenes = [];
  let loading = true;
  let errorMsg = '';
  let isOffline = false;
  let pagina = 1;
  let descargando = false;
  let ocupado = null;
  let statusMsg = '';
  let statusType = '';
  let viendo = null;
  let destroyReveals = () => {};

  $: totalPaginas = Math.max(1, Math.ceil(imagenes.length / POR_PAGINA));
  $: visibles = imagenes.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function nombreLimpio(name) {
    try {
      return decodeURIComponent(name);
    } catch {
      return name;
    }
  }

  function fechaDe(name) {
    const m = String(name).match(/(\d{4}-\d{2}-\d{2})-(\d{2})/);
    if (!m) return '';
    const d = new Date(`${m[1]}T${m[2]}:00`);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function avisar(mensaje, tipo = 'success') {
    statusMsg = mensaje;
    statusType = tipo;
    setTimeout(() => (statusMsg = ''), 5000);
  }

  async function cargar() {
    loading = imagenes.length === 0;
    errorMsg = '';
    isOffline = !estaEnLinea();

    const cache = await leerDeCache(CACHE_KEY);
    if (cache !== null) {
      imagenes = cache;
      loading = false;
      await tick();
      destroyReveals();
      destroyReveals = setupReveals();
    }

    if (!estaEnLinea()) {
      if (cache === null) {
        errorMsg =
          'No hay bosquejos guardados en este dispositivo. Conéctate a internet para verlos y descargarlos.';
      }
      loading = false;
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('imagenes')
        .list(CARPETA, { limit: 200, offset: 0, sortBy: { column: 'name', order: 'desc' } });

      if (error) throw error;

      imagenes = (data || [])
        .filter((f) => f.name && f.name !== '.emptyFolderPlaceholder')
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from('imagenes').getPublicUrl(`${CARPETA}/${f.name}`).data.publicUrl,
        }));

      errorMsg = '';
      isOffline = false;
      await guardarEnCache(CACHE_KEY, imagenes);
    } catch (e) {
      if (cache === null) errorMsg = 'No fue posible cargar los bosquejos. Intenta más tarde.';
      console.error('Error cargando los bosquejos:', e);
    } finally {
      loading = false;
      if (pagina > totalPaginas) pagina = totalPaginas;
      await tick();
      destroyReveals();
      destroyReveals = setupReveals();
    }
  }

  async function descargarUno(imagen) {
    if (ocupado) return;
    ocupado = imagen.name;
    statusMsg = '';
    statusType = '';
    try {
      await descargarArchivo(imagen.url, imagen.name);
      avisar('Bosquejo descargado.');
    } catch (e) {
      console.error('Error descargando el bosquejo:', e);
      avisar(e?.message || 'No se pudo descargar el bosquejo.', 'error');
    } finally {
      ocupado = null;
    }
  }

  function abrirVisor(imagen) {
    viendo = imagen;
  }

  async function descargarTodo() {
    if (descargando || !imagenes.length) return;
    descargando = true;
    statusMsg = '';
    statusType = '';

    try {
      const resultado = await descargarConjunto(
        imagenes.map((i) => ({ url: i.url, nombre: i.name })),
        `bosquejos-${new Date().toISOString().slice(0, 10)}.zip`
      );

      if (resultado.modo === 'zip-android') {
        avisar(`ZIP con ${resultado.total} bosquejos guardado en la carpeta Descargas.`);
      } else if (resultado.omitidas) {
        avisar(
          `ZIP con ${resultado.total} bosquejos (${resultado.omitidas} no se pudieron incluir).`,
          'warning'
        );
      } else {
        avisar(`ZIP con ${resultado.total} bosquejos descargado.`);
      }
    } catch (e) {
      console.error('Error descargando los bosquejos:', e);
      avisar(e.message || 'No se pudo descargar el conjunto.', 'error');
    } finally {
      descargando = false;
    }
  }

  async function cambiarPagina(nueva) {
    destroyReveals();
    pagina = Math.min(Math.max(nueva, 1), totalPaginas);
    await tick();
    destroyReveals();
    destroyReveals = setupReveals();
    document.getElementById('bosquejos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMount(() => {
    void cargar();
    const alVolverOnline = () => {
      isOffline = false;
      void cargar();
    };
    window.addEventListener('online', alVolverOnline);
    return () => {
      window.removeEventListener('online', alVolverOnline);
      destroyReveals();
    };
  });
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">Estudio de la Palabra</span>
      <h1>Bosquejos</h1>
      <p>
        Descarga los bosquejos de nuestras predicaciones para estudiarlos, compartirlos y llevarlos
        a tu casa.
      </p>
    </div>
  </section>

  <section class="cc-section" id="bosquejos">
    <div class="cc-container">
      {#if !$hayConexion || isOffline}
        <div class="cc-bosq__offline" role="status">
          <i class="fa-solid fa-wifi"></i>
          <div>
            <strong>Estás sin conexión</strong>
            <p>
              Mostramos los bosquejos guardados en este dispositivo. Para descargarlos necesitas
              volver a tener internet.
            </p>
          </div>
        </div>
      {/if}

      {#if statusMsg}
        <div
          class="cc-bosq__msg cc-bosq__msg--{statusType}"
          role="status">
          {statusMsg}
        </div>
      {/if}

      {#if loading}
        <div class="cc-state">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <p>Cargando bosquejos...</p>
        </div>
      {:else if errorMsg}
        <div class="cc-state">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>{errorMsg}</p>
        </div>
      {:else if !imagenes.length}
        <div class="cc-state">
          <i class="fa-solid fa-folder-open"></i>
          <p>Todavía no hay bosquejos publicados. Vuelve pronto.</p>
        </div>
      {:else}
        <div class="cc-bosq__barra">
          <div>
            <strong>{imagenes.length}</strong>
            {imagenes.length === 1 ? 'bosquejo disponible' : 'bosquejos disponibles'}
            <small>· "Descargar todo" genera un ZIP</small>
          </div>
          <button
            type="button"
            class="cc-btn cc-btn--gold"
            disabled={descargando}
            on:click={descargarTodo}>
            {#if descargando}
              <i class="fa-solid fa-circle-notch fa-spin"></i> Preparando...
            {:else}
              <i class="fa-solid fa-file-zipper"></i> Descargar todo
            {/if}
          </button>
        </div>

        <div class="row g-4">
          {#each visibles as imagen, i}
            {@const numero = (pagina - 1) * POR_PAGINA + i + 1}
            <div class="col-sm-6 col-lg-3">
              <article class="cc-bosq cc-reveal cc-d{(i % 4) + 1}">
                <div class="cc-bosq__marco">
                  <img src={imagen.url} alt={nombreLimpio(imagen.name)} loading="lazy" />
                  <span class="cc-bosq__numero">{numero}</span>
                </div>

                <div class="cc-bosq__cuerpo">
                  <h3 class="cc-bosq__titulo" title={nombreLimpio(imagen.name)}>
                    {nombreLimpio(imagen.name)}
                  </h3>

                  {#if fechaDe(imagen.name)}
                    <p class="cc-bosq__fecha">
                      <i class="fa-regular fa-calendar"></i>
                      {fechaDe(imagen.name)}
                    </p>
                  {/if}

                  <div class="cc-bosq__acciones">
                    <button
                      type="button"
                      class="cc-bosq__btn"
                      disabled={ocupado === imagen.name}
                      on:click={() => descargarUno(imagen)}>
                      {#if ocupado === imagen.name}
                        <i class="fa-solid fa-circle-notch fa-spin"></i> Descargando
                      {:else}
                        <i class="fa-solid fa-download"></i> Descargar
                      {/if}
                    </button>
                    <button
                      type="button"
                      class="cc-bosq__btn cc-bosq__btn--fantasma"
                      on:click={() => abrirVisor(imagen)}
                      title="Ver en pantalla completa">
                      <i class="fa-solid fa-expand"></i>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          {/each}
        </div>

        {#if totalPaginas > 1}
          <nav class="cc-bosq__paginacion" aria-label="Paginación de bosquejos">
            <button type="button" on:click={() => cambiarPagina(pagina - 1)} disabled={pagina === 1}>
              <i class="fa-solid fa-chevron-left"></i> Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas}
              <small>· {imagenes.length} bosquejos</small>
            </span>
            <button
              type="button"
              on:click={() => cambiarPagina(pagina + 1)}
              disabled={pagina === totalPaginas}>
              Siguiente <i class="fa-solid fa-chevron-right"></i>
            </button>
          </nav>
        {/if}
      {/if}
    </div>
  </section>

  <Footer />
</div>

{#if viendo}
  <ImageLightbox
    src={viendo.url}
    titulo={nombreLimpio(viendo.name)}
    pie={fechaDe(viendo.name)}
    on:cerrar={() => (viendo = null)} />
{/if}

<style>
  /* ---------- Avisos ---------- */
  .cc-bosq__offline {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 16px;
    margin-bottom: 26px;
    border: 1px solid rgba(252, 129, 129, 0.35);
    background: linear-gradient(160deg, rgba(252, 129, 129, 0.12), rgba(252, 129, 129, 0.05));
  }

  .cc-bosq__offline i {
    color: #fc8181;
    font-size: 1.1rem;
    margin-top: 3px;
  }

  .cc-bosq__offline strong {
    display: block;
    font-size: 0.98rem;
    margin-bottom: 2px;
  }

  .cc-bosq__offline p {
    margin: 0;
    color: var(--cc-muted);
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .cc-bosq__msg {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 0.92rem;
    border: 1px solid;
    margin-bottom: 26px;
  }

  .cc-bosq__msg--success {
    background: rgba(146, 174, 131, 0.12);
    border-color: rgba(146, 174, 131, 0.45);
    color: var(--cc-primary);
  }

  .cc-bosq__msg--warning {
    background: rgba(200, 169, 126, 0.12);
    border-color: rgba(200, 169, 126, 0.45);
    color: var(--cc-accent-soft);
  }

  .cc-bosq__msg--error {
    background: rgba(252, 129, 129, 0.12);
    border-color: rgba(252, 129, 129, 0.45);
    color: #fc8181;
  }

  /* ---------- Barra superior ---------- */
  .cc-bosq__barra {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 20px 24px;
    margin-bottom: 34px;
    border-radius: 18px;
    border: 1px solid var(--cc-border);
    background: linear-gradient(160deg, var(--cc-card) 0%, #17140f 100%);
    color: var(--cc-cream);
    font-size: 1.05rem;
  }

  .cc-bosq__barra strong {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem;
    color: var(--cc-accent);
    margin-right: 4px;
  }

  .cc-bosq__barra small {
    display: block;
    color: var(--cc-muted);
    font-size: 0.84rem;
    letter-spacing: 0.4px;
  }

  .cc-bosq__barra .cc-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ---------- Tarjetas ---------- */
  .cc-bosq {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: var(--cc-radius);
    border: 1px solid var(--cc-border);
    background: linear-gradient(160deg, var(--cc-card) 0%, #17140f 100%);
    overflow: hidden;
    transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .cc-bosq:hover {
    transform: translateY(-8px);
    border-color: rgba(200, 169, 126, 0.4);
    box-shadow: var(--cc-shadow);
  }

  .cc-bosq__marco {
    position: relative;
    aspect-ratio: 3 / 4;
    background: var(--cc-darker);
  }

  .cc-bosq__marco img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .cc-bosq:hover .cc-bosq__marco img {
    transform: scale(1.05);
  }

  .cc-bosq__numero {
    position: absolute;
    top: 12px;
    left: 12px;
    min-width: 30px;
    height: 30px;
    padding: 0 9px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(14, 13, 6, 0.82);
    border: 1px solid rgba(200, 169, 126, 0.32);
    color: var(--cc-accent);
    font-family: 'Jost', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .cc-bosq__cuerpo {
    padding: 18px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }

  .cc-bosq__titulo {
    font-size: 1.12rem;
    line-height: 1.3;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .cc-bosq__fecha {
    margin: 0;
    color: var(--cc-muted);
    font-size: 0.82rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cc-bosq__fecha i {
    color: var(--cc-primary);
    font-size: 0.78rem;
  }

  .cc-bosq__acciones {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 8px;
  }

  .cc-bosq__btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: var(--cc-gradient);
    color: #fff;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.88rem;
    letter-spacing: 0.4px;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .cc-bosq__btn--fantasma {
    flex: 0 0 auto;
    width: 42px;
    padding: 10px;
    background: transparent;
    border-color: var(--cc-border);
    color: var(--cc-cream);
  }

  .cc-bosq__btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(120, 151, 104, 0.35);
    color: #fff;
  }

  .cc-bosq__btn--fantasma:hover {
    border-color: var(--cc-accent);
    color: var(--cc-accent);
    box-shadow: none;
  }

  .cc-bosq__btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ---------- Paginación ---------- */
  .cc-bosq__paginacion {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 46px;
    color: var(--cc-muted);
  }

  .cc-bosq__paginacion span {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.95rem;
  }

  .cc-bosq__paginacion span small {
    font-size: 0.76rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .cc-bosq__paginacion button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid var(--cc-border);
    background: transparent;
    color: var(--cc-cream);
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
  }

  .cc-bosq__paginacion button:hover:not(:disabled) {
    border-color: var(--cc-accent);
    color: var(--cc-accent);
    background: rgba(200, 169, 126, 0.1);
  }

  .cc-bosq__paginacion button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .cc-bosq__barra {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
  }
</style>
