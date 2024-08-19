<script>
  import Footer from "../../components/Footer.svelte";
  import { onMount } from "svelte";
  
  let images = [];

  onMount(async () => {
    const response = await fetch("/verbosquejo");
    const result = await response.json();
    images = result.images;
  });
</script>

<h1>Imágenes de Bosquejo</h1>
<div class="container">
  <div class="row row-cols-1 row-cols-md-4">
    {#each images as image}
      <div class="col mb-4 p-1">
        <div class="card p-2" style="width: 18rem; border: none;">
          <img src={image.url} class="card-img-top" alt={image.name} />
          <div class="card-body">
            <h5 class="card-title">{image.name}</h5>
            <p class="card-text">Bosquejo Semanal.</p>
            <a href={image.url} download={image.name} class="btn btn-primary">Descargar</a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>


<Footer />
