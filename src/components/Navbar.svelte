<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  const GRUPOS = [
    {
      id: 'iglesia',
      etiqueta: 'Nuestra Iglesia',
      items: [
        { href: '/adn', etiqueta: 'Nuestro ADN', icono: 'fa-solid fa-dna' },
        { href: '/fundadores', etiqueta: 'Nuestros Fundadores', icono: 'fa-solid fa-people-group' },
        { href: '/misiones', etiqueta: 'Misiones', icono: 'fa-solid fa-earth-americas' },
        { href: '/ubicanos', etiqueta: 'Ubícanos', icono: 'fa-solid fa-location-dot' },
      ],
    },
    {
      id: 'palabra',
      etiqueta: 'La Palabra',
      items: [
        { href: '/predica', etiqueta: 'Prédicas', icono: 'fa-solid fa-video' },
        { href: '/bosquejos', etiqueta: 'Bosquejos', icono: 'fa-solid fa-file-alt' },
        { href: '/biblia', etiqueta: 'Lee la Biblia', icono: 'fa-solid fa-book-open' },
        { href: '/reflexiones', etiqueta: 'Reflexiones', icono: 'fa-solid fa-book' },
      ],
    },
    {
      id: 'comunidad',
      etiqueta: 'Comunidad',
      items: [
        { href: '/peticiones', etiqueta: 'Peticiones', icono: 'fa-solid fa-hands-praying' },
        { href: '/testimonios', etiqueta: 'Testimonios', icono: 'fa-solid fa-note-sticky' },
      ],
    },
  ];

  let scrolled = false;
  let mobileOpen = false;
  let abierto = null;
  let raiz;

  function onScroll() {
    scrolled = window.scrollY > 40;
  }

  onMount(() => {
    window.addEventListener('scroll', onScroll, { passive: true });

    const alHacerClicFuera = (e) => {
      if (raiz && !raiz.contains(e.target)) abierto = null;
    };
    const alPulsarEscape = (e) => {
      if (e.key === 'Escape') {
        abierto = null;
        mobileOpen = false;
      }
    };

    document.addEventListener('click', alHacerClicFuera);
    document.addEventListener('keydown', alPulsarEscape);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', alHacerClicFuera);
      document.removeEventListener('keydown', alPulsarEscape);
    };
  });

  function closeMenu() {
    mobileOpen = false;
    abierto = null;
  }

  function alternar(id) {
    abierto = abierto === id ? null : id;
  }

  function esActual(href) {
    return $page.url.pathname === href;
  }

  $: grupoActual = GRUPOS.find((g) => g.items.some((i) => esActual(i.href)))?.id ?? null;

  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }
</script>

