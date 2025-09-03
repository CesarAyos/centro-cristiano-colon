<script>
  import { supabase } from "../components/supabase.js";
  import { onMount } from "svelte";

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
    Total_financiero: "",
    Participacion_Mision_Amigo: "",
    Participacion_Consolidacion: "",
    Participacion_Discipulado_1: "",
    Participacion_Discipulado_2: "",
    Asistencia_a_la_Escuela_de_Liderazgo: "",
    asistencia_hermanos: "",
    Asistencia_de_Amigos: "",
    Asistencia_de_Ninos: "",
  };

  // Variables para notificaciones
  let mostrarNotif = false;
  let mensajeNotif = "";
  let tipoNotif = "success"; // success, error, info

  const onSubmitHandlers = () => {
    insertPlanilla();
    Clear();
  };

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
      Total_financiero: "",
      Participacion_Mision_Amigo: "",
      Participacion_Consolidacion: "",
      Participacion_Discipulado_1: "",
      Participacion_Discipulado_2: "",
      Asistencia_a_la_Escuela_de_Liderazgo: "",
      asistencia_hermanos: "",
      Asistencia_de_Amigos: "",
      Asistencia_de_Ninos: "",
    };
  };

  onMount(() => {
    solicitarPermisoNotificacion();
  });
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

  const mostrarNotificacion = (mensaje = "✅ Reporte enviado exitosamente a la base de datos y WhatsApp.", tipo = "success") => {
    mensajeNotif = mensaje;
    tipoNotif = tipo;
    mostrarNotif = true;
    
    // Ocultar la notificación después de 4 segundos
    setTimeout(() => {
      mostrarNotif = false;
    }, 4000);
  };

 const insertPlanilla = async () => {
  try {
    const { data, error } = await supabase
      .from("planilla")
      .insert([planilla])
      .select();

    if (error) {
      console.error("Error al insertar datos:", error.message, error.details);
      mostrarNotificacion("❌ Error al enviar los datos", "error");
      return; // Salimos si hay error
    } else {
      console.log("Datos insertados con éxito:", data);
      planilla = data[0] || planilla;
      
      // Enviar a WhatsApp inmediatamente después de guardar en BD
      enviarAWhatsApp();
      
      // Mostrar notificación inmediatamente
      mostrarNotificacion();
    }
  } catch (error) {
    console.error("Error general:", error.message);
    mostrarNotificacion("❌ Ocurrió un error al procesar la solicitud", "error");
  }
};

  function calcularResultado() {
    planilla.Total_financiero = planilla.Ofrendas + planilla.Diezmos;
  }

  // Función para detectar si estamos en App24Creator
  const isApp24Creator = () => {
    return window.navigator.userAgent.includes('App24Creator') || 
           window.navigator.userAgent.includes('WebView') ||
           window.navigator.userAgent.includes('Android') && window.navigator.userAgent.includes('Mobile');
  };

  // Función para abrir WhatsApp de manera más confiable
  const abrirWhatsApp = (numero, mensaje) => {
    try {
      // Método 1: Crear un elemento <a> temporal
      const link = document.createElement('a');
      link.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Agregar al DOM temporalmente
      document.body.appendChild(link);
      
      // Hacer clic en el enlace
      link.click();
      
      // Remover el elemento temporal después de un pequeño delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Error en abrirWhatsApp:', error);
      return false;
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

  const enviarAWhatsApp = () => {
  const numero = "584247187229";
  
  // Crear mensaje más simple y compatible (sin asteriscos para evitar problemas)
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
  const url = `https://wa.me/${numero}?text=${mensaje}`;

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
</script>

<main class="">
  <!-- Notificación elegante -->
  {#if mostrarNotif}
    <div class="notification-container">
      <div class="notification {tipoNotif}">
        <span class="notification-message">{mensajeNotif}</span>
        <button class="notification-close" on:click={() => mostrarNotif = false}>×</button>
      </div>
    </div>
  {/if}

  <div class="container d-flex justify-content-center mt-3 mb-3 movil">
    <div
      class="card bg-body-secondary"
      style="width: 70rem; box-shadow: 10px 10px 5px 0px rgba(54,130,123,0.75);"
    >
      <div style="background:#333333">
        <div
          class="d-flex justify-content-center m-2"
          style="background:#333333"
        >
          <img
            src="/logo.png"
            alt="logo"
            class="logo-form"
            style="height: 50px;"
          />
        </div>
        <h2 class="d-flex justify-content-center m-2 text-white">
          REPORTES DE GRUPOS BIBLICOS
        </h2>
      </div>
      <div class="card-body" style="background:#333333;">
        <form on:submit|preventDefault={onSubmitHandlers} class="row g-3">
          <div class="form-group col-md-6">
            <input
              type="text"
              bind:value={planilla.PASTOR_SUPERVISOR}
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              placeholder="Pastor Supervisor"
              title="Pastor Supervisor"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.COORDINADOR_DPTO}
              placeholder="Coordinador de departamento"
              title="Coordinador de departamento"
              required
            />
          </div>
          <div class="form-group col-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.SUPERVISOR_DE_RED}
              placeholder="Supervisor de red"
              title="Supervir de red"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.FELIPE_DE_RED}
              placeholder="Felipe de red"
              title="Felipe de red"
              required
            />
          </div>

          <div class="form-group col-md-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.FELIPE_LIDER}
              placeholder="felipe lider"
              title="felipe lider"
              required
            />
          </div>

          <div class="form-group col-md-6">
            <select
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.grupobiblico}
              required
            >
              <option value="" disabled selected
                >Selecciona el grupo bíblico</option
              >
              <option value="agente-de-paz">Agente de paz</option>
              <option value="alfa-y-omega">Alfa y Omega</option>
              <option value="belen">Belén</option>
              <option value="betel">Betel</option>
              <option value="elohim">Elohim</option>
              <option value="Emanuel">Emanuel</option>
              <option value="juda">Judá</option>
              <option value="jireth">Jireth</option>
              
            </select>
          </div>

          <div class="form-group col-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Asistencia_vea}
              placeholder="asistencia en el vea"
              title="asistencia en el vea"
              required
            />
          </div>
          <div class="form-group col-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.asistentes}
              placeholder="asistencia Grupo Biblico"
              title="asistencia Grupo biblico"
              required
            />
          </div>
          <div class="form-group col-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Felipes}
              placeholder="felipes"
              title="felipes"
              required
            />
          </div>
          <div class="form-group col-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Etiopes}
              placeholder="Etiopes"
              title="Etiopes"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.novedades}
              placeholder="Novedades"
              title="Novedades"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Amigos}
              placeholder="Amigos"
              title="Amigos"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Ninos}
              placeholder="Niños Grupo biblico"
              title="Niños Grupo biblico"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Ausentes}
              placeholder="Ausentes"
              title="Ausentes"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Convertidos_adultos}
              placeholder="Adultos convertidos"
              title="Adultos convertidos"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Convertidos_ninos}
              placeholder="Niños Convertidos"
              title="niños Convertidos"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Reconciliados}
              placeholder="Reconciliados"
              title="Reconciliados"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              id="diezmos"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Diezmos}
              placeholder="Diezmos"
              title="Diesmos"
              required
            />
          </div>

          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              id="ofrendas"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Ofrendas}
              on:input={calcularResultado}
              placeholder="Ofrendas"
              title="Ofrendas"
              required
            />
          </div>

          <div class="form-group col-md-6">
            <p class="form-control" style="border-bottom: 2px solid #5504f8;">
              Total Financiero {planilla.Total_financiero}
            </p>
          </div>

          <div class="form-group col-md-6">
            <input
              type="hidden"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              id="resultado"
              bind:value={planilla.Total_financiero}
              on:input={calcularResultado}
              required
            />
          </div>

          <div class="d-flex justify-content-center">
            <h2 class="text-white">PARTICIPACIONES</h2>
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Participacion_Mision_Amigo}
              placeholder="Participacion mision amigo"
              title="Participacion mision amigo"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Participacion_Consolidacion}
              placeholder="participacion consolidacion"
              title="participacion consolidacion"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Participacion_Discipulado_1}
              placeholder="Participacion Discipulado 1"
              title="Participacion Discipulado 1"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Participacion_Discipulado_2}
              placeholder="Participacion Discipulado 2"
              title="Participacion Discipulado 2"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Asistencia_a_la_Escuela_de_Liderazgo}
              placeholder="Asistencia a la Escuela de Liderazgo"
              title="Asistencia a la Escuela de Liderazgo"
              required
            />
          </div>

          <div class="d-flex justify-content-center">
            <h2 class="text-white">REUNIÓN DOMINICAL</h2>
          </div>

          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.asistencia_hermanos}
              placeholder="Asistencia de Hermanos en la Iglesia"
              title="Asistencia de Hermanos en la Iglesia"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Asistencia_de_Amigos}
              placeholder="Asistencia de Amigos en la Iglesia"
              title="Asistencia de Amigos en la Iglesia"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="number"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.Asistencia_de_Ninos}
              placeholder="Asistencia de Niños en la Iglesia"
              title="Asistencia de Niños en la Iglesia"
              required
            />
          </div>

          <div
            class="form-group d-flex justify-content-center text-white col-12"
          >
            <div class="form-check">
              <input
                class="form-check-input bg-primary"
                type="checkbox"
                id="gridCheck"
                required
              />
              <label class="form-check-label" for="gridCheck">
                E revisado y estoy seguro de la informacion suministrada
              </label>
            </div>
          </div>
          <div class="col-12 d-flex mt-4 justify-content-center m">
            <button type="submit" class="btn btn-primary btn-lg"
              >📤 Enviar reporte a BD y WhatsApp</button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</main>

<style>
  @media (max-width: 900px) {
    .movil {
      width: 21rem;
    }
  }

  /* Estilos para notificaciones elegantes */
  .notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  }

  .notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 400px;
    font-weight: 500;
    color: white;
  }

  .notification.success {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border-left: 4px solid #2E7D32;
  }

  .notification.error {
    background: linear-gradient(135deg, #f44336, #d32f2f);
    border-left: 4px solid #C62828;
  }

  .notification.info {
    background: linear-gradient(135deg, #2196F3, #1976D2);
    border-left: 4px solid #1565C0;
  }

  .notification-message {
    flex: 1;
    margin-right: 10px;
    font-size: 14px;
  }

  .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .notification-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

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

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Responsive para móviles */
  @media (max-width: 768px) {
    .notification-container {
      top: 10px;
      right: 10px;
      left: 10px;
    }

    .notification {
      min-width: auto;
      max-width: none;
      width: 100%;
    }
  }
</style>
