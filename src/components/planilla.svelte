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

  const mostrarNotificacion = () => {
    if (Notification.permission === "granted") {
      new Notification(`Reporte`, {
        body: `El reporte del grupo bíblico ha sido enviado con éxito.`,
        icon: "/logo.png",
      });
    }
  };

  const insertPlanilla = async () => {
    try {
      const { data, error } = await supabase
        .from("planilla")
        .insert([planilla])
        .select();

      if (error) {
        console.error("Error al insertar datos:", error.message, error.details);
      } else {
        console.log("Datos insertados con éxito:", data);

        // Aseguramos que los datos de Supabase se reflejen en planilla
        planilla = data[0] || planilla;

        mostrarNotificacion();
        enviarAWhatsApp(); // Enviamos solo cuando los datos están seguros
      }
    } catch (error) {
      console.error("Error general:", error.message);
    }
    alert("Enviado con éxito");
  };

  function calcularResultado() {
    planilla.Total_financiero = planilla.Ofrendas + planilla.Diezmos;
  }

  const enviarAWhatsApp = () => {
    const numero = "584165313465"; // Código de país + número sin el 0 inicial
    const mensaje = encodeURIComponent(`
    📄 *Reporte del Grupo Bíblico* 
    🔹 *Pastor Supervisor:* ${planilla.PASTOR_SUPERVISOR}
    🔹 *Grupo Bíblico:* ${planilla.grupobiblico}
    🏅 *Coordinador Dpto:* ${planilla.COORDINADOR_DPTO}
    🔰 *Supervisor de Red:* ${planilla.SUPERVISOR_DE_RED}
    🏆 *Felipe de Red:* ${planilla.FELIPE_DE_RED}
    ⭐ *Felipe Líder:* ${planilla.FELIPE_LIDER}
    
    👥 *Asistencia* 
    ✅ *VEA:* ${planilla.Asistencia_vea}
    ✅ *Asistentes:* ${planilla.asistentes}
    👤 *Felipes:* ${planilla.Felipes}
    🧑🏽 *Etíopes:* ${planilla.Etiopes}
    📝 *Novedades:* ${planilla.novedades}
    
    🤝 *Participación* 
    🎯 *Misión Amigo:* ${planilla.Participacion_Mision_Amigo}
    🔄 *Consolidación:* ${planilla.Participacion_Consolidacion}
    📖 *Discipulado 1:* ${planilla.Participacion_Discipulado_1}
    📖 *Discipulado 2:* ${planilla.Participacion_Discipulado_2}
    🏫 *Escuela de Liderazgo:* ${planilla.Asistencia_a_la_Escuela_de_Liderazgo}
    
    💰 *Finanzas* 
    💵 *Diezmos:* ${planilla.Diezmos}
    💸 *Ofrendas:* ${planilla.Ofrendas}
    💳 *Total Financiero:* ${planilla.Total_financiero}
    
    🙌 *Asistencia General* 
    🙋‍♂️ *Hermanos:* ${planilla.asistencia_hermanos}
    🧑‍🤝‍🧑 *Amigos:* ${planilla.Asistencia_de_Amigos}
    👶 *Niños:* ${planilla.Asistencia_de_Ninos}
  `);

    const url = `https://wa.me/${numero}?text=${mensaje}`;

    // Abrir WhatsApp correctamente en móviles y PC
    setTimeout(() => {
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.open(url, "_self"); // Abre en la misma ventana en móviles
      } else {
        window.open(url, "_blank"); // Abre en una nueva pestaña en PC
      }
    }, 500); // Retraso de medio segundo para evitar bloqueos
  };
</script>

<main class="">
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
              <option value="belen">Belén</option>
              <option value="elohim">Elohim</option>
              <option value="juda">Judá</option>
              <option value="betel">Betel</option>
              <option value="alfa-y-omega">Alfa y Omega</option>
              <option value="jireth">Jireth</option>
              <option value="agente-de-paz">Agente de paz</option>
              <option value="el-roi">El Roi</option>
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
              >Enviar reporte</button
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
</style>
