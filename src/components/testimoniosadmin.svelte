<script>
  import { supabase } from "../components/supabase.js";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  let pendientes = [];
  let aprobados = [];
  let loading = true;
  let busyId = null;
  let mostrarAprobados = false;
  let statusMsg = "";
  let statusType = "";

  const fechaCorta = (ts) => {
    try {
      return new Date(ts).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const contarPalabras = (texto) => {
    const t = (texto || "").trim();
    return t ? t.split(/\s+/).length : 0;
  };

  const mostrarNotificacion = (mensaje = "Listo", tipo = "success") => {
    statusMsg = mensaje;
    statusType = tipo;
    setTimeout(() => (statusMsg = ""), 4000);
  };

  const cargar = async () => {
    loading = true;
    const { data, error } = await supabase
      .from("testimonios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando los testimonios:", error.message);
      mostrarNotificacion(
        "No se pudieron cargar los testimonios. Verifica que la tabla 'testimonios' exista en Supabase.",
        "error",
      );
    } else {
      const filas = data || [];
      pendientes = filas.filter((t) => t.estado !== "aprobado");
      aprobados = filas.filter((t) => t.estado === "aprobado");
    }
    loading = false;
  };

  const aprobar = async (t) => {
    busyId = t.id;
    const { error } = await supabase
      .from("testimonios")
      .update({ estado: "aprobado" })
      .eq("id", t.id);

    if (error) {
      console.error("Error aprobando el testimonio:", error.message);
      mostrarNotificacion("No se pudo aprobar el testimonio.", "error");
    } else {
      mostrarNotificacion(`Testimonio de ${t.nombre} aprobado y publicado.`);
    }
    busyId = null;
    await cargar();
  };

  const rechazar = async (t) => {
    if (!confirm(`¿Rechazar y eliminar el testimonio de ${t.nombre}?`)) return;
    busyId = t.id;
    const { error } = await supabase.from("testimonios").delete().eq("id", t.id);

    if (error) {
      console.error("Error rechazando el testimonio:", error.message);
      mostrarNotificacion("No se pudo rechazar el testimonio.", "error");
    } else {
      mostrarNotificacion(`Testimonio de ${t.nombre} rechazado.`);
    }
    busyId = null;
    await cargar();
  };

  const devolverAPendiente = async (t) => {
    busyId = t.id;
    const { error } = await supabase
      .from("testimonios")
      .update({ estado: "pendiente" })
      .eq("id", t.id);

    if (error) {
      console.error("Error devolviendo el testimonio a pendientes:", error.message);
      mostrarNotificacion("No se pudo actualizar el testimonio.", "error");
    } else {
      mostrarNotificacion("Testimonio devuelto a pendientes.");
    }
    busyId = null;
    await cargar();
  };

  const eliminar = async (t) => {
    if (!confirm(`¿Eliminar definitivamente el testimonio de ${t.nombre}?`)) return;
    busyId = t.id;
    const { error } = await supabase.from("testimonios").delete().eq("id", t.id);

    if (error) {
      console.error("Error eliminando el testimonio:", error.message);
      mostrarNotificacion("No se pudo eliminar el testimonio.", "error");
    } else {
      mostrarNotificacion("Testimonio eliminado.");
    }
    busyId = null;
    await cargar();
  };

  onMount(cargar);
</script>

<main>
  <div class="container mb-5" style="max-width: 960px;">
    <div
      class="card mb-4"
      style="box-shadow: 10px 10px 5px 0px rgba(200,169,126,0.35); background-color:#1d1a15;"
    >
      <div class="p-3">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="fa-solid fa-note-sticky" style="color:#c8a97e;"></i>
          <h4 class="text-white mb-0">Solicitudes de Testimonio</h4>
        </div>
        <p class="text-white-50 mb-3">
          Los testimonios enviados desde la sección pública llegan aquí antes de aparecer en el muro
          de notas. Aprueba los que quieras publicar o recházalos para eliminarlos.
        </p>

        {#if statusMsg}
          <div
            class="alert py-2 {statusType === 'success' ? 'alert-success' : 'alert-danger'}"
            in:fade={{ duration: 200 }}>
            {statusMsg}
          </div>
        {/if}

        <div class="d-flex gap-2 flex-wrap align-items-center">
          <span class="badge" style="background:#c8a97e; color:#1d1a15;">
            Pendientes: {pendientes.length}
          </span>
          <span class="badge" style="background:#92ae83; color:#14120e;">
            Aprobados: {aprobados.length}
          </span>
          <a
            class="btn btn-sm btn-outline-light ms-auto"
            href="/testimonios"
            target="_blank"
            rel="noopener">
            <i class="fa-solid fa-eye"></i> Ver sección pública
          </a>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="card" style="background-color:#1d1a15;">
        <p class="text-white-50 mb-0 p-3">Cargando testimonios...</p>
      </div>
    {:else if !pendientes.length}
      <div class="card" style="background-color:#1d1a15;">
        <p class="text-white-50 mb-0 p-3">
          <i class="fa-solid fa-circle-check"></i> No hay testimonios pendientes de revisión.
        </p>
      </div>
    {:else}
      <div class="d-flex flex-column gap-3">
        {#each pendientes as t}
          <div
            class="card"
            style="background-color:#1d1a15; border-left: 4px solid #92ae83;"
            in:fade={{ duration: 250 }}>
            <div class="p-3">
              <div
                class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <strong class="text-white">{t.nombre}</strong>
                <small class="text-white-50">Enviado: {fechaCorta(t.created_at)}</small>
              </div>

              <h5 class="mb-2" style="color:#e6d5b4; font-family:'Cormorant Garamond', serif;">
                {t.asunto}
              </h5>

              <p class="text-white mb-2" style="white-space: pre-line; line-height: 1.7;">
                {t.testimonio}
              </p>

              <small class="text-white-50 d-block mb-3">
                {contarPalabras(t.testimonio)} palabras
              </small>

              <div class="d-flex gap-2 flex-wrap">
                <button
                  class="btn btn-sm btn-success"
                  disabled={busyId === t.id}
                  on:click={() => aprobar(t)}>
                  <i class="fa-solid fa-check"></i> Aprobar
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  disabled={busyId === t.id}
                  on:click={() => rechazar(t)}>
                  <i class="fa-solid fa-xmark"></i> Rechazar
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <div class="card mt-4" style="background-color:#1d1a15;">
      <div class="p-3">
        <button
          class="btn btn-sm w-100"
          style="background:#92ae83; color:#14120e; font-weight:600;"
          on:click={() => (mostrarAprobados = !mostrarAprobados)}>
          <i class="fa-solid fa-chevron-down {mostrarAprobados ? 'fa-rotate-180' : ''}"></i>
          Testimonios publicados ({aprobados.length})
        </button>

        {#if mostrarAprobados}
          <div class="table-responsive mt-3" in:fade={{ duration: 250 }}>
            {#if aprobados.length}
              <table class="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Asunto</th>
                    <th style="width: 220px;">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {#each aprobados as t}
                    <tr>
                      <td class="fw-semibold">{t.nombre}</td>
                      <td class="text-white-50">{t.asunto}</td>
                      <td>
                        <div class="d-flex gap-1 flex-wrap">
                          <button
                            class="btn btn-sm btn-outline-warning"
                            disabled={busyId === t.id}
                            title="Devolver a pendientes"
                            on:click={() => devolverAPendiente(t)}>
                            <i class="fa-solid fa-rotate-left"></i> Pendiente
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            disabled={busyId === t.id}
                            title="Eliminar"
                            on:click={() => eliminar(t)}>
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            {:else}
              <p class="text-white-50 mb-0">Todavía no hay testimonios publicados.</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
