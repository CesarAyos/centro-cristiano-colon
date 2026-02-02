<script>
  import { supabase } from "../components/supabase.js";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // Variables del formulario
  let planilla = {
    tipo: "",
    PASTOR_SUPERVISOR: "",
    grupobiblico: "",
    COORDINADOR_DPTO: "",
    SUPERVISOR_DE_RED: "",
    lidercasa: "",
    area: "",
    codigo: "",
    Asistencia_vea: "",
    asistentes: "",
    visitas: "",
    Decision: "",
    novedades: "",
    Amigos: "",
    Ninos: "",
    Decisionninos: "",
    adultos: "",
    joven: "",
    ninoscasa: "",
    Diezmos: "",
    Ofrendas: "",
    Total_financiero: "0",
    misionvida: "",
    Participacion_Consolidacion: "",
    pasosdevida: "",
    hermanosdominical: "",
    amigosIglesia: "",
    escueladevida: "",
    vea: "",
    Asistencia_de_Ninos: "",
    ninosdominical: "",
    adultosdominical: "",
    jovendominical: "",
    total_casa_familiar: "0",
    total_dominical: "0",
    lider: "",
    aprendiz: "",
    maestrninos: "",
    anfitrion: "",
    direccion: "",
    telefono: "",
    diahora: "",
    observaciones: "",
  };

  // Variables de estado
  let isSubmitting = false;

  // Variables para notificaciones
  let mostrarNotif = false;
  let mensajeNotif = "";
  let tipoNotif = "success";

  // Grupos bíblicos disponibles
  const gruposBiblicos = [
    { value: "agente-de-paz", label: "Agente de Paz" },
    { value: "alfa-y-omega", label: "Alfa y Omega" },
    { value: "belen", label: "Belén" },
    { value: "betel", label: "Betel" },
    { value: "elohim", label: "Elohim" },
    { value: "emanuel", label: "Emanuel" },
    { value: "juda", label: "Judá" },
    { value: "jireth", label: "Jireth" },
  ];

  // Función para calcular total financiero
  const calcularTotalFinanciero = () => {
    const diezmos = parseFloat(planilla.Diezmos) || 0;
    const ofrendas = parseFloat(planilla.Ofrendas) || 0;
    planilla.Total_financiero = (diezmos + ofrendas).toFixed(2);
  };

  const calcularTotalCasaFamiliar = () => {
    const adultos = parseFloat(planilla.adultos) || 0;
    const ninoscasa = parseFloat(planilla.ninoscasa) || 0;
    const joven = parseFloat(planilla.joven) || 0;
    const total = adultos + ninoscasa + joven;
    planilla.total_casa_familiar = total.toString();
  };

  const calcularTotalDominical = () => {
    const adultosdominical = parseFloat(planilla.adultosdominical) || 0;
    const jovendominical = parseFloat(planilla.jovendominical) || 0;
    const ninosdominical = parseFloat(planilla.ninosdominical) || 0;
    const total = adultosdominical + jovendominical + ninosdominical;
    planilla.total_dominical = total.toString();
  };

  // Función para mostrar notificación
  const mostrarNotificacion = (
    mensaje = "✅ Reporte enviado exitosamente a la base de datos y WhatsApp.",
    tipo = "success",
  ) => {
    mensajeNotif = mensaje;
    tipoNotif = tipo;
    mostrarNotif = true;

    setTimeout(() => {
      mostrarNotif = false;
    }, 4000);
  };

  // Función para limpiar el formulario
  const Clear = () => {
    planilla = {
      tipo: "",
      PASTOR_SUPERVISOR: "",
      grupobiblico: "",
      COORDINADOR_DPTO: "",
      SUPERVISOR_DE_RED: "",
      area: "",
      codigo: "",
      Asistencia_vea: "",
      asistentes: "",
      visitas: "",
      Decision: "",
      novedades: "",
      Amigos: "",
      Ninos: "",
      Decisionninos: "",
      adultos: "",
      joven: "",
      ninoscasa: "",
      lidercasa: "",
      Diezmos: "",
      Ofrendas: "",
      Total_financiero: "0",
      misionvida: "",
      Participacion_Consolidacion: "",
      pasosdevida: "",
      hermanosdominical: "",
      amigosIglesia: "",
      escueladevida: "",
      vea: "",
      ninosdominical: "",
      adultosdominical: "",
      jovendominical: "",
      Asistencia_de_Ninos: "",
      total_casa_familiar: "0",
      total_dominical: "0",
      lider: "",
      aprendiz: "",
      maestrninos: "",
      anfitrion: "",
      direccion: "",
      telefono: "",
      diahora: "",
      observaciones: "",
    };
  };

