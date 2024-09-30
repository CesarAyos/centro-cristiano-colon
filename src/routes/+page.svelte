<script>
  import Footer from "../components/Footer.svelte";

    
</script>

<div
  id="carouselExampleInterval"
  class="carousel slide"
  data-bs-ride="carousel"
>
  <div
    class="carousel-inner"
    style="height:360px;"
  >
    <div class="carousel-item active" data-bs-interval="10000">
      <img
        src="/1.webp"
        class="d-block w-100"
        alt="lgo"
        style="height: 360px;"
      />
    </div>
    <div class="carousel-item" data-bs-interval="2000">
      <img
        src="/2.webp"
        class="d-block w-100"
        alt="pastor"
        style="height: 360px;"
      />
    </div>
    <div class="carousel-item">
      <img
        src="/3.webp"
        class="d-block w-100"
        alt="pastora"
        style="height: 360px;"
      />
    </div>
    <div class="carousel-item">
      <img
        src="/4.webp"
        class="d-block w-100"
        alt="erick"
        style="height: 360px;"
      />
    </div>
  </div>
  <button
    class="carousel-control-prev"
    type="button"
    data-bs-target="#carouselExampleInterval"
    data-bs-slide="prev"
  >
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button
    class="carousel-control-next"
    type="button"
    data-bs-target="#carouselExampleInterval"
    data-bs-slide="next"
  >
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<div class="card-title d-flex justify-content-center mb-2" style="background:#333333;height:45px;">
  <p class="text-white fs-2"><em>Agenda Semanal</em></p>
</div>
<header>
  <div class="container text-center">
    <div class="row row-cols-2 row-cols-lg-6 g-2 g-lg-2">
      <div class="col d-flex align-items-stretch pb-4">
        <div class="card m-2" style="border: none;background:#f2f2f2;">
          <div class="card-header" style="border: none;"><em>Martes</em></div>
          <div class="card-body">
            <i class="fa-solid fa-users-viewfinder fs-2 mb-2"></i>
            <p class="text-start" ><em>SUPER V.E.A 6:00PM</em></p>
          </div>
        </div>
      </div>
      <div class="col d-flex align-items-stretch pb-4">
        <div class="card m-2" style="border: none;background:#f2f2f2;">
          <div class="card-header" style="border: none;"><em>Miercoles</em></div>
          <div class="card-body">
            <i class="fa-solid fa-place-of-worship fs-2 mb-2"></i>
            <p class="text-start"><em>CULTO DE AVIVAMIENTO Y GLORIA 6:00PM</em></p>
          </div>
        </div>
      </div>
      <div class="col d-flex align-items-stretch pb-4">
        <div class="card m-2" style="border: none;background:#f2f2f2;">
          <div class="card-header" style="border: none;"><em>Viernes</em></div>
          <div class="card-body">
            <i class="fa-solid fa-house-fire fs-2 mb-2"></i>
              <p class="text-start"><em>GRUPOS BIBLICOS</em></p>
          </div>
        </div>
      </div>
      <div class="col d-flex align-items-stretch pb-4">
        <div class="card m-2" style="border: none;background:#f2f2f2;">
          <div class="card-header" style="border: none;"><em>Sabado</em></div>
          <div class="card-body">
            <i class="fa-solid fa-person-praying fs-2 mb-2"></i>
              <p class="text-start"><em>
                AYUNO CONGRECIONAL 8:00AM
            </em>
              </p>
          </div>
        </div>
      </div>
      <div class="col d-flex align-items-stretch pb-4">
        <div class="card m-2" style="border: none;background:#f2f2f2;">
          <div class="card-header" style="border: none;"><em>Sabado (tarde)</em></div>
          <div class="card-body">
            <i class="fa-solid fa-place-of-worship fs-2 mb-2"></i>
              <p class="text-start"><em>
                CULTO DE JOVENES R21 4:00PM
            </em>
              </p>
          </div>
        </div>
      </div>
      <div class="col d-flex align-items-stretch pb-4">
        <div class="card m-2" style="border: none;background:#f2f2f2;">
          <div class="card-header" style="border: none;"><em>Domingo</em></div>
          <div class="card-body">
            <i class="fa-solid fa-place-of-worship fs-2 mb-2"></i>
              <p class="text-star"><em>
                CULTO MAÑANA DE BENDICIÓN
            </em>
              </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

<Footer />
