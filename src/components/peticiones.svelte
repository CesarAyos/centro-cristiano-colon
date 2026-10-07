<script>
  import { onMount, tick } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { setupReveals } from '$lib/reveal.js';
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

  const CACHE_KEY = 'peticiones';
  const MAX_PALABRAS = 200;
  const DIAS_SEMANA = 3;
  const DOMINGO = 0;
  const CANTIDAD_FECHAS = 8;

  const TIPOS = [
    { valor: 'oracion', etiqueta: 'Oración', icono: 'fa-solid fa-hands-praying' },
    { valor: 'agradecimiento', etiqueta: 'Acción de gracias', icono: 'fa-solid fa-heart' },
    { valor: 'ambas', etiqueta: 'Ambas', icono: 'fa-solid fa-infinity' },
  ];

  let peticiones = [];
  let loading = true;
  let errorMsg = '';
  let isOffline = false;

  let destroyReveals = () => {};

  const form = {
    nombre: '',
    tipo: 'oracion',
    fecha: '',
    mensaje: '',
  };

  let enviando = false;
  let formMsg = '';
  let formType = '';

  function toISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function proximasFechas(diaSemana, desde) {
    const fechas = [];
    const d = new Date(`${desde}T00:00:00`);
    d.setDate(d.getDate() + ((diaSemana - d.getDay() + 7) % 7));
    for (let i = 0; i < CANTIDAD_FECHAS; i++) {
      fechas.push(toISO(d));
      d.setDate(d.getDate() + 7);
    }
    return fechas;
  }

  // Una petición para la fecha D se puede enviar hasta las 7:00 pm
  // (hora venezolana, UTC-4) del día anterior. Venezuela no aplica horario
  // de verano, así que 7:00 pm local equivale siempre a 23:00 UTC.
  const HORA_CORTE_UTC = 23;

  function instanteDeCorte(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d - 1, HORA_CORTE_UTC, 0, 0);
  }

  // La lista es una ventana móvil: los próximos 8 días de cada tipo que
  // todavía siguen abiertos. `ahora` se refresca cada minuto para que las
  // opciones cierren solas al llegar las 7:00 pm.
  let ahora = Date.now();
  let hoyIso = toISO(new Date());

  $: fechasMiercoles = proximasFechas(DIAS_SEMANA, hoyIso).filter((f) => ahora < instanteDeCorte(f));
  $: fechasDomingo = proximasFechas(DOMINGO, hoyIso).filter((f) => ahora < instanteDeCorte(f));

  function estaAbierta(iso) {
    return ahora < instanteDeCorte(iso);
  }

  function cuentaRegresiva(iso) {
    const ms = instanteDeCorte(iso) - ahora;
    if (ms <= 0) return '';
    const horas = Math.floor(ms / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    if (horas >= 24) {
      const dias = Math.floor(horas / 24);
      return ` · cierra en ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
    return ` · cierra en ${horas} h ${minutos} min`;
  }

  function comprobarDia() {
    ahora = Date.now();
    const actual = toISO(new Date(ahora));
    if (actual !== hoyIso) hoyIso = actual;
    // Si la fecha elegida ya cerró, se descarta la selección.
    if (form.fecha && !estaAbierta(form.fecha)) form.fecha = '';
  }

  function contarPalabras(texto) {
    const t = (texto || '').trim();
    return t ? t.split(/\s+/).length : 0;
  }

  $: palabrasMensaje = contarPalabras(form.mensaje);
  $: puedeEnviar =
    form.nombre.trim().length > 0 &&
    form.mensaje.trim().length > 0 &&
    palabrasMensaje <= MAX_PALABRAS &&
    Boolean(form.fecha) &&
    estaAbierta(form.fecha) &&
    !enviando;

  function aFecha(iso) {
    const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function fechaLabel(iso) {
    const d = aFecha(iso);
    if (!d) return '';
    const dia = d.toLocaleDateString('es-ES', { day: 'numeric' });
    const mes = d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
    const diaSemana = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
    return `${diaSemana} ${dia} ${mes}`;
  }

  function fechaLarga(iso) {
    const d = aFecha(iso);
    if (!d) return '';
    const dia = d.toLocaleDateString('es-ES', { weekday: 'long' });
    return `${dia.charAt(0).toUpperCase() + dia.slice(1)} ${d.getDate()} de ${d.toLocaleDateString('es-ES', { month: 'long' })}`;
  }

  function lunesDe(iso) {
    const d = aFecha(iso);
    if (!d) return null;
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }

  function etiquetaSemana(isoLunes) {
    const inicio = lunesDe(isoLunes);
    if (!inicio) return '';
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6);

    if (inicio.getFullYear() !== fin.getFullYear()) {
      const mesI = inicio.toLocaleDateString('es-ES', { month: 'long' });
      const mesF = fin.toLocaleDateString('es-ES', { month: 'long' });
      return `Semana del ${inicio.getDate()} de ${mesI} de ${inicio.getFullYear()} al ${fin.getDate()} de ${mesF} de ${fin.getFullYear()}`;
    }
    if (inicio.getMonth() === fin.getMonth()) {
      return `Semana del ${inicio.getDate()} al ${fin.getDate()} de ${inicio.toLocaleDateString('es-ES', { month: 'long' })}`;
    }
    const mesI = inicio.toLocaleDateString('es-ES', { month: 'long' });
    const mesF = fin.toLocaleDateString('es-ES', { month: 'long' });
    return `Semana del ${inicio.getDate()} de ${mesI} al ${fin.getDate()} de ${mesF}`;
  }

  function diaDe(iso) {
    return aFecha(iso)?.getDay() ?? -1;
  }

  function porFechaDesc(a, b) {
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  }

  $: grupos = agruparPorSemana(peticiones);

  function agruparPorSemana(filas) {
    const mapa = new Map();

    for (const fila of filas) {
      if (!fila.fecha) continue;
      const lunes = lunesDe(fila.fecha);
      if (!lunes) continue;
      const clave = toISO(lunes);
      if (!mapa.has(clave)) {
        mapa.set(clave, { clave, miercoles: [], domingo: [], otro: [] });
      }
      const grupo = mapa.get(clave);
      if (diaDe(fila.fecha) === DIAS_SEMANA) grupo.miercoles.push(fila);
      else if (diaDe(fila.fecha) === DOMINGO) grupo.domingo.push(fila);
      else grupo.otro.push(fila);
    }

    return [...mapa.values()]
      .sort((a, b) => (a.clave < b.clave ? 1 : -1))
      .map((g) => ({
        ...g,
        miercoles: g.miercoles.sort(porFechaDesc),
        domingo: g.domingo.sort(porFechaDesc),
        otro: g.otro.sort(porFechaDesc),
      }));
  }

  async function cargarPeticiones() {
    loading = peticiones.length === 0;
    errorMsg = '';
    isOffline = !estaEnLinea();

    const cache = await leerDeCache(CACHE_KEY);
    if (cache !== null) {
      peticiones = cache;
      loading = false;
    }

    if (!estaEnLinea()) {
      if (cache === null) {
        errorMsg =
          'No hay peticiones guardadas en este dispositivo. Conéctate a internet para verlas y enviarlas.';
      }
      loading = false;
      await tick();
      destroyReveals();
      destroyReveals = setupReveals();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('peticiones')
        .select('*')
        .eq('estado', 'aprobado')
        .order('fecha', { ascending: false });

      if (error) throw error;

      peticiones = data || [];
      errorMsg = '';
      isOffline = false;
      await guardarEnCache(CACHE_KEY, peticiones);
    } catch (e) {
      if (cache === null) {
        errorMsg = 'No fue posible cargar las peticiones. Intenta de nuevo más tarde.';
      }
      console.error('Error cargando las peticiones:', e);
    } finally {
      loading = false;
      await tick();
      destroyReveals();
      destroyReveals = setupReveals();
    }
  }

  function limpiarFormulario() {
    form.nombre = '';
    form.tipo = 'oracion';
    form.fecha = '';
    form.mensaje = '';
  }

  async function enviarPeticion() {
    comprobarDia();
    if (!puedeEnviar) {
      if (form.fecha && !estaAbierta(form.fecha)) {
        formMsg =
          'El tiempo para enviar peticiones de ese día ya cerró (7:00 pm del día anterior). Elige otra fecha.';
        formType = 'error';
      }
      return;
    }

    enviando = true;
    formMsg = '';
    formType = '';

    const { entregado, enCola: guardado } = await enviarConRespaldo('peticiones', {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      fecha: form.fecha,
      mensaje: form.mensaje.trim(),
      estado: 'pendiente',
    });

    if (!entregado && !guardado) {
      formMsg = 'No pudimos guardar tu petición en este dispositivo. Inténtalo otra vez.';
      formType = 'error';
      enviando = false;
      return;
    }

    limpiarFormulario();
    isOffline = !entregado;
    formMsg = entregado
      ? '¡Gracias! Tu petición fue recibida y está esperando la aprobación de nuestro equipo.'
      : 'Sin conexión. Guardamos tu petición en este dispositivo y la enviaremos apenas vuelvas a tener internet.';
    formType = 'success';
    enviando = false;

    if (entregado) await cargarPeticiones();
  }

  function iconoTipo(tipo) {
    const t = TIPOS.find((x) => x.valor === tipo);
    return t ? t.icono : TIPOS[0].icono;
  }

  function etiquetaTipo(tipo) {
    const t = TIPOS.find((x) => x.valor === tipo);
    return t ? t.etiqueta : 'Petición';
  }

  onMount(() => {
    isOffline = !estaEnLinea();
    void sincronizarPendientes();
    void cargarPeticiones();

    const pararSync = iniciarSincronizacion();
    const pararAviso = alSincronizar(async ({ tipo }) => {
      if (tipo !== 'sincronizado') return;
      formMsg =
        'Tus envíos guardados mientras no tenías conexión ya fueron enviados. Serán revisados por nuestro equipo.';
      formType = 'success';
      isOffline = false;
      await cargarPeticiones();
      setTimeout(() => {
        formMsg = '';
      }, 8000);
    });

    // Mantiene la ventana de fechas al día aunque la app quede abierta días.
    const revisarDia = () => comprobarDia();
    const intervalo = setInterval(revisarDia, 60000);
    window.addEventListener('focus', revisarDia);
    document.addEventListener('visibilitychange', revisarDia);

    return () => {
      pararSync();
      pararAviso();
      clearInterval(intervalo);
      window.removeEventListener('focus', revisarDia);
      document.removeEventListener('visibilitychange', revisarDia);
      destroyReveals();
    };
  });
</script>

<section class="cc-pet">
  <div class="cc-container">
    {#if !$hayConexion || isOffline}
      <div class="cc-pet__offline" role="status">
        <i class="fa-solid fa-wifi"></i>
        <div>
          <strong>Estás sin conexión</strong>
          <p>
            Puedes seguir escribiendo tu petición: la guardamos en este dispositivo y la enviamos
            automáticamente cuando vuelvas a tener internet.
          </p>
        </div>
      </div>
    {/if}

    {#if $enCola > 0}
      <div class="cc-pet__pendientes" role="status">
        <i class="fa-solid fa-cloud-arrow-up"></i>
        {#if $sincronizando}
          Enviando {$enCola} {$enCola === 1 ? 'envío pendiente' : 'envíos pendientes'}...
        {:else}
          {$enCola} {$enCola === 1 ? 'envío pendiente' : 'envíos pendientes'} por enviar.
        {/if}
      </div>
    {/if}

    <div class="text-center mb-5">
      <span class="cc-overline">Bandeja de la iglesia</span>
      <h2 class="cc-section-title">Envía tu petición</h2>
      <p class="cc-section-sub">
        Escribe tu petición de oración o acción de gracias. Cada petición es revisada por
        nuestro equipo antes de aparecer en esta sección.
      </p>
    </div>

    <form class="cc-pet__form cc-card" on:submit|preventDefault={enviarPeticion}>
      <div class="cc-pet__grid">
        <div class="cc-pet__field">
          <label class="cc-pet__label" for="pet-nombre">
            <i class="fa-solid fa-user"></i> Tu nombre
          </label>
          <input
            id="pet-nombre"
            type="text"
            bind:value={form.nombre}
            placeholder="¿Cómo te llamas?"
            maxlength="60"
            required
          />
        </div>

        <div class="cc-pet__field">
          <span class="cc-pet__label"><i class="fa-solid fa-tag"></i> Tipo de petición</span>
          <div class="cc-pet__tipos" role="radiogroup" aria-label="Tipo de petición">
            {#each TIPOS as t}
              <button
                type="button"
                class="cc-pet__tipo"
                class:is-active={form.tipo === t.valor}
                role="radio"
                aria-checked={form.tipo === t.valor}
                on:click={() => (form.tipo = t.valor)}
              >
                <i class={t.icono}></i>
                <span>{t.etiqueta}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <div class="cc-pet__field">
        <span class="cc-pet__label"><i class="fa-regular fa-calendar"></i> Elige el día</span>
        <p class="cc-pet__hint">
          Solo miércoles y domingos. Para cada culto tienes hasta las
          <strong>7:00 pm del día anterior</strong> (hora de Venezuela) para enviar tu petición; el
          día del culto ya no se acepta.
        </p>

        <div class="cc-pet__dias">
          <div class="cc-pet__dia">
            <h4><i class="fa-solid fa-hands-praying"></i> Miércoles</h4>
            <div class="cc-pet__fechas">
              {#if fechasMiercoles.length}
                {#each fechasMiercoles as f}
                  <button
                    type="button"
                    class="cc-pet__fecha"
                    class:is-active={form.fecha === f}
                    aria-pressed={form.fecha === f}
                    on:click={() => (form.fecha = f)}
                  >
                    <i class="fa-regular fa-calendar-day"></i>
                    {fechaLabel(f)}
                  </button>
                {/each}
              {:else}
                <p class="cc-pet__cerrado">
                  <i class="fa-solid fa-lock"></i>
                  Por ahora no hay miércoles abiertos.
                </p>
              {/if}
            </div>
          </div>

          <div class="cc-pet__dia">
            <h4><i class="fa-solid fa-church"></i> Domingo</h4>
            <div class="cc-pet__fechas">
              {#if fechasDomingo.length}
                {#each fechasDomingo as f}
                  <button
                    type="button"
                    class="cc-pet__fecha"
                    class:is-active={form.fecha === f}
                    aria-pressed={form.fecha === f}
                    on:click={() => (form.fecha = f)}
                  >
                    <i class="fa-regular fa-calendar-day"></i>
                    {fechaLabel(f)}
                  </button>
                {/each}
              {:else}
                <p class="cc-pet__cerrado">
                  <i class="fa-solid fa-lock"></i>
                  Por ahora no hay domingos abiertos.
                </p>
              {/if}
            </div>
          </div>
        </div>

        {#if form.fecha}
          <p class="cc-pet__selected">
            <i class="fa-solid fa-circle-check"></i>
            Selected: {fechaLarga(form.fecha)}
            <span class="cc-pet__selected-corte">{cuentaRegresiva(form.fecha)}</span>
          </p>
        {/if}
      </div>

      <div class="cc-pet__field">
        <label class="cc-pet__label" for="pet-mensaje">
          <i class="fa-solid fa-pen-nib"></i> Tu petición
        </label>
        <textarea
          id="pet-mensaje"
          bind:value={form.mensaje}
          placeholder="Cuéntanos para qué necesitas oración o por qué quieres dar gracias a Dios..."
          rows="5"
          required
        ></textarea>
        <div class="cc-pet__counter" class:is-full={palabrasMensaje >= MAX_PALABRAS}>
          {palabrasMensaje} / {MAX_PALABRAS} palabras
        </div>
      </div>

      {#if formMsg}
        <div class="cc-pet__msg cc-pet__msg--{formType}" role="status">{formMsg}</div>
      {/if}

      <button type="submit" class="cc-btn cc-pet__submit" disabled={!puedeEnviar}>
        {#if enviando}
          <i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...
        {:else}
          <i class="fa-solid fa-paper-plane"></i> Enviar petición
        {/if}
      </button>
    </form>
  </div>
</section>

<section class="cc-pet cc-pet--lista">
  <div class="cc-container">
    <div class="text-center mb-5">
      <span class="cc-overline">Lo que la iglesia está orando</span>
      <h2 class="cc-section-title">Peticiones aprobadas</h2>
      <p class="cc-section-sub">
        Cada semana reunimos las peticiones del miércoles y del domingo en un solo bloque.
      </p>
    </div>

    {#if loading}
      <div class="cc-state">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <p>Cargando peticiones...</p>
      </div>
    {:else if errorMsg}
      <div class="cc-state">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>{errorMsg}</p>
      </div>
    {:else if !grupos.length}
      <div class="cc-state">
        <i class="fa-solid fa-hands-praying"></i>
        <p>Todavía no hay peticiones aprobadas. ¡Sé el primero en compartir la tuya!</p>
      </div>
    {:else}
      {#each grupos as grupo, gi}
        <article class="cc-pet__semana cc-reveal" style="--pet-delay: {gi < 4 ? gi * 0.12 : 0.48}s">
          <header class="cc-pet__semana-head">
            <i class="fa-regular fa-calendar-check"></i>
            <h3>{etiquetaSemana(grupo.clave)}</h3>
          </header>

          <div class="cc-pet__bloques">
            {#each [
              { dia: 'miercoles', titulo: 'Miércoles', icono: 'fa-solid fa-hands-praying', fecha: grupo.miercoles[0]?.fecha },
              { dia: 'domingo', titulo: 'Domingo', icono: 'fa-solid fa-church', fecha: grupo.domingo[0]?.fecha },
            ] as bloque}
              <div class="cc-pet__bloque">
                <h4 class="cc-pet__bloque-title">
                  <i class={bloque.icono}></i>
                  {bloque.titulo}
                  {#if bloque.fecha}
                    <span>{fechaLarga(bloque.fecha)}</span>
                  {/if}
                </h4>

                {#if grupo[bloque.dia].length}
                  <ul class="cc-pet__lista">
                    {#each grupo[bloque.dia] as p}
                      <li class="cc-pet__item">
                        <div class="cc-pet__item-head">
                          <span class="cc-pet__nombre">{p.nombre}</span>
                          <span class="cc-pet__badge">
                            <i class={iconoTipo(p.tipo)}></i>
                            {etiquetaTipo(p.tipo)}
                          </span>
                        </div>
                        <p class="cc-pet__texto">{p.mensaje}</p>
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <p class="cc-pet__vacio">
                    <i class="fa-regular fa-comment-dots"></i>
                    Sin peticiones aprobadas para este día.
                  </p>
                {/if}
              </div>
            {/each}
          </div>
        </article>
      {/each}
    {/if}
  </div>
</section>

<style>
  .cc-pet {
    padding: 90px 0 0;
  }

  .cc-pet--lista {
    padding: 90px 0 110px;
  }

  /* ---------- Avisos de conexión ---------- */
  .cc-pet__offline,
  .cc-pet__pendientes {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 16px;
    margin-bottom: 22px;
    border: 1px solid;
  }

  .cc-pet__offline {
    background: linear-gradient(160deg, rgba(252, 129, 129, 0.12), rgba(252, 129, 129, 0.05));
    border-color: rgba(252, 129, 129, 0.35);
  }

  .cc-pet__offline i {
    color: #fc8181;
    font-size: 1.1rem;
    margin-top: 3px;
  }

  .cc-pet__offline strong {
    display: block;
    font-size: 0.98rem;
    margin-bottom: 2px;
  }

  .cc-pet__offline p {
    margin: 0;
    color: var(--cc-muted);
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .cc-pet__pendientes {
    align-items: center;
    background: rgba(200, 169, 126, 0.1);
    border-color: rgba(200, 169, 126, 0.35);
    color: var(--cc-accent-soft);
    font-size: 0.9rem;
  }

  .cc-pet__pendientes i {
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
  .cc-pet__form {
    display: grid;
    gap: 26px;
    max-width: 880px;
    margin: 0 auto;
    padding: 2.4rem;
  }

  .cc-pet__grid {
    display: grid;
    gap: 22px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  .cc-pet__field {
    display: grid;
    gap: 10px;
  }

  .cc-pet__label {
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

  .cc-pet__hint {
    margin: 0;
    color: var(--cc-muted);
    font-size: 0.88rem;
  }

  .cc-pet__hint strong {
    color: var(--cc-accent-soft);
    font-weight: 600;
  }

  .cc-pet__form input[type='text'],
  .cc-pet__form textarea {
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

  .cc-pet__form input[type='text']::placeholder,
  .cc-pet__form textarea::placeholder {
    color: var(--cc-muted);
    opacity: 0.65;
  }

  .cc-pet__form input[type='text']:focus,
  .cc-pet__form textarea:focus {
    outline: none;
    border-color: rgba(200, 169, 126, 0.55);
    box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.12);
  }

  .cc-pet__form textarea {
    min-height: 130px;
    resize: vertical;
    line-height: 1.7;
  }

  /* ---------- Tipos ---------- */
  .cc-pet__tipos {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .cc-pet__tipo {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid var(--cc-border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--cc-muted);
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cc-pet__tipo:hover {
    border-color: rgba(200, 169, 126, 0.45);
    color: var(--cc-cream);
  }

  .cc-pet__tipo.is-active {
    background: rgba(200, 169, 126, 0.16);
    border-color: var(--cc-accent);
    color: var(--cc-accent-soft);
  }

  /* ---------- Fechas ---------- */
  .cc-pet__dias {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .cc-pet__dia {
    border: 1px solid var(--cc-border);
    border-radius: 16px;
    padding: 18px;
    background: rgba(0, 0, 0, 0.18);
  }

  .cc-pet__dia h4 {
    font-size: 1.12rem;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--cc-primary);
  }

  .cc-pet__fechas {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cc-pet__fecha {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 13px;
    border-radius: 999px;
    border: 1px solid var(--cc-border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--cc-muted);
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .cc-pet__fecha i {
    font-size: 0.74rem;
    opacity: 0.75;
  }

  .cc-pet__fecha:hover {
    border-color: rgba(200, 169, 126, 0.5);
    color: var(--cc-cream);
    transform: translateY(-2px);
  }

  .cc-pet__fecha.is-active {
    background: var(--cc-gradient);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 8px 20px rgba(120, 151, 104, 0.35);
  }

  .cc-pet__cerrado {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.86rem;
    color: var(--cc-muted);
    opacity: 0.75;
  }

  .cc-pet__cerrado i {
    font-size: 0.8rem;
  }

  .cc-pet__selected {
    margin: 4px 0 0;
    color: var(--cc-primary);
    font-size: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 9px;
  }

  .cc-pet__selected-corte {
    color: var(--cc-accent);
    font-size: 0.84rem;
  }

  /* ---------- Contador y envío ---------- */
  .cc-pet__counter {
    justify-self: end;
    font-size: 0.82rem;
    color: var(--cc-muted);
    font-family: 'Jost', sans-serif;
  }

  .cc-pet__counter.is-full {
    color: #fc8181;
  }

  .cc-pet__msg {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 0.92rem;
    border: 1px solid;
  }

  .cc-pet__msg--success {
    background: rgba(146, 174, 131, 0.12);
    border-color: rgba(146, 174, 131, 0.45);
    color: var(--cc-primary);
  }

  .cc-pet__msg--error {
    background: rgba(252, 129, 129, 0.12);
    border-color: rgba(252, 129, 129, 0.45);
    color: #fc8181;
  }

  .cc-pet__submit {
    justify-self: start;
  }

  .cc-pet__submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ---------- Lista por semana ---------- */
  .cc-pet__semana {
    background: linear-gradient(160deg, var(--cc-card) 0%, #17140f 100%);
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius);
    padding: 2rem;
    margin-bottom: 26px;
    transition-delay: var(--pet-delay, 0s);
  }

  .cc-pet__semana-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--cc-border);
  }

  .cc-pet__semana-head i {
    color: var(--cc-accent);
    font-size: 1.1rem;
  }

  .cc-pet__semana-head h3 {
    font-size: 1.5rem;
    margin: 0;
  }

  .cc-pet__bloques {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .cc-pet__bloque {
    background: rgba(0, 0, 0, 0.22);
    border: 1px solid var(--cc-border);
    border-radius: 16px;
    padding: 1.4rem;
  }

  .cc-pet__bloque-title {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px;
    font-size: 1.2rem;
    color: var(--cc-primary);
    margin-bottom: 16px;
  }

  .cc-pet__bloque-title i {
    color: var(--cc-accent);
    font-size: 0.95rem;
  }

  .cc-pet__bloque-title span {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 0.82rem;
    color: var(--cc-muted);
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }

  .cc-pet__lista {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 14px;
  }

  .cc-pet__item {
    border-left: 3px solid rgba(146, 174, 131, 0.45);
    padding-left: 14px;
  }

  .cc-pet__item-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .cc-pet__nombre {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.08rem;
    font-weight: 600;
    color: var(--cc-cream);
  }

  .cc-pet__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.74rem;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(200, 169, 126, 0.13);
    border: 1px solid rgba(200, 169, 126, 0.3);
    color: var(--cc-accent-soft);
  }

  .cc-pet__texto {
    margin: 0;
    color: var(--cc-muted);
    font-size: 0.95rem;
    line-height: 1.7;
    white-space: pre-line;
  }

  .cc-pet__vacio {
    margin: 0;
    color: var(--cc-muted);
    opacity: 0.7;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 9px;
  }

  @media (max-width: 768px) {
    .cc-pet,
    .cc-pet--lista {
      padding: 70px 0;
    }

    .cc-pet__semana {
      padding: 1.4rem;
    }

    .cc-pet__form {
      padding: 1.5rem;
    }

    .cc-pet__submit {
      justify-self: stretch;
    }
  }
</style>
