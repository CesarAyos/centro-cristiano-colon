<script>
  import { supabase } from "../components/supabase.js";

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

  const insertPlanilla = async () => {
    try {
      const { data, error } = await supabase
        .from("planilla")
        .insert([planilla]);

      if (error) {
        console.error("Error al insertar datos:", error.message, error.details);
      } else {
        console.log("Datos insertados correctamente:", data);
      }
    } catch (error) {
      console.error("Error general:", error.message);
    }

    alert(" Reporte Enviado con Exito");
  };

  function calcularResultado() {
    planilla.Total_financiero = planilla.Ofrendas + planilla.Diezmos;
  }
</script>

<main class="">
  <div class="container d-flex justify-content-center mt-3 mb-3 movil" >
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
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={planilla.grupobiblico}
              placeholder="Nombre del grupo biblico"
              title="Nombre del grupo biblico"
              required
            />
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
 .movil{
  width: 21rem;
 }  
}
</style>

