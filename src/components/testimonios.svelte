<script>
  import { onMount, tick } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { setupReveals } from '$lib/reveal.js';
  import { fade, scale } from 'svelte/transition';
  import {
    alSincronizar,
    enCola,
    enviarConRespaldo,
    estaEnLinea,
    guardarEnCache,
    hayConexion,
    iniciarSincronizacion,
    leerDeCache,
    sincronizarPendientes,
    sincronizando,
  } from '$lib/pendientes.js';

  const CACHE_KEY = 'testimonios';
  const MAX_PALABRAS = 300;
  const POR_PAGINA = 20;

  const COLORES = [
    { fondo: '#f6e6a4', borde: '#d9c377', texto: '#3d3520', acento: '#8a7420' },
    { fondo: '#cfe3c4', borde: '#a8c496', texto: '#26301f', acento: '#4f6b3f' },
    { fondo: '#f4d6c8', borde: '#d9b09b', texto: '#3b2a22', acento: '#96543a' },
    { fondo: '#d6dcf0', borde: '#b0bade', texto: '#262b3b', acento: '#4a5591' },
    { fondo: '#f2ddc6', borde: '#d6bb99', texto: '#392e22', acento: '#8c6438' },
  ];

  let testimonios = [];
  let loading = true;
  let errorMsg = '';
  let isOffline = false;
  let destroyReveals = () => {};

  const form = { nombre: '', asunto: '', testimonio: '' };
  let enviando = false;
  let formMsg = '';
  let formType = '';

  let abierto = null;

  let paginaActual = 1;
  $: totalPaginas = Math.max(1, Math.ceil(testimonios.length / POR_PAGINA));
  $: testimoniosVisibles = testimonios.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  async function cambiarPagina(pagina) {
    destroyReveals();
    paginaActual = Math.min(Math.max(pagina, 1), totalPaginas);
    abierto = null;
    await tick();
    destroyReveals();
    destroyReveals = setupReveals();
    const muro = document.querySelector('.cc-tst__muro');
    if (muro) muro.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function colorDe(id) {
    const base = COLORES[0];
    const limpio = String(id || '');
    let suma = 0;
    for (let i = 0; i < limpio.length; i++) suma += limpio.charCodeAt(i);
    return COLORES[suma % COLORES.length] || base;
  }

  function contarPalabras(texto) {
    const t = (texto || '').trim();
    return t ? t.split(/\s+/).length : 0;
  }

  $: palabras = contarPalabras(form.testimonio);
  $: puedeEnviar =
    form.nombre.trim().length > 0 &&
    form.asunto.trim().length > 0 &&
    form.testimonio.trim().length > 0 &&
    palabras <= MAX_PALABRAS &&
    !enviando;

  function extracto(texto, max = 130) {
    const t = (texto || '').trim().replace(/\s+/g, ' ');
    if (t.length <= max) return t;
    return `${t.slice(0, max).trimEnd()}…`;
  }

  function fechaLegible(ts) {
    try {
      return new Date(ts).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }

  async function cargarTestimonios() {
    loading = testimonios.length === 0;
    errorMsg = '';
    isOffline = !estaEnLinea();

    const cache = await leerDeCache(CACHE_KEY);
    if (cache !== null) {
      testimonios = cache;
      loading = false;
    }

    if (!estaEnLinea()) {
      if (cache === null) {
        errorMsg =
          'No hay testimonios guardados en este dispositivo. Conéctate a internet para verlos y enviar el tuyo.';
      }
      loading = false;
      await tick();
      destroyReveals();
      destroyReveals = setupReveals();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('testimonios')
        .select('*')
        .eq('estado', 'aprobado')
        .order('created_at', { ascending: false });

      if (error) throw error;

      testimonios = data || [];
      errorMsg = '';
      isOffline = false;
      await guardarEnCache(CACHE_KEY, testimonios);
    } catch (e) {
      if (cache === null) {
        errorMsg = 'No fue posible cargar los testimonios. Intenta de nuevo más tarde.';
      }
      console.error('Error cargando los testimonios:', e);
    } finally {
      loading = false;
      if (paginaActual > totalPaginas) paginaActual = totalPaginas;
      await tick();
      destroyReveals();
      destroyReveals = setupReveals();
    }
  }

  async function enviarTestimonio() {
    if (!puedeEnviar) return;

    enviando = true;
    formMsg = '';
    formType = '';

    const { entregado, enCola: guardado } = await enviarConRespaldo('testimonios', {
      nombre: form.nombre.trim(),
      asunto: form.asunto.trim(),
      testimonio: form.testimonio.trim(),
      estado: 'pendiente',
    });

    if (!entregado && !guardado) {
      formMsg = 'No pudimos guardar tu testimonio en este dispositivo. Inténtalo otra vez.';
      formType = 'error';
      enviando = false;
      return;
    }

    form.nombre = '';
    form.asunto = '';
    form.testimonio = '';
    isOffline = !entregado;
    formMsg = entregado
      ? '¡Gracias por compartir tu testimonio! Nuestro equipo lo revisará pronto.'
      : 'Sin conexión. Guardamos tu testimonio en este dispositivo y lo enviaremos apenas vuelvas a tener internet.';
    formType = 'success';
    enviando = false;

    if (entregado) await cargarTestimonios();
  }

  function abrirTestimonio(t) {
    abierto = t;
  }

  function cerrarTestimonio() {
    abierto = null;
  }

  function cerrarSiTocoElFondo(e) {
    if (e.target === e.currentTarget) cerrarTestimonio();
  }

  function alPresionarTecla(e) {
    if (e.key === 'Escape' && abierto) cerrarTestimonio();
  }

  onMount(() => {
    isOffline = !estaEnLinea();
    void sincronizarPendientes();
    void cargarTestimonios();

    const pararSync = iniciarSincronizacion();
    const pararAviso = alSincronizar(async ({ tipo }) => {
      if (tipo !== 'sincronizado') return;
      formMsg =
        'Tus envíos guardados mientras no tenías conexión ya fueron enviados. Serán revisados por nuestro equipo.';
      formType = 'success';
      isOffline = false;
      await cargarTestimonios();
      setTimeout(() => {
        formMsg = '';
      }, 8000);
    });

    window.addEventListener('keydown', alPresionarTecla);

    return () => {
      pararSync();
      pararAviso();
      window.removeEventListener('keydown', alPresionarTecla);
      destroyReveals();
    };
  });
</script>

<section class="cc-tst">
  <div class="cc-container">
    {#if !$hayConexion || isOffline}
      <div class="cc-tst__offline" role="status">
        <i class="fa-solid fa-wifi"></i>
        <div>
          <strong>Estás sin conexión</strong>
          <p>
            Puedes escribir tu testimonio igual: lo guardamos en este dispositivo y lo enviamos
            automáticamente cuando vuelvas a tener internet.
          </p>
        </div>
      </div>
    {/if}

    {#if $enCola > 0}
      <div class="cc-tst__pendientes" role="status">
        <i class="fa-solid fa-cloud-arrow-up"></i>
        {#if $sincronizando}
          Enviando {$enCola} {$enCola === 1 ? 'envío pendiente' : 'envíos pendientes'}...
        {:else}
          {$enCola} {$enCola === 1 ? 'envío pendiente' : 'envíos pendientes'} por enviar.
        {/if}
      </div>
    {/if}

    <div class="text-center mb-5">
      <span class="cc-overline">Historias de fe</span>
      <h2 class="cc-section-title">Comparte tu testimonio</h2>
      <p class="cc-section-sub">
        Lo que Dios ha hecho en tu vida puede fortalecer la de alguien más. Escríbenos y lo
        compartiremos con la iglesia.
      </p>
    </div>

    <form class="cc-tst__form cc-card" on:submit|preventDefault={enviarTestimonio}>
      <div class="cc-tst__grid">
        <div class="cc-tst__field">
          <label class="cc-tst__label" for="tst-nombre">
            <i class="fa-solid fa-user"></i> Tu nombre
          </label>
          <input
            id="tst-nombre"
            type="text"
            bind:value={form.nombre}
            placeholder="¿Cómo te llamas?"
            maxlength="60"
            required
          />
        </div>

        <div class="cc-tst__field">
          <label class="cc-tst__label" for="tst-asunto">
            <i class="fa-solid fa-heading"></i> Asunto
          </label>
          <input
            id="tst-asunto"
            type="text"
            bind:value={form.asunto}
            placeholder="Ej. Dios restauró mi salud"
            maxlength="80"
            required
          />
        </div>
      </div>

      <div class="cc-tst__field">
        <label class="cc-tst__label" for="tst-testimonio">
          <i class="fa-solid fa-pen-nib"></i> Tu testimonio
        </label>
        <textarea
          id="tst-testimonio"
          bind:value={form.testimonio}
          placeholder="Cuéntanos qué ha hecho Dios en tu vida..."
          rows="6"
          required
        ></textarea>
        <div class="cc-tst__counter" class:is-full={palabras >= MAX_PALABRAS}>
          {palabras} / {MAX_PALABRAS} palabras
        </div>
      </div>

      {#if formMsg}
        <div class="cc-tst__msg cc-tst__msg--{formType}" role="status">{formMsg}</div>
      {/if}

      <button type="submit" class="cc-btn cc-btn--gold cc-tst__submit" disabled={!puedeEnviar}>
        {#if enviando}
          <i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...
        {:else}
          <i class="fa-solid fa-quote-right"></i> Enviar testimonio
        {/if}
      </button>
    </form>
  </div>
</section>

<section class="cc-tst cc-tst--muro">
  <div class="cc-container">
      <div class="text-center mb-5">
        <span class="cc-overline">Muro de la iglesia</span>
        <h2 class="cc-section-title">Testimonios</h2>
        <p class="cc-section-sub">
          {#if testimonios.length > 1}
            {testimonios.length}
            {testimonios.length === 1 ? 'testimonio' : 'testimonios'}. Toca cualquier nota para leer
            el testimonio completo.
          {:else}
            Toca cualquier nota para leer el testimonio completo.
          {/if}
        </p>
      </div>

    {#if loading}
      <div class="cc-state">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <p>Cargando testimonios...</p>
      </div>
    {:else if errorMsg}
      <div class="cc-state">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>{errorMsg}</p>
      </div>
    {:else if !testimonios.length}
      <div class="cc-state">
        <i class="fa-solid fa-note-sticky"></i>
        <p>Todavía no hay testimonios publicados. ¡Comparte el tuyo!</p>
      </div>
    {:else}
      <div class="cc-tst__muro">
        {#each testimoniosVisibles as t, i}
          <button
            type="button"
            class="cc-tst__nota cc-reveal"
            style="--nota-fondo: {colorDe(t.id).fondo}; --nota-borde: {colorDe(t.id).borde};
                   --nota-texto: {colorDe(t.id).texto}; --nota-acento: {colorDe(t.id).acento};
                   --giro: {((i % 5) - 2) * 1.1}deg; --giro-hover: {((i % 5) - 2) * 0.35}deg;
                   transition-delay: {0.12 * (i % 4)}s"
            on:click={() => abrirTestimonio(t)}
            aria-label="Leer testimonio de {t.nombre}: {t.asunto}"
          >
            <span class="cc-tst__nota-pin" aria-hidden="true"></span>
            <span class="cc-tst__nota-asunto">{t.asunto}</span>
            <span class="cc-tst__nota-texto">{extracto(t.testimonio)}</span>
            <span class="cc-tst__nota-pie">
              <i class="fa-solid fa-user"></i>
              {t.nombre}
              <i class="fa-solid fa-arrow-right-long cc-tst__nota-arrow"></i>
            </span>
          </button>
        {/each}
      </div>

      {#if totalPaginas > 1}
        <nav class="cc-tst__paginacion" aria-label="Paginación de testimonios">
          <button
            type="button"
            on:click={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}>
            <i class="fa-solid fa-chevron-left"></i> Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
            <small>· {testimonios.length} testimonios</small>
          </span>
          <button
            type="button"
            on:click={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}>
            Siguiente <i class="fa-solid fa-chevron-right"></i>
          </button>
        </nav>
      {/if}
    {/if}
  </div>
</section>

{#if abierto}
  <div
    class="cc-tst__overlay"
    role="presentation"
    transition:fade={{ duration: 220 }}
    on:click={cerrarSiTocoElFondo}
  >
    <div
      class="cc-tst__modal"
      role="dialog"
      aria-modal="true"
      aria-label="Testimonio de {abierto.nombre}"
      style="--nota-fondo: {colorDe(abierto.id).fondo}; --nota-borde: {colorDe(abierto.id).borde};
             --nota-texto: {colorDe(abierto.id).texto}; --nota-acento: {colorDe(abierto.id).acento};"
      transition:scale={{ duration: 280, start: 0.92 }}
    >
      <button
        type="button"
        class="cc-tst__cerrar"
        aria-label="Cerrar testimonio"
        on:click={cerrarTestimonio}
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

      <span class="cc-tst__nota-pin cc-tst__nota-pin--modal" aria-hidden="true"></span>

      <h3 class="cc-tst__modal-asunto">{abierto.asunto}</h3>
      <p class="cc-tst__modal-meta">
        <i class="fa-solid fa-user"></i>
        {abierto.nombre}
        {#if abierto.created_at}
          <span aria-hidden="true">·</span>
          <i class="fa-regular fa-calendar"></i>
          {fechaLegible(abierto.created_at)}
        {/if}
      </p>

      <p class="cc-tst__modal-texto">{abierto.testimonio}</p>

      <p class="cc-tst__modal-firma">
        <i class="fa-solid fa-quote-left"></i>
        Para la gloria de Dios
      </p>
    </div>
  </div>
{/if}

<style>
  .cc-tst {
    padding: 90px 0 0;
  }

  .cc-tst--muro {
    padding: 90px 0 110px;
  }

  /* ---------- Avisos de conexión ---------- */
  .cc-tst__offline,
  .cc-tst__pendientes {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 16px;
    margin-bottom: 22px;
    border: 1px solid;
  }

  .cc-tst__offline {
    background: linear-gradient(160deg, rgba(252, 129, 129, 0.12), rgba(252, 129, 129, 0.05));
    border-color: rgba(252, 129, 129, 0.35);
  }

  .cc-tst__offline i {
    color: #fc8181;
    font-size: 1.1rem;
    margin-top: 3px;
  }

  .cc-tst__offline strong {
    display: block;
    font-size: 0.98rem;
    margin-bottom: 2px;
  }

  .cc-tst__offline p {
    margin: 0;
    color: var(--cc-muted);
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .cc-tst__pendientes {
    align-items: center;
    background: rgba(200, 169, 126, 0.1);
    border-color: rgba(200, 169, 126, 0.35);
    color: var(--cc-accent-soft);
    font-size: 0.9rem;
  }

  .cc-tst__pendientes i {
    color: var(--cc-accent);
    animation: subeBaja 1.6s ease-in-out infinite;
  }

  @keyframes subeBaja {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  /* ---------- Formulario ---------- */
  .cc-tst__form {
    display: grid;
    gap: 24px;
    max-width: 820px;
    margin: 0 auto;
    padding: 2.4rem;
  }

  .cc-tst__grid {
    display: grid;
    gap: 22px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .cc-tst__field {
    display: grid;
    gap: 10px;
  }

  .cc-tst__label {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: 'Jost', sans-serif;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--cc-accent);
  }

  .cc-tst__form input[type='text'],
  .cc-tst__form textarea {
    width: 100%;
    background: rgba(146, 174, 131, 0.06);
    border: 1px solid var(--cc-border);
    border-radius: 12px;
    color: var(--cc-cream);
    font-family: 'Jost', sans-serif;
    font-size: 0.98rem;
    padding: 13px 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .cc-tst__form input[type='text']::placeholder,
  .cc-tst__form textarea::placeholder {
    color: var(--cc-muted);
    opacity: 0.65;
  }

  .cc-tst__form input[type='text']:focus,
  .cc-tst__form textarea:focus {
    outline: none;
    border-color: rgba(200, 169, 126, 0.55);
    box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.12);
  }

  .cc-tst__form textarea {
    min-height: 160px;
    resize: vertical;
    line-height: 1.7;
  }

  .cc-tst__counter {
    justify-self: end;
    font-size: 0.82rem;
    color: var(--cc-muted);
  }

  .cc-tst__counter.is-full {
    color: #fc8181;
  }

  .cc-tst__msg {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 0.92rem;
    border: 1px solid;
  }

  .cc-tst__msg--success {
    background: rgba(146, 174, 131, 0.12);
    border-color: rgba(146, 174, 131, 0.45);
    color: var(--cc-primary);
  }

  .cc-tst__msg--error {
    background: rgba(252, 129, 129, 0.12);
    border-color: rgba(252, 129, 129, 0.45);
    color: #fc8181;
  }

  .cc-tst__submit {
    justify-self: start;
  }

  .cc-tst__submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ---------- Muro de notas ---------- */
  .cc-tst__muro {
    display: grid;
    gap: 26px;
    grid-template-columns: repeat(auto-fill, minmax(258px, 1fr));
    perspective: 1200px;
  }

  .cc-tst__nota {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: left;
    padding: 30px 24px 22px;
    min-height: 230px;
    border: 1px solid var(--nota-borde);
    border-radius: 4px 14px 14px 14px;
    background: linear-gradient(160deg, var(--nota-fondo) 0%, var(--nota-fondo) 100%);
    color: var(--nota-texto);
    font-family: 'Jost', sans-serif;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
    transform: rotate(var(--giro, 0deg));
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease;
    animation: notaEntra 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cc-tst__nota::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.035) 0px,
      rgba(0, 0, 0, 0.035) 1px,
      transparent 1px,
      transparent 27px
    );
    pointer-events: none;
  }

  .cc-tst__nota:hover {
    transform: rotate(var(--giro-hover, 0deg)) translateY(-10px) scale(1.03);
    box-shadow: 0 26px 50px rgba(0, 0, 0, 0.55);
    z-index: 2;
  }

  .cc-tst__nota:focus-visible {
    outline: 3px solid var(--cc-accent);
    outline-offset: 4px;
  }

  .cc-tst__nota-pin {
    position: absolute;
    top: -11px;
    left: 50%;
    width: 26px;
    height: 26px;
    transform: translateX(-50%);
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #f08a7d 0%, #b23a2e 70%);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.5);
    animation: pinPulso 3.4s ease-in-out infinite;
  }

  .cc-tst__nota-asunto {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.34rem;
    font-weight: 700;
    line-height: 1.25;
    color: var(--nota-texto);
  }

  .cc-tst__nota-texto {
    font-size: 0.94rem;
    line-height: 1.65;
    color: var(--nota-texto);
    opacity: 0.85;
    flex: 1;
  }

  .cc-tst__nota-pie {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--nota-acento);
    padding-top: 10px;
    border-top: 1px dashed var(--nota-borde);
  }

  .cc-tst__nota-arrow {
    margin-left: auto;
    transition: transform 0.35s ease;
  }

  .cc-tst__nota:hover .cc-tst__nota-arrow {
    transform: translateX(7px);
  }

  @keyframes notaEntra {
    from {
      opacity: 0;
      transform: rotate(var(--giro, 0deg)) translateY(-40px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: rotate(var(--giro, 0deg)) translateY(0) scale(1);
    }
  }

  @keyframes pinPulso {
    0%,
    100% {
      transform: translateX(-50%) scale(1);
    }
    50% {
      transform: translateX(-50%) scale(1.14);
    }
  }

  /* ---------- Paginación ---------- */
  .cc-tst__paginacion {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 44px;
    color: var(--cc-muted);
    font-family: 'Jost', sans-serif;
  }

  .cc-tst__paginacion span {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.95rem;
  }

  .cc-tst__paginacion span small {
    font-size: 0.76rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .cc-tst__paginacion button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: 1px solid var(--cc-border);
    border-radius: 999px;
    background: transparent;
    color: var(--cc-cream);
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
  }

  .cc-tst__paginacion button:hover:not(:disabled) {
    border-color: var(--cc-accent);
    color: var(--cc-accent);
    background: rgba(200, 169, 126, 0.1);
  }

  .cc-tst__paginacion button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ---------- Modal ---------- */
  .cc-tst__overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(8, 7, 4, 0.82);
    backdrop-filter: blur(6px);
    overflow-y: auto;
  }

  .cc-tst__modal {
    position: relative;
    width: min(620px, 100%);
    padding: 44px 38px 34px;
    border-radius: 6px 20px 20px 20px;
    border: 1px solid var(--nota-borde);
    background: var(--nota-fondo);
    color: var(--nota-texto);
    box-shadow: 0 34px 80px rgba(0, 0, 0, 0.65);
    animation: notaSube 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cc-tst__nota-pin--modal {
    animation: none;
  }

  .cc-tst__cerrar {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--nota-borde);
    background: rgba(0, 0, 0, 0.08);
    color: var(--nota-texto);
    font-size: 1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .cc-tst__cerrar:hover {
    transform: rotate(90deg);
    background: rgba(0, 0, 0, 0.16);
  }

  .cc-tst__modal-asunto {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 700;
    line-height: 1.2;
    color: var(--nota-texto);
    margin-bottom: 8px;
  }

  .cc-tst__modal-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 0.84rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--nota-acento);
    padding-bottom: 18px;
    margin-bottom: 20px;
    border-bottom: 1px dashed var(--nota-borde);
  }

  .cc-tst__modal-texto {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.85;
    white-space: pre-line;
  }

  .cc-tst__modal-firma {
    display: flex;
    align-items: center;
    gap: 9px;
    margin: 26px 0 0;
    font-size: 0.84rem;
    font-weight: 600;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: var(--nota-acento);
    opacity: 0.85;
  }

  @keyframes notaSube {
    from {
      opacity: 0;
      transform: translateY(40px) rotate(-1.5deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) rotate(-0.5deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cc-tst__nota,
    .cc-tst__modal,
    .cc-tst__nota-pin {
      animation: none;
    }
  }

  @media (max-width: 768px) {
    .cc-tst,
    .cc-tst--muro {
      padding: 70px 0;
    }

    .cc-tst__form {
      padding: 1.5rem;
    }

    .cc-tst__submit {
      justify-self: stretch;
    }

    .cc-tst__modal {
      padding: 40px 24px 28px;
    }
  }
</style>
