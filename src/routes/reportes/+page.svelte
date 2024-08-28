<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";

  let planilla = [];
  let nuevos = [];

  onMount(async () => {
    try {
      const { data: planillaData, error: planillaError } = await supabase
        .from("planilla")
        .select("*");
      if (planillaError) throw planillaError;
      planilla = planillaData;

      const { data: nuevosData, error: nuevosError } = await supabase
        .from("nuevos")
        .select("*");
      if (nuevosError) throw nuevosError;
      nuevos = nuevosData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  async function deleteItem(item) {
    try {
      const { error } = await supabase
        .from("nuevos")
        .delete()
        .eq("id", item.id);
      if (error) throw error;
      nuevos = nuevos.filter((nuevo) => nuevo.id !== item.id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  async function deletePlanilla(item) {
    try {
      const { error } = await supabase
        .from("planilla")
        .delete()
        .eq("id", item.id);
      if (error) throw error;
      planilla = planilla.filter((planillaItem) => planillaItem.id !== item.id);
    } catch (error) {
      console.error("Error deleting item from planilla:", error);
    }
  }
</script>

<div class="text-center bg-dark">
  <p class="text-white mt-5">Reportes Grupos Biblicos</p>
</div>
<div class="container">
  <div class="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
    {#each planilla as item}
      <button
        type="button"
        class="btn btn-outline-secondary mb-2"
        data-bs-toggle="modal"
        data-bs-target={`#modal-${item.id}`}
      >
        <div style="font-size: 14px;">
          <p>Felipe Lider: {item.FELIPE_LIDER}</p>
          <p>Grupo biblico: {item.grupobiblico}</p>
          <p class="text-end" style="font-size: 10px;">
            Fecha: {item.created_at}
          </p>
        </div>
      </button>
      <div
        class="modal fade"
        id={`modal-${item.id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby={`modalLabel-${item.id}`}
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id={`modalLabel-${item.id}`}>
                Reporte Grupo Biblico: {item.grupobiblico}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form class="row g-3">
                <div class="container text-center">
                  <div class="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                    <div class="col">
                      <div class="p-3">
                        <p>Asistencia VEA: {item.Asistencia_vea}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Asistentes GB: {item.asistentes}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Felipes: {item.Felipes}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Etiopes: {item.Etiopes}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Novedades: {item.novedades}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Amigos: {item.Amigos}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Niños: {item.Ninos}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Ausentes: {item.Ausentes}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Convertidos Adultos: {item.Convertidos_adultos}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Convertidos Nños: {item.Convertidos_ninos}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Reconciliados: {item.Reconciliados}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Diezmos: {item.Diezmos}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3"><p>Ofrendas: {item.Ofrendas}</p></div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Total: {item.Total_financiero}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Mision Amigo: {item.Participacion_Mision_Amigo}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Consolidacion: {item.Participacion_Consolidacion}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Discipulado 1: {item.Participacion_Discipulado_1}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Discipulado 2: {item.Participacion_Discipulado_2}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>
                          Escuela de Liderazgo: {item.Asistencia_a_la_Escuela_de_Liderazgo}
                        </p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>
                          Asistencia de hermanoss: {item.asistencia_hermanos}
                        </p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Asistencia de amigos: {item.Asistencia_de_Amigos}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="p-3">
                        <p>Asistencia de Niños: {item.Asistencia_de_Ninos}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                on:click={() => deletePlanilla(item)}
                class="btn btn-secondary"
                data-bs-dismiss="modal">Eliminar</button
              >
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="text-center bg-dark">
  <p class="text-white">Nuevos Amigos</p>
</div>
<div class="container">
  <div class="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
    {#each nuevos as item}
      <button
        type="button"
        class="btn btn-outline-secondary mb-2"
        data-bs-toggle="modal"
        data-bs-target={`#modal-${item.id}`}
      >
        <div style="font-size: 14px;">
          <p class="text-start">Felipe Lider: {item.nombrelidernuevo}</p>
          <p class="text-start">Grupo Biblico: {item.nombregruponuevo}</p>
          <p class="text-start">Nombres: {item.nombresnuevo}</p>
          <p class="text-end" style="font-size: 10px;">
            Fecha: {item.created_at}
          </p>
        </div>
      </button>
      <div
        class="modal fade"
        id={`modal-${item.id}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby={`modalLabel-${item.id}`}
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id={`modalLabel-${item.id}`}>
                Datos de la persona Nueva
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form class="row g-3">
                <p>Nombres: {item.nombresnuevo}</p>
                <p>Apellidos: {item.apellidosnuevo}</p>
                <p>Direccion: {item.direccionnuevo}</p>
                <p>Edad: {item.edadnuevo}</p>
                <p>Telefono: {item.telefononuevo}</p>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                on:click={() => deleteItem(item)}
                class="btn btn-secondary"
                data-bs-dismiss="modal">Eliminar</button
              >
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
