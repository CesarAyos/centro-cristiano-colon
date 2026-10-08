<script>
  import { supabase } from "../components/supabase.js";
  import { onDestroy } from "svelte";

  const MAX_POR_TANDA = 6;
  const MAX_PESOS_MB = 10;
  const CARPETA = "bosquejo";
  const FORMATOS_VISIBLES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  let entrada;
  let seleccionados = [];
  let resultados = [];
  let subiendo = false;
  let aviso = "";
  let avisoTipo = "";

  const avisar = (mensaje, tipo = "error") => {
    aviso = mensaje;
    avisoTipo = tipo;
  };

  const pesoLegible = (bytes) => {
    if (!bytes) return "0 KB";
    const mb = bytes / 1048576;
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const limpiarNombre = (nombre) =>
    nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

  function nombreDestino(archivo, indice) {
    const marca = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");
    const limpio = limpiarNombre(archivo.name) || "bosquejo";
    const conIndice = indice > 0 ? `-${indice + 1}` : "";
    return `${limpio}-${marca}${conIndice}`;
  }

  function alElegirArchivos() {
    aviso = "";
    resultados = [];
    const lista = Array.from(entrada?.files || []);

    if (!lista.length) {
      seleccionados = [];
      return;
    }

    if (lista.length > MAX_POR_TANDA) {
      avisar(
        `Solo puedes subir ${MAX_POR_TANDA} imágenes por vez. Se tomarán las primeras ${MAX_POR_TANDA}.`
      );
    }

    const aceptados = lista.slice(0, MAX_POR_TANDA);
    const rechazados = [];
    const avisos = [];

    for (const archivo of aceptados) {
      if (!archivo.type.startsWith("image/")) {
        rechazados.push(`${archivo.name} no es una imagen`);
        continue;
      }
      if (archivo.size > MAX_PESOS_MB * 1048576) {
        rechazados.push(`${archivo.name} supera los ${MAX_PESOS_MB} MB`);
        continue;
      }
      if (!FORMATOS_VISIBLES.includes(archivo.type)) {
        avisos.push(`${archivo.name} podría no verse en el navegador (${archivo.type}).`);
      }
      seleccionados = [...seleccionados, { archivo, url: URL.createObjectURL(archivo) }];
    }

    if (rechazados.length) {
      avisar(`Se descartaron: ${rechazados.join(", ")}.`);
    } else if (avisos.length) {
      avisar(avisos.join(" "), "warning");
    } else if (lista.length > MAX_POR_TANDA) {
      avisar(`Se tomarán las primeras ${MAX_POR_TANDA} imágenes.`, "info");
    }
  }

  function soltarUrl(indice) {
    const item = seleccionados[indice];
    if (item?.url) URL.revokeObjectURL(item.url);
  }

  function quitar(index) {
    soltarUrl(index);
    seleccionados = seleccionados.filter((_, i) => i !== index);
    resultados = [];
    if (entrada) entrada.value = "";
  }

  function limpiarLista(quitarResultados = true) {
    seleccionados.forEach((item) => URL.revokeObjectURL(item.url));
    seleccionados = [];
    if (quitarResultados) resultados = [];
    if (entrada) entrada.value = "";
  }

  function limpiarTodo() {
    limpiarLista();
    aviso = "";
  }

  async function subir() {
    if (!seleccionados.length || subiendo) return;

    subiendo = true;
    resultados = [];
    aviso = "";

    for (const [indice, item] of seleccionados.entries()) {
      const { archivo } = item;
      const destino = nombreDestino(archivo, indice);
      const ruta = `${CARPETA}/${destino}`;
      const tipo = archivo.type || "image/jpeg";

      try {
        const { error } = await supabase.storage.from("imagenes").upload(ruta, archivo, {
          contentType: tipo,
          cacheControl: "3600",
          upsert: false,
        });

        if (error) throw error;

        resultados = [
          ...resultados,
          { nombre: archivo.name, destino, ok: true, msg: "Subida" },
        ];
      } catch (e) {
        console.error("Error subiendo", archivo.name, e);
        resultados = [
          ...resultados,
          {
            nombre: archivo.name,
            destino,
            ok: false,
            msg: e?.message || "No se pudo subir",
          },
        ];
      }
    }

    subiendo = false;

    const buenos = resultados.filter((r) => r.ok).length;
    const malos = resultados.length - buenos;

    if (buenos && !malos) {
      avisar(`Se subieron ${buenos} ${buenos === 1 ? "imagen" : "imágenes"}.`, "success");
      limpiarLista(false);
    } else if (buenos) {
      avisar(`${buenos} subidas, ${malos} con error. Revisa el detalle.`, "warning");
    } else {
      avisar("Ninguna imagen se pudo subir. Revisa el detalle.", "error");
    }
  }

  const avisoClase = () =>
    avisoTipo === "success"
      ? "alert-success"
      : avisoTipo === "warning"
        ? "alert-warning"
        : "alert-danger";

  onDestroy(limpiarLista);
</script>

<main>
  <div class="container mb-5" style="max-width: 960px;">
    <div
      class="card mb-4"
      style="box-shadow: 10px 10px 5px 0px rgba(200,169,126,0.35); background-color:#1d1a15;"
    >
      <div class="d-flex justify-content-center m-2" style="background: #1d1a15;">
        <img src="/logo.png" alt="logo" class="logo-form" style="height: 50px;" />
      </div>

      <div class="p-3">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="fa-solid fa-cloud-arrow-up" style="color:#c8a97e;"></i>
          <h4 class="text-white mb-0">Subir Bosquejos</h4>
          <span class="badge ms-auto" style="background:#c8a97e; color:#1d1a15;">
            {seleccionados.length} / {MAX_POR_TANDA}
          </span>
        </div>

        <p class="text-white-50 mb-3">
          Selecciona hasta {MAX_POR_TANDA} imágenes por tanda (JPG, PNG o WEBP, máximo
          {MAX_PESOS_MB} MB cada una). Cada archivo se guarda con fecha y hora para que no se
          pisen entre sí.
        </p>

        {#if aviso}
          <div class="alert py-2 {avisoClase()}" role="status">{aviso}</div>
        {/if}

        <label for="fileUpload" class="form-label text-white">Selecciona las imágenes</label>
        <input
          type="file"
          id="fileUpload"
          class="form-control mb-3"
          style="border-bottom: 2px solid #c8a97e;"
          name="fileUpload"
          accept="image/*"
          multiple
          bind:this={entrada}
          on:change={alElegirArchivos}
        />

        {#if seleccionados.length}
          <div class="row g-2 mb-3">
            {#each seleccionados as item, i}
              <div class="col-6 col-md-4">
                <div class="bosq-item">
                  <img src={item.url} alt={item.archivo.name} loading="lazy" />
                  <button
                    type="button"
                    class="bosq-item__quitar"
                    title="Quitar de la lista"
                    aria-label={`Quitar ${item.archivo.name}`}
                    disabled={subiendo}
                    on:click={() => quitar(i)}>
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                  <div class="bosq-item__pie">
                    <span class="bosq-item__nombre">{item.archivo.name}</span>
                    <small>{pesoLegible(item.archivo.size)}</small>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}

        <div class="d-flex gap-2 flex-wrap">
          <button
            type="button"
            class="btn btn-success btn-lg"
            disabled={!seleccionados.length || subiendo}
            on:click={subir}>
            {#if subiendo}
              <i class="fa-solid fa-circle-notch fa-spin"></i> Subiendo...
            {:else}
              <i class="fa-solid fa-cloud-arrow-up"></i>
              Subir {seleccionados.length || ""}
              {seleccionados.length === 1 ? "imagen" : "imágenes"}
            {/if}
          </button>

          {#if seleccionados.length || resultados.length}
            <button
              type="button"
              class="btn btn-outline-light btn-lg"
              disabled={subiendo}
              on:click={limpiarTodo}>
              <i class="fa-solid fa-eraser"></i> Limpiar
            </button>
          {/if}

          <a
            class="btn btn-outline-light btn-lg ms-auto"
            href="/verbosquejo"
            target="_blank"
            rel="noopener">
            <i class="fa-solid fa-eye"></i> Ver bosquejos
          </a>
        </div>
      </div>
    </div>

    {#if resultados.length}
      <div class="card" style="background-color:#1d1a15;">
        <div class="p-3">
          <h5 class="text-white mb-3">
            <i class="fa-solid fa-list-check"></i> Resultado de la subida
          </h5>

          <div class="table-responsive">
            <table class="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Guardado como</th>
                  <th style="width: 120px;">Estado</th>
                </tr>
              </thead>
              <tbody>
                {#each resultados as r}
                  <tr>
                    <td>{r.nombre}</td>
                    <td><small class="text-white-50">{CARPETA}/{r.destino}</small></td>
                    <td>
                      {#if r.ok}
                        <span style="color:#92ae83;">
                          <i class="fa-solid fa-circle-check"></i> {r.msg}
                        </span>
                      {:else}
                        <span style="color:#fc8181;" title={r.msg}>
                          <i class="fa-solid fa-circle-xmark"></i> Error
                        </span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  .bosq-item {
    position: relative;
    border: 1px solid var(--adm-border, rgba(200, 169, 126, 0.16));
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .bosq-item img {
    width: 100%;
    height: 130px;
    object-fit: cover;
    display: block;
  }

  .bosq-item__quitar {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: rgba(14, 13, 6, 0.85);
    color: #fc8181;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease;
  }

  .bosq-item__quitar:hover:not(:disabled) {
    background: #fc8181;
    color: #14120e;
    transform: scale(1.08);
  }

  .bosq-item__quitar:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .bosq-item__pie {
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .bosq-item__nombre {
    font-size: 0.78rem;
    color: #f5f1e8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bosq-item__pie small {
    color: #b7b0a3;
    font-size: 0.72rem;
  }
</style>
