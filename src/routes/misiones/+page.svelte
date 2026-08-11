<script>
  import { onMount } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import '$lib/public.css';

  const highlights = [
    {
      icon: 'fa-earth-americas',
      title: 'Misiones internacionales',
      text: 'Congregaciones fundadas en Europa, Asia y América, llevando esperanza hasta lo último de la tierra.',
    },
    {
      icon: 'fa-flag',
      title: 'Misiones nacionales',
      text: 'Proyectos de expansión y cobertura en todo el territorio venezolano y colombiano.',
    },
    {
      icon: 'fa-feather-pointed',
      title: 'Misiones étnicas',
      text: 'Obra misionera en Resguardos Indígenas en Colombia, alcanzando a cada pueblo con el evangelio.',
    },
    {
      icon: 'fa-city',
      title: 'Misiones urbanas',
      text: 'Llevando esperanza y transformación a las ciudades, a través de programas de impacto social.',
    },
    {
      icon: 'fa-hand-holding-heart',
      title: 'Aliados Misioneros',
      text: 'Personas y empresas que comprenden su identidad y, con su generosidad, sostienen cada proyecto.',
    },
    {
      icon: 'fa-comments',
      title: 'La Gran Comisión',
      text: 'Con el único propósito de cumplir el mandato de Jesús de ir y hacer discípulos a todas las naciones.',
    },
  ];

  let destroyReveals = () => {};

  onMount(() => {
    destroyReveals = setupReveals();
    return destroyReveals;
  });
</script>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">Ganar · Edificar · Enviar</span>
      <h1>Somos una Iglesia con ADN Misionero</h1>
      <p>Llevando esperanza hasta lo último de la tierra, desde hace más de cuatro décadas.</p>
    </div>
  </section>

  <section class="cc-section">
    <div class="cc-container">
      <div class="cc-intro cc-reveal">
        <span class="cc-intro__quote"><i class="fa-solid fa-quote-left"></i></span>
        <p>
          Durante más de cuatro décadas y bajo la dirección del pastor y misionero
          José Satirio Dos Santos, la iglesia Centro Cristiano, como plataforma
          misionera, lleva a cabo múltiples proyectos a través de las misiones
          internacionales, nacionales, étnicas y urbanas, llevando esperanza hasta
          lo último de la tierra.
        </p>
        <p>
          Es así como hoy se han fundado centenares de congregaciones en diferentes
          continentes como Europa, Asia y América, así como en Resguardos Indígenas
          en Colombia, con el único propósito de cumplir con la Gran Comisión.
        </p>
      </div>

      <div class="row g-4 mt-4">
        {#each highlights as h, i}
          <div class="col-lg-4 col-md-6">
            <div class="cc-card cc-reveal cc-d{i + 1}">
              <span class="cc-card-icon"><i class="fa-solid {h.icon}"></i></span>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          </div>
        {/each}
      </div>

      <div class="cc-cta cc-reveal mt-5">
        <div>
          <h2>Sé parte de la misión</h2>
          <p>
            Bajo esta visión misionera, hoy múltiples personas y empresas se han
            sumado voluntariamente a ser Aliados Misioneros, convirtiéndose en un
            brazo extendido para la expansión del Reino en la tierra.
          </p>
        </div>
        <a
          class="cc-btn"
          href="https://wa.me/584247187229?&text=Me%20gustar%C3%ADa%20ser%20un%20Aliado%20Misionero."
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp"></i>Quiero ser Aliado
        </a>
      </div>
    </div>
  </section>

  <Footer />
</div>

<style>
  .cc-intro {
    max-width: 860px;
    margin: 0 auto;
    text-align: center;
    position: relative;
  }

  .cc-intro__quote {
    color: var(--cc-accent);
    font-size: 2rem;
    display: block;
    margin-bottom: 16px;
  }

  .cc-intro p {
    color: var(--cc-muted);
    font-size: 1.12rem;
    line-height: 1.9;
    margin-bottom: 1.2rem;
  }

  .cc-cta {
    background: linear-gradient(135deg, rgba(146, 174, 131, 0.12), rgba(200, 169, 126, 0.1));
    border: 1px solid var(--cc-border);
    border-radius: 22px;
    padding: 46px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
  }

  .cc-cta h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    margin-bottom: 10px;
  }

  .cc-cta p {
    color: var(--cc-muted);
    max-width: 620px;
    margin: 0;
  }

  @media (max-width: 768px) {
    .cc-cta {
      padding: 30px;
      text-align: center;
      justify-content: center;
    }
  }
</style>
