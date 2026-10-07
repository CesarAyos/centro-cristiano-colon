<script>
  import { supabase } from "$lib/supabaseClient.js";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import ImageLightbox from "./ImageLightbox.svelte";
  import { descargarArchivo, descargarConjunto } from "$lib/descargas.js";

  const CARPETA = "bosquejo";
  const POR_PAGINA = 4;

  let imagenes = [];
  let loading = true;
  let errorMsg = "";
  let pagina = 1;
  let descargando = false;
  let ocupado = null;
  let statusMsg = "";
  let statusType = "";
  let viendo = null;

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
    return new Date(`${m[1]}T${m[2]}:00`).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function avisar(mensaje, tipo = 'success') {
    statusMsg = mensaje;
    statusType = tipo;
    if (tipo === 'success') setTimeout(() => (statusMsg = ''), 4000);
  }

  async function cargar() {
    loading = true;
    errorMsg = '';

    const { data, error } = await supabase.storage
      .from('imagenes')
      .list(CARPETA, { limit: 200, offset: 0, sortBy: { column: 'name', order: 'desc' } });

    if (error) {
      console.error('Error listando los bosquejos:', error.message);
      errorMsg =
        'No se pudieron cargar los bosquejos. Revisa el bucket "imagenes" y la carpeta bosquejo.';
      imagenes = [];
    } else {
      imagenes = (data || [])
        .filter((f) => f.name && f.name !== '.emptyFolderPlaceholder')
        .map((f) => ({ name: f.name, url: supabase.storage.from('imagenes').getPublicUrl(`${CARPETA}/${f.name}`).data.publicUrl }));
    }

    if (pagina > totalPaginas) pagina = totalPaginas;
    loading = false;
  }

  async function descargarUna(imagen) {
    if (ocupado) return;
    ocupado = imagen.name;
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

  async function descargarTodo() {
    if (descargando || !imagenes.length) return;
    descargando = true;

    try {
      const resultado = await descargarConjunto(
        imagenes.map((i) => ({ url: i.url, nombre: i.name })),
        `bosquejos-${new Date().toISOString().slice(0, 10)}.zip`
      );

      if (resultado.modo === 'zip-android') {
        avisar(`ZIP con ${resultado.total} bosquejos guardado en la carpeta Descargas.`);
      } else if (resultado.omitidas) {
        avisar(`ZIP con ${resultado.total} bosquejos (${resultado.omitidas} no se pudieron incluir).`, 'warning');
      } else {
        avisar(`ZIP con ${resultado.total} bosquejos descargado.`);
      }
    } catch (e) {
      console.error('Error descargando todo:', e);
      avisar(e.message || 'No se pudo descargar el conjunto.', 'error');
    } finally {
      descargando = false;
    }
  }

  async function eliminar(imagen) {
    if (!confirm(`¿Eliminar "${nombreLimpio(imagen.name)}"? Esta acción no se puede deshacer.`)) return;
    ocupado = imagen.name;

    const { error } = await supabase.storage.from('imagenes').remove([`${CARPETA}/${imagen.name}`]);

    if (error) {
      console.error('Error eliminando el bosquejo:', error.message);
      avisar('No se pudo eliminar la imagen.', 'error');
    } else {
      avisar('Imagen eliminada.');
      await cargar();
    }

    ocupado = null;
  }

  function cambiarPagina(nueva) {
    pagina = Math.min(Math.max(nueva, 1), totalPaginas);
  }

  onMount(cargar);
</script>

<main>
  <div class="container mb-5" style="max-width: 1100px;">
    <div
      class="card mb-4"
      style="box-shadow: 10px 10px 5px 0px rgba(200,169,126,0.35); background-color:#1d1a15;"
    >
      <div class="p-3">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="fa-solid fa-images" style="color:#c8a97e;"></i>
          <h4 class="text-white mb-0">Ver Bosquejos</h4>
          <span class="badge ms-auto" style="background:#92ae83; color:#14120e;">
            {imagenes.length} en total
          </span>
        </div>

        <p class="text-white-50 mb-3">
          <i class="fa-solid fa-circle-info"></i>
          "Descargar todo" genera un archivo ZIP con todos los bosquejos. El botón
          <i class="fa-solid fa-expand"></i> los abre en pantalla completa con zoom.
        </p>

        {#if statusMsg}
          <div
            class="alert py-2 {statusType === 'success'
              ? 'alert-success'
              : statusType === 'warning'
                ? 'alert-warning'
                : 'alert-danger'}"
            in:fade={{ duration: 200 }}
            role="status">
            {statusMsg}
          </div>
        {/if}

        <div class="d-flex gap-2 flex-wrap">
          <button
            type="button"
            class="btn btn-success"
            disabled={descargando || !imagenes.length}
            on:click={descargarTodo}>
            {#if descargando}
              <i class="fa-solid fa-circle-notch fa-spin"></i> Preparando...
            {:else}
              <i class="fa-solid fa-file-zipper"></i> Descargar todo
            {/if}
          </button>

          <button
            type="button"
            class="btn btn-outline-light"
            disabled={loading}
            on:click={cargar}>
            <i class="fa-solid fa-rotate {loading ? 'fa-spin' : ''}"></i> Actualizar
          </button>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="card" style="background-color:#1d1a15;">
        <p class="text-white-50 mb-0 p-3">Cargando bosquejos...</p>
      </div>
    {:else if errorMsg}
      <div class="card" style="background-color:#1d1a15;">
        <p class="text-white-50 mb-0 p-3">
          <i class="fa-solid fa-triangle-exclamation"></i> {errorMsg}
        </p>
      </div>
    {:else if !imagenes.length}
      <div class="card" style="background-color:#1d1a15;">
        <p class="text-white-50 mb-0 p-3">
          <i class="fa-solid fa-folder-open"></i> Todavía no hay bosquejos subidos.
        </p>
      </div>
    {:else}
      <div class="row g-3">
        {#each visibles as imagen, i}
          <div class="col-12 col-sm-6 col-lg-3" in:fade={{ duration: 250 }}>
            <article class="bosq-card">
              <div class="bosq-card__marco">
                <img src={imagen.url} alt={nombreLimpio(imagen.name)} loading="lazy" />
                <span class="bosq-card__conteo">{(pagina - 1) * POR_PAGINA + i + 1}</span>
              </div>

              <div class="bosq-card__cuerpo">
                <h6 class="bosq-card__titulo">{nombreLimpio(imagen.name)}</h6>
                {#if fechaDe(imagen.name)}
                  <small class="bosq-card__fecha">
                    <i class="fa-regular fa-calendar"></i> {fechaDe(imagen.name)}
                  </small>
                {/if}

                <div class="bosq-card__botones">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-light"
                    disabled={ocupado === imagen.name}
                    title="Descargar"
                    on:click={() => descargarUna(imagen)}>
                    {#if ocupado === imagen.name}
                      <i class="fa-solid fa-circle-notch fa-spin"></i>
                    {:else}
                      <i class="fa-solid fa-download"></i>
                    {/if}
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-light"
                    disabled={ocupado === imagen.name}
                    title="Ver en pantalla completa con zoom"
                    on:click={() => (viendo = imagen)}>
                    <i class="fa-solid fa-expand"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger ms-auto"
                    disabled={ocupado === imagen.name}
                    title="Eliminar"
                    on:click={() => eliminar(imagen)}>
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </article>
          </div>
        {/each}
      </div>

      {#if totalPaginas > 1}
        <nav class="bosq-paginacion" aria-label="Paginación de bosquejos">
          <button type="button" on:click={() => cambiarPagina(pagina - 1)} disabled={pagina === 1}>
            <i class="fa-solid fa-chevron-left"></i> Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
            <small>· {imagenes.length} imágenes</small>
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
</main>

{#if viendo}
  <ImageLightbox
    src={viendo.url}
    titulo={nombreLimpio(viendo.name)}
    pie={fechaDe(viendo.name)}
    on:cerrar={() => (viendo = null)} />
{/if}

<style>
  .bosq-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--adm-border, rgba(200, 169, 126, 0.16));
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
  }

  .bosq-card:hover {
    transform: translateY(-6px);
    border-color: rgba(200, 169, 126, 0.4);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  }

  .bosq-card__marco {
    position: relative;
    aspect-ratio: 4 / 5;
    background: #0e0d06;
  }

  .bosq-card__marco img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .bosq-card__conteo {
    position: absolute;
    top: 8px;
    left: 8px;
    min-width: 26px;
    height: 26px;
    padding: 0 7px;
    border-radius: 999px;
    background: rgba(14, 13, 6, 0.82);
    border: 1px solid rgba(200, 169, 126, 0.3);
    color: #c8a97e;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .bosq-card__cuerpo {
    padding: 12px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }

  .bosq-card__titulo {
    color: #f5f1e8;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bosq-card__fecha {
    color: #b7b0a3;
    font-size: 0.78rem;
  }

  .bosq-card__botones {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .bosq-paginacion {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 32px;
    color: #b7b0a3;
  }

  .bosq-paginacion span {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.92rem;
  }

  .bosq-paginacion span small {
    font-size: 0.74rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .bosq-paginacion button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    border: 1px solid var(--adm-border, rgba(200, 169, 126, 0.16));
    border-radius: 999px;
    background: transparent;
    color: #f5f1e8;
    font-size: 0.88rem;
    cursor: pointer;
    transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
  }

  .bosq-paginacion button:hover:not(:disabled) {
    border-color: #c8a97e;
    color: #c8a97e;
    background: rgba(200, 169, 126, 0.1);
  }

  .bosq-paginacion button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
