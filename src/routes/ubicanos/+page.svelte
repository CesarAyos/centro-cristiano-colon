<script>
  import Footer from "../../components/Footer.svelte";

    
</script>

<div class="container mt-5 mb-5">
  <div class="row row-2">
    <div class="card col-md-4" style="border:none;">
      <div class="card-body bg-body-secondary">
        <h5 class="card-title p-4">
          Pastor(es):Jose Wilman Chamorro,
          <br />Francis Ortiz de Chamorro
        </h5>
        <h6 class="card-subtitle mb-2 text-body-secondary p-3">
          Direccion: Calle 3 con Carrera 11, Barrio el topon
          <br />Una cuadra mas arriba del Gimnasio cubierto
        </h6>
        <p class="card-text p-3">
          Ciudad: San Juan de Colón, Municipio Ayacucho
        </p>
        <p class="card-text p-3">Telefono: +58 0424-7187229</p>
        <div class="d-flex justify-content-center">
          <i class="fa-solid fa-info p-2"></i>
          <i class="fa-solid fa-location-crosshairs p-2"></i>
          <i class="fa-solid fa-arrow-up p-2"></i>
        </div>
      </div>
    </div>
    <div class="card col mt-4" style="border: none;">
      <iframe
        title="mapa"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1040.9298326463252!2d-72.25937907746008!3d8.028365623962548!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6661c4a2b6d037%3A0xb863abb51aac8fd6!2sCentro%20Cristiano%20Colon!5e1!3m2!1ses!2sve!4v1723598950364!5m2!1ses!2sve"
        width="auto"
        height="450"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</div>

<Footer/>