<header class="cc-nav" class:is-scrolled={scrolled} bind:this={raiz}>
  <div class="cc-nav__inner cc-container">
    <a class="cc-nav__brand" href="/" on:click={closeMenu} aria-label="Ir al inicio">
      <img src="/logo.png" alt="Logo Centro Cristiano Misión Global Colón" class="cc-nav__logo" />
      <!-- <span class="cc-nav__brand-text">
        <span class="cc-nav__name">Centro Cristiano Misión Global Colón</span>
        <span class="cc-nav__tagline">Un lugar para un momento espiritual</span>
      </span> -->
    </a>

    <nav class="cc-nav__menu" class:is-open={mobileOpen} aria-label="Navegación principal">
      <a href="/" class="cc-nav__link" class:is-actual={esActual('/')} on:click={closeMenu}>Inicio</a>

      {#each GRUPOS as grupo}
        <div class="cc-nav__dropdown" class:is-open={abierto === grupo.id}>
          <button
            class="cc-nav__link cc-nav__toggle"
            class:is-actual={grupoActual === grupo.id}
            type="button"
            aria-expanded={abierto === grupo.id}
            on:click={() => alternar(grupo.id)}
          >
            <span>{grupo.etiqueta}</span>
            <i class="fa-solid fa-chevron-down cc-nav__caret"></i>
          </button>
          <div class="cc-nav__submenu">
            {#each grupo.items as item}
              <a
                href={item.href}
                class="cc-nav__subitem"
                class:is-actual={esActual(item.href)}
                on:click={closeMenu}
              >
                <i class={item.icono}></i>{item.etiqueta}
              </a>
            {/each}
          </div>
        </div>
      {/each}

      <a href="/envivo" class="cc-nav__link cc-nav__link--live" on:click={closeMenu}>
        <span class="cc-nav__live-dot"></span>En Vivo
      </a>
    </nav>

    <div class="cc-nav__actions">
      <a
        class="cc-nav__wa"
        href="https://wa.me/584247187229?&text=Me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20iglesia."
        target="_blank"
        rel="noopener"
        title="Escríbenos por WhatsApp"
      >
        <i class="fa-brands fa-whatsapp"></i>
        <span>Contáctanos</span>
      </a>
      <a class="cc-nav__login" href="/login" title="Acceso interno">
        <i class="fa-solid fa-user-lock"></i>
      </a>
      <button
        class="cc-nav__burger"
        class:is-open={mobileOpen}
        type="button"
        aria-label="Abrir menú"
        aria-expanded={mobileOpen}
        on:click={() => (mobileOpen = !mobileOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
</header>

<style>
  :root {
    --nav-bg: rgba(14, 13, 6, 0.82);
    --nav-primary: #92ae83;
    --nav-accent: #c8a97e;
    --nav-cream: #f5f1e8;
    --nav-muted: #b7b0a3;
    --nav-border: rgba(200, 169, 126, 0.16);
  }

  .cc-nav {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1050;
    background: linear-gradient(180deg, rgba(14, 13, 6, 0.95) 0%, rgba(14, 13, 6, 0.75) 100%);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--nav-border);
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }

  .cc-container {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .cc-nav.is-scrolled {
    background: rgba(14, 13, 6, 0.97);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
  }

  .cc-nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    height: 78px;
    transition: height 0.4s ease;
  }

  .cc-nav.is-scrolled .cc-nav__inner {
    height: 66px;
  }

  /* ---- Marca ---- */
  .cc-nav__brand {
    display: flex;
    align-items: center;
    gap: 14px;
    text-decoration: none;
    min-width: 0;
    flex-shrink: 1;
  }

  .cc-nav__logo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--nav-primary);
    padding: 3px;
    transition: transform 0.4s ease, border-color 0.4s ease;
  }

  .cc-nav__brand:hover .cc-nav__logo {
    transform: rotate(-8deg) scale(1.05);
    border-color: var(--nav-accent);
  }

  .cc-nav__brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    min-width: 0;
  }

  .cc-nav__name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    font-size: 1.28rem;
    color: var(--nav-cream);
    letter-spacing: 0.5px;
  }

  .cc-nav__tagline {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--nav-accent);
  }

  /* ---- Menú ---- */
  .cc-nav__menu {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    max-width: 100%;
  }

  .cc-nav__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0.65rem 1.05rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: 0.94rem;
    letter-spacing: 0.4px;
    color: var(--nav-cream);
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .cc-nav__link::after {
    content: '';
    position: absolute;
    left: 1.05rem;
    right: 1.05rem;
    bottom: 0.3rem;
    height: 2px;
    background: linear-gradient(90deg, var(--nav-primary), var(--nav-accent));
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
  }

  .cc-nav__link:hover,
  .cc-nav__link:focus-visible {
    color: var(--nav-primary);
  }

  .cc-nav__link:hover::after,
  .cc-nav__link:focus-visible::after {
    transform: scaleX(1);
  }

  .cc-nav__link.is-actual {
    color: var(--nav-primary);
  }

  .cc-nav__link.is-actual::after {
    transform: scaleX(1);
  }

  /* ---- Link Live ---- */
  .cc-nav__link--live {
    color: #e07a5f;
  }

  .cc-nav__live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e07a5f;
    animation: cc-nav-pulse 1.6s ease-out infinite;
  }

  @keyframes cc-nav-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(224, 122, 95, 0.55);
    }
    70% {
      box-shadow: 0 0 0 9px rgba(224, 122, 95, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(224, 122, 95, 0);
    }
  }

  /* ---- Dropdown ---- */
  .cc-nav__dropdown {
    position: relative;
  }

  .cc-nav__caret {
    font-size: 0.6rem;
    color: var(--nav-accent);
    transition: transform 0.3s ease;
  }

  .cc-nav__dropdown.is-open .cc-nav__caret {
    transform: rotate(180deg);
  }

  .cc-nav__submenu {
    position: absolute;
    top: calc(100% + 14px);
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    min-width: 244px;
    max-width: 90vw;
    background: #18150f;
    border: 1px solid var(--nav-border);
    border-radius: 16px;
    padding: 10px;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
  }

  .cc-nav__dropdown.is-open .cc-nav__submenu {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }

  .cc-nav__subitem {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    font-size: 0.92rem;
    color: var(--nav-cream);
    text-decoration: none;
    transition: background 0.25s ease, color 0.25s ease;
  }

  .cc-nav__subitem i {
    width: 18px;
    text-align: center;
    color: var(--nav-primary);
  }

  .cc-nav__subitem:hover {
    background: rgba(146, 174, 131, 0.12);
    color: var(--nav-accent);
  }

  .cc-nav__subitem.is-actual {
    background: rgba(146, 174, 131, 0.16);
    color: var(--nav-accent-soft, var(--nav-accent));
  }

  .cc-nav__subitem.is-actual i {
    color: var(--nav-accent);
  }

  /* ---- Acciones ---- */
  .cc-nav__actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cc-nav__wa {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.6rem 1.3rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #92ae83, #5f7d52);
    color: #fff;
    font-family: 'Jost', sans-serif;
    font-weight: 600;
    font-size: 0.88rem;
    text-decoration: none;
    box-shadow: 0 8px 22px rgba(95, 125, 82, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .cc-nav__wa:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(95, 125, 82, 0.55);
    color: #fff;
  }

  .cc-nav__login {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: var(--nav-muted);
    font-size: 1rem;
    text-decoration: none;
    border: 1px solid transparent;
    transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  }

  .cc-nav__login:hover {
    color: var(--nav-accent);
    border-color: var(--nav-border);
    background: rgba(200, 169, 126, 0.08);
  }

  /* ---- Hamburguesa ---- */
  .cc-nav__burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--nav-border);
    border-radius: 12px;
    cursor: pointer;
  }

  .cc-nav__burger span {
    display: block;
    height: 2px;
    width: 100%;
    background: var(--nav-primary);
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .cc-nav__burger.is-open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .cc-nav__burger.is-open span:nth-child(2) {
    opacity: 0;
  }

  .cc-nav__burger.is-open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* ---- Responsive ---- */
  @media (max-width: 991.98px) {
    .cc-nav__wa span {
      display: none;
    }

    .cc-nav__wa {
      padding: 0.6rem;
      width: 42px;
      height: 42px;
      justify-content: center;
      border-radius: 50%;
    }

    .cc-nav__burger {
      display: flex;
    }

    .cc-nav__menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 4px;
      background: rgba(14, 13, 6, 0.99);
      border: none;
      border-top: 1px solid var(--nav-border);
      border-radius: 0;
      padding: 18px 24px 28px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
      overflow-y: auto;
      max-height: calc(100vh - 78px);
      z-index: 1049;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
    }

    .cc-nav__menu.is-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .cc-nav__link {
      justify-content: flex-start;
      width: 100%;
      padding: 0.8rem 1rem;
    }

    .cc-nav__link::after {
      display: none;
    }

    .cc-nav__submenu {
      position: static;
      transform: none;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      min-width: 0;
      max-width: none;
      box-shadow: none;
      background: rgba(0, 0, 0, 0.25);
      border: none;
      margin: 4px 0 8px;
      max-height: 0;
      overflow: hidden;
      padding: 0 8px;
      transition: max-height 0.35s ease, padding 0.35s ease;
    }

    .cc-nav__dropdown.is-open .cc-nav__submenu {
      max-height: 320px;
      padding: 8px;
      transform: none;
    }
  }

  @media (max-width: 480px) {
    .cc-nav__tagline {
      display: none;
    }

    .cc-nav__logo {
      width: 42px;
      height: 42px;
    }

    .cc-nav__name {
      font-size: 1.08rem;
    }

    .cc-nav__inner {
      gap: 10px;
      padding: 0 16px;
    }
  }
</style>