const insertPlanilla = async () => {
  isSubmitting = true;

  try {
    const { data, error } = await supabase
      .from("planilla")
      .insert([planilla])
      .select();

    if (error) {
      console.error("Error al insertar datos:", error.message, error.details);
      mostrarNotificacion("❌ Error al enviar los datos", "error");
      return;
    } else {
      console.log("Datos insertados con éxito:", data);
      enviarAWhatsApp();
      mostrarNotificacion();
      setTimeout(() => {
        Clear();
      }, 1000);
    }
  } catch (error) {
    console.error("Error general:", error?.message || error);
    mostrarNotificacion(
      "❌ Ocurrió un error al procesar la solicitud",
      "error",
    );
  } finally {
    isSubmitting = false;
  }
};

  // Función para manejar el submit
  const onSubmitHandlers = (event) => {
    event.preventDefault();
    insertPlanilla();
  };

  // Función para forzar la apertura de WhatsApp
  const forzarAperturaWhatsApp = (numero, mensaje) => {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    try {
      const nuevaVentana = window.open(url, "_blank");
      if (nuevaVentana) {
        return true;
      }
    } catch (error) {
      console.log("Método 1 falló:", error);
    }

    try {
      window.location.href = url;
      return true;
    } catch (error) {
      console.log("Método 2 falló:", error);
    }

    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);

      return true;
    } catch (error) {
      console.log("Método 3 falló:", error);
    }

    return false;
  };

  // Función para enviar a WhatsApp
