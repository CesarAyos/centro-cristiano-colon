<script>
  import { supabase } from "../../components/supabase.js";

  let nuevos = {
    nombrelidernuevo: '',
    nombregruponuevo: '',
    nombresnuevo: '',
    apellidosnuevo: '',
    direccionnuevo: '',
    edadnuevo: '',
    telefononuevo: '',
  };

  const onSubmitHandlers = () => {
    insertNuevos();
    Clear();
  };

  const Clear = () => {
    nuevos = {
      nombrelidernuevo: '',
      nombregruponuevo: '',
      nombresnuevo: '',
      apellidosnuevo: '',
      direccionnuevo: '',
      edadnuevo: '',
      telefononuevo: '',
    };
  };

  const insertNuevos = async () => {
    try {
      const { data, error } = await supabase.from("nuevos").insert([nuevos]);

      if (error) {
        console.error("Error al insertar datos:", error.message, error.details);
      } else {
        console.log("Datos insertados correctamente:", data);
      }
    } catch (error) {
      console.error("Error general:", error.message);
    }

    alert("Enviado con Exito");
  };
</script>

<form
  action="profile"
  class="btn-group dropup btn-float fs-2 m-2"
  style="left: 5px;"
>
  <button
    class="fa-solid fa-house fa-flip bg-transparent"
    style="border: none;color: rgb(231, 14, 14);"
  ></button>
</form>

<main>
  <div class="container d-flex justify-content-center mt-5 mb-5">
    <div
      class="card bg-body-secondary"
      style="width: 70rem; box-shadow: 10px 10px 5px 0px rgba(54,130,123,0.75);"
    >
      <div style="background:#333333">
        <div class="d-flex justify-content-center m-2">
          <img
            src="/logo.png"
            alt="logo"
            class="logo-form"
            style="height: 50px;"
          />
        </div>
        <h2 class="d-flex justify-content-center m-2 text-white">
          REPORTES DE AMIGOS
        </h2>
      </div>
      <div class="card-body" style="background-color: #333333">
        <form on:submit|preventDefault={onSubmitHandlers} class="row g-3">
          <div class="form-group col-md-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={nuevos.nombrelidernuevo}
              placeholder="Nombre del lider"
              title="Nombre del lider"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={nuevos.nombregruponuevo}
              placeholder="Nombre del grupo Biblico"
              title="Nombre del grupo Biblico"
              required
            />
          </div>
          <div class="form-group col-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={nuevos.nombresnuevo}
              placeholder="Nombre de la persona nueva"
              title="Nombre de la persona nueva"
              required
            />
          </div>
          <div class="form-group col-md-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={nuevos.apellidosnuevo}
              placeholder="Apellido de la persona nueva"
              title="Apellido de la persona nueva"
              required
            />
          </div>

          <div class="form-group col-md-12">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={nuevos.direccionnuevo}
              placeholder="Direccion donde vive la persona nueva"
              title="Direccion donde vive la persona nueva"
              required
            />
          </div>
          <div class="form-group col-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={nuevos.edadnuevo}
              placeholder="edad de la persona nueva"
              title="edad de la persona nueva"
              required
            />
          </div>
          <div class="form-group col-6">
            <input
              type="text"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              bind:value={nuevos.telefononuevo}
              placeholder="Numero de telefono de la persona nueva"
              title="Numero de telefono de la persona nueva"
              required
            />
          </div>

          <div class="col-12 d-flex mt-4 justify-content-center m">
            <button type="submit" class="btn btn-dark btn-lg"
              >Enviar reporte</button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</main>
