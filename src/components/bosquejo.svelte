<script>
    import { goto } from "$app/navigation";
    import { supabase } from "../components/supabase.js";
  
    let file;
  
    const uploadFile = async (filePath, file) => {
      try {
        const { data, error } = await supabase.storage
          .from("imagenes")
          .upload(filePath, file, {
            contentType: "image/jpeg",
          });
  
        if (error) {
          console.error("Hubo un error subiendo el archivo:", error.message);
        } else {
          console.log("Archivo subido con éxito:", data);
          goto('verbosquejoadmin');
          
        }
      } catch (error) {
        console.error("Error general:", error.message);
      }
    };
  
    const handleSubmit = async () => {
      if (!file) {
        alert("No se ha seleccionado ningún archivo.");
        return;
      }
  
      let filePath = `bosquejo/${file.name}`;
      await uploadFile(filePath, file);
      alert("Archivo subido con éxito");
    };
  </script>
  
  <main class="movil">
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
          on:submit|preventDefault={handleSubmit}
          enctype="multipart/form-data"
        >
          <div class="form-group p-2">
            <label for="fileUpload" class="form-label text-white"
              >Selecciona un archivo para subir</label
            >
            <input
              type="file"
              id="fileUpload"
              class="form-control"
              style="border-bottom: 2px solid #5504f8;"
              name="fileUpload"
              on:change="{(e) => file = e.target.files[0]}"
              required
            />
            <button type="submit" class="btn btn-dark btn-lg m-2"
              >Cargar Bosquejo</button
            >
          </div>
        </form>
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
  