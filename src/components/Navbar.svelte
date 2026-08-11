<script>
  import { onMount } from 'svelte';

  let scrolled = false;
  let mobileOpen = false;
  let churchOpen = false;

  function onScroll() {
    scrolled = window.scrollY > 40;
  }

  onMount(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function closeMenu() {
    mobileOpen = false;
    churchOpen = false;
  }
</script>

<header class="cc-nav" class:is-scrolled={scrolled}>
  <div class="cc-nav__inner cc-container">
    <a class="cc-nav__brand" href="/" on:click={closeMenu} aria-label="Ir al inicio">
      <img src="/logo.png" alt="Logo Centro Cristiano Colón" class="cc-nav__logo" />
      <span class="cc-nav__brand-text">
        <span class="cc-nav__name">Centro Cristiano Colón</span>
        <span class="cc-nav__tagline">Un lugar para un momento espiritual</span>
      </span>
    </a>

    <nav class="cc-nav__menu" class:is-open={mobileOpen} aria-label="Navegación principal">
      <a href="/" class="cc-nav__link" on:click={closeMenu}>Inicio</a>

      <div class="cc-nav__dropdown" class:is-open={churchOpen}>
        <button
          class="cc-nav__link cc-nav__toggle"
          type="button"
          aria-expanded={churchOpen}
          on:click={() => (churchOpen = !churchOpen)}
        >
          <span>Nuestra Iglesia</span>
          <i class="fa-solid fa-chevron-down cc-nav__caret"></i>
        </button>
        <div class="cc-nav__submenu">
          <a href="/adn" class="cc-nav__subitem" on:click={closeMenu}>
            <i class="fa-solid fa-dna"></i>Nuestro ADN
          </a>
          <a href="/fundadores" class="cc-nav__subitem" on:click={closeMenu}>
            <i class="fa-solid fa-people-group"></i>Nuestros Fundadores
          </a>
          <a href="/misiones" class="cc-nav__subitem" on:click={closeMenu}>
            <i class="fa-solid fa-earth-americas"></i>Misiones
          </a>
        </div>
      </div>

      <a href="/predica" class="cc-nav__link" on:click={closeMenu}>Prédicas</a>
      <a href="/envivo" class="cc-nav__link" on:click={closeMenu}>En Vivo</a>
      <a href="/reflexiones" class="cc-nav__link" on:click={closeMenu}>Reflexiones</a>
      <a href="/biblia" class="cc-nav__link" on:click={closeMenu}>Biblia</a>
      <a href="/ubicanos" class="cc-nav__link" on:click={closeMenu}>Ubícanos</a>
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
    min-width: 250px;
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
      left: 16px;
      right: 16px;
      flex-direction: column;
      align-items: stretch;
      gap: 4px;
      background: rgba(14, 13, 6, 0.98);
      border: 1px solid var(--nav-border);
      border-radius: 18px;
      padding: 14px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
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
      max-height: 260px;
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
  }
</style>
