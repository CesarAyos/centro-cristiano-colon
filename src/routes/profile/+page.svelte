<script>
  import Bosquejo from "../../components/bosquejo.svelte";
  import Nuevos from "../../components/nuevos.svelte";
  import Planilla from "../../components/planilla.svelte";
  import Reportes from "../../components/reportes.svelte";
  import Subirvideos from "../../components/subirvideos.svelte";
  import { supabase } from "../../components/supabase.js";
  import { onMount } from "svelte";
  import Verbosquejo from "../../components/verbosquejo.svelte";
  import Vervideoadmin from "../../components/vervideoadmin.svelte";
  


  let user = null;
  let userName = "";

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      window.location.href = "/login";
    } else {
      user = session.user;
      userName = user.user_metadata.full_name || user.email;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  function showContent(id) {
    // Oculta todos los contenidos
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.add('d-none'));

    // Muestra el contenido seleccionado
    const selectedContent = document.getElementById(id);
    if (selectedContent) {
      selectedContent.classList.remove('d-none');
    }
  }
</script>

<main >
  <div class="container-fluid">
    <div class="row">
      <!-- Menú de Navegación -->
      <div class="col-3 p-3 pc" style="background: #333333;">
        <p class="text-center mt-4 text-white">Bienvenido, {userName}</p>
        <div class="list-group">
          <button type="button" class="list-group-item  list-group-item-action text-dark" on:click={() => showContent('planilla')}>Reporte de Grupo Biblico</button>
          <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('nuevos')}>Reporte de Personas Nuevas</button>
          <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('reportes')}>Ver Reportes</button>
          <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('verbosquejoadmin')}>Ver bosquejo</button>
          <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('vervideoadmin')}>Ver Video</button>
          <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('bosquejos')}>Subir Bosquejos</button>
          <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('subirvideos')}>Subir Video</button>
          <button type="button" class="list-group-item list-group-item-action text-center text-dark" on:click={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      <!-- pc -->
      <div class="col-9">
        <div id="planilla" class="content">
          <Planilla/>
        </div>
        <div id="nuevos" class="content d-none">
          <Nuevos/>
        </div>
        <div id="reportes" class="content d-none">
          <Reportes/>
        </div>
        <div id="verbosquejoadmin" class="content d-none">
          <Verbosquejo/>
        </div>
        <div id="vervideoadmin" class="content d-none">
          <!-- Contenido de "Ver Video" -->
          <h2>Ver Video</h2>
          <Vervideoadmin/>
        </div>
        <div id="bosquejos" class="content d-none">
          <!-- Contenido de "Subir Bosquejos" -->
          <h2>Subir Bosquejos</h2>
          <Bosquejo/>
        </div>
        <div id="subirvideos" class="content d-none">
          <!-- Contenido de "Subir Video" -->
          <h2>Subir Video</h2>
          <Subirvideos/>
        </div>
      </div>
    </div>
  </div>
</main>

<main class="movil">
<nav class="navbar navbar-dark bg-dark fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#!">Menu</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div class="">
          <p class="text-center">Bienvenido, {userName}</p>
          <div class="list-group">
            <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('planilla')}>Reporte de Grupo Biblico</button>
            <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('nuevos')}>Reporte de Personas Nuevas</button>
            <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('reportes')}>Ver Reportes</button>
            <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('verbosquejoadmin')}>Ver bosquejo</button>
            <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('vervideoadmin')}>Ver Video</button>
            <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('bosquejos')}>Subir Bosquejos</button>
            <button type="button" class="list-group-item list-group-item-action text-dark" on:click={() => showContent('subirvideos')}>Subir Video</button>
            <button type="button" class="list-group-item list-group-item-action text-center text-dark" on:click={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
</main>

<style>
  .d-none {
    display: none;
  }

  .movil{
    display: none;
  }


  #planilla , #nuevos, #reportes, #verbosquejoadmin, #vervideoadmin, #subirvideos, #bosquejos {
  overflow-y: auto;
  max-height: 500px;
}


  @media (max-width: 900px) {
    
   .pc{
    display: none;
   }
   .movil{
    display: block;
   }

   #planilla , #nuevos, #reportes, #verbosquejoadmin, #vervideoadmin, #subirvideos, #bosquejos {
  overflow-y: visible;
   }
   
}
</style>
