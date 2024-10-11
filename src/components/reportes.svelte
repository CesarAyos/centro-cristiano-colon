<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import * as XLSX from "xlsx";

  let planilla = [];
  let selectedCards = [];
  let nuevos = [];
  let selectedReporte = [];
  let currentPagePlanilla = 1;
  let currentPageNuevos = 1;
  const itemsPerPage = 10;
  const itemsPerPagePlanilla = 7;
  let totalPagesPlanilla = 1;
  let totalPagesNuevos = 1;
  $: hasSelectedCards = selectedCards.length > 0;
  $: hasSelectedReporte = selectedReporte.length > 0;

  // Función para obtener los datos de Supabase
  async function fetchData() {
    try {
      const { data: planillaData, error: planillaError } = await supabase
        .from("planilla")
        .select("*")
        .order("id", { ascending: false });
      if (planillaError) throw planillaError;
      planilla = planillaData;
      totalPagesPlanilla = Math.ceil(planilla.length / itemsPerPagePlanilla);

      const { data: nuevosData, error: nuevosError } = await supabase
        .from("nuevos")
        .select("*")
        .order("id", { ascending: false });
      if (nuevosError) throw nuevosError;
      nuevos = nuevosData;
      totalPagesNuevos = Math.ceil(nuevos.length / itemsPerPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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

  function handleExport() {
    const selectedItems = nuevos.filter((item) =>
      selectedCards.includes(item.id)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Seleccionados");
    XLSX.writeFile(workbook, "amigos_nuevos.xlsx");
  }

  function handleReporte() {
    const selectedItems = planilla.filter((item) =>
      selectedReporte.includes(item.id)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, "reportes.xlsx");
  }

  function isSelected(id) {
    return selectedCards.includes(id);
  }

  function toggleSelection(id) {
    if (selectedCards.includes(id)) {
      selectedCards = selectedCards.filter((selectedId) => selectedId !== id);
    } else {
      selectedCards = [...selectedCards, id];
    }
  }

  function isReporteSelected(id) {
    return selectedReporte.includes(id);
  }

  function toggleReporteSelection(id) {
    if (selectedReporte.includes(id)) {
      selectedReporte = selectedReporte.filter(
        (selectedId) => selectedId !== id
      );
    } else {
      selectedReporte = [...selectedReporte, id];
    }
  }

  // Llamar a fetchData cuando el componente se monta
  onMount(() => {
    fetchData();
  });

  // Filtrar los elementos para la página actual
  $: paginatedPlanilla = planilla.slice(
    (currentPagePlanilla - 1) * itemsPerPagePlanilla,
    currentPagePlanilla * itemsPerPagePlanilla
  );

  $: paginatedNuevos = nuevos.slice(
    (currentPageNuevos - 1) * itemsPerPage,
    currentPageNuevos * itemsPerPage
  );

  function nextPagePlanilla() {
    if (currentPagePlanilla < totalPagesPlanilla) {
      currentPagePlanilla += 1;
    }
  }

  function prevPagePlanilla() {
    if (currentPagePlanilla > 1) {
      currentPagePlanilla -= 1;
    }
  }

  function nextPageNuevos() {
    if (currentPageNuevos < totalPagesNuevos) {
      currentPageNuevos += 1;
    }
  }

  function prevPageNuevos() {
    if (currentPageNuevos > 1) {
      currentPageNuevos -= 1;
    }
  }
</script>

<div id="planilla">
  <div class="text-center bg-dark movil">
    <p class="text-white mt-5">Reportes Grupos Biblicos</p>
  </div>
  <div class="d-flex justify-content-center m-2">
    {#if hasSelectedReporte}
      <button
        class="btn btn-success text-center"
        style="font-size: 12px;"
        on:click={handleReporte}>Exportar Reportes</button
      >
    {/if}
  </div>
  <div class="container planilla">
    <div class="row row-cols-2 row-cols-lg-5 g-2 g-lg-3 movil">
      {#each paginatedPlanilla as item}
        <div class="card" style="border: none;">
          <div
            class="d-flex justify-content-start p-1 bg-dark"
            style="border-radius: 10px 10px 0px 0px;"
          >
            <input
              type="checkbox"
              checked={isReporteSelected(item.id)}
              on:change={() => toggleReporteSelection(item.id)}
            />
          </div>
          <button
            type="button"
            class="btn btn-outline-secondary mb-2"
            data-bs-toggle="modal"
            style="border: none;border-bottom: solid #212529;"
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
                          <div class="p-3">
                            <p>Novedades: {item.novedades}</p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3"><p>Amigos: {item.Amigos}</p></div>
                        </div>
                        <div class="col">
                          <div class="p-3"><p>Niños: {item.Ninos}</p></div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>Ausentes: {item.Ausentes}</p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>
                              Convertidos Adultos: {item.Convertidos_adultos}
                            </p>
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
                          <div class="p-3">
                            <p>Ofrendas: {item.Ofrendas}</p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>Total: {item.Total_financiero}</p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>
                              Mision Amigo: {item.Participacion_Mision_Amigo}
                            </p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>
                              Consolidacion: {item.Participacion_Consolidacion}
                            </p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>
                              Discipulado 1: {item.Participacion_Discipulado_1}
                            </p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>
                              Discipulado 2: {item.Participacion_Discipulado_2}
                            </p>
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
                            <p>
                              Asistencia de amigos: {item.Asistencia_de_Amigos}
                            </p>
                          </div>
                        </div>
                        <div class="col">
                          <div class="p-3">
                            <p>
                              Asistencia de Niños: {item.Asistencia_de_Ninos}
                            </p>
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
        </div>
      {/each}
    </div>
  </div>
  <div class="d-flex justify-content-center m-2">
    <button
      class="btn btn-primary"
      on:click={prevPagePlanilla}
      disabled={currentPagePlanilla === 1}>Anterior</button
    >
    <button
      class="btn btn-primary"
      on:click={nextPagePlanilla}
      disabled={currentPagePlanilla === totalPagesPlanilla}>Siguiente</button
    >
  </div>
</div>

<div id="nuevos">
  <div class="text-center bg-dark movil">
    <p class="text-white ">Nuevos Amigos</p>
  </div>
  <div class="d-flex justify-content-center m-2">
    {#if hasSelectedCards}
      <button
        class="btn btn-success text-center"
        style="font-size: 12px;"
        on:click={handleExport}>Exportar Nuevos</button
      >
    {/if}
  </div>
  <div class="container nuevos">
    <div class="row row-cols-2 row-cols-lg-5 g-2 g-lg-3 movil">
      {#each paginatedNuevos as item}
        <div class="card" style="border: none;">
          <div
            class="d-flex justify-content-start p-1 bg-dark"
            style="border-radius: 10px 10px 0px 0px;"
          >
            <input
              type="checkbox"
              checked={isSelected(item.id)}
              on:change={() => toggleSelection(item.id)}
            />
          </div>
          <button
            type="button"
            class="btn btn-outline-secondary mb-2"
            style="border: none;border-bottom: solid #212529;"
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
        </div>
      {/each}
    </div>
  </div>

  <div class="d-flex justify-content-center m-2">
    <button
      class="btn btn-primary"
      on:click={prevPageNuevos}
      disabled={currentPageNuevos === 1}>Anterior</button
    >
    <button
      class="btn btn-primary"
      on:click={nextPageNuevos}
      disabled={currentPageNuevos === totalPagesNuevos}>Siguiente</button
    >
  </div>
</div>

<style>
  @media (max-width: 900px) {
    .movil {
      width: 18rem;
    }
  }
</style>
