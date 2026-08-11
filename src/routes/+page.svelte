<script>
  import { onMount } from 'svelte';
  import Footer from '../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import '$lib/public.css';

  const slides = [
    {
      img: '/carru2.jpg',
      fallback:
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
      caption: 'Cultos que transforman vidas',
      sub: 'Únete a nuestra familia de fe',
    },
    {
      img: '/carru1.jpg',
      fallback:
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
      caption: 'Alabanza y adoración',
      sub: 'Un ambiente de encuentro con Dios',
    },
    {
      img: '/carru3.jpg',
      fallback:
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
      caption: 'Una comunidad con propósito',
      sub: 'Ganar, edificar y enviar',
    },
  ];

  const services = [
    {
      day: 'Martes',
      title: 'Visión · Evaluación · Agenda',
      img: '/vea.jpg',
      times: ['5:45 PM'],
    },
    {
      day: 'Miércoles',
      title: 'Culto de Empoderamiento y Gloria',
      img: '/miercoles.jpg',
      times: ['5:45 PM'],
    },
    {
      day: 'Sábados',
      title: 'Ensayos y Culto de Jóvenes',
      img: '/sabado.jpg',
      times: ['2:00 PM', '5:00 PM', '6:00 PM'],
    },
    {
      day: 'Domingos',
      title: 'Devocional y Mañana de Bendición',
      img: '/domingo.jpg',
      times: ['8:45 AM', '9:00 AM', '10:30 AM'],
    },
  ];

  const ministries = [
    {
      icon: 'fa-child-reaching',
      title: 'Ministerio de Niños',
      text: 'Un espacio seguro y lleno de alegría donde los niños aprenden de Jesús de forma creativa y divertida.',
    },
    {
      icon: 'fa-fire-flame-curved',
      title: 'Ministerio de Jóvenes',
      text: 'Una generación apasionada por Dios, con cultos y encuentros que fortalecen la fe de nuestros jóvenes.',
    },
    {
      icon: 'fa-music',
      title: 'Ministerio de Alabanza',
      text: 'Adoración genuina a través de la música y el canto, conduciendo a la congregación a la presencia de Dios.',
    },
    {
      icon: 'fa-drum',
      title: 'Ministerio de Danza',
      text: 'Un ministerio de adoración en movimiento que expresa con gozo la gloria y la libertad de Dios.',
    },
  ];

  const sermons = [    {
      title: 'La Fe que Mueve Montañas',
      date: '15 de Julio, 2023',
      text: 'Explorando el poder de la fe genuina en nuestras vidas diarias y cómo puede transformar circunstancias imposibles.',
      img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'El Amor Ágape',
      date: '8 de Julio, 2023',
      text: 'Descubriendo la profundidad del amor incondicional de Dios y cómo manifestarlo en nuestras relaciones.',
      img: 'https://media.sitioandino.com.ar/p/910138db31ea520ffdba106421cb0ddd/adjuntos/335/imagenes/000/626/0000626464/790x0/smart/pascua-resurrecion-santuario-divina-misericordia22jpg.jpg',
    },
    {
      title: 'Esperanza en Tiempos Difíciles',
      date: '1 de Julio, 2023',
      text: 'Encontrando esperanza y propósito en medio de las pruebas, con la seguridad del cuidado divino.',
      img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80',
    },
  ];

  let active = 0;
  let timer;

  function go(n) {
    active = (n + slides.length) % slides.length;
  }

  function next() {
    go(active + 1);
  }

  function prev() {
    go(active - 1);
  }

  function startTimer() {
    timer = setInterval(() => next(), 6500);
  }

  function pause() {
    clearInterval(timer);
  }

  function resume() {
    clearInterval(timer);
    startTimer();
  }

  let destroyReveals = () => {};

  onMount(() => {
    destroyReveals = setupReveals();
    startTimer();
    return () => {
      clearInterval(timer);
      destroyReveals();
    };
  });
</script>

