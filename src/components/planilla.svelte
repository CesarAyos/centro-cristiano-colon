<script>
  import { supabase } from "../components/supabase.js";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  // Variables del formulario
  let planilla = {
    PASTOR_SUPERVISOR: "",
    grupobiblico: "",
    COORDINADOR_DPTO: "",
    SUPERVISOR_DE_RED: "",
    FELIPE_DE_RED: "",
    FELIPE_LIDER: "",
    Asistencia_vea: "",
    asistentes: "",
    Felipes: "",
    Etiopes: "",
    novedades: "",
    Amigos: "",
    Ninos: "",
    Ausentes: "",
    Convertidos_adultos: "",
    Convertidos_ninos: "",
    Reconciliados: "",
    Diezmos: "",
    Ofrendas: "",
    Total_financiero: "0",
    Participacion_Mision_Amigo: "",
    Participacion_Consolidacion: "",
    Participacion_Discipulado_1: "",
    Participacion_Discipulado_2: "",
    Asistencia_a_la_Escuela_de_Liderazgo: "",
    asistencia_hermanos: "",
    Asistencia_de_Amigos: "",
    Asistencia_de_Ninos: "",
  };

  // Variables de estado
  let formValid = false;
  let isSubmitting = false;
  let touchedFields = {};
  
  // Variables para notificaciones
  let mostrarNotif = false;
  let mensajeNotif = "";
  let tipoNotif = "success"; // success, error, info

  // Grupos bíblicos disponibles
  const gruposBiblicos = [
    { value: 'agente-de-paz', label: 'Agente de Paz' },
    { value: 'alfa-y-omega', label: 'Alfa y Omega' },
    { value: 'belen', label: 'Belén' },
    { value: 'betel', label: 'Betel' },
    { value: 'elohim', label: 'Elohim' },
    { value: 'emanuel', label: 'Emanuel' },
    { value: 'juda', label: 'Judá' },
    { value: 'jireth', label: 'Jireth' }
  ];

  // Función para calcular total financiero
  const calcularTotalFinanciero = () => {
    const diezmos = parseFloat(planilla.Diezmos) || 0;
    const ofrendas = parseFloat(planilla.Ofrendas) || 0;
    planilla.Total_financiero = (diezmos + ofrendas).toFixed(2);
  };

  // Función para marcar campo como tocado
  const marcarCampoTocado = (fieldName) => {
    touchedFields[fieldName] = true;
    validarFormulario();
  };

  // Función para validar el formulario
  const validarFormulario = () => {
    const requiredFields = [
      'PASTOR_SUPERVISOR', 'grupobiblico', 'COORDINADOR_DPTO', 
      'SUPERVISOR_DE_RED', 'FELIPE_DE_RED', 'FELIPE_LIDER', 
      'Asistencia_vea', 'asistentes', 'Felipes', 'Etiopes', 
      'novedades', 'Amigos', 'Ninos', 'Ausentes', 
      'Convertidos_adultos', 'Convertidos_ninos', 'Reconciliados',
      'Diezmos', 'Ofrendas', 'Participacion_Mision_Amigo', 
      'Participacion_Consolidacion', 'Participacion_Discipulado_1', 
      'Participacion_Discipulado_2', 'Asistencia_a_la_Escuela_de_Liderazgo',
      'asistencia_hermanos', 'Asistencia_de_Amigos', 'Asistencia_de_Ninos'
    ];
    
    formValid = requiredFields.every(field => {
      const value = planilla[field];
      return value !== null && value !== undefined && value.toString().trim() !== '';
    });
  };

  // Función para mostrar notificación
  const mostrarNotificacion = (mensaje = "✅ Reporte enviado exitosamente a la base de datos y WhatsApp.", tipo = "success") => {
    mensajeNotif = mensaje;
    tipoNotif = tipo;
    mostrarNotif = true;
    
    // Ocultar la notificación después de 4 segundos
    setTimeout(() => {
      mostrarNotif = false;
    }, 4000);
  };

  // Función para limpiar el formulario
  const Clear = () => {
    planilla = {
      PASTOR_SUPERVISOR: "",
      grupobiblico: "",
      COORDINADOR_DPTO: "",
      SUPERVISOR_DE_RED: "",
      FELIPE_DE_RED: "",
      FELIPE_LIDER: "",
      Asistencia_vea: "",
      asistentes: "",
      Felipes: "",
      Etiopes: "",
      novedades: "",
      Amigos: "",
      Ninos: "",
      Ausentes: "",
      Convertidos_adultos: "",
      Convertidos_ninos: "",
      Reconciliados: "",
      Diezmos: "",
      Ofrendas: "",
      Total_financiero: "0",
      Participacion_Mision_Amigo: "",
      Participacion_Consolidacion: "",
      Participacion_Discipulado_1: "",
      Participacion_Discipulado_2: "",
      Asistencia_a_la_Escuela_de_Liderazgo: "",
      asistencia_hermanos: "",
      Asistencia_de_Amigos: "",
      Asistencia_de_Ninos: "",
    };
    touchedFields = {};
    validarFormulario();
  };

  // Función para insertar en Supabase
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
        
        // Enviar a WhatsApp inmediatamente después de guardar en BD
        enviarAWhatsApp();
        
        // Mostrar notificación de éxito
        mostrarNotificacion();
        
        // Limpiar formulario después de 1 segundo
        setTimeout(() => {
          Clear();
        }, 1000);
      }
    } catch (error) {
      console.error("Error general:", error.message);
      mostrarNotificacion("❌ Ocurrió un error al procesar la solicitud", "error");
    } finally {
      isSubmitting = false;
    }
  };

  // Función para manejar el submit
  const onSubmitHandlers = (event) => {
    event.preventDefault();
    
    if (!formValid) {
      mostrarNotificacion("❌ Por favor, completa todos los campos requeridos", "error");
      return;
    }
    
    insertPlanilla();
  };

  // Función para solicitar permiso de notificaciones
  const solicitarPermisoNotificacion = async () => {
    if (!("Notification" in window)) {
      console.error("Este navegador no soporta notificaciones de escritorio.");
    } else if (Notification.permission === "granted") {
      console.log("Permiso de notificación ya otorgado.");
    } else if (Notification.permission !== "denied") {
      const permiso = await Notification.requestPermission();
      if (permiso === "granted") {
        console.log("Permiso de notificación otorgado.");
      } else {
        console.error("Permiso de notificación denegado.");
      }
    }
  };

  // Función para forzar la apertura de WhatsApp
  const forzarAperturaWhatsApp = (numero, mensaje) => {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    
    // Intentar múltiples métodos
    try {
      // Método 1: window.open
      const nuevaVentana = window.open(url, '_blank');
      if (nuevaVentana) {
        return true;
      }
    } catch (error) {
      console.log('Método 1 falló:', error);
    }
    
    try {
      // Método 2: window.location.href
      window.location.href = url;
      return true;
    } catch (error) {
      console.log('Método 2 falló:', error);
    }
    
    try {
      // Método 3: Crear iframe temporal
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
      
      return true;
    } catch (error) {
      console.log('Método 3 falló:', error);
    }
    
    return false;
  };

  // Función para enviar a WhatsApp
  const enviarAWhatsApp = () => {
    const numero = "584247187229";
    
    // Crear mensaje más simple y compatible
    const mensajeTexto = `📄 Reporte del Grupo Bíblico

🔹 Pastor Supervisor: ${planilla.PASTOR_SUPERVISOR}
🔹 Grupo Bíblico: ${planilla.grupobiblico}
🏅 Coordinador Dpto: ${planilla.COORDINADOR_DPTO}
🔰 Supervisor de Red: ${planilla.SUPERVISOR_DE_RED}
🏆 Felipe de Red: ${planilla.FELIPE_DE_RED}
⭐ Felipe Líder: ${planilla.FELIPE_LIDER}

👥 Asistencia
✅ VEA: ${planilla.Asistencia_vea}
✅ Asistentes: ${planilla.asistentes}
👤 Felipes: ${planilla.Felipes}
👥 Etíopes: ${planilla.Etiopes}
📝 Novedades: ${planilla.novedades}

🤝 Participación
🎯 Misión Amigo: ${planilla.Participacion_Mision_Amigo}
🔄 Consolidación: ${planilla.Participacion_Consolidacion}
📖 Discipulado 1: ${planilla.Participacion_Discipulado_1}
📖 Discipulado 2: ${planilla.Participacion_Discipulado_2}
🏫 Escuela de Liderazgo: ${planilla.Asistencia_a_la_Escuela_de_Liderazgo}

💰 Finanzas
💵 Diezmos: ${planilla.Diezmos}
💸 Ofrendas: ${planilla.Ofrendas}
💳 Total Financiero: ${planilla.Total_financiero}

🙌 Asistencia General
🙋‍♂️ Hermanos: ${planilla.asistencia_hermanos}
🧑‍🤝‍🧑 Amigos: ${planilla.Asistencia_de_Amigos}
👶 Niños: ${planilla.Asistencia_de_Ninos}`;

    const mensaje = encodeURIComponent(mensajeTexto);

    // Método más agresivo para asegurar que funcione desde la primera vez
    if (!forzarAperturaWhatsApp(numero, mensajeTexto)) {
      // Si todos los métodos fallan, copiar al portapapeles
      if (navigator.clipboard) {
        navigator.clipboard.writeText(mensajeTexto).then(() => {
          mostrarNotificacion(`📱 Mensaje copiado al portapapeles! Número: ${numero}`, "info");
        });
      } else {
        mostrarNotificacion(`📱 Para enviar: Número ${numero} - Mensaje copiado`, "info");
      }
    }
  };

  // Inicialización
  onMount(() => {
    solicitarPermisoNotificacion();
    validarFormulario();
  });