const enviarAWhatsApp = () => {
  const numero = "584247187229";

  const mensajeTexto = `📄 REPORTE DE GRUPO BÍBLICO - CASA DE VIDA

📋 INFORME GENERAL
────────────────────
🔹 Tipo de reporte: ${planilla.tipo}
🙏 Pastor Supervisor: ${planilla.PASTOR_SUPERVISOR}
🏠 Casa de Vida: ${planilla.grupobiblico}
🎖️ Coordinador Departamento: ${planilla.COORDINADOR_DPTO}
🔰 Supervisor de Red: ${planilla.SUPERVISOR_DE_RED}
🌐 Área: ${planilla.area}
⭐ Código: ${planilla.codigo}

👥 ASISTENCIA CASA DE VIDA FAMILIAR
──────────────────────────────────
✅ VEA: ${planilla.Asistencia_vea}
🙋‍♂️ Adultos (+26): ${planilla.adultos}
🧑‍🎓 Jóvenes (13-26): ${planilla.joven}
👶 Niños (1-12): ${planilla.ninoscasa}
📊 TOTAL CASA: ${planilla.total_casa_familiar}

📈 REPORTE DE REUNIÓN
────────────────────
🎯 Misión Vida: ${planilla.misionvida}
🔗 Consolidación: ${planilla.Participacion_Consolidacion}
📖 Pasos de vida: ${planilla.pasosdevida}


👥 ASISTENCIA DOMINICAL
──────────────────────
🙏 Hermanos: ${planilla.hermanosdominical}
🤝 Amigos Iglesia: ${planilla.amigosIglesia}
👧 Niños Iglesia: ${planilla.Asistencia_de_Ninos}
🙋‍♂️ Adultos Dominical: ${planilla.adultosdominical}
🧑‍🎓 Jóvenes Dominical: ${planilla.jovendominical}
👶 Niños Dominical: ${planilla.ninosdominical}
📊 TOTAL DOMINICAL: ${planilla.total_dominical}

💰 FINANZAS
──────────
💵 Diezmos: $${planilla.Diezmos}
💸 Ofrendas: $${planilla.Ofrendas}
💳 TOTAL FINANCIERO: $${planilla.Total_financiero}

🎯 PARTICIPACIÓN CICLO
─────────────────────
🎯 Misión Vida: ${planilla.misionvida}
🔗 Consolidación: ${planilla.Participacion_Consolidacion}
📖 Pasos de Vida: ${planilla.pasosdevida}
📖 Hermanos Dominical: ${planilla.hermanosdominical}

🏃 ASISTIERON A:
────────────────
✅ VEA: ${planilla.vea}
🏫 Escuela de Vida: ${planilla.escueladevida}

👥 ESTADÍSTICAS ADICIONALES
──────────────────────────
🤝 Amigos: ${planilla.Amigos}
👶 Niños GB: ${planilla.Ninos}
🏡 Visitas Hogares: ${planilla.visitas}
✝️ Decisión Fe Adultos: ${planilla.Decision}
✝️ Decisión Fe Niños: ${planilla.Decisionninos}

👑 LIDERAZGO
───────────
🏠 Líder Casa: ${planilla.lidercasa}
👨‍💼 Líder: ${planilla.lider}
👨‍🎓 Aprendiz: ${planilla.aprendiz}
👩‍🏫 Maestro Niños: ${planilla.maestrninos}
🏡 Anfitrión: ${planilla.anfitrion}

📍 INFORMACIÓN DE CONTACTO
─────────────────────────
🏠 Dirección: ${planilla.direccion}
📞 Teléfono: ${planilla.telefono}
📅 Día/Hora: ${planilla.diahora}

📝 OBSERVACIONES
────────────────
${planilla.observaciones || "Sin observaciones"}

📊 RESUMEN FINAL
────────────────
🏠 TOTAL CASA VIDA: ${planilla.total_casa_familiar}
⛪ TOTAL DOMINICAL: ${planilla.total_dominical}
💰 TOTAL FINANCIERO: $${planilla.Total_financiero}`;

  if (!forzarAperturaWhatsApp(numero, mensajeTexto)) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mensajeTexto).then(() => {
        mostrarNotificacion(
          `📱 Mensaje copiado al portapapeles! Número: ${numero}`,
          "info",
        );
      });
    } else {
      mostrarNotificacion(
        `📱 Para enviar: Número ${numero} - Mensaje copiado`,
        "info",
      );
    }
  }
};
</script>

