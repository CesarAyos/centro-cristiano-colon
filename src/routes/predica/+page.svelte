<script>
  import Predica from '../../components/predica.svelte';
  import Footer from '../../components/Footer.svelte';
  import '$lib/public.css';
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">La Palabra de Dios</span>
      <h1>Prédicas</h1>
      <p>Mensajes que transforman vidas. Escúchalos cuando y donde quieras.</p>
    </div>
  </section>

  <section class="cc-section">
    <div class="cc-container">
      <Predica />
    </div>
  </section>

  <Footer />
</div>
