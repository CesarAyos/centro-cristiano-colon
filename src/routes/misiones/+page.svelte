<script>
  import { onMount, onDestroy } from 'svelte';
  import Footer from '../../components/Footer.svelte';
  import { setupReveals } from '$lib/reveal.js';
  import 'leaflet/dist/leaflet.css';
  import '$lib/public.css';

  const missions = [
    {
      name: 'Sede Central',
      location: 'San Juan de Colón, Táchira',
      country: 'Venezuela',
      type: 'Sede',
      typeIcon: 'fa-house-church',
      lat: 8.0283656,
      lng: -72.259379,
      text: 'Nuestra casa madre, desde donde se coordina la obra misionera.',
    },
    {
      name: 'Sede San Cristóbal',
      location: 'San Cristóbal, Táchira',
      country: 'Venezuela',
      type: 'Sede',
      typeIcon: 'fa-house-church',
      lat: 7.7756663,
      lng: -72.2214154,
      text: 'Sede central de la red en Venezuela, en la avenida Demócrata con avenida Libertador.',
    },
    {
      name: 'Sede La Fría',
      location: 'La Fría, Táchira',
      country: 'Venezuela',
      type: 'Sede',
      typeIcon: 'fa-house-church',
      lat: 8.2118501,
      lng: -72.2536276,
      text: 'Sede de la iglesia en la avenida Aeropuerto de La Fría.',
    },
    {
      name: 'Sede Coloncito',
      location: 'Coloncito, Táchira',
      country: 'Venezuela',
      type: 'Sede',
      typeIcon: 'fa-house-church',
      lat: 8.3296762,
      lng: -72.0891631,
      text: 'Sede de la iglesia en el municipio Panamericano.',
    },
    {
      name: 'Sede La Tendida',
      location: 'La Tendida, Táchira',
      country: 'Venezuela',
      type: 'Sede',
      typeIcon: 'fa-house-church',
      lat: 8.5084083,
      lng: -71.8320895,
      text: 'Sede de la iglesia en la ruta hacia El Vigía.',
    },
    {
      name: 'Misión Étnica Arhuaca',
      location: 'Sierra Nevada de Santa Marta',
      country: 'Colombia',
      type: 'Étnica',
      typeIcon: 'fa-feather-pointed',
      lat: 10.8591,
      lng: -73.759,
      text: 'Alcanzando a la comunidad indígena Ijku (Arhuacos) con el evangelio.',
    },
    {
      name: 'Misión Étnica Guambiana',
      location: 'Silvia, Cauca',
      country: 'Colombia',
      type: 'Étnica',
      typeIcon: 'fa-feather-pointed',
      lat: 2.615,
      lng: -76.37,
      text: 'Evangelización y acompañamiento social a la comunidad Misak (Guambianos).',
    },
    {
      name: 'Misión Nacional',
      location: 'Caracas',
      country: 'Venezuela',
      type: 'Nacional',
      typeIcon: 'fa-flag',
      lat: 10.4806,
      lng: -66.9036,
      text: 'Proyectos de expansión y cobertura en todo el territorio venezolano.',
    },
    {
      name: 'Misión Internacional',
      location: 'Madrid',
      country: 'España',
      type: 'Internacional',
      typeIcon: 'fa-earth-americas',
      lat: 40.4168,
      lng: -3.7038,
      text: 'Congregaciones fundadas en Europa, llevando esperanza hasta lo último de la tierra.',
    },
    {
      name: 'Misión Internacional',
      location: 'Manila',
      country: 'Filipinas',
      type: 'Internacional',
      typeIcon: 'fa-earth-americas',
      lat: 14.5995,
      lng: 120.9842,
      text: 'Congregaciones fundadas en Asia, cumpliendo la Gran Comisión.',
    },
    {
      name: 'Misión Urbana',
      location: 'Bogotá',
      country: 'Colombia',
      type: 'Urbana',
      typeIcon: 'fa-city',
      lat: 4.711,
      lng: -74.0721,
      text: 'Programas de impacto social y transformación en las grandes ciudades.',
    },
  ];

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

  let mapEl;
  let map;
  let mapFailed = false;
  let activeIndex = -1;
  let destroyReveals = () => {};

  onMount(async () => {
    destroyReveals = setupReveals();
    try {
      const L = (await import('leaflet')).default;

      map = L.map(mapEl).setView([7.5, -66], 4);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(map);

      const icon = L.divIcon({
        className: 'cc-mission-pin',
        html: '<span class="cc-mission-pin__inner"><i class="fa-solid fa-cross"></i></span>',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -22],
      });

      missions.forEach((m, i) => {
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(
          `<div class="cc-mission-pop">
            <strong>${m.name}</strong>
            <span class="cc-mission-pop__place">${m.location}, ${m.country}</span>
            <em>${m.type}</em>
            <p>${m.text}</p>
          </div>`
        );
        marker.on('click', () => {
          activeIndex = i;
        });
        m.marker = marker;
      });

      setTimeout(() => map && map.invalidateSize(), 300);
    } catch (e) {
      console.error('Error inicializando el mapa de misiones:', e);
      mapFailed = true;
    }
  });

  function focusMission(i) {
    const m = missions[i];
    activeIndex = i;
    if (map && m.marker) {
      map.flyTo([m.lat, m.lng], 7, { duration: 1.1 });
      setTimeout(() => m.marker.openPopup(), 1250);
    }
  }

  onDestroy(() => {
    if (map) map.remove();
    map = null;
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
    </div>
  </section>

  <section class="cc-section cc-section--map">
    <div class="cc-container">
      <div class="cc-map-head cc-reveal">
        <span class="cc-overline">La Gran Comisión</span>
        <h2 class="cc-section-title">Nuestras Misiones en el Mundo</h2>
        <p class="cc-section-sub">
          Explora cada obra misionera en el mapa. Haz clic en un marcador o en una
          tarjeta para conocer más.
        </p>
      </div>

      <div class="row g-4">
        <div class="col-lg-7">
          <div class="cc-mission-map cc-reveal cc-d1" bind:this={mapEl}>
            {#if mapFailed}
              <div class="cc-mission-map__fallback">
                <i class="fa-solid fa-earth-americas"></i>
                <p>No fue posible cargar el mapa en este momento.</p>
                <p>Explora las misiones desde las tarjetas de la derecha.</p>
              </div>
            {/if}
          </div>
        </div>
        <div class="col-lg-5">
          <div class="cc-mission-list cc-reveal cc-d2">
            {#each missions as m, i (m.name + m.location)}
              <button
                class="cc-mission-card"
                class:is-active={activeIndex === i}
                type="button"
                on:click={() => focusMission(i)}
              >
                <span class="cc-mission-card__icon"><i class="fa-solid {m.typeIcon}"></i></span>
                <span class="cc-mission-card__body">
                  <strong>{m.name}</strong>
                  <em>{m.location}, {m.country}</em>
                </span>
                <span class="cc-mission-card__tag">{m.type}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cc-section cc-section--cta">
    <div class="cc-container">
      <div class="cc-cta cc-reveal">
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

  .cc-section--map {
    padding-top: 40px;
  }

  .cc-map-head {
    text-align: center;
    margin-bottom: 52px;
  }

  .cc-mission-map {
    height: 560px;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--cc-border);
    box-shadow: var(--cc-shadow);
    z-index: 0;
    position: relative;
  }

  .cc-mission-map__fallback {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    padding: 30px;
    color: var(--cc-muted);
  }

  .cc-mission-map__fallback i {
    font-size: 2.6rem;
    color: var(--cc-accent);
    margin-bottom: 10px;
  }

  .cc-mission-map__fallback p {
    margin: 0;
  }

  .cc-mission-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 560px;
    overflow-y: auto;
    padding-right: 6px;
  }

  .cc-mission-card {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 14px 16px;
    text-align: left;
    background: linear-gradient(160deg, #1d1a15 0%, #16130e 100%);
    border: 1px solid var(--cc-border);
    border-radius: 16px;
    color: var(--cc-cream);
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
  }

  .cc-mission-card:hover {
    border-color: rgba(200, 169, 126, 0.45);
    transform: translateX(4px);
  }

  .cc-mission-card.is-active {
    border-color: var(--cc-accent);
    background: linear-gradient(160deg, rgba(200, 169, 126, 0.16), rgba(146, 174, 131, 0.1));
  }

  .cc-mission-card__icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(146, 174, 131, 0.12);
    border: 1px solid var(--cc-border);
    color: var(--cc-accent);
  }

  .cc-mission-card__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  .cc-mission-card__body strong {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.08rem;
    font-weight: 600;
    color: var(--cc-cream);
  }

  .cc-mission-card__body em {
    font-style: normal;
    color: var(--cc-muted);
    font-size: 0.82rem;
  }

  .cc-mission-card__tag {
    flex-shrink: 0;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--cc-primary);
    border: 1px solid var(--cc-border);
    border-radius: 999px;
    padding: 4px 10px;
  }

  :global(.cc-mission-pin) {
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.55));
  }

  :global(.cc-mission-pin__inner) {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #c8a97e, #92ae83);
    border: 2px solid #f5f1e8;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.cc-mission-pin__inner i) {
    transform: rotate(45deg);
    color: #1d1a15;
    font-size: 13px;
  }

  :global(.leaflet-popup-content-wrapper) {
    background: #1d1a15;
    color: #f5f1e8;
    border: 1px solid rgba(200, 169, 126, 0.35);
    border-radius: 14px;
    font-family: 'Jost', sans-serif;
  }

  :global(.leaflet-popup-content) {
    margin: 14px 18px;
  }

  :global(.leaflet-popup-tip) {
    background: #1d1a15;
    border: 1px solid rgba(200, 169, 126, 0.35);
  }

  :global(.leaflet-popup-close-button) {
    color: #b7b0a3 !important;
  }

  :global(.cc-mission-pop strong) {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 600;
  }

  :global(.cc-mission-pop__place) {
    display: block;
    color: #b7b0a3;
    font-size: 0.82rem;
    margin-top: 2px;
  }

  :global(.cc-mission-pop em) {
    display: inline-block;
    font-style: normal;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c8a97e;
    margin-top: 8px;
  }

  :global(.cc-mission-pop p) {
    color: #b7b0a3;
    font-size: 0.85rem;
    line-height: 1.55;
    margin: 8px 0 0;
  }

  :global(.leaflet-control-zoom a) {
    background: #1d1a15 !important;
    color: #c8a97e !important;
    border-color: rgba(200, 169, 126, 0.3) !important;
  }

  :global(.leaflet-control-attribution) {
    background: rgba(14, 13, 6, 0.75) !important;
    color: #8a847a !important;
  }

  :global(.leaflet-control-attribution a) {
    color: #c8a97e !important;
  }

  @media (max-width: 768px) {
    .cc-cta {
      padding: 30px;
      text-align: center;
      justify-content: center;
    }

    .cc-mission-map {
      height: 420px;
    }

    .cc-mission-list {
      max-height: none;
    }
  }
</style>