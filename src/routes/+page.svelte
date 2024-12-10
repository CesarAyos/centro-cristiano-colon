<script>
  import Footer from "../components/Footer.svelte";
  import Predica from "../components/predica.svelte";
 

</script>

<div class="container2 animate-left p-5">
  <div class="container text-center">
    <div class="row">
      <div class="col">
        <p class="text-start mt-5" style="font-size: 50px;color:#92ae83;">
          CENTRO CRISTIANO COLÓN
        </p>
        <p class="fs-3 text-start" style="color:#92ae83;">
          un sitio ideal para un momento espiritual
        </p>
        <div class="d-flex justify-content-start mt-4">
          <a
            class="text-decoration-none"
            style="background: #0e0d06"
            href="https://wa.me/584169752291?&text=solicito%20una%20carrera."
            target="_blank"
          >
          </a>
        </div>
      </div>
      <div class="col">
        <img
          src="/logo.png"
          class="img-fluid imgPrincipal rounded-start"
          style="height: 350px; width: auto; object-fit: cover"
          alt="..."
        />
      </div>
    </div>
  </div>
</div>

<div class="container2 p-3" style="background: #0e0d06">
  <div class="container text-center mt-5">
    <div class="row">
      <div class="col" style="background: #0e0d06">
        <div id="carouselExample" class="carousel slide">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="/carru2.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="/carru1.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="/carru3.jpg" class="d-block w-100" alt="..." />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="col pb-5" style="background: #0e0d06">
        <p
          class="text-end"
          style="font-size: 50px; background: #0e0d06;color:#92ae83;"
        >
          UNA IGLESIA EN CONSTANTE CRECIMIENTO
        </p>
        <p class="text-start" style="background: #0e0d06;color:#92ae83;">
          Cada día,nuevos miembros se unen a nosotros, atraídos por nuestra
          devoción al señor y el sentido de pertenencia que cultivamos. Nuestras
          puertas están siempre abiertas, y juntos, como una gran familia,
          seguimos fortaleciendo nuestra fe y extendiendo nuestro amor a todos
          los rincones del mundo.
        </p>
      </div>
    </div>
  </div>
</div>


  <div class="container3 animate-left d-flex justify-content-center" >
    <div class="card" style="width: 50rem; border: none">
      <div class="card-body">
        <h1 class="card-title pt-3 text-center border-bottom border-danger" style="color:#92ae83;">
          NUESTROS SERVICIOS SEMANALES
        </h1>
      </div>
    </div>
  </div>

  <div class="container4 animate-left " >
    <div class="container text-center" >
      <div class="row">
        <div class="col border-bottom border-danger" >
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-6" >
                <img
                  src="/vea.jpg"
                  class="img-fluid rounded-start"
                  style="height: 350px; width: auto; object-fit: cover"
                  alt="..."
                />
              </div>
              <div class="col-md-6">
                <div class="card-body" >
                  <h3
                    class="card-title text-start "
                    style="color:#92ae83;"
                  >
                    MARTES
                  </h3>
                  <h4
                    class="card-text text-end pt-4"
                    style="color:#92ae83;"
                  >
                    VISION <br /> EVALUACIÓN <br /> AGENDA
                  </h4>
                  <div
                    class="d-flex mt-5 justify-content-center"
                    
                  >
                    <button type="button" class="btn btn-outline-success">
                      5:45 pm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col border-bottom border-danger">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-6">
                <img
                  src="/miercoles.jpg"
                  class="img-fluid rounded-start"
                  style="height: 350px; object-fit: cover"
                  alt="..."
                />
              </div>
              <div class="col-md-6">
                <div class="card-body" >
                  <h3
                    class="card-title text-start"
                    style="color:#92ae83;"
                  >
                    MIERCOLES
                  </h3>
                  <h4
                    class="card-text text-end pt-4"
                    style="color:#92ae83;"
                  >
                    CULTO DE EMPODERAMIENTO Y GLORIA
                  </h4>
                  <div
                    class="d-flex mt-5 justify-content-center"
                    
                  >
                    <button type="button" class="btn btn-outline-success">
                      5:45 pm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <div class="row">
        <div class="col border-bottom border-danger">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-6">
                <img
                  src="/sabado.jpg"
                  class="img-fluid rounded-start"
                  style="height: 350px; width: auto; object-fit: cover"
                  alt="..."
                />
              </div>
              <div class="col-md-6">
                <div class="card-body" >
                  <h3
                    class="card-title text-start"
                    style="color:#92ae83;"
                  >
                    SABADOS
                  </h3>
                  <h4
                    class="card-text text-end pt-4"
                    style="color:#92ae83;"
                  >
                    ENSAYO DE DANZA <br /> CULTO DE JOVENES <br /> ENSAYO DE ALABANZA
                  </h4>
                  <div
                    class="d-flex mt-5 justify-content-center"
                    
                  >
                    <button type="button" class="btn btn-outline-success m-2">
                      2:00 pm
                    </button>
                    <button type="button" class="btn btn-outline-success m-2">
                      5:00 pm
                    </button>
                    <button type="button" class="btn btn-outline-success m-2">
                      6:00 pm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col border-bottom border-danger">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-6">
                <img
                  src="/domingo.jpg"
                  class="img-fluid rounded-start"
                  style="height: 350px; object-fit: cover"
                  alt="..."
                />
              </div>
              <div class="col-md-6">
                <div class="card-body">
                  <h3
                    class="card-title text-start"
                    style="color:#92ae83;"
                  >
                    DOMINGOS
                  </h3>
                  <h4
                    class="card-text text-end pt-4"
                    style="color:#92ae83;"
                  >
                    DEVOCIONAL <br /> RUTA ACADEMICA <br /> CULTO MAÑANA DE BENDICIÓN
                  </h4>
                  <div
                    class="d-flex mt-5 justify-content-center"
                    
                  >
                    <button type="button" class="btn btn-outline-success m-2">
                      8:45 am
                    </button>
                    <button type="button" class="btn btn-outline-success m-2">
                      9:00 am
                    </button>
                    <button type="button" class="btn btn-outline-success m-2">
                      10:30 am
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container3 animate-left d-flex justify-content-center" >
    <div class="card" style="width: 50rem; border: none">
      <div class="card-body">
        <h1 class="card-title pt-3 text-center border-bottom border-danger" style="color:#92ae83;">
          NUESTROS PREDICAS SEMANALES
        </h1>
        <h5 class="text-center" style="color:#92ae83;">SIGUENOS EN YOUTUBE</h5>
      </div>
    </div>
  </div>

  <div>
    <Predica/>
  </div>


<div>
  <Footer/>
</div>


<style>
  * {
    background: #1b1b1b;
  }

  /* animacion izquierda derecha */
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-left {
    animation: slideInLeft 1s ease-in-out;
  }

  @media (max-width: 900px) {
    .imgPrincipal {
      display: none;
    }
  }
</style>