<main class="modern-form-container">
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

  <div class="form-wrapper">
    <div class="modern-card">
      <!-- Header del formulario -->
      <div class="form-header">
        <div class="header-logo">
          <img
            src="/logo.png"
            alt="Centro Cristiano Colón"
            class="logo-image"
          />
          <div class="header-title">
            <h1>REPORTE DE GRUPO BÍBLICO</h1>
            <p class="header-subtitle">
              Complete el formulario con la información del reporte
            </p>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <form on:submit|preventDefault={onSubmitHandlers} class="modern-form">
        <!-- Sección 1: Información del Liderazgo -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-users"></i>
            <h3>P.V.A</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="tipo">Tipo de reporte</label>
              <div class="select-with-icon">
                <i class="fas fa-church"></i>
                <select
                  id="tipo"
                  bind:value={planilla.tipo}
                  required
                >
                  <option value="" selected>Seleccione el tipo de reporte</option>
                  <option value="Grupal">Grupal</option>
                  <option value="Familiar">Familiar</option>
                </select>
                <i class="fas fa-chevron-down select-arrow"></i>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="pastorSupervisor">Supervisor de red</label>
              <div class="input-with-icon">
                <i class="fas fa-user-tie"></i>
                <input
                  id="pastorSupervisor"
                  type="text"
                  bind:value={planilla.PASTOR_SUPERVISOR}
                  placeholder="Ingrese el nombre del Supervisor de red"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="coordinador">Departamento</label>
              <div class="input-with-icon">
                <i class="fas fa-user-cog"></i>
                <input
                  id="coordinador"
                  type="text"
                  bind:value={planilla.COORDINADOR_DPTO}
                  placeholder="Departamento"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="supervisorRed">Lider de Red</label>
              <div class="input-with-icon">
                <i class="fas fa-user-friends"></i>
                <input
                  id="supervisorRed"
                  type="text"
                  bind:value={planilla.SUPERVISOR_DE_RED}
                  placeholder="Lider de red"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="area">Area</label>
              <div class="input-with-icon">
                <i class="fas fa-hands-helping"></i>
                <input
                  id="area"
                  type="text"
                  bind:value={planilla.area}
                  placeholder="area"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="codigo">codigo</label>
              <div class="input-with-icon">
                <i class="fas fa-user-check"></i>
                <input
                  id="codigo"
                  type="text"
                  bind:value={planilla.codigo}
                  placeholder="codigo"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="grupoBiblico">Nombre de casa de vida</label>
              <div class="select-with-icon">
                <i class="fas fa-church"></i>
                <select
                  id="grupoBiblico"
                  bind:value={planilla.grupobiblico}
                  required
                >
                  <option value=""  selected>Seleccione un grupo de vida</option>
                  {#each gruposBiblicos as grupo}
                    <option value={grupo.value}>{grupo.label}</option>
                  {/each}
                </select>
                <i class="fas fa-chevron-down select-arrow"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 2: Asistencia y Estadísticas -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-chart-line"></i>
            <h3>REPORTE DE LA REUNIÓN</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="asistenciaVea">Hermanos</label>
              <div class="input-with-icon">
                <i class="fas fa-calendar-check"></i>
                <input
                  id="asistenciaVea"
                  type="number"
                  bind:value={planilla.Asistencia_vea}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="asistentesGB">Discipulos</label>
              <div class="input-with-icon">
                <i class="fas fa-users"></i>
                <input
                  id="asistentesGB"
                  type="number"
                  bind:value={planilla.asistentes}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="amigos">Amigos</label>
              <div class="input-with-icon">
                <i class="fas fa-handshake"></i>
                <input
                  id="amigos"
                  type="number"
                  bind:value={planilla.Amigos}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="ninosGB">Niños(as)</label>
              <div class="input-with-icon">
                <i class="fas fa-child"></i>
                <input
                  id="ninosGB"
                  type="number"
                  bind:value={planilla.Ninos}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="visitas">Visitas hogares</label>
              <div class="input-with-icon">
                <i class="fas fa-user-graduate"></i>
                <input
                  id="visitas"
                  type="number"
                  bind:value={planilla.visitas}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="Decision">Decisión fe adultos</label>
              <div class="input-with-icon">
                <i class="fas fa-user-tag"></i>
                <input
                  id="Decision"
                  type="number"
                  bind:value={planilla.Decision}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="Decisionninos">Decisión fe Niños</label>
              <div class="input-with-icon">
                <i class="fas fa-user-times"></i>
                <input
                  id="Decisionninos"
                  type="number"
                  bind:value={planilla.Decisionninos}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 3: Asistencia Casa de Vida Familiar -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-chart-line"></i>
            <h3>ASISTENCIA CASA DE VIDA FAMILIAR</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="adultos">Adultos (+26)</label>
              <div class="input-with-icon">
                <i class="fas fa-pray"></i>
                <input
                  id="adultos"
                  type="number"
                  bind:value={planilla.adultos}
                  on:input={calcularTotalCasaFamiliar}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="joven">Joven (13 a 26 años)</label>
              <div class="input-with-icon">
                <i class="fas fa-hands-praying"></i>
                <input
                  id="joven"
                  type="number"
                  bind:value={planilla.joven}
                  on:input={calcularTotalCasaFamiliar}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="ninoscasa">Niños (1 a 12 años)</label>
              <div class="input-with-icon">
                <i class="fas fa-heart"></i>
                <input
                  id="ninoscasa"
                  type="number"
                  bind:value={planilla.ninoscasa}
                  on:input={calcularTotalCasaFamiliar}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div class="form-group highlight">
              <label for="totalasistencia">Total asistencia</label>
              <div class="total-display">
                <i class="fas fa-calculator"></i>
                <span class="total-amount">{planilla.total_casa_familiar}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 4: Finanzas -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-coins"></i>
            <h3>FINANZAS</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="diezmos">Diezmos</label>
              <div class="input-with-icon currency">
                <i class="fas fa-hand-holding-usd"></i>
                <input
                  id="diezmos"
                  type="number"
                  bind:value={planilla.Diezmos}
                  on:input={calcularTotalFinanciero}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                <span class="currency-symbol">$</span>
              </div>
            </div>

            <div class="form-group">
              <label for="ofrendas">Ofrendas</label>
              <div class="input-with-icon currency">
                <i class="fas fa-donate"></i>
                <input
                  id="ofrendas"
                  type="number"
                  bind:value={planilla.Ofrendas}
                  on:input={calcularTotalFinanciero}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                <span class="currency-symbol">$</span>
              </div>
            </div>

            <div class="form-group highlight">
              <label for="totalFinanciero">Total Financiero</label>
              <div class="total-display">
                <i class="fas fa-calculator"></i>
                <span class="total-amount">${planilla.Total_financiero}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 5: Participaciones -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-chart-bar"></i>
            <h3>PARTICIPACION EN EL CICLO</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="misionvida">Misión Vida</label>
              <div class="input-with-icon">
                <i class="fas fa-user-plus"></i>
                <input
                  id="misionvida"
                  type="number"
                  bind:value={planilla.misionvida}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="consolidacion">Consolidación</label>
              <div class="input-with-icon">
                <i class="fas fa-link"></i>
                <input
                  id="consolidacion"
                  type="number"
                  bind:value={planilla.Participacion_Consolidacion}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="pasosdevida">Pasos de vida</label>
              <div class="input-with-icon">
                <i class="fas fa-book-open"></i>
                <input
                  id="pasosdevida"
                  type="number"
                  bind:value={planilla.pasosdevida}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 6: Asistencia a la Reunión Dominical -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-chart-bar"></i>
            <h3>ASISTENCIA A LA REUNION DOMINICAL</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="hermanosdominical">Hermanos</label>
              <div class="input-with-icon">
                <i class="fas fa-graduation-cap"></i>
                <input
                  id="hermanosdominical"
                  type="number"
                  bind:value={planilla.hermanosdominical}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="amigosIglesia">Amigos en la Iglesia</label>
              <div class="input-with-icon">
                <i class="fas fa-handshake"></i>
                <input
                  id="amigosIglesia"
                  type="number"
                  bind:value={planilla.amigosIglesia}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="ninosIglesia">Niños en la Iglesia</label>
              <div class="input-with-icon">
                <i class="fas fa-child"></i>
                <input
                  id="ninosIglesia"
                  type="number"
                  bind:value={planilla.Asistencia_de_Ninos}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 7: Asistieron A -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-church"></i>
            <h3>Asistieron A:</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="vea">V.E.A</label>
              <div class="input-with-icon">
                <i class="fas fa-user-friends"></i>
                <input
                  id="vea"
                  type="number"
                  bind:value={planilla.vea}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="escueladevida">Escuela de vida</label>
              <div class="input-with-icon">
                <i class="fas fa-handshake"></i>
                <input
                  id="escueladevida"
                  type="number"
                  bind:value={planilla.escueladevida}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 8: Asistencia Reunión Dominical -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-chart-line"></i>
            <h3>ASISTENCIA REUNION DOMINICAL</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="adultosdominical">Adultos (+26)</label>
              <div class="input-with-icon">
                <i class="fas fa-pray"></i>
                <input
                  id="adultosdominical"
                  type="number"
                  bind:value={planilla.adultosdominical}
                  on:input={calcularTotalDominical}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="jovendominical">Joven (13 a 26 años)</label>
              <div class="input-with-icon">
                <i class="fas fa-hands-praying"></i>
                <input
                  id="jovendominical"
                  type="number"
                  bind:value={planilla.jovendominical}
                  on:input={calcularTotalDominical}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="ninosdominical">Niños (1 a 12 años)</label>
              <div class="input-with-icon">
                <i class="fas fa-heart"></i>
                <input
                  id="ninosdominical"
                  type="number"
                  bind:value={planilla.ninosdominical}
                  on:input={calcularTotalDominical}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div class="form-group highlight">
              <label for="totalasistencia">Total asistencia</label>
              <div class="total-display">
                <i class="fas fa-calculator"></i>
                <span class="total-amount">{planilla.total_dominical}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 9: Liderazgo -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-users"></i>
            <h3>LIDERAZGO</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="lidercasa">Lider casa de vida</label>
              <div class="input-with-icon">
                <i class="fas fa-user-tie"></i>
                <input
                  id="lidercasa"
                  type="text"
                  bind:value={planilla.lidercasa}
                  placeholder="Lider casa de vida"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="lider">Lider</label>
              <div class="input-with-icon">
                <i class="fas fa-user-cog"></i>
                <input
                  id="lider"
                  type="text"
                  bind:value={planilla.lider}
                  placeholder="lider"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="aprendiz">Aprendiz</label>
              <div class="input-with-icon">
                <i class="fas fa-user-friends"></i>
                <input
                  id="aprendiz"
                  type="text"
                  bind:value={planilla.aprendiz}
                  placeholder="aprendiz"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="maestrninos">Maestro niños</label>
              <div class="input-with-icon">
                <i class="fas fa-hands-helping"></i>
                <input
                  id="maestrninos"
                  type="text"
                  bind:value={planilla.maestrninos}
                  placeholder="Maestro niños"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="anfitrion">Anfitrión</label>
              <div class="input-with-icon">
                <i class="fas fa-user-check"></i>
                <input
                  id="anfitrion"
                  type="text"
                  bind:value={planilla.anfitrion}
                  placeholder="anfitrion"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 10: Novedades -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-chart-line"></i>
            <h3>NOVEDADES</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="direccion">Direccion</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt"></i>
                <input
                  id="direccion"
                  type="text"
                  bind:value={planilla.direccion}
                  placeholder="direccion"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="telefono">Telefono</label>
              <div class="input-with-icon">
                <i class="fas fa-phone"></i>
                <input
                  id="telefono"
                  type="text"
                  bind:value={planilla.telefono}
                  placeholder="telefono"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="diahora">Dia y hora</label>
              <div class="input-with-icon">
                <i class="fas fa-clock"></i>
                <input
                  id="diahora"
                  type="text"
                  bind:value={planilla.diahora}
                  placeholder="dia y hora"
                />
              </div>
            </div>
            
            <div class="form-group wide">
              <label for="observaciones">Observaciones</label>
              <div class="input-with-icon">
                <i class="fas fa-comment-alt"></i>
                <input
                  id="observaciones"
                  type="text"
                  bind:value={planilla.observaciones}
                  placeholder="observaciones"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmación y Envío -->
        <div class="form-section submit-section">
          <div class="confirmation-check">
            <input
              type="checkbox"
              id="confirmationCheck"
              class="modern-checkbox"
              required
            />
            <label for="confirmationCheck">
              <i class="fas fa-shield-alt"></i>
              He revisado y estoy seguro de la información suministrada
            </label>
          </div>

          <div class="submit-actions">
            <button
              type="submit"
              class="submit-button {isSubmitting ? 'loading' : ''}"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <i class="fas fa-spinner fa-spin"></i>
                <span>Enviando...</span>
              {:else}
                <i class="fas fa-paper-plane"></i>
                <span>Enviar Reporte a BD y WhatsApp</span>
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</main>

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
    --text-light: #ffffff;
    --text-dark: #333333;
    --text-muted: #6c757d;
    --border-color: #dee2e6;
    --card-bg: #ffffff;
    --card-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Contenedor principal */
  .modern-form-container {
    padding: 1.5rem;
    min-height: 100vh;
  }

  .form-wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Tarjeta principal */
  .modern-card {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: var(--transition);
  }

  /* Header del formulario */
  .form-header {
    background: linear-gradient(135deg, var(--bg-dark) 0%, #444 100%);
    padding: 2rem;
    color: var(--text-light);
  }

  .header-logo {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .logo-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary-color);
    padding: 3px;
  }

  .header-title h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
  }

  /* Formulario */
  .modern-form {
    padding: 2rem;
  }

  /* Secciones del formulario */
  .form-section {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .form-section:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .section-header i {
    font-size: 1.5rem;
    color: var(--primary-color);
    background: rgba(146, 174, 131, 0.1);
    padding: 0.75rem;
    border-radius: 50%;
  }

  .section-header h3 {
    font-size: 1.25rem;
    color: var(--text-dark);
    font-weight: 600;
    margin: 0;
  }

  /* Grid del formulario */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .form-group.wide {
    grid-column: 1 / -1;
  }

  /* Grupos de formulario */
  .form-group {
    position: relative;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.9rem;
  }

  /* Inputs con iconos */
  .input-with-icon,
  .select-with-icon {
    position: relative;
  }

  .input-with-icon i,
  .select-with-icon i:first-child {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 1rem;
    z-index: 1;
    transition: var(--transition);
  }

  .input-with-icon input,
  .select-with-icon select {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    transition: var(--transition);
    background: var(--bg-light);
  }

  .input-with-icon input:focus,
  .select-with-icon select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(146, 174, 131, 0.1);
  }

  .input-with-icon.currency {
    position: relative;
  }

  .input-with-icon.currency .currency-symbol {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-weight: 500;
  }

  .select-with-icon .select-arrow {
    left: auto;
    right: 1rem;
    pointer-events: none;
  }

  .select-with-icon select {
    appearance: none;
    cursor: pointer;
  }

  /* Display de total */
  .total-display {
    padding: 1rem;
    background: linear-gradient(135deg, rgba(146, 174, 131, 0.1) 0%, rgba(86, 4, 248, 0.1) 100%);
    border: 2px solid var(--primary-color);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color);
  }

  .total-display i {
    font-size: 1.5rem;
  }

  .total-amount {
    flex: 1;
    text-align: right;
  }

  /* Checkbox moderno */
  .confirmation-check {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .modern-checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid var(--border-color);
    appearance: none;
    cursor: pointer;
    position: relative;
    transition: var(--transition);
  }

  .modern-checkbox:checked {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }

  .modern-checkbox:checked::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.8rem;
  }

  .confirmation-check label {
    cursor: pointer;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  /* Botón de enviar */
  .submit-actions {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .submit-button {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-width: 300px;
    align-self: center;
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(146, 174, 131, 0.3);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .submit-button.loading {
    opacity: 0.8;
  }

  /* Notificaciones modernas */
  .modern-notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  }

  .modern-notification {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    min-width: 350px;
    max-width: 400px;
    color: white;
    background: var(--info-color);
  }

  .modern-notification.success {
    background: linear-gradient(135deg, var(--success-color) 0%, #45a049 100%);
  }

  .modern-notification.error {
    background: linear-gradient(135deg, var(--error-color) 0%, #d32f2f 100%);
  }

  .modern-notification.info {
    background: linear-gradient(135deg, var(--info-color) 0%, #1976d2 100%);
  }

  .notification-icon {
    font-size: 1.5rem;
  }

  .notification-message {
    flex: 1;
    font-weight: 500;
  }

  .notification-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
  }

  .notification-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .modern-form-container {
      padding: 1rem;
    }

    .form-header {
      padding: 1.5rem;
    }

    .header-logo {
      flex-direction: column;
      text-align: center;
    }

    .header-title h1 {
      font-size: 1.5rem;
    }

    .modern-form {
      padding: 1.5rem;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .submit-button {
      min-width: auto;
      width: 100%;
    }

    .modern-notification {
      min-width: calc(100vw - 40px);
      max-width: calc(100vw - 40px);
    }
  }

  @media (max-width: 480px) {
    .form-header {
      padding: 1rem;
    }

    .modern-form {
      padding: 1rem;
    }

    .form-section {
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  /* Animaciones */
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>