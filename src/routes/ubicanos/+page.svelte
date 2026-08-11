<script>
  import { onMount } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import '$lib/public.css';

  const info = [
    {
      icon: 'fa-person-chalkboard',
      title: 'Pastores',
      lines: ['Jose Wilman Chamorro', 'Francis Ortiz de Chamorro'],
    },
    {
      icon: 'fa-location-dot',
      title: 'Dirección',
      lines: ['Calle 3 con Carrera 11', 'Barrio El Topón'],
      extra: 'Una cuadra más arriba del Gimnasio Cubierto',
    },
    {
      icon: 'fa-city',
      title: 'Ciudad',
      lines: ['San Juan de Colón', 'Municipio Ayacucho'],
    },
    {
      icon: 'fa-phone',
      title: 'Teléfono',
      lines: ['+58 424-7187229'],
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
      <span class="cc-overline">Te esperamos</span>
      <h1>Ubícanos</h1>
      <p>Nos encantaría recibirte en nuestra casa. Encuéntranos aquí.</p>
    </div>
  </section>

  <section class="cc-section">
    <div class="cc-container">
      <div class="row g-4">
        <div class="col-lg-5">
          <div class="row g-4">
            {#each info as item, i}
              <div class="col-md-6">
                <div class="cc-place cc-reveal cc-d{i + 1}">
                  <span class="cc-card-icon"><i class="fa-solid {item.icon}"></i></span>
                  <h3>{item.title}</h3>
                  {#each item.lines as line}
                    <p>{line}</p>
                  {/each}
                  {#if item.extra}
                    <em>{item.extra}</em>
                  {/if}
                </div>
              </div>
            {/each}
          </div>

          <div class="cc-actions cc-reveal cc-d4">
            <a class="cc-btn" href="https://wa.me/584247187229" target="_blank" rel="noopener">
              <i class="fa-brands fa-whatsapp"></i>Escríbenos
            </a>
            <a
              class="cc-btn cc-btn--ghost"
              href="https://www.google.com/maps/place/Centro+Cristiano+Colon"
              target="_blank"
              rel="noopener"
            >
              <i class="fa-solid fa-diamond-turn-right"></i>Cómo llegar
            </a>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="cc-map cc-reveal cc-d2">
            <iframe
              title="Mapa de Centro Cristiano Misión Global Colón"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1040.9298326463252!2d-72.25937907746008!3d8.028365623962548!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6661c4a2b6d037%3A0xb863abb51aac8fd6!2sCentro%20Cristiano%20Colon!5e1!3m2!1ses!2sve!4v1723598950364!5m2!1ses!2sve"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</div>

<style>
  .cc-place {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 18px;
    padding: 26px;
    height: 100%;
    transition: transform 0.4s ease, border-color 0.4s ease;
  }

  .cc-place:hover {
    transform: translateY(-6px);
    border-color: rgba(200, 169, 126, 0.4);
  }

  .cc-place h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .cc-place p {
    color: var(--cc-muted);
    margin-bottom: 2px;
    font-size: 0.95rem;
  }

  .cc-place em {
    display: block;
    color: var(--cc-accent);
    font-size: 0.85rem;
    font-style: normal;
    margin-top: 8px;
  }

  .cc-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 26px;
  }

  .cc-map {
    position: relative;
    height: 100%;
    min-height: 460px;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--cc-border);
    box-shadow: var(--cc-shadow);
  }

  .cc-map iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(0.5) contrast(1.05);
  }

  @media (max-width: 992px) {
    .cc-map {
      min-height: 380px;
    }
  }
</style>
