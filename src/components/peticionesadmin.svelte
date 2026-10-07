<script>
  import { supabase } from "../components/supabase.js";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  let pendientes = [];
  let aprobadas = [];
  let loading = true;
  let busyId = null;
  let mostrarAprobadas = false;
  let statusMsg = "";
  let statusType = "";

  const DIAS = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
  };

  const TIPOS = {
    oracion: { etiqueta: "Oración", icono: "fa-solid fa-hands-praying" },
    agradecimiento: { etiqueta: "Acción de gracias", icono: "fa-solid fa-heart" },
    ambas: { etiqueta: "Oración y gracias", icono: "fa-solid fa-infinity" },
  };

  const mostrarNotificacion = (mensaje = "Listo", tipo = "success") => {
    statusMsg = mensaje;
    statusType = tipo;
    setTimeout(() => (statusMsg = ""), 4000);
  };

  const fechaLabel = (iso) => {
    if (!iso) return "—";
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return `${DIAS[d.getDay()]} ${d.getDate()} de ${d.toLocaleDateString("es-ES", {
      month: "long",
    })}`;
  };

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

  const tipoInfo = (tipo) => TIPOS[tipo] || TIPOS.oracion;

  const cargar = async () => {
    loading = true;
    const { data, error } = await supabase
      .from("peticiones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando las peticiones:", error.message);
      mostrarNotificacion(
        "No se pudieron cargar las peticiones. Verifica que la tabla 'peticiones' exista en Supabase.",
        "error",
      );
    } else {
      const filas = data || [];
      pendientes = filas.filter((p) => p.estado !== "aprobado");
      aprobadas = filas.filter((p) => p.estado === "aprobado");
    }
    loading = false;
  };

  const aprobar = async (p) => {
    busyId = p.id;
    const { error } = await supabase
      .from("peticiones")
      .update({ estado: "aprobado" })
      .eq("id", p.id);

    if (error) {
      console.error("Error aprobando la petición:", error.message);
      mostrarNotificacion("No se pudo aprobar la petición.", "error");
    } else {
      mostrarNotificacion(`Petición de ${p.nombre} aprobada y publicada.`);
    }
    busyId = null;
    await cargar();
  };

  const rechazar = async (p) => {
    if (!confirm(`¿Rechazar y eliminar la petición de ${p.nombre}?`)) return;
    busyId = p.id;
    const { error } = await supabase.from("peticiones").delete().eq("id", p.id);

    if (error) {
      console.error("Error rechazando la petición:", error.message);
      mostrarNotificacion("No se pudo rechazar la petición.", "error");
    } else {
      mostrarNotificacion(`Petición de ${p.nombre} rechazada.`);
    }
    busyId = null;
    await cargar();
  };

  const devolverAPendiente = async (p) => {
    busyId = p.id;
    const { error } = await supabase
      .from("peticiones")
      .update({ estado: "pendiente" })
      .eq("id", p.id);

    if (error) {
      console.error("Error devolviendo la petición a pendientes:", error.message);
      mostrarNotificacion("No se pudo actualizar la petición.", "error");
    } else {
      mostrarNotificacion("Petición devuelta a pendientes.");
    }
    busyId = null;
    await cargar();
  };

  const eliminar = async (p) => {
    if (!confirm(`¿Eliminar definitivamente la petición de ${p.nombre}?`)) return;
    busyId = p.id;
    const { error } = await supabase.from("peticiones").delete().eq("id", p.id);

    if (error) {
      console.error("Error eliminando la petición:", error.message);
      mostrarNotificacion("No se pudo eliminar la petición.", "error");
    } else {
      mostrarNotificacion("Petición eliminada.");
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
          <i class="fa-solid fa-hands-praying" style="color:#c8a97e;"></i>
          <h4 class="text-white mb-0">Solicitudes de Petición</h4>
        </div>
        <p class="text-white-50 mb-3">
          Las peticiones enviadas desde la sección pública llegan aquí antes de publicarse en la web.
          Aprueba las que deban aparecer o recházalas para eliminarlas.
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
            Aprobadas: {aprobadas.length}
          </span>
          <a
            class="btn btn-sm btn-outline-light ms-auto"
            href="/peticiones"
            target="_blank"
            rel="noopener">
            <i class="fa-solid fa-eye"></i> Ver sección pública
          </a>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="card" style="background-color:#1d1a15;">
        <p class="text-white-50 mb-0 p-3">Cargando peticiones...</p>
      </div>
    {:else if !pendientes.length}
      <div class="card" style="background-color:#1d1a15;">
        <p class="text-white-50 mb-0 p-3">
          <i class="fa-solid fa-circle-check"></i> No hay peticiones pendientes de revisión.
        </p>
      </div>
    {:else}
      <div class="d-flex flex-column gap-3">
        {#each pendientes as p}
          <div
            class="card"
            style="background-color:#1d1a15; border-left: 4px solid #c8a97e;"
            in:fade={{ duration: 250 }}>
            <div class="p-3">
              <div
                class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <strong class="text-white">{p.nombre}</strong>
                  <span class="badge" style="background:rgba(200,169,126,0.2); color:#e6d5b4;">
                    <i class={tipoInfo(p.tipo).icono}></i> {tipoInfo(p.tipo).etiqueta}
                  </span>
                </div>
                <small class="text-white-50">Enviada: {fechaCorta(p.created_at)}</small>
              </div>

              <div class="mb-3">
                <span style="color:#92ae83; font-size:0.9rem;">
                  <i class="fa-regular fa-calendar"></i>
                  {fechaLabel(p.fecha)}
                </span>
              </div>

              <p class="text-white mb-3" style="white-space: pre-line; line-height: 1.7;">
                {p.mensaje}
              </p>

              <div class="d-flex gap-2 flex-wrap">
                <button
                  class="btn btn-sm btn-success"
                  disabled={busyId === p.id}
                  on:click={() => aprobar(p)}>
                  <i class="fa-solid fa-check"></i> Aprobar
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  disabled={busyId === p.id}
                  on:click={() => rechazar(p)}>
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
          on:click={() => (mostrarAprobadas = !mostrarAprobadas)}>
          <i class="fa-solid fa-chevron-down {mostrarAprobadas ? 'fa-rotate-180' : ''}"></i>
          Peticiones aprobadas ({aprobadas.length})
        </button>

        {#if mostrarAprobadas}
          <div class="table-responsive mt-3" in:fade={{ duration: 250 }}>
            {#if aprobadas.length}
              <table class="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th style="width: 220px;">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {#each aprobadas as p}
                    <tr>
                      <td>
                        <div class="fw-semibold">{p.nombre}</div>
                        <small class="text-white-50">{tipoInfo(p.tipo).etiqueta}</small>
                      </td>
                      <td class="text-white-50">{fechaLabel(p.fecha)}</td>
                      <td>
                        <div class="d-flex gap-1 flex-wrap">
                          <button
                            class="btn btn-sm btn-outline-warning"
                            disabled={busyId === p.id}
                            title="Devolver a pendientes"
                            on:click={() => devolverAPendiente(p)}>
                            <i class="fa-solid fa-rotate-left"></i> Pendiente
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            disabled={busyId === p.id}
                            title="Eliminar"
                            on:click={() => eliminar(p)}>
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            {:else}
              <p class="text-white-50 mb-0">Todavía no hay peticiones aprobadas.</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
