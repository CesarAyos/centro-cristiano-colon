<script>
  import Testimonios from '../../components/testimonios.svelte';
  import Footer from '../../components/Footer.svelte';
  import '$lib/public.css';
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">Historias de fe</span>
      <h1>Testimonios</h1>
      <p>
        Cada testimonio es una semilla que Dios planta en un corazón. Lee lo que Él ha hecho en
        nuestra comunidad.
      </p>
    </div>
  </section>

  <Testimonios />

  <section class="cc-verse">
    <div class="cc-container">
      <blockquote>
        En esto consiste el testimonio que damos, que la luz resplandece.
      </blockquote>
      <cite>2 Corintios 4:13</cite>
    </div>
  </section>

  <Footer />
</div>
