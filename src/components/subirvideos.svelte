<script>
    import { goto } from "$app/navigation";
    import { supabase } from "../components/supabase.js";
  
    let video = {
        Titulo:"",
        Descripcion:"",
        Url:"",
        Pastor:"",
        Fecha:"",
  };

  const onSubmitHandlers = () => {
    insertVideo();
    Clear();
  };

  const Clear = () => {
    video = {
        Titulo:"",
        Descripcion:"",
        Url:"",
        Pastor:"",
        Fecha:"",
    }
  }

  const insertVideo = async () => {
    try {
      const { data, error } = await supabase
        .from("video")
        .insert([video]);

      if (error) {
        console.error("Error al insertar datos:", error.message, error.details);
      } else {
        console.log("Datos insertados correctamente:", data);
      }
    } catch (error) {
      console.error("Error general:", error.message);
    }

    alert(" Video Cargado Con Exito");
  };
  
    
  </script>
  
  <main class="">
    <div
      class="container d-flex justify-content-center"
      style="margin-bottom: 150px;"
    >
      <div
        class="card"
        style="width: 30rem; box-shadow: 10px 10px 5px 0px rgba(54,130,123,0.75);background-color:#333333"
      >
        <div
          class="d-flex justify-content-center m-2"
          style="background: #333333;"
        >
          <img
            src="/logo.png"
            alt="logo"
            class="logo-form"
            style="height: 50px;"
          />
        </div>
        <form
          on:submit|preventDefault={onSubmitHandlers}
          enctype="multipart/form-data"
        >
          <div class="form-group p-2">
            <label for="fileUpload" class="form-label text-white"
              >Proceso de carga de video</label
            >
            
            <input
              type="text"
              id="Titulo"
              bind:value={video.Titulo}
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
            placeholder="Titulo"
            />
            <input
              type="text"
              id="url"
              bind:value={video.Url}
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
            placeholder="Url del Video"
            />
            <input
              type="text"
              id="descripcion"
              bind:value={video.Descripcion}
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
            placeholder="Descripcion del video"
            />
            <input
              type="text"
              id="pastor"
              bind:value={video.Pastor}
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
            placeholder="Pastor de la predicacion"
            />
            <input
              type="text"
              id="fecha"
              bind:value={video.Fecha}
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
            placeholder="Fecha de la predicacion"
            />
            <button type="submit" class="btn btn-dark btn-lg m-2"
              >Cargar Video</button
            >
          </div>
        </form>
      </div>
    </div>
  </main>
  