<div class="public-site">
  <!-- ===================== HERO ===================== -->
  <section class="cc-hero">
    <div class="cc-hero__bg">
      <img src="/logo.png" alt="" aria-hidden="true" />
    </div>
    <span class="cc-hero__glow cc-hero__glow--one" aria-hidden="true"></span>
    <span class="cc-hero__glow cc-hero__glow--two" aria-hidden="true"></span>

    <div class="cc-container cc-hero__content">
      <p class="cc-hero__overline">
        <i class="fa-solid fa-cross"></i>
        Bienvenidos a nuestra casa de oración
      </p>
      <h1 class="cc-hero__title">
        Centro Cristiano <span>Colón</span>
      </h1>
      <p class="cc-hero__subtitle">Un lugar para un momento espiritual</p>
      <p class="cc-hero__text">
        Somos una comunidad de fe comprometida con el crecimiento espiritual y
        el servicio a nuestra comunidad. Únete a nosotros en este camino de fe.
      </p>
      <div class="cc-hero__actions">
        <a
          class="cc-btn"
          href="https://wa.me/584247187229?&text=Me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20iglesia."
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp"></i>Contáctanos
        </a>
        <a class="cc-btn cc-btn--ghost" href="/ubicanos">
          <i class="fa-solid fa-location-dot"></i>Ven a visitarnos
        </a>
      </div>
    </div>

    <a class="cc-hero__scroll" href="#carousel" aria-label="Bajar">
      <span></span>
    </a>
  </section>

  <!-- ===================== CARRUSEL ===================== -->
  <section class="cc-carousel-wrap" id="carousel">
    <div class="cc-container">
      <div
        class="cc-carousel"
        on:mouseenter={pause}
        on:mouseleave={resume}
        role="region"
        aria-label="Galería de la iglesia"
      >
        {#each slides as slide, i}
          <div class="cc-slide" class:is-active={i === active} aria-hidden={i !== active}>
            <img
              src={slide.img}
              alt={slide.caption}
              onerror={(e) => (e.currentTarget.src = slide.fallback)}
            />
            <div class="cc-slide__shade"></div>
            <div class="cc-slide__caption">
              <p class="cc-slide__sub">{slide.sub}</p>
              <h3 class="cc-slide__title">{slide.caption}</h3>
            </div>
          </div>
        {/each}

        <button class="cc-carousel__arrow cc-carousel__arrow--prev" type="button" on:click={prev} aria-label="Anterior">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <button class="cc-carousel__arrow cc-carousel__arrow--next" type="button" on:click={next} aria-label="Siguiente">
          <i class="fa-solid fa-arrow-right"></i>
        </button>

        <div class="cc-carousel__dots">
          {#each slides as _, i}
            <button
              class:is-active={i === active}
              type="button"
              on:click={() => go(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
            ></button>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- ===================== SERVICIOS ===================== -->
  <section class="cc-section cc-services">
    <div class="cc-container">
      <div class="cc-head cc-reveal">
        <span class="cc-overline">Ven y adora con nosotros</span>
        <h2 class="cc-section-title">Nuestros Servicios Semanales</h2>
        <p class="cc-section-sub">
          Te esperamos en cualquiera de nuestras reuniones durante la semana para
          crecer juntos en fe.
        </p>
      </div>

      <div class="row g-4">
        {#each services as service, i}
          <div class="col-lg-3 col-md-6">
            <article class="cc-service cc-reveal cc-d{i + 1}">
              <div class="cc-service__media">
                <img src={service.img} alt={`Servicio de ${service.day}`} loading="lazy" />
                <span class="cc-service__day">{service.day}</span>
              </div>
              <div class="cc-service__body">
                <h3>{service.title}</h3>
                <div class="cc-service__times">
                  {#each service.times as t}
                    <span>{t}</span>
                  {/each}
                </div>
              </div>
            </article>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ===================== MINISTERIOS ===================== -->
  <section class="cc-section cc-ministries">
    <div class="cc-container">
      <div class="cc-head cc-reveal">
        <span class="cc-overline">Sírvete y sirve</span>
        <h2 class="cc-section-title">Nuestros Ministerios</h2>
        <p class="cc-section-sub">
          Cada persona tiene un lugar en la iglesia. Encuentra el ministerio
          donde Dios quiere que sirvas.
        </p>
      </div>

      <div class="row g-4">
        {#each ministries as m, i}
          <div class="col-lg-3 col-md-6">
            <div class="cc-ministry cc-reveal cc-d{i + 1}">
              <span class="cc-ministry__icon"><i class="fa-solid {m.icon}"></i></span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ===================== CITA BÍBLICA ===================== -->
  <section class="cc-verse cc-reveal">
    <div class="cc-container">
      <blockquote>
        Por tanto, id, y haced discípulos a todas las naciones... enseñándoles
        que guarden todas las cosas que os he mandado.
      </blockquote>
      <cite>Mateo 28:19-20</cite>
    </div>
  </section>

  <!-- ===================== PRÉDICAS ===================== -->
  <section class="cc-section cc-sermons">
    <div class="cc-container">
      <div class="cc-head cc-reveal">
        <span class="cc-overline">Mensajes que transforman</span>
        <h2 class="cc-section-title">Nuestras Prédicas</h2>
        <p class="cc-section-sub">
          Palabra viva para cada temporada de tu vida. Escucha las enseñanzas que
          Dios nos ha dado.
        </p>
      </div>

      <div class="row g-4">
        {#each sermons as sermon, i}
          <div class="col-lg-4 col-md-6">
            <article class="cc-sermon cc-reveal cc-d{i + 1}">
              <div class="cc-sermon__media">
                <img src={sermon.img} alt={sermon.title} loading="lazy" />
                <span class="cc-sermon__play"><i class="fa-solid fa-play"></i></span>
              </div>
              <div class="cc-sermon__body">
                <span class="cc-sermon__date"><i class="fa-regular fa-calendar"></i>{sermon.date}</span>
                <h3>{sermon.title}</h3>
                <p>{sermon.text}</p>
                <a class="cc-sermon__link" href="https://youtube.com" target="_blank" rel="noopener">
                  <i class="fa-brands fa-youtube"></i>Ver en YouTube
                </a>
              </div>
            </article>
          </div>
        {/each}
      </div>

      <div class="text-center mt-5 cc-reveal">
        <a class="cc-btn cc-btn--gold" href="https://youtube.com" target="_blank" rel="noopener">
          <i class="fa-brands fa-youtube"></i>Suscríbete a nuestro canal
        </a>
      </div>
    </div>
  </section>

  <!-- ===================== DONACIONES ===================== -->
  <section class="cc-section cc-donate">
    <div class="cc-container">
      <div class="cc-donate__card cc-reveal">
        <span class="cc-donate__glow" aria-hidden="true"></span>
        <div class="cc-donate__content">
          <span class="cc-card-icon"><i class="fa-solid fa-hand-holding-heart"></i></span>
          <span class="cc-overline">Siembra de bendición</span>
          <h2 class="cc-section-title">Apoya la obra del Señor</h2>
          <p class="cc-section-sub">
            Tu ofrenda y tu generosidad ayudan a sostener los proyectos del
            ministerio y a llevar el evangelio hasta lo último de la tierra.
            Toda semilla que siembras es una bendición para la iglesia.
          </p>
          <a
            class="cc-btn cc-btn--gold cc-donate__btn"
            href="https://wa.me/584247187229?&text=Hola%2C%20quiero%20realizar%20una%20donaci%C3%B3n%20a%20la%20iglesia."
            target="_blank"
            rel="noopener"
          >
            <i class="fa-brands fa-whatsapp"></i>Quiero donar
          </a>
          <p class="cc-donate__verse">
            «Dad, y se os dará; medida buena, apretada, remecida y rebosando darán
            en vuestro regazo.» <cite>Lucas 6:38</cite>
          </p>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</div>

<style>
  /* ===================== HERO ===================== */
  .cc-hero {
    position: relative;
    min-height: calc(100vh - 78px);
    display: flex;
    align-items: center;
    padding: 90px 0 100px;
    overflow: hidden;
    background: radial-gradient(ellipse at 75% 20%, rgba(146, 174, 131, 0.16), transparent 55%),
      radial-gradient(ellipse at 15% 85%, rgba(200, 169, 126, 0.12), transparent 50%),
      linear-gradient(165deg, #0e0d06 0%, #191610 60%, #10100c 100%);
  }

  .cc-hero__bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 6%;
    opacity: 0.07;
  }

  .cc-hero__bg img {
    width: 46vw;
    max-width: 560px;
    height: auto;
    animation: heroFloat 9s ease-in-out infinite;
  }

  .cc-hero__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.5;
    pointer-events: none;
  }

  .cc-hero__glow--one {
    width: 420px;
    height: 420px;
    left: -120px;
    top: 12%;
    background: radial-gradient(circle, rgba(146, 174, 131, 0.5), transparent 70%);
    animation: glowMove 14s ease-in-out infinite;
  }

  .cc-hero__glow--two {
    width: 360px;
    height: 360px;
    right: -100px;
    bottom: 4%;
    background: radial-gradient(circle, rgba(200, 169, 126, 0.4), transparent 70%);
    animation: glowMove 18s ease-in-out infinite reverse;
  }

  .cc-hero__content {
    position: relative;
    z-index: 2;
  }

  .cc-hero__overline {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: var(--cc-accent);
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-size: 0.82rem;
    margin-bottom: 26px;
  }

  .cc-hero__overline i {
    color: var(--cc-primary);
  }

  .cc-hero__title {
    font-size: clamp(3.2rem, 8vw, 6rem);
    font-weight: 700;
    line-height: 1.02;
    margin-bottom: 20px;
    max-width: 760px;
  }

  .cc-hero__title span {
    background: linear-gradient(120deg, #92ae83, #c8a97e);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-style: italic;
  }

  .cc-hero__subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    color: var(--cc-accent);
    margin-bottom: 20px;
  }

  .cc-hero__text {
    color: var(--cc-muted);
    font-size: 1.1rem;
    max-width: 560px;
    margin-bottom: 40px;
  }

  .cc-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .cc-hero__scroll {
    position: absolute;
    bottom: 34px;
    left: 50%;
    transform: translateX(-50%);
    width: 26px;
    height: 44px;
    border: 2px solid rgba(200, 169, 126, 0.5);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    padding-top: 8px;
    z-index: 2;
  }

  .cc-hero__scroll span {
    width: 4px;
    height: 10px;
    border-radius: 4px;
    background: var(--cc-accent);
    animation: scrollDot 1.8s ease-in-out infinite;
  }

  @keyframes heroFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-22px) rotate(3deg); }
  }

  @keyframes glowMove {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(40px, -30px) scale(1.15); }
  }

  @keyframes scrollDot {
    0% { transform: translateY(0); opacity: 1; }
    70% { transform: translateY(14px); opacity: 0; }
    100% { transform: translateY(0); opacity: 0; }
  }

  /* ===================== CARRUSEL ===================== */
  .cc-carousel-wrap {
    padding: 100px 0;
    background: var(--cc-dark);
  }

  .cc-carousel {
    position: relative;
    height: clamp(380px, 56vw, 640px);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
    border: 1px solid var(--cc-border);
  }

  .cc-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity 1.1s ease, visibility 1.1s;
  }

  .cc-slide.is-active {
    opacity: 1;
    visibility: visible;
    z-index: 1;
  }

  .cc-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.08);
    transition: transform 7s linear;
  }

  .cc-slide.is-active img {
    transform: scale(1);
  }

  .cc-slide__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10, 9, 4, 0.85) 0%, rgba(10, 9, 4, 0.1) 55%, rgba(10, 9, 4, 0.3) 100%);
  }

  .cc-slide__caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 46px;
    z-index: 2;
    transform: translateY(24px);
    opacity: 0;
    transition: transform 0.9s ease 0.4s, opacity 0.9s ease 0.4s;
  }

  .cc-slide.is-active .cc-slide__caption {
    transform: translateY(0);
    opacity: 1;
  }

  .cc-slide__sub {
    color: var(--cc-accent);
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin-bottom: 8px;
  }

  .cc-slide__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 4vw, 2.6rem);
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .cc-carousel__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid var(--cc-border);
    background: rgba(14, 13, 6, 0.55);
    backdrop-filter: blur(8px);
    color: var(--cc-cream);
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
  }

  .cc-carousel__arrow:hover {
    background: var(--cc-gradient);
    color: #fff;
    transform: translateY(-50%) scale(1.08);
  }

  .cc-carousel__arrow--prev { left: 22px; }
  .cc-carousel__arrow--next { right: 22px; }

  .cc-carousel__dots {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    gap: 10px;
  }

  .cc-carousel__dots button {
    width: 34px;
    height: 4px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.35);
    cursor: pointer;
    transition: background 0.3s ease, width 0.3s ease;
    padding: 0;
  }

  .cc-carousel__dots button.is-active {
    background: var(--cc-accent);
    width: 54px;
  }

  /* ===================== SERVICIOS ===================== */
  .cc-services {
    background: linear-gradient(180deg, var(--cc-dark) 0%, #17140f 100%);
  }

  .cc-head {
    text-align: center;
    margin-bottom: 64px;
  }

  .cc-service {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 20px;
    overflow: hidden;
    height: 100%;
    transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  }

  .cc-service:hover {
    transform: translateY(-10px);
    border-color: rgba(200, 169, 126, 0.4);
    box-shadow: var(--cc-shadow);
  }

  .cc-service__media {
    position: relative;
    height: 230px;
    overflow: hidden;
  }

  .cc-service__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
  }

  .cc-service:hover .cc-service__media img {
    transform: scale(1.1);
  }

  .cc-service__media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(14, 13, 6, 0.65), transparent 55%);
  }

  .cc-service__day {
    position: absolute;
    left: 18px;
    top: 18px;
    z-index: 2;
    background: rgba(14, 13, 6, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid var(--cc-border);
    color: var(--cc-accent);
    font-weight: 600;
    letter-spacing: 2px;
    font-size: 0.82rem;
    text-transform: uppercase;
    padding: 8px 16px;
    border-radius: 999px;
  }

  .cc-service__body {
    padding: 26px 24px 30px;
  }

  .cc-service__body h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
    min-height: 56px;
    line-height: 1.25;
  }

  .cc-service__times {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cc-service__times span {
    border: 1px solid rgba(146, 174, 131, 0.5);
    color: var(--cc-primary);
    font-weight: 500;
    font-size: 0.82rem;
    letter-spacing: 0.5px;
    padding: 7px 14px;
    border-radius: 999px;
    transition: background 0.3s ease, color 0.3s ease;
  }

  .cc-service:hover .cc-service__times span {
    background: var(--cc-gradient);
    border-color: transparent;
    color: #fff;
  }

  /* ===================== MINISTERIOS ===================== */
  .cc-ministries {
    background: linear-gradient(180deg, #17140f 0%, var(--cc-dark) 100%);
  }

  .cc-ministry {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 20px;
    padding: 34px 28px;
    height: 100%;
    text-align: center;
    transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .cc-ministry:hover {
    transform: translateY(-8px);
    border-color: rgba(200, 169, 126, 0.4);
    box-shadow: var(--cc-shadow);
  }

  .cc-ministry__icon {
    width: 68px;
    height: 68px;
    margin: 0 auto 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: var(--cc-gradient);
    color: #fff;
    font-size: 1.5rem;
    box-shadow: 0 10px 26px rgba(95, 125, 82, 0.4);
    transition: transform 0.4s ease;
  }

  .cc-ministry:hover .cc-ministry__icon {
    transform: scale(1.1) rotate(-6deg);
  }

  .cc-ministry h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.45rem;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .cc-ministry p {
    color: var(--cc-muted);
    font-size: 0.95rem;
    margin: 0;
  }

  /* ===================== SERMONES ===================== */
  .cc-sermons {
    background: var(--cc-dark);
  }

  .cc-sermon {
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 20px;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  }

  .cc-sermon:hover {
    transform: translateY(-10px);
    border-color: rgba(200, 169, 126, 0.4);
    box-shadow: var(--cc-shadow);
  }

  .cc-sermon__media {
    position: relative;
    height: 210px;
    overflow: hidden;
  }

  .cc-sermon__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
  }

  .cc-sermon:hover .cc-sermon__media img {
    transform: scale(1.08);
  }

  .cc-sermon__media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(14, 13, 6, 0.5), transparent 60%);
  }

  .cc-sermon__play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: rgba(14, 13, 6, 0.6);
    backdrop-filter: blur(6px);
    border: 1px solid var(--cc-border);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    transition: background 0.3s ease, transform 0.3s ease;
    z-index: 2;
  }

  .cc-sermon:hover .cc-sermon__play {
    background: var(--cc-gradient);
    transform: translate(-50%, -50%) scale(1.1);
  }

  .cc-sermon__body {
    padding: 26px 24px 28px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .cc-sermon__date {
    color: var(--cc-accent);
    font-size: 0.85rem;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  .cc-sermon__date i {
    margin-right: 8px;
  }

  .cc-sermon__body h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .cc-sermon__body p {
    color: var(--cc-muted);
    font-size: 0.95rem;
    margin-bottom: 20px;
    flex-grow: 1;
  }

  .cc-sermon__link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--cc-primary);
    font-weight: 500;
    font-size: 0.92rem;
    text-decoration: none;
    letter-spacing: 0.5px;
    transition: color 0.3s ease, gap 0.3s ease;
  }

  .cc-sermon__link:hover {
    color: var(--cc-accent);
    gap: 14px;
  }

  /* ===================== DONACIONES ===================== */
  .cc-donate {
    background: linear-gradient(180deg, var(--cc-dark) 0%, #17140f 100%);
  }

  .cc-donate__card {
    position: relative;
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid rgba(200, 169, 126, 0.3);
    border-radius: 26px;
    padding: 64px 48px;
    text-align: center;
    overflow: hidden;
    box-shadow: var(--cc-shadow);
  }

  .cc-donate__card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--cc-gradient-gold);
  }

  .cc-donate__glow {
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    background: radial-gradient(circle, rgba(200, 169, 126, 0.35), transparent 70%);
    top: -140px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .cc-donate__content {
    position: relative;
    z-index: 2;
  }

  .cc-donate__content .cc-overline {
    justify-content: center;
    margin-top: 18px;
  }

  .cc-donate__content .cc-section-sub {
    margin-bottom: 34px;
  }

  .cc-donate__btn {
    padding: 1.05rem 2.6rem;
    font-size: 1.02rem;
  }

  .cc-donate__verse {
    margin-top: 34px;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.15rem;
    color: var(--cc-accent-soft);
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }

  .cc-donate__verse cite {
    display: block;
    margin-top: 6px;
    font-style: normal;
    font-family: 'Jost', sans-serif;
    font-weight: 600;
    font-size: 0.8rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--cc-primary);
  }

  @media (max-width: 576px) {
    .cc-donate__card {
      padding: 44px 24px;
    }
  }

  /* ===================== RESPONSIVE ===================== */
  @media (max-width: 992px) {
    .cc-hero {
      padding: 70px 0 90px;
    }

    .cc-hero__bg {
      opacity: 0.05;
      justify-content: center;
      padding-right: 0;
    }
  }

  @media (max-width: 576px) {
    .cc-carousel-wrap {
      padding: 64px 0;
    }

    .cc-slide__caption {
      padding: 26px;
    }

    .cc-carousel__arrow {
      width: 44px;
      height: 44px;
      font-size: 0.85rem;
    }

    .cc-carousel__arrow--prev { left: 12px; }
    .cc-carousel__arrow--next { right: 12px; }
  }
</style>
