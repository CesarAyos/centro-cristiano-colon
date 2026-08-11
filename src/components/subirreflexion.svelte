<script>
  import { supabase } from "../components/supabase.js";
  import { onMount } from "svelte";

  let reflexiones = [];
  let loading = true;
  let statusMsg = "";
  let statusType = "";
  let editingId = null;
  let comentariosCount = {};

  let reflexion = {
    titulo: "",
    autor: "",
    fecha: "",
    referencia: "",
    contenido: "",
  };

  const loadComentarios = async () => {
    const { data, error } = await supabase.from("comentarios").select("reflexion_id");
    if (error) {
      console.error("Error cargando comentarios:", error.message);
      return;
    }
    const counts = {};
    for (const c of data || []) {
      counts[c.reflexion_id] = (counts[c.reflexion_id] || 0) + 1;
    }
    comentariosCount = counts;
  };

  const loadReflexiones = async () => {
    const { data, error } = await supabase
      .from("reflexiones")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) reflexiones = data || [];
    loading = false;
    loadComentarios();
  };

  const resetForm = () => {
    editingId = null;
    reflexion = {
      titulo: "",
      autor: "",
      fecha: "",
      referencia: "",
      contenido: "",
    };
    statusMsg = "";
  };

  const onSubmit = async () => {
    if (!reflexion.titulo.trim() || !reflexion.contenido.trim()) {
      statusMsg = "El título y el contenido son obligatorios.";
      statusType = "error";
      return;
    }

    statusMsg = "";
    try {
      if (editingId) {
        const { error } = await supabase
          .from("reflexiones")
          .update({ ...reflexion })
          .eq("id", editingId);
        if (error) throw error;
        statusMsg = "Reflexión actualizada con éxito.";
        statusType = "success";
      } else {
        const { error } = await supabase.from("reflexiones").insert([{ ...reflexion }]);
        if (error) throw error;
        statusMsg = "Reflexión publicada con éxito.";
        statusType = "success";
      }
      resetForm();
      loadReflexiones();
    } catch (error) {
      console.error("Error al guardar reflexión:", error.message);
      statusMsg =
        "Error al guardar la reflexión. Verifica que la tabla 'reflexiones' exista y tenga permisos.";
      statusType = "error";
    }
  };

  const editReflexion = (r) => {
    editingId = r.id;
    reflexion = {
      titulo: r.titulo || "",
      autor: r.autor || "",
      fecha: r.fecha || "",
      referencia: r.referencia || "",
      contenido: r.contenido || "",
    };
    statusMsg = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteReflexion = async (r) => {
    if (!confirm(`¿Eliminar la reflexión "${r.titulo}"?`)) return;
    const { error } = await supabase.from("reflexiones").delete().eq("id", r.id);
    if (error) {
      statusMsg = "Error al eliminar la reflexión.";
      statusType = "error";
      return;
    }
    if (editingId === r.id) resetForm();
    loadReflexiones();
  };

  const shareReflexion = (r) => {
    const url = `${window.location.origin}/reflexiones?id=${r.id}`;
    const texto = `${r.titulo}${r.referencia ? " — " + r.referencia : ""}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const copyReflexion = async (r) => {
    const url = `${window.location.origin}/reflexiones?id=${r.id}`;
    try {
      await navigator.clipboard.writeText(url);
      statusMsg = "Enlace copiado al portapapeles.";
      statusType = "success";
    } catch (e) {
      statusMsg = "No se pudo copiar el enlace.";
      statusType = "error";
    }
  };

  onMount(loadReflexiones);
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
      <form on:submit|preventDefault={onSubmit}>
        <div class="form-group p-3">
          <h4 class="text-white mb-3">
            {editingId ? "Editar Reflexión" : "Publicar Reflexión"}
          </h4>

          {#if editingId}
            <div
              class="alert alert-info py-2 d-flex justify-content-between align-items-center flex-wrap gap-2"
            >
              <span><i class="fa-solid fa-pen"></i> Editando: {reflexion.titulo}</span>
              <button type="button" class="btn btn-sm btn-outline-light" on:click={resetForm}>
                <i class="fa-solid fa-xmark"></i> Cancelar edición
              </button>
            </div>
          {/if}

          <input
            type="text"
            id="titulo"
            bind:value={reflexion.titulo}
            class="form-control mb-2"
            style="border-bottom: 2px solid #c8a97e;"
            placeholder="Título de la reflexión"
          />
          <input
            type="text"
            id="autor"
            bind:value={reflexion.autor}
            class="form-control mb-2"
            style="border-bottom: 2px solid #c8a97e;"
            placeholder="Autor (opcional)"
          />
          <input
            type="text"
            id="fecha"
            bind:value={reflexion.fecha}
            class="form-control mb-2"
            style="border-bottom: 2px solid #c8a97e;"
            placeholder="Fecha (ej. 12 de Agosto, 2026)"
          />
          <input
            type="text"
            id="referencia"
            bind:value={reflexion.referencia}
            class="form-control mb-2"
            style="border-bottom: 2px solid #c8a97e;"
            placeholder="Referencia bíblica (ej. Juan 3:16)"
          />
          <textarea
            id="contenido"
            bind:value={reflexion.contenido}
            class="form-control mb-2"
            style="border-bottom: 2px solid #c8a97e; min-height: 180px;"
            placeholder="Escribe aquí el contenido de la reflexión..."
          ></textarea>

          {#if statusMsg}
            <div
              class="alert mt-2 {statusType === 'success'
                ? 'alert-success'
                : 'alert-danger'}"
            >
              {statusMsg}
            </div>
          {/if}

          <button type="submit" class="btn btn-dark btn-lg m-2">
            {editingId ? "Actualizar Reflexión" : "Publicar Reflexión"}
          </button>
        </div>
      </form>
    </div>

    <div
      class="card"
      style="box-shadow: 10px 10px 5px 0px rgba(200,169,126,0.35); background-color:#1d1a15;"
    >
      <div class="p-3">
        <h5 class="text-white mb-3">
          <i class="fa-solid fa-list"></i> Reflexiones publicadas ({reflexiones.length})
        </h5>

        {#if loading}
          <p class="text-white-50 mb-0">Cargando reflexiones...</p>
        {:else if !reflexiones.length}
          <p class="text-white-50 mb-0">Aún no hay reflexiones publicadas.</p>
        {:else}
          <div class="table-responsive">
            <table class="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Likes</th>
                  <th>Comentarios</th>
                  <th>Fecha</th>
                  <th style="width: 340px;">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {#each reflexiones as r}
                  <tr class:table-active={editingId === r.id}>
                    <td>
                      <div class="fw-semibold">{r.titulo}</div>
                      {#if r.referencia}
                        <small class="text-white-50"
                          ><i class="fa-solid fa-cross"></i> {r.referencia}</small
                        >
                      {/if}
                    </td>
                    <td>
                      <span class="text-white-50"
                        ><i class="fa-solid fa-heart" style="color:#e07a5f;"></i> {r.likes || 0}</span
                      >
                    </td>
                    <td>
                      <span class="text-white-50"
                        ><i class="fa-regular fa-comment"></i> {comentariosCount[r.id] || 0}</span
                      >
                    </td>
                    <td class="text-white-50">{r.fecha || "—"}</td>
                    <td>
                      <div class="d-flex gap-1 flex-wrap">
                        <a
                          class="btn btn-sm btn-outline-light"
                          href={`/reflexiones?id=${r.id}`}
                          target="_blank"
                          title="Ver en la web"
                        >
                          <i class="fa-solid fa-eye"></i> Ver
                        </a>
                        <button
                          class="btn btn-sm btn-outline-info"
                          title="Editar reflexión"
                          on:click={() => editReflexion(r)}
                        >
                          <i class="fa-solid fa-pen"></i> Editar
                        </button>
                        <button
                          class="btn btn-sm btn-outline-success"
                          title="Compartir por WhatsApp"
                          on:click={() => shareReflexion(r)}
                        >
                          <i class="fa-brands fa-whatsapp"></i> Compartir
                        </button>
                        <button
                          class="btn btn-sm btn-outline-secondary"
                          title="Copiar enlace"
                          on:click={() => copyReflexion(r)}
                        >
                          <i class="fa-solid fa-link"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          title="Eliminar reflexión"
                          on:click={() => deleteReflexion(r)}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
