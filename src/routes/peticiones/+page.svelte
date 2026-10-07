<script>
  import Peticiones from '../../components/peticiones.svelte';
  import Footer from '../../components/Footer.svelte';
  import '$lib/public.css';
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">Oración y gratitud</span>
      <h1>Peticiones</h1>
      <p>
        Levantamos tu petición al Señor. Escríbenos y la tendremos en cuenta en nuestros cultos de
        miércoles y domingo.
      </p>
    </div>
  </section>

  <Peticiones />

  <section class="cc-verse">
    <div class="cc-container">
      <blockquote>
        Echad todas vuestras preocupaciones sobre Él, porque Él fielmente cuidará de vosotros.
      </blockquote>
      <cite>1 Pedro 5:7</cite>
    </div>
  </section>

  <Footer />
</div>
