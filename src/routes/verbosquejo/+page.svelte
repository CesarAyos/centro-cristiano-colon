<script>
  import Footer from "../../components/Footer.svelte";
  import { onMount } from "svelte";

  let images = [];

  onMount(async () => {
    const response = await fetch("/verbosquejo");
    const result = await response.json();
    images = result.images;
  });

  function downloadImage(url, name) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(console.error);
  }
</script>

<h1>Imágenes de Bosquejo</h1>
<div class="container">
  <div class="row row-cols-1 row-cols-md-4">
    {#each images as image}
      <div class="col mb-4 p-1">
        <div class="card p-2" style="width: 18rem; border: none;">
          <img src={image.url} class="card-img-top" alt={image.name} />
          <div class="card-body">
            <h5 class="card-title">Bosquejo N°{image.name}</h5>
            <p class="card-text">Bosquejo Semanal.</p>
            <button on:click={() => downloadImage(image.url, image.name)} class="btn btn-primary">Descargar</button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<Footer />
