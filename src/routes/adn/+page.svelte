<script>
  import { onMount } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import '$lib/public.css';

  const pillars = [
    {
      icon: 'fa-hands-praying',
      title: 'Adoración a Dios',
      text: 'Nuestra iglesia motiva a sus miembros a vivir una vida que agrade a Dios en todos los lugares donde se muevan, haciendo una diferencia entre la verdadera adoración y la falsa religiosidad.',
    },
    {
      icon: 'fa-sun',
      title: 'Revelación de la gloria de Dios',
      text: 'Revelamos al mundo la gloria de Dios a través de la transformación de vidas, que funciona como un imán que atrae a otros.',
    },
    {
      icon: 'fa-bolt',
      title: 'Demostración del Poder de Dios',
      text: 'Una iglesia dinámica y efectiva por el poder de Dios sobre las enfermedades, la muerte, la naturaleza y los demonios.',
    },
    {
      icon: 'fa-earth-americas',
      title: 'Expansión del Reino de Dios',
      text: 'Buscamos activamente a quienes no son salvos y desarrollamos programas de enseñanza para que crean en Jesucristo y asuman la misión de ganar, edificar y enviar.',
    },
  ];

  const principles = [
    {
      icon: 'fa-people-group',
      title: 'Unidad de Propósito',
      text: 'Todos los miembros piensan y actúan en consonancia con la visión. Aunque exista autonomía en ciertas áreas, todo debe apuntar a un bien común.',
    },
    {
      icon: 'fa-magnifying-glass',
      title: 'Conocimiento del entorno',
      text: 'Estamos atentos a los cambios en los ámbitos políticos, legales, económicos, socioculturales, tecnológicos y ecológicos, para dar una respuesta oportuna.',
    },
    {
      icon: 'fa-user-tie',
      title: 'Liderazgo capaz',
      text: 'El líder es el centro en torno al cual gravita la iglesia. Si el líder es competente, la organización prosperará.',
    },
    {
      icon: 'fa-sitemap',
      title: 'Organización eficaz',
      text: 'Requiere sistemas de control adecuados, comunicación fluida, asignación eficaz de recursos y personal competente.',
    },
  ];

  const values = [
    {
      icon: 'fa-crown',
      title: 'Dignidad',
      items: [
        'La compasión',
        'El aprecio',
        'El reconocimiento',
        'La consideración y aceptación del personal interno y externo',
        'La excelencia',
        'La independencia con confianza en lo que se es y según el propósito',
      ],
    },
    {
      icon: 'fa-shield-heart',
      title: 'Integridad',
      items: [
        'Honestidad',
        'Veracidad',
        'Transparencia',
        'Responsabilidad',
        'Confiabilidad',
        'Esfuerzo',
        'Organización',
      ],
    },
    {
      icon: 'fa-dove',
      title: 'Libertad',
      items: [
        'Respetar la vida propia y la de los demás',
        'Obedecer las leyes, a las autoridades y las reglas de convivencia',
        'Seguir procesos de acuerdo al orden establecido',
      ],
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
      <span class="cc-overline">Nuestra identidad</span>
      <h1>Nuestro ADN</h1>
      <p>Lo que nos define, guía cada decisión y nos mantiene fieles a la Gran Comisión.</p>
    </div>
  </section>

  <!-- Misión y Visión -->
  <section class="cc-section">
    <div class="cc-container">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="cc-card cc-reveal">
            <span class="cc-card-icon"><i class="fa-solid fa-cross"></i></span>
            <h3>Nuestra Misión</h3>
            <p>
              Buscamos a hombres y mujeres que no conocen de Jesucristo y los guiamos
              a la salvación. Luego los discipulamos y capacitamos para que asuman un
              compromiso con Cristo y con su iglesia. Formamos de ellos líderes
              autónomos, responsables y trascendentes. Levantamos una generación de
              conquista, consumadora de la palabra y dispuesta a llevar el Evangelio
              sin mirar el precio.
            </p>
            <p class="cc-card__verse"><em>Mateo 28:19-20</em></p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="cc-card cc-reveal cc-d1">
            <span class="cc-card-icon"><i class="fa-solid fa-eye"></i></span>
            <h3>Nuestra Visión</h3>
            <p>
              Hacer de San Juan de Colón, del Estado y de Venezuela, espacios donde el
              amor y los principios del Reino de Dios estén presentes en todas las
              áreas de la vida personal y social, como modelo y plataforma de la
              misión mundial.
            </p>
            <p class="cc-card__verse"><em>Hechos 1:8</em></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Pilares -->
  <section class="cc-section" style="padding-top: 0">
    <div class="cc-container">
      <div class="cc-head cc-reveal">
        <span class="cc-overline">Nuestros pilares</span>
        <h2 class="cc-section-title">Identidad de la iglesia</h2>
      </div>
      <div class="row g-4">
        {#each pillars as p, i}
          <div class="col-lg-3 col-md-6">
            <div class="cc-card cc-reveal cc-d{i + 1}">
              <span class="cc-card-icon"><i class="fa-solid {p.icon}"></i></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Principios -->
  <section class="cc-section" style="padding-top: 0">
    <div class="cc-container">
      <div class="cc-head cc-reveal">
        <span class="cc-overline">Cómo operamos</span>
        <h2 class="cc-section-title">Principios de gobierno</h2>
      </div>
      <div class="row g-4">
        {#each principles as p, i}
          <div class="col-lg-3 col-md-6">
            <div class="cc-card cc-reveal cc-d{i + 1}">
              <span class="cc-card-icon"><i class="fa-solid {p.icon}"></i></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Valores -->
  <section class="cc-section" style="padding-top: 0">
    <div class="cc-container">
      <div class="cc-head cc-reveal">
        <span class="cc-overline">Lo que atesoramos</span>
        <h2 class="cc-section-title">Nuestros valores</h2>
      </div>
      <div class="row g-4">
        {#each values as v, i}
          <div class="col-lg-4 col-md-6">
            <div class="cc-card cc-reveal cc-d{i + 1}">
              <span class="cc-card-icon"><i class="fa-solid {v.icon}"></i></span>
              <h3>{v.title}</h3>
              <ul class="cc-list">
                {#each v.items as item}
                  <li><i class="fa-solid fa-check"></i>{item}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <Footer />
</div>

<style>
  .cc-head {
    text-align: center;
    margin-bottom: 56px;
  }

  .cc-card__verse {
    margin-top: 18px !important;
    color: var(--cc-accent) !important;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
  }

  .cc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .cc-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: var(--cc-muted);
    font-size: 0.95rem;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .cc-list li i {
    color: var(--cc-primary);
    font-size: 0.8rem;
    margin-top: 5px;
    min-width: 14px;
  }
</style>
