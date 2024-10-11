<script>
  import Footer from "../components/Footer.svelte";

  
</script>

<div class="d-grid gap-3 movil2" style="grid-template-columns: 1fr 2fr;">
  <div class="bg-light pt-5 border rounded-3 ">
    <p
      class="text-center movilletrero"
      style="font-family: Arial, Helvetica, sans-serif;"
    >
      <em>Agenda Semanal</em>
    </p>

    <!-- Button trigger modal 1 -->
    <div class="d-grid gap-2 m-2 ">
      <button
      id="btn-modal"
        type="button"
        class="btn btn-dark"
        data-bs-toggle="modal"
        data-bs-target="#modal1"
      >
        <h5>Martes</h5>
      </button>
    </div>

    <!-- Modal 1 -->
    <div
      class="modal fade"
      id="modal1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="modal1Label"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark">
          <div class="modal-header">
            <h1 class="modal-title fs-5 text-white" id="modal1Label">Agenda Semanal</h1>
            <button
              type="button"
              class="btn-close" 
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="d-flex justify-content-center"><img src="/1.png" style="width: 400px;" alt="martes"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Button trigger modal 2 -->
    <div class="d-grid gap-2 m-2">
      <button
      id="btn-modal"
        type="button"
        class="btn btn-dark"
        data-bs-toggle="modal"
        data-bs-target="#modal2"
      >
        <h5>Miercoles</h5>
      </button>
    </div>

    <!-- Modal 2 -->
    <div
      class="modal fade"
      id="modal2"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="modal2Label"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark ">
          <div class="modal-header">
            <h1 class="modal-title fs-5 text-white" id="modal2Label">Agenda Semanal</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="d-flex justify-content-center"><img src="/2.png" style="width: 400px;" alt="martes"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Button trigger modal 3 -->
    <div class="d-grid gap-2 m-2">
      <button
        type="button"
        id="btn-modal"
        class="btn btn-dark"
        data-bs-toggle="modal"
        data-bs-target="#modal3"
      >
        <h5>Viernes</h5>
      </button>
    </div>

    <!-- Modal 3 -->
    <div
      class="modal fade"
      id="modal3"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="modal3Label"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark">
          <div class="modal-header">
            <h1 class="modal-title fs-5 text-white" id="modal3Label">Agenda Semanal</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="d-flex justify-content-center"><img src="/3.png" style="width: 400px;" alt="martes"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Button trigger modal 4 -->
    <div class="d-grid gap-2 m-2">
      <button
      id="btn-modal"
        type="button"
        class="btn btn-dark"
        data-bs-toggle="modal"
        data-bs-target="#modal4"
      >
        <h5>Sabado</h5>
      </button>
    </div>

    <!-- Modal 4 -->
    <div
      class="modal fade"
      id="modal4"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="modal4Label"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark">
          <div class="modal-header">
            <h1 class="modal-title fs-5 text-white" id="modal4Label">Agenda Semanal</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="d-flex justify-content-center"><img src="/4.png" style="width: 400px;" alt="martes"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Button trigger modal 5 -->
    <div class="d-grid gap-2 m-2">
      <button
      id="btn-modal"
        type="button"
        class="btn btn-dark"
        data-bs-toggle="modal"
        data-bs-target="#modal5"
      >
        <h5>Domingo</h5>
      </button>
    </div>

    <!-- Modal 5 -->
    <div
      class="modal fade"
      id="modal5"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="modal5Label"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark">
          <div class="modal-header">
            <h1 class="modal-title fs-5 text-white" id="modal5Label">Agenda Semanal</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="d-flex justify-content-center"><img src="/5.png" style="width: 400px;" alt="martes"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-light border rounded-3 movil">
    <div id="carouselExample" class="carousel slide">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="/1p.png" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="/2p.png" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="/3p.png" class="d-block w-100" alt="...">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</div>

<Footer/>


<style>
  #btn-modal:hover{
    background-color: #082c0f;
    transition: 1s;
  }


  @media (max-width: 900px) {

    .movil{
      margin-top: 120px;
    }

 .movilletrero{
  font-size: 35px;
 }
}

</style>