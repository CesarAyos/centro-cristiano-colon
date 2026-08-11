<script>
  import { onMount } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import '$lib/public.css';

  const stats = [
    { value: '1975', label: 'Inicio del ministerio en Cúcuta' },
    { value: '+69.000', label: 'Personas bautizadas' },
    { value: '+500', label: 'Congregaciones establecidas' },
    { value: '4 décadas', label: 'De servicio al Reino' },
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
      <span class="cc-overline">Nuestra historia</span>
      <h1>Nuestros Fundadores</h1>
      <p>Fe, perseverancia y fuerza en movimiento: el legado de una familia misionera.</p>
    </div>
  </section>

  <section class="cc-section">
    <div class="cc-container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-7">
          <div class="cc-card cc-founder cc-reveal">
            <span class="cc-founder__quote"><i class="fa-solid fa-quote-left"></i></span>
            <p class="cc-founder__lead">
              Fe, perseverancia más fuerza en movimiento son la esencia de la vida
              ministerial de nuestro pastor y misionero, <strong>José Satirio Dos Santos</strong>,
              quien luego de una experiencia sobrenatural dejó su país natal Brasil
              para llegar a Cúcuta, Colombia, en el año de 1975.
            </p>
            <p>
              Junto a su esposa, la pastora y misionera <strong>Nair Andrade Dos Santos</strong>,
              y sus tres hijos, Sulamita, Eliseu y José, fundaron la iglesia Centro
              Cristiano: una plataforma misionera que ha mantenido la insignia de
              <strong>Ganar, Edificar y Enviar</strong>.
            </p>
            <p>
              Hoy, más de 69.000 personas han sido bautizadas en los últimos 20 años
              y más de 500 congregaciones han sido fundadas bajo cobertura en
              diferentes países del mundo, además de múltiples programas misioneros en
              Venezuela, Ecuador, Argentina, Estados Unidos y el Himalaya, en el
              continente de Asia.
            </p>
            <p>
              El esfuerzo de los misioneros por mejorar la calidad de vida de los
              miembros de la iglesia y de la comunidad en general les ha permitido
              fundar entidades educativas, sociales, medios de comunicación y
              empresas misioneras. Su labor ha sido reconocida en varias ocasiones
              por entes gubernamentales locales, regionales, nacionales e
              internacionales, quienes han exaltado la contribución hecha por más de
              cuatro décadas a favor del desarrollo de la sociedad.
            </p>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="row g-4">
            {#each stats as s, i}
              <div class="col-6">
                <div class="cc-stat cc-reveal cc-d{i + 1}">
                  <span class="cc-stat__value">{s.value}</span>
                  <span class="cc-stat__label">{s.label}</span>
                </div>
              </div>
            {/each}
          </div>

          <div class="cc-founder__verse cc-reveal cc-d3">
            <i class="fa-solid fa-dove"></i>
            <p>
              «Id por todo el mundo y predicad el evangelio a toda criatura».
            </p>
            <cite>Marcos 16:15</cite>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</div>

<style>
  .cc-founder {
    padding: 3rem;
  }

  .cc-founder__quote {
    color: var(--cc-accent);
    font-size: 1.6rem;
    margin-bottom: 1rem;
    display: block;
  }

  .cc-founder p {
    color: var(--cc-muted);
    font-size: 1.02rem;
    margin-bottom: 1.1rem;
  }

  .cc-founder__lead {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem !important;
    color: var(--cc-cream) !important;
    line-height: 1.6;
  }

  .cc-founder strong {
    color: var(--cc-accent);
    font-weight: 500;
  }

  .cc-stat {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 18px;
    padding: 26px 20px;
    text-align: center;
    height: 100%;
    transition: transform 0.4s ease, border-color 0.4s ease;
  }

  .cc-stat:hover {
    transform: translateY(-6px);
    border-color: rgba(200, 169, 126, 0.4);
  }

  .cc-stat__value {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    font-size: 2.1rem;
    background: linear-gradient(120deg, #92ae83, #c8a97e);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 6px;
  }

  .cc-stat__label {
    color: var(--cc-muted);
    font-size: 0.86rem;
    line-height: 1.4;
  }

  .cc-founder__verse {
    margin-top: 28px;
    background: linear-gradient(135deg, rgba(146, 174, 131, 0.1), rgba(200, 169, 126, 0.08));
    border: 1px solid var(--cc-border);
    border-radius: 18px;
    padding: 26px;
    text-align: center;
  }

  .cc-founder__verse i {
    color: var(--cc-primary);
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  .cc-founder__verse p {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.25rem;
    color: var(--cc-accent-soft);
    margin-bottom: 8px;
  }

  .cc-founder__verse cite {
    color: var(--cc-primary);
    font-style: normal;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .cc-founder {
      padding: 2rem;
    }
  }
</style>