</script>

<main class="modern-form-container">
  <!-- Notificación moderna -->
  {#if mostrarNotif}
    <div class="modern-notification-container" in:fade out:fade>
      <div class="modern-notification {tipoNotif}">
        <div class="notification-icon">
          {#if tipoNotif === 'success'}
            <i class="fas fa-check-circle"></i>
          {:else if tipoNotif === 'error'}
            <i class="fas fa-exclamation-circle"></i>
          {:else}
            <i class="fas fa-info-circle"></i>
          {/if}
        </div>
        <span class="notification-message">{mensajeNotif}</span>
        <button class="notification-close" on:click={() => mostrarNotif = false}>
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
          <img src="/logo.png" alt="Centro Cristiano Colón" class="logo-image" />
          <div class="header-title">
            <h1>REPORTE DE GRUPO BÍBLICO</h1>
            <p class="header-subtitle">Complete el formulario con la información del reporte</p>
          </div>
        </div>
        <div class="header-status">
          <div class="status-indicator {formValid ? 'valid' : 'invalid'}">
            <i class="fas {formValid ? 'fa-check' : 'fa-exclamation'}"></i>
            <span>{formValid ? 'Formulario completo' : 'Campos pendientes'}</span>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <form on:submit|preventDefault={onSubmitHandlers} class="modern-form">
        <!-- Sección 1: Información del Liderazgo -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-users"></i>
            <h3>INFORMACIÓN DEL LIDERAZGO</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group" class:has-value={planilla.PASTOR_SUPERVISOR} class:touched={touchedFields.PASTOR_SUPERVISOR}>
              <label for="pastorSupervisor">Pastor Supervisor</label>
              <div class="input-with-icon">
                <i class="fas fa-user-tie"></i>
                <input
                  id="pastorSupervisor"
                  type="text"
                  bind:value={planilla.PASTOR_SUPERVISOR}
                  on:blur={() => marcarCampoTocado('PASTOR_SUPERVISOR')}
                  placeholder="Ingrese el nombre del pastor supervisor"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.COORDINADOR_DPTO} class:touched={touchedFields.COORDINADOR_DPTO}>
              <label for="coordinador">Coordinador de Departamento</label>
              <div class="input-with-icon">
                <i class="fas fa-user-cog"></i>
                <input
                  id="coordinador"
                  type="text"
                  bind:value={planilla.COORDINADOR_DPTO}
                  on:blur={() => marcarCampoTocado('COORDINADOR_DPTO')}
                  placeholder="Ingrese el nombre del coordinador"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.SUPERVISOR_DE_RED} class:touched={touchedFields.SUPERVISOR_DE_RED}>
              <label for="supervisorRed">Supervisor de Red</label>
              <div class="input-with-icon">
                <i class="fas fa-user-friends"></i>
                <input
                  id="supervisorRed"
                  type="text"
                  bind:value={planilla.SUPERVISOR_DE_RED}
                  on:blur={() => marcarCampoTocado('SUPERVISOR_DE_RED')}
                  placeholder="Ingrese el nombre del supervisor"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.FELIPE_DE_RED} class:touched={touchedFields.FELIPE_DE_RED}>
              <label for="felipeRed">Felipe de Red</label>
              <div class="input-with-icon">
                <i class="fas fa-hands-helping"></i>
                <input
                  id="felipeRed"
                  type="text"
                  bind:value={planilla.FELIPE_DE_RED}
                  on:blur={() => marcarCampoTocado('FELIPE_DE_RED')}
                  placeholder="Ingrese el nombre del felipe"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.FELIPE_LIDER} class:touched={touchedFields.FELIPE_LIDER}>
              <label for="felipeLider">Felipe Líder</label>
              <div class="input-with-icon">
                <i class="fas fa-user-check"></i>
                <input
                  id="felipeLider"
                  type="text"
                  bind:value={planilla.FELIPE_LIDER}
                  on:blur={() => marcarCampoTocado('FELIPE_LIDER')}
                  placeholder="Ingrese el nombre del líder"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.grupobiblico} class:touched={touchedFields.grupobiblico}>
              <label for="grupoBiblico">Grupo Bíblico</label>
              <div class="select-with-icon">
                <i class="fas fa-church"></i>
                <select
                  id="grupoBiblico"
                  bind:value={planilla.grupobiblico}
                  on:change={() => marcarCampoTocado('grupobiblico')}
                  required
                >
                  <option value="" disabled selected>Seleccione un grupo</option>
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
            <h3>ASISTENCIA Y ESTADÍSTICAS</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group" class:has-value={planilla.Asistencia_vea} class:touched={touchedFields.Asistencia_vea}>
              <label for="asistenciaVea">Asistencia VEA</label>
              <div class="input-with-icon">
                <i class="fas fa-calendar-check"></i>
                <input
                  id="asistenciaVea"
                  type="number"
                  bind:value={planilla.Asistencia_vea}
                  on:blur={() => marcarCampoTocado('Asistencia_vea')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.asistentes} class:touched={touchedFields.asistentes}>
              <label for="asistentesGB">Asistencia Grupo Bíblico</label>
              <div class="input-with-icon">
                <i class="fas fa-users"></i>
                <input
                  id="asistentesGB"
                  type="number"
                  bind:value={planilla.asistentes}
                  on:blur={() => marcarCampoTocado('asistentes')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Felipes} class:touched={touchedFields.Felipes}>
              <label for="felipes">Felipes</label>
              <div class="input-with-icon">
                <i class="fas fa-user-graduate"></i>
                <input
                  id="felipes"
                  type="number"
                  bind:value={planilla.Felipes}
                  on:blur={() => marcarCampoTocado('Felipes')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Etiopes} class:touched={touchedFields.Etiopes}>
              <label for="etiopes">Etiopes</label>
              <div class="input-with-icon">
                <i class="fas fa-user-tag"></i>
                <input
                  id="etiopes"
                  type="number"
                  bind:value={planilla.Etiopes}
                  on:blur={() => marcarCampoTocado('Etiopes')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Amigos} class:touched={touchedFields.Amigos}>
              <label for="amigos">Amigos</label>
              <div class="input-with-icon">
                <i class="fas fa-handshake"></i>
                <input
                  id="amigos"
                  type="number"
                  bind:value={planilla.Amigos}
                  on:blur={() => marcarCampoTocado('Amigos')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Ninos} class:touched={touchedFields.Ninos}>
              <label for="ninosGB">Niños Grupo Bíblico</label>
              <div class="input-with-icon">
                <i class="fas fa-child"></i>
                <input
                  id="ninosGB"
                  type="number"
                  bind:value={planilla.Ninos}
                  on:blur={() => marcarCampoTocado('Ninos')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Ausentes} class:touched={touchedFields.Ausentes}>
              <label for="ausentes">Ausentes</label>
              <div class="input-with-icon">
                <i class="fas fa-user-times"></i>
                <input
                  id="ausentes"
                  type="number"
                  bind:value={planilla.Ausentes}
                  on:blur={() => marcarCampoTocado('Ausentes')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Convertidos_adultos} class:touched={touchedFields.Convertidos_adultos}>
              <label for="convertidosAdultos">Adultos Convertidos</label>
              <div class="input-with-icon">
                <i class="fas fa-pray"></i>
                <input
                  id="convertidosAdultos"
                  type="number"
                  bind:value={planilla.Convertidos_adultos}
                  on:blur={() => marcarCampoTocado('Convertidos_adultos')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Convertidos_ninos} class:touched={touchedFields.Convertidos_ninos}>
              <label for="convertidosNinos">Niños Convertidos</label>
              <div class="input-with-icon">
                <i class="fas fa-hands-praying"></i>
                <input
                  id="convertidosNinos"
                  type="number"
                  bind:value={planilla.Convertidos_ninos}
                  on:blur={() => marcarCampoTocado('Convertidos_ninos')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Reconciliados} class:touched={touchedFields.Reconciliados}>
              <label for="reconciliados">Reconciliados</label>
              <div class="input-with-icon">
                <i class="fas fa-heart"></i>
                <input
                  id="reconciliados"
                  type="number"
                  bind:value={planilla.Reconciliados}
                  on:blur={() => marcarCampoTocado('Reconciliados')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group wide" class:has-value={planilla.novedades} class:touched={touchedFields.novedades}>
              <label for="novedades">Novedades</label>
              <div class="input-with-icon">
                <i class="fas fa-sticky-note"></i>
                <input
                  id="novedades"
                  type="text"
                  bind:value={planilla.novedades}
                  on:blur={() => marcarCampoTocado('novedades')}
                  placeholder="Ingrese las novedades del grupo"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 3: Finanzas -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-coins"></i>
            <h3>FINANZAS</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group" class:has-value={planilla.Diezmos} class:touched={touchedFields.Diezmos}>
              <label for="diezmos">Diezmos</label>
              <div class="input-with-icon currency">
                <i class="fas fa-hand-holding-usd"></i>
                <input
                  id="diezmos"
                  type="number"
                  bind:value={planilla.Diezmos}
                  on:input={() => {
                    marcarCampoTocado('Diezmos');
                    calcularTotalFinanciero();
                  }}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                <span class="currency-symbol">$</span>
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Ofrendas} class:touched={touchedFields.Ofrendas}>
              <label for="ofrendas">Ofrendas</label>
              <div class="input-with-icon currency">
                <i class="fas fa-donate"></i>
                <input
                  id="ofrendas"
                  type="number"
                  bind:value={planilla.Ofrendas}
                  on:input={() => {
                    marcarCampoTocado('Ofrendas');
                    calcularTotalFinanciero();
                  }}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                <span class="currency-symbol">$</span>
              </div>
            </div>

            <div class="form-group highlight" class:has-value={planilla.Total_financiero}>
              <label for="totalFinanciero">Total Financiero</label>
              <div class="total-display">
                <i class="fas fa-calculator"></i>
                <span class="total-amount">${planilla.Total_financiero}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 4: Participaciones -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-chart-bar"></i>
            <h3>PARTICIPACIONES</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group" class:has-value={planilla.Participacion_Mision_Amigo} class:touched={touchedFields.Participacion_Mision_Amigo}>
              <label for="misionAmigo">Misión Amigo</label>
              <div class="input-with-icon">
                <i class="fas fa-user-plus"></i>
                <input
                  id="misionAmigo"
                  type="number"
                  bind:value={planilla.Participacion_Mision_Amigo}
                  on:blur={() => marcarCampoTocado('Participacion_Mision_Amigo')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Participacion_Consolidacion} class:touched={touchedFields.Participacion_Consolidacion}>
              <label for="consolidacion">Consolidación</label>
              <div class="input-with-icon">
                <i class="fas fa-link"></i>
                <input
                  id="consolidacion"
                  type="number"
                  bind:value={planilla.Participacion_Consolidacion}
                  on:blur={() => marcarCampoTocado('Participacion_Consolidacion')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Participacion_Discipulado_1} class:touched={touchedFields.Participacion_Discipulado_1}>
              <label for="discipulado1">Discipulado 1</label>
              <div class="input-with-icon">
                <i class="fas fa-book-open"></i>
                <input
                  id="discipulado1"
                  type="number"
                  bind:value={planilla.Participacion_Discipulado_1}
                  on:blur={() => marcarCampoTocado('Participacion_Discipulado_1')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Participacion_Discipulado_2} class:touched={touchedFields.Participacion_Discipulado_2}>
              <label for="discipulado2">Discipulado 2</label>
              <div class="input-with-icon">
                <i class="fas fa-graduation-cap"></i>
                <input
                  id="discipulado2"
                  type="number"
                  bind:value={planilla.Participacion_Discipulado_2}
                  on:blur={() => marcarCampoTocado('Participacion_Discipulado_2')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Asistencia_a_la_Escuela_de_Liderazgo} class:touched={touchedFields.Asistencia_a_la_Escuela_de_Liderazgo}>
              <label for="escuelaLiderazgo">Escuela de Liderazgo</label>
              <div class="input-with-icon">
                <i class="fas fa-user-graduate"></i>
                <input
                  id="escuelaLiderazgo"
                  type="number"
                  bind:value={planilla.Asistencia_a_la_Escuela_de_Liderazgo}
                  on:blur={() => marcarCampoTocado('Asistencia_a_la_Escuela_de_Liderazgo')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 5: Reunión Dominical -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-church"></i>
            <h3>REUNIÓN DOMINICAL</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group" class:has-value={planilla.asistencia_hermanos} class:touched={touchedFields.asistencia_hermanos}>
              <label for="hermanosIglesia">Hermanos en la Iglesia</label>
              <div class="input-with-icon">
                <i class="fas fa-user-friends"></i>
                <input
                  id="hermanosIglesia"
                  type="number"
                  bind:value={planilla.asistencia_hermanos}
                  on:blur={() => marcarCampoTocado('asistencia_hermanos')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Asistencia_de_Amigos} class:touched={touchedFields.Asistencia_de_Amigos}>
              <label for="amigosIglesia">Amigos en la Iglesia</label>
              <div class="input-with-icon">
                <i class="fas fa-handshake"></i>
                <input
                  id="amigosIglesia"
                  type="number"
                  bind:value={planilla.Asistencia_de_Amigos}
                  on:blur={() => marcarCampoTocado('Asistencia_de_Amigos')}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="form-group" class:has-value={planilla.Asistencia_de_Ninos} class:touched={touchedFields.Asistencia_de_Ninos}>
              <label for="ninosIglesia">Niños en la Iglesia</label>
              <div class="input-with-icon">
                <i class="fas fa-child"></i>
                <input
                  id="ninosIglesia"
                  type="number"
                  bind:value={planilla.Asistencia_de_Ninos}
                  on:blur={() => marcarCampoTocado('Asistencia_de_Ninos')}
                  min="0"
                  placeholder="0"
                  required
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
              required
              class="modern-checkbox"
            />
            <label for="confirmationCheck">
              <i class="fas fa-shield-alt"></i>
              He revisado y estoy seguro de la información suministrada
            </label>
          </div>

          <div class="submit-actions">
            <button 
              type="submit" 
              class="submit-button"
              disabled={!formValid || isSubmitting}
              class:loading={isSubmitting}
            >
              {#if isSubmitting}
                <i class="fas fa-spinner fa-spin"></i>
                <span>Enviando...</span>
              {:else}
                <i class="fas fa-paper-plane"></i>
                <span>Enviar Reporte a BD y WhatsApp</span>
              {/if}
            </button>
            
            <div class="form-stats">
              <div class="stat-item">
                <i class="fas fa-check-circle"></i>
                <span>Campos completados: {Object.values(planilla).filter(v => v && v.toString().trim() !== '' && v !== '0').length}/28</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
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
    --success-color: #4CAF50;
    --error-color: #f44336;
    --warning-color: #FF9800;
    --info-color: #2196F3;
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
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
  
  .header-status {
    display: flex;
    justify-content: flex-end;
  }
  
  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .status-indicator.valid {
    background: rgba(76, 175, 80, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  .status-indicator.invalid {
    background: rgba(255, 152, 0, 0.1);
    color: var(--warning-color);
    border: 1px solid rgba(255, 152, 0, 0.3);
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
    transition: var(--transition);
  }
  
  .form-group:focus-within label {
    color: var(--primary-color);
  }
  
  .form-group.touched:not(.has-value) label {
    color: var(--error-color);
  }
  
  /* Inputs con iconos */
  .input-with-icon, .select-with-icon {
    position: relative;
  }
  
  .input-with-icon i, .select-with-icon i:first-child {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 1rem;
    z-index: 1;
    transition: var(--transition);
  }
  
  .input-with-icon input, .select-with-icon select {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    transition: var(--transition);
    background: var(--bg-light);
  }
  
  .input-with-icon input:focus, .select-with-icon select:focus {
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
    content: '✓';
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
  
  /* Estadísticas del formulario */
  .form-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  
  .stat-item i {
    font-size: 1rem;
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
    background: linear-gradient(135deg, var(--info-color) 0%, #1976D2 100%);
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
    
    .form-stats {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
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