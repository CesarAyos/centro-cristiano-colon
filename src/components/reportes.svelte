<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import * as XLSX from "xlsx";
  import { fade } from "svelte/transition";

  // Variables reactivas
  let planilla = [];
  let nuevos = [];
  let selectedPlanilla = [];
  let selectedNuevos = [];
  let currentPagePlanilla = 1;
  let currentPageNuevos = 1;
  const itemsPerPagePlanilla = 8;
  const itemsPerPageNuevos = 8;
  let totalPagesPlanilla = 1;
  let totalPagesNuevos = 1;
  let isLoading = true;
  let activeTab = "planilla"; // 'planilla' o 'nuevos'

  // Variables para notificaciones
  let mostrarNotif = false;
  let mensajeNotif = "";
  let tipoNotif = "success";

  // Variables reactivas derivadas
  $: hasSelectedPlanilla = selectedPlanilla.length > 0;
  $: hasSelectedNuevos = selectedNuevos.length > 0;
  $: paginatedPlanilla = planilla.slice(
    (currentPagePlanilla - 1) * itemsPerPagePlanilla,
    currentPagePlanilla * itemsPerPagePlanilla,
  );
  $: paginatedNuevos = nuevos.slice(
    (currentPageNuevos - 1) * itemsPerPageNuevos,
    currentPageNuevos * itemsPerPageNuevos,
  );
  $: totalPagesPlanilla = Math.ceil(planilla.length / itemsPerPagePlanilla);
  $: totalPagesNuevos = Math.ceil(nuevos.length / itemsPerPageNuevos);

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje, tipo = "success") => {
    mensajeNotif = mensaje;
    tipoNotif = tipo;
    mostrarNotif = true;

    setTimeout(() => {
      mostrarNotif = false;
    }, 4000);
  };

  // Función para obtener los datos de Supabase
  async function fetchData() {
    isLoading = true;
    try {
      // Obtener datos de planilla
      const { data: planillaData, error: planillaError } = await supabase
        .from("planilla")
        .select("*")
        .order("created_at", { ascending: false });

      if (planillaError) throw planillaError;
      planilla = planillaData || [];

      // Obtener datos de nuevos amigos
      const { data: nuevosData, error: nuevosError } = await supabase
        .from("nuevos")
        .select("*")
        .order("created_at", { ascending: false });

      if (nuevosError) throw nuevosError;
      nuevos = nuevosData || [];

      mostrarNotificacion("✅ Datos cargados exitosamente", "success");
    } catch (error) {
      console.error("Error fetching data:", error);
      mostrarNotificacion("❌ Error al cargar los datos", "error");
    } finally {
      isLoading = false;
    }
  }

  // Funciones para eliminar items
  async function deletePlanillaItem(item) {
    try {
      const { error } = await supabase
        .from("planilla")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      planilla = planilla.filter((planillaItem) => planillaItem.id !== item.id);
      selectedPlanilla = selectedPlanilla.filter((id) => id !== item.id);

      mostrarNotificacion("✅ Reporte eliminado exitosamente", "success");
    } catch (error) {
      console.error("Error deleting item from planilla:", error);
      mostrarNotificacion("❌ Error al eliminar el reporte", "error");
    }
  }

  async function deleteNuevoItem(item) {
    try {
      const { error } = await supabase
        .from("nuevos")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      nuevos = nuevos.filter((nuevo) => nuevo.id !== item.id);
      selectedNuevos = selectedNuevos.filter((id) => id !== item.id);

      mostrarNotificacion("✅ Amigo eliminado exitosamente", "success");
    } catch (error) {
      console.error("Error deleting item:", error);
      mostrarNotificacion("❌ Error al eliminar el amigo", "error");
    }
  }

  // Funciones para exportar a Excel
  function exportPlanilla() {
    if (selectedPlanilla.length === 0) {
      mostrarNotificacion(
        "❌ Selecciona al menos un reporte para exportar",
        "error",
      );
      return;
    }

    const selectedItems = planilla.filter((item) =>
      selectedPlanilla.includes(item.id),
    );
    try {
      const worksheet = XLSX.utils.json_to_sheet(selectedItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Reportes Grupos Bíblicos",
      );
      XLSX.writeFile(
        workbook,
        `reportes_grupos_biblicos_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      mostrarNotificacion("✅ Reportes exportados exitosamente", "success");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      mostrarNotificacion("❌ Error al exportar los reportes", "error");
    }
  }

  function exportNuevos() {
    if (selectedNuevos.length === 0) {
      mostrarNotificacion(
        "❌ Selecciona al menos un amigo para exportar",
        "error",
      );
      return;
    }

    const selectedItems = nuevos.filter((item) =>
      selectedNuevos.includes(item.id),
    );
    try {
      const worksheet = XLSX.utils.json_to_sheet(selectedItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Amigos Nuevos");
      XLSX.writeFile(
        workbook,
        `amigos_nuevos_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      mostrarNotificacion("✅ Amigos exportados exitosamente", "success");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      mostrarNotificacion("❌ Error al exportar los amigos", "error");
    }
  }

  // Funciones para selección múltiple
  function isPlanillaSelected(id) {
    return selectedPlanilla.includes(id);
  }

  function togglePlanillaSelection(id) {
    if (selectedPlanilla.includes(id)) {
      selectedPlanilla = selectedPlanilla.filter(
        (selectedId) => selectedId !== id,
      );
    } else {
      selectedPlanilla = [...selectedPlanilla, id];
    }
  }

  function isNuevoSelected(id) {
    return selectedNuevos.includes(id);
  }

  function toggleNuevoSelection(id) {
    if (selectedNuevos.includes(id)) {
      selectedNuevos = selectedNuevos.filter((selectedId) => selectedId !== id);
    } else {
      selectedNuevos = [...selectedNuevos, id];
    }
  }

  // Funciones para seleccionar/deseleccionar todos
  function toggleAllPlanilla() {
    if (selectedPlanilla.length === paginatedPlanilla.length) {
      selectedPlanilla = [];
    } else {
      selectedPlanilla = paginatedPlanilla.map((item) => item.id);
    }
  }

  function toggleAllNuevos() {
    if (selectedNuevos.length === paginatedNuevos.length) {
      selectedNuevos = [];
    } else {
      selectedNuevos = paginatedNuevos.map((item) => item.id);
    }
  }

  // Funciones de paginación
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

  // Formatear fecha
  function formatDate(dateString) {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Inicialización
  onMount(() => {
    fetchData();
  });
</script>

<div class="reports-dashboard" in:fade>
  <!-- Notificación moderna -->
  {#if mostrarNotif}
    <div class="modern-notification-container" in:fade out:fade>
      <div class="modern-notification {tipoNotif}">
        <div class="notification-icon">
          {#if tipoNotif === "success"}
            <i class="fas fa-check-circle"></i>
          {:else if tipoNotif === "error"}
            <i class="fas fa-exclamation-circle"></i>
          {:else}
            <i class="fas fa-info-circle"></i>
          {/if}
        </div>
        <span class="notification-message">{mensajeNotif}</span>
        <button
          class="notification-close"
          on:click={() => (mostrarNotif = false)}
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  {/if}

  <!-- Dashboard de Reportes -->
  <div class="dashboard-container">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1><i class="fas fa-chart-bar"></i> Gestión de Reportes</h1>
        <p class="header-subtitle">
          Administra y visualiza todos los reportes y amigos nuevos registrados
        </p>
      </div>

      <div class="header-stats">
        <div class="stat-card">
          <i class="fas fa-church"></i>
          <div class="stat-info">
            <span class="stat-number">{planilla.length}</span>
            <span class="stat-label">Reportes Totales</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-user-friends"></i>
          <div class="stat-info">
            <span class="stat-number">{nuevos.length}</span>
            <span class="stat-label">Amigos Nuevos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs de navegación -->
    <div class="tabs-container">
      <div class="tabs">
        <button
          class:active={activeTab === "planilla"}
          on:click={() => (activeTab = "planilla")}
          class="tab-button"
        >
          <i class="fas fa-file-alt"></i>
          <span>Reportes de Grupos</span>
          {#if selectedPlanilla.length > 0}
            <span class="tab-badge">{selectedPlanilla.length}</span>
          {/if}
        </button>

        <button
          class:active={activeTab === "nuevos"}
          on:click={() => (activeTab = "nuevos")}
          class="tab-button"
        >
          <i class="fas fa-user-plus"></i>
          <span>Amigos Nuevos</span>
          {#if selectedNuevos.length > 0}
            <span class="tab-badge">{selectedNuevos.length}</span>
          {/if}
        </button>
      </div>
    </div>

    <!-- Contenido de los Tabs -->
    <div class="tab-content">
      {#if isLoading}
        <!-- Cargando -->
        <div class="loading-container">
          <i class="fas fa-spinner fa-spin loading-icon"></i>
          <p>Cargando datos...</p>
        </div>
      {:else if activeTab === "planilla"}
        <!-- Tab de Reportes -->
        <div class="tab-panel" in:fade>
          <!-- Acciones de Reportes -->
          <div class="actions-bar">
            <div class="actions-left">
              <button
                class="action-button select-all"
                on:click={toggleAllPlanilla}
              >
                <i
                  class="fas {selectedPlanilla.length ===
                  paginatedPlanilla.length
                    ? 'fa-check-square'
                    : 'fa-square'}"
                ></i>
                <span>Seleccionar Todos</span>
              </button>

              {#if hasSelectedPlanilla}
                <button class="action-button export" on:click={exportPlanilla}>
                  <i class="fas fa-file-excel"></i>
                  <span>Exportar Seleccionados ({selectedPlanilla.length})</span
                  >
                </button>
              {/if}
            </div>

            <div class="actions-right">
              <button class="action-button refresh" on:click={fetchData}>
                <i class="fas fa-sync-alt"></i>
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          <!-- Lista de Reportes -->
          <div class="cards-grid">
            {#if planilla.length === 0}
              <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No hay reportes registrados</h3>
                <p>Los reportes de grupos bíblicos aparecerán aquí</p>
              </div>
            {:else}
              {#each paginatedPlanilla as item}
                <div
                  class="report-card"
                  class:selected={isPlanillaSelected(item.id)}
                >
                  <!-- Header de la tarjeta -->
                  <div class="card-header">
                    <div class="card-checkbox">
                      <input
                        type="checkbox"
                        checked={isPlanillaSelected(item.id)}
                        on:change={() => togglePlanillaSelection(item.id)}
                        id={`planilla-${item.id}`}
                      />
                      <label for={`planilla-${item.id}`}></label>
                    </div>

                    <div class="card-actions">
                      <button
                        class="card-action delete"
                        on:click={() => deletePlanillaItem(item)}
                        title="Eliminar reporte"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Contenido de la tarjeta -->
                  <div class="card-content">
                    <div class="card-title">
                      <i class="fas fa-users"></i>
                      <h3>{item.grupobiblico || "Sin grupo"}</h3>
                    </div>

                    <div class="card-details">
                      <div class="detail-item">
                        <i class="fas fa-user-check"></i>
                        <span>{item.FELIPE_LIDER || "Sin líder"}</span>
                      </div>

                      <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>

                    <!-- Estadísticas resumidas -->
                    <div class="card-stats">
                      <div class="stat">
                        <i class="fas fa-user-friends"></i>
                        <span>{item.asistentes || 0} asistentes</span>
                      </div>
                      <div class="stat">
                        <i class="fas fa-hand-holding-usd"></i>
                        <span>${item.Total_financiero || 0}</span>
                      </div>
                    </div>

                    <!-- Botón para ver detalles -->
                    <button
                      class="view-details"
                      on:click={() => {
                        const modal = new bootstrap.Modal(
                          document.getElementById(`modal-planilla-${item.id}`),
                        );
                        modal.show();
                      }}
                    >
                      <i class="fas fa-eye"></i>
                      <span>Ver detalles completos</span>
                    </button>
                  </div>
                </div>

                <!-- Modal para detalles del reporte -->
                <div
                  class="modal fade"
                  id={`modal-planilla-${item.id}`}
                  tabindex="-1"
                  aria-hidden="true"
                >
                  <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">
                          <i class="fas fa-file-alt me-2"></i>
                          Reporte Completo - {item.grupobiblico || "Sin nombre"}
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <div class="modal-grid">
                          <!-- Sección 1: Información General -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-info-circle me-2"></i>Información
                              General
                            </h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label">Tipo:</span>
                                <span class="info-value"
                                  >{item.tipo || "No especificado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Grupo Bíblico:</span>
                                <span class="info-value"
                                  >{item.grupobiblico || "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Área:</span>
                                <span class="info-value"
                                  >{item.area || "No registrada"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Código:</span>
                                <span class="info-value"
                                  >{item.codigo || "Sin código"}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 2: Liderazgo -->
                          <div class="modal-section">
                            <h6><i class="fas fa-users me-2"></i>Liderazgo</h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label"
                                  >Pastor Supervisor:</span
                                >
                                <span class="info-value"
                                  >{item.PASTOR_SUPERVISOR ||
                                    "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Coordinador Dpto:</span
                                >
                                <span class="info-value"
                                  >{item.COORDINADOR_DPTO ||
                                    "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label"
                                  >Supervisor de Red:</span
                                >
                                <span class="info-value"
                                  >{item.SUPERVISOR_DE_RED ||
                                    "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Líder:</span>
                                <span class="info-value"
                                  >{item.lider || "No registrado"}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 3: Equipo de Servicio -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-user-friends me-2"></i>Equipo de
                              Servicio
                            </h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label">Aprendiz:</span>
                                <span class="info-value"
                                  >{item.aprendiz || "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Maestro Niños:</span>
                                <span class="info-value"
                                  >{item.maestrninos || "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Anfitrión:</span>
                                <span class="info-value"
                                  >{item.anfitrion || "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Líder Casa:</span>
                                <span class="info-value"
                                  >{item.lidercasa || "No registrado"}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 4: Información de Contacto -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-map-marker-alt me-2"
                              ></i>Información de Contacto
                            </h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label">Dirección:</span>
                                <span class="info-value"
                                  >{item.direccion || "No registrada"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Teléfono:</span>
                                <span class="info-value"
                                  >{item.telefono || "No registrado"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Día y Hora:</span>
                                <span class="info-value"
                                  >{item.diahora || "No establecido"}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 5: Asistencia General -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-calendar-check me-2"
                              ></i>Asistencia General
                            </h6>
                            <div class="stats-grid">
                              <div class="stat-item">
                                <i class="fas fa-church"></i>
                                <div>
                                  <span class="stat-label">Asistencia VEA</span>
                                  <span class="stat-value"
                                    >{item.Asistencia_vea || 0}</span
                                  >
                                </div>
                              </div>
                              <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <div>
                                  <span class="stat-label">Asistentes GB</span>
                                  <span class="stat-value"
                                    >{item.asistentes || 0}</span
                                  >
                                </div>
                              </div>
                              <div class="stat-item">
                                <i class="fas fa-user-plus"></i>
                                <div>
                                  <span class="stat-label">Visitas</span>
                                  <span class="stat-value"
                                    >{item.visitas || 0}</span
                                  >
                                </div>
                              </div>
                              <div class="stat-item">
                                <i class="fas fa-hands-praying"></i>
                                <div>
                                  <span class="stat-label">Decisiones</span>
                                  <span class="stat-value"
                                    >{item.Decision || 0}</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Sección 6: Asistencia por Grupos -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-user-group me-2"></i>Asistencia
                              por Grupos
                            </h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label">Amigos:</span>
                                <span class="info-value"
                                  >{item.Amigos || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Niños:</span>
                                <span class="info-value">{item.Ninos || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Decisiones Niños:</span
                                >
                                <span class="info-value"
                                  >{item.Decisionninos || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Adultos:</span>
                                <span class="info-value"
                                  >{item.adultos || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Jóvenes:</span>
                                <span class="info-value">{item.joven || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Niños en Casa:</span>
                                <span class="info-value"
                                  >{item.ninoscasa || 0}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 7: Finanzas -->
                          <div class="modal-section">
                            <h6><i class="fas fa-coins me-2"></i>Finanzas</h6>
                            <div class="finances-grid">
                              <div class="finance-item">
                                <span class="finance-label">Diezmos:</span>
                                <span class="finance-value"
                                  >${item.Diezmos || 0}</span
                                >
                              </div>
                              <div class="finance-item">
                                <span class="finance-label">Ofrendas:</span>
                                <span class="finance-value"
                                  >${item.Ofrendas || 0}</span
                                >
                              </div>
                              <div class="finance-item total">
                                <span class="finance-label">Total:</span>
                                <span class="finance-value"
                                  >${item.Total_financiero || 0}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 8: Programas y Ministerios -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-hands-helping me-2"></i>Programas
                              y Ministerios
                            </h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label">Misión Vida:</span>
                                <span class="info-value"
                                  >{item.misionvida || "No"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label"
                                  >Participación Consolidación:</span
                                >
                                <span class="info-value"
                                  >{item.Participacion_Consolidacion ||
                                    "No"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Pasos de Vida:</span>
                                <span class="info-value"
                                  >{item.pasosdevida || "No"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Escuela de Vida:</span>
                                <span class="info-value"
                                  >{item.escueladevida || "No"}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">VEA:</span>
                                <span class="info-value"
                                  >{item.vea || "No"}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 9: Asistencia Dominical -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-calendar-day me-2"></i>Asistencia
                              Dominical
                            </h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label">Hermanos:</span>
                                <span class="info-value"
                                  >{item.hermanosdominical || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Amigos Iglesia:</span>
                                <span class="info-value"
                                  >{item.amigosIglesia || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Niños Dominical:</span>
                                <span class="info-value"
                                  >{item.ninosdominical || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label"
                                  >Adultos Dominical:</span
                                >
                                <span class="info-value"
                                  >{item.adultosdominical || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label"
                                  >Jóvenes Dominical:</span
                                >
                                <span class="info-value"
                                  >{item.jovendominical || 0}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 10: Totales -->
                          <div class="modal-section">
                            <h6>
                              <i class="fas fa-calculator me-2"></i>Totales
                            </h6>
                            <div class="info-grid">
                              <div class="info-item">
                                <span class="info-label"
                                  >Total Casa Familiar:</span
                                >
                                <span class="info-value"
                                  >{item.total_casa_familiar || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Total Dominical:</span>
                                <span class="info-value"
                                  >{item.total_dominical || 0}</span
                                >
                              </div>
                              <div class="info-item">
                                <span class="info-label">Asistencia Niños:</span
                                >
                                <span class="info-value"
                                  >{item.Asistencia_de_Ninos || 0}</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Sección 11: Novedades y Observaciones -->
                          <div class="modal-section full-width">
                            <div class="row">
                              {#if item.novedades}
                                <div class="col-md-6">
                                  <h6>
                                    <i class="fas fa-sticky-note me-2"
                                    ></i>Novedades
                                  </h6>
                                  <div class="text-content">
                                    {item.novedades}
                                  </div>
                                </div>
                              {/if}

                              {#if item.observaciones}
                                <div class="col-md-6">
                                  <h6>
                                    <i class="fas fa-clipboard-check me-2"
                                    ></i>Observaciones
                                  </h6>
                                  <div class="text-content">
                                    {item.observaciones}
                                  </div>
                                </div>
                              {/if}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          <i class="fas fa-times me-1"></i>
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>

          <!-- Paginación -->
          {#if planilla.length > 0}
            <div class="pagination-container">
              <div class="pagination-info">
                Mostrando {paginatedPlanilla.length} de {planilla.length} reportes
              </div>
              <div class="pagination-controls">
                <button
                  class="pagination-button"
                  on:click={prevPagePlanilla}
                  disabled={currentPagePlanilla === 1}
                >
                  <i class="fas fa-chevron-left"></i>
                  <span>Anterior</span>
                </button>

                <div class="pagination-numbers">
                  Página {currentPagePlanilla} de {totalPagesPlanilla}
                </div>

                <button
                  class="pagination-button"
                  on:click={nextPagePlanilla}
                  disabled={currentPagePlanilla === totalPagesPlanilla}
                >
                  <span>Siguiente</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          {/if}
        </div>
      {:else if activeTab === "nuevos"}
        <!-- Tab de Amigos Nuevos -->
        <div class="tab-panel" in:fade>
          <!-- Acciones de Amigos Nuevos -->
          <div class="actions-bar">
            <div class="actions-left">
              <button
                class="action-button select-all"
                on:click={toggleAllNuevos}
              >
                <i
                  class="fas {selectedNuevos.length === paginatedNuevos.length
                    ? 'fa-check-square'
                    : 'fa-square'}"
                ></i>
                <span>Seleccionar Todos</span>
              </button>

              {#if hasSelectedNuevos}
                <button class="action-button export" on:click={exportNuevos}>
                  <i class="fas fa-file-excel"></i>
                  <span>Exportar Seleccionados ({selectedNuevos.length})</span>
                </button>
              {/if}
            </div>

            <div class="actions-right">
              <button class="action-button refresh" on:click={fetchData}>
                <i class="fas fa-sync-alt"></i>
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          <!-- Lista de Amigos Nuevos -->
          <div class="cards-grid">
            {#if nuevos.length === 0}
              <div class="empty-state">
                <i class="fas fa-user-friends"></i>
                <h3>No hay amigos nuevos registrados</h3>
                <p>Los nuevos amigos aparecerán aquí</p>
              </div>
            {:else}
              {#each paginatedNuevos as item}
                <div
                  class="friend-card"
                  class:selected={isNuevoSelected(item.id)}
                >
                  <!-- Header de la tarjeta -->
                  <div class="card-header">
                    <div class="card-checkbox">
                      <input
                        type="checkbox"
                        checked={isNuevoSelected(item.id)}
                        on:change={() => toggleNuevoSelection(item.id)}
                        id={`nuevo-${item.id}`}
                      />
                      <label for={`nuevo-${item.id}`}></label>
                    </div>

                    <div class="card-actions">
                      <button
                        class="card-action delete"
                        on:click={() => deleteNuevoItem(item)}
                        title="Eliminar amigo"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Contenido de la tarjeta -->
                  <div class="card-content">
                    <div class="card-avatar">
                      <i class="fas fa-user-circle"></i>
                    </div>

                    <div class="card-info">
                      <h3 class="friend-name">
                        {item.nombresnuevo}
                        {item.apellidosnuevo}
                      </h3>

                      <div class="friend-details">
                        <div class="detail-item">
                          <i class="fas fa-user-tie"></i>
                          <span>{item.nombrelidernuevo}</span>
                        </div>

                        <div class="detail-item">
                          <i class="fas fa-church"></i>
                          <span>{item.nombregruponuevo}</span>
                        </div>

                        <div class="detail-item">
                          <i class="fas fa-birthday-cake"></i>
                          <span>{item.edadnuevo} años</span>
                        </div>

                        <div class="detail-item">
                          <i class="fas fa-calendar-alt"></i>
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Botón para ver detalles -->
                    <button
                      class="view-details"
                      on:click={() => {
                        const modal = new bootstrap.Modal(
                          document.getElementById(`modal-nuevo-${item.id}`),
                        );
                        modal.show();
                      }}
                    >
                      <i class="fas fa-eye"></i>
                      <span>Ver información completa</span>
                    </button>
                  </div>
                </div>

                <!-- Modal para detalles del amigo -->
                <div
                  class="modal fade"
                  id={`modal-nuevo-${item.id}`}
                  tabindex="-1"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">
                          <i class="fas fa-user-circle"></i>
                          Información Completa
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <div class="friend-info-grid">
                          <div class="info-section">
                            <h6>
                              <i class="fas fa-user"></i> Información Personal
                            </h6>
                            <div class="info-item">
                              <span class="info-label">Nombres:</span>
                              <span class="info-value">{item.nombresnuevo}</span
                              >
                            </div>
                            <div class="info-item">
                              <span class="info-label">Apellidos:</span>
                              <span class="info-value"
                                >{item.apellidosnuevo}</span
                              >
                            </div>
                            <div class="info-item">
                              <span class="info-label">Edad:</span>
                              <span class="info-value"
                                >{item.edadnuevo} años</span
                              >
                            </div>
                          </div>

                          <div class="info-section">
                            <h6>
                              <i class="fas fa-church"></i> Información del Grupo
                            </h6>
                            <div class="info-item">
                              <span class="info-label">Líder Responsable:</span>
                              <span class="info-value"
                                >{item.nombrelidernuevo}</span
                              >
                            </div>
                            <div class="info-item">
                              <span class="info-label">Grupo Bíblico:</span>
                              <span class="info-value"
                                >{item.nombregruponuevo}</span
                              >
                            </div>
                          </div>

                          <div class="info-section">
                            <h6>
                              <i class="fas fa-address-book"></i> Contacto
                            </h6>
                            <div class="info-item">
                              <span class="info-label">Dirección:</span>
                              <span class="info-value"
                                >{item.direccionnuevo}</span
                              >
                            </div>
                            <div class="info-item">
                              <span class="info-label">Teléfono:</span>
                              <span class="info-value"
                                >{item.telefononuevo}</span
                              >
                            </div>
                          </div>

                          <div class="info-section">
                            <h6>
                              <i class="fas fa-calendar"></i> Fecha de Registro
                            </h6>
                            <div class="info-item">
                              <span class="info-label">Registrado el:</span>
                              <span class="info-value"
                                >{formatDate(item.created_at)}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          <i class="fas fa-times"></i>
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>

          <!-- Paginación -->
          {#if nuevos.length > 0}
            <div class="pagination-container">
              <div class="pagination-info">
                Mostrando {paginatedNuevos.length} de {nuevos.length} amigos
              </div>
              <div class="pagination-controls">
                <button
                  class="pagination-button"
                  on:click={prevPageNuevos}
                  disabled={currentPageNuevos === 1}
                >
                  <i class="fas fa-chevron-left"></i>
                  <span>Anterior</span>
                </button>

                <div class="pagination-numbers">
                  Página {currentPageNuevos} de {totalPagesNuevos}
                </div>

                <button
                  class="pagination-button"
                  on:click={nextPageNuevos}
                  disabled={currentPageNuevos === totalPagesNuevos}
                >
                  <span>Siguiente</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Variables de diseño */
  :root {
    --primary-color: #92ae83;
    --primary-dark: #789768;
    --secondary-color: #5504f8;
    --accent-color: #36827b;
    --success-color: #4caf50;
    --error-color: #f44336;
    --warning-color: #ff9800;
    --info-color: #2196f3;
    --bg-light: #f8f9fa;
    --bg-dark: #333333;
    --card-bg: #ffffff;
    --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    --card-shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.12);
    --border-color: #e9ecef;
    --text-primary: #2d3748;
    --text-secondary: #718096;
    --text-muted: #a0aec0;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Dashboard principal */
  .reports-dashboard {
    min-height: 100vh;
    padding: 1.5rem;
  }

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  /* Header del Dashboard */
  .dashboard-header {
    background: linear-gradient(135deg, var(--bg-dark) 0%, #444 100%);
    padding: 2rem;
    color: white;
  }

  .header-content h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-content h1 i {
    color: var(--primary-color);
  }

  .header-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .header-stats {
    display: flex;
    gap: 1.5rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: var(--transition);
  }

  .stat-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  .stat-card i {
    font-size: 2rem;
    color: var(--primary-color);
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-top: 0.25rem;
  }

  /* Tabs de navegación */
  .tabs-container {
    background: white;
    border-bottom: 1px solid var(--border-color);
    padding: 0 2rem;
  }

  .tabs {
    display: flex;
    gap: 1px;
    background: var(--border-color);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    overflow: hidden;
  }

  .tab-button {
    flex: 1;
    background: white;
    border: none;
    padding: 1.2rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    position: relative;
  }

  .tab-button:hover {
    background: var(--bg-light);
    color: var(--primary-color);
  }

  .tab-button.active {
    background: white;
    color: var(--primary-color);
    border-bottom: 3px solid var(--primary-color);
  }

  .tab-badge {
    background: var(--primary-color);
    color: white;
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: 50px;
    font-weight: 600;
  }

  /* Contenido de los Tabs */
  .tab-content {
    padding: 2rem;
    min-height: 500px;
  }

  .tab-panel {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Barra de acciones */
  .actions-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: var(--bg-light);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
  }

  .actions-left,
  .actions-right {
    display: flex;
    gap: 0.75rem;
  }

  .action-button {
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .action-button.select-all {
    background: white;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .action-button.select-all:hover {
    background: var(--bg-light);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .action-button.export {
    background: var(--success-color);
    color: white;
  }

  .action-button.export:hover {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .action-button.refresh {
    background: var(--info-color);
    color: white;
  }

  .action-button.refresh:hover {
    background: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  /* Grid de tarjetas */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  /* Tarjeta de Reporte */
  .report-card,
  .friend-card {
    background: white;
    border-radius: var(--radius-md);
    box-shadow: var(--card-shadow);
    border: 2px solid transparent;
    transition: var(--transition);
    overflow: hidden;
  }

  .report-card:hover,
  .friend-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--card-shadow-hover);
  }

  .report-card.selected,
  .friend-card.selected {
    border-color: var(--primary-color);
    background: rgba(146, 174, 131, 0.05);
  }

  /* Header de tarjeta */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--bg-light);
    border-bottom: 1px solid var(--border-color);
  }

  .card-checkbox input {
    display: none;
  }

  .card-checkbox label {
    width: 20px;
    height: 20px;
    border: 2px solid var(--text-muted);
    border-radius: 4px;
    display: block;
    cursor: pointer;
    position: relative;
    transition: var(--transition);
  }

  .card-checkbox input:checked + label {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }

  .card-checkbox input:checked + label::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
  }

  .card-action {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: white;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  .card-action:hover {
    background: var(--error-color);
    color: white;
  }

  /* Contenido de tarjeta */
  .card-content {
    padding: 1.5rem;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .card-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .card-title i {
    color: var(--primary-color);
    font-size: 1.2rem;
  }

  .card-details,
  .friend-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .detail-item i {
    width: 16px;
    color: var(--text-muted);
  }

  /* Avatar para amigos */
  .card-avatar {
    width: 60px;
    height: 60px;
    background: linear-gradient(
      135deg,
      var(--primary-color) 0%,
      var(--accent-color) 100%
    );
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .card-avatar i {
    font-size: 2rem;
    color: white;
  }

  .friend-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  /* Estadísticas en tarjeta */
  .card-stats {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    padding: 1rem;
    background: var(--bg-light);
    border-radius: var(--radius-sm);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  .stat i {
    color: var(--primary-color);
  }

  /* Botón ver detalles */
  .view-details {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid var(--primary-color);
    border-radius: var(--radius-sm);
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .view-details:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
  }

  /* Estados vacíos */
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-muted);
  }

  .empty-state i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--border-color);
  }

  .empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }

  /* Cargando */
  .loading-container {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
  }

  .loading-icon {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  /* Paginación */
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: var(--bg-light);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
  }

  .pagination-info {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .pagination-button {
    padding: 0.75rem 1.25rem;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pagination-button:hover:not(:disabled) {
    background: var(--bg-light);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-numbers {
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Modales */
  .modal-grid,
  .friend-info-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .modal-section,
  .info-section {
    background: var(--bg-light);
    border-radius: var(--radius-sm);
    padding: 1.5rem;
    border: 1px solid var(--border-color);
  }

  .modal-section h6,
  .info-section h6 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .modal-section h6 i,
  .info-section h6 i {
    color: var(--primary-color);
  }

  .info-grid,
  .stats-grid,
  .finances-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-label {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .info-value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 600;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--text-muted);
    display: block;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    display: block;
  }

  .finance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: white;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
  }

  .finance-item.total {
    background: rgba(146, 174, 131, 0.1);
    border-color: var(--primary-color);
  }

  .finance-label {
    font-weight: 600;
    color: var(--text-primary);
  }

  .finance-value {
    font-weight: 700;
    color: var(--primary-color);
  }

  .novedades {
    background: white;
    padding: 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    line-height: 1.6;
    color: var(--text-primary);
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .reports-dashboard {
      padding: 1rem;
    }

    .dashboard-header {
      padding: 1.5rem;
    }

    .header-content h1 {
      font-size: 1.8rem;
    }

    .header-stats {
      flex-direction: column;
    }

    .tab-content {
      padding: 1.5rem;
    }

    .tabs-container {
      padding: 0 1rem;
    }

    .tab-button {
      padding: 1rem;
      font-size: 0.9rem;
    }

    .cards-grid {
      grid-template-columns: 1fr;
    }

    .actions-bar {
      flex-direction: column;
      gap: 1rem;
    }

    .actions-left,
    .actions-right {
      width: 100%;
      justify-content: center;
    }

    .pagination-container {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .dashboard-header {
      padding: 1rem;
    }

    .header-content h1 {
      font-size: 1.5rem;
    }

    .tab-button {
      padding: 0.75rem;
      font-size: 0.85rem;
    }

    .action-button {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
    }

    .card-content {
      padding: 1rem;
    }
  }
</style>
