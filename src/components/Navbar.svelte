<script>
  import { onMount } from 'svelte';
  
  // Variables reactivas para el estado del navbar
  let isNavbarOpen = false;
  let scrolled = false;
  let currentPage = '';
  
  // Función para detectar la página actual
  function getCurrentPage() {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path.split('/').pop() || 'index.html';
    }
    return '';
  }
  
  // Función para alternar el navbar
  function toggleNavbar() {
    isNavbarOpen = !isNavbarOpen;
  }
  
  // Función para cerrar el navbar (útil en móviles)
  function closeNavbar() {
    isNavbarOpen = false;
  }
  
  // Solo ejecutar en el cliente
  onMount(() => {
    currentPage = getCurrentPage();
    
    // Efecto de scroll
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        scrolled = window.scrollY > 50;
      });
      
      // Scroll suave para enlaces internos
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
            
            // Cerrar navbar en móvil
            closeNavbar();
          }
        });
      });
    }
  });
</script>

<header class="modern-navbar" class:scrolled>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!-- Logo y nombre -->
      <a class="navbar-brand" href="/" on:click={closeNavbar}>
        <div class="logo-container">
          <img src="/logo.png" alt="Centro Cristiano Colón" class="logo">
          <div class="brand-text">
            <span class="brand-name">CENTRO CRISTIANO COLÓN</span>
            <span class="brand-tagline">Un sitio ideal para un momento espiritual</span>
          </div>
        </div>
      </a>
      
      <!-- Botón hamburguesa para móvil -->
      <button 
        class="navbar-toggler" 
        type="button" 
        on:click={toggleNavbar}
        aria-controls="navbarContent" 
        aria-expanded={isNavbarOpen}
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <!-- Contenido del navbar -->
      <div class="navbar-collapse {isNavbarOpen ? 'show' : ''}" id="navbarContent">
        <!-- Navegación principal -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Dropdown: Nuestra Iglesia -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="/" role="button" 
               data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-church"></i> Nuestra Iglesia
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="adn" on:click={closeNavbar}><i class="fas fa-dna"></i> Nuestro ADN</a></li>
              <li><a class="dropdown-item" href="fundadores" on:click={closeNavbar}><i class="fas fa-users"></i> Nuestros Fundadores</a></li>
              <li><a class="dropdown-item" href="misiones" on:click={closeNavbar}><i class="fas fa-globe-americas"></i> Misiones</a></li>
            </ul>
          </li>
          
          <!-- Enlace simple: Ubícanos -->
          <li class="nav-item">
            <a class="nav-link" href="ubicanos" on:click={closeNavbar}>
              <i class="fas fa-map-marker-alt"></i> Ubícanos
            </a>
          </li>
          
          
          <!-- Enlace simple: Servicios -->
          <li class="nav-item">
            <a class="nav-link" href="/login" on:click={closeNavbar}>
              <i class="fas fa-calendar-check"></i> Login
            </a>
          </li>
          
          <!-- Enlace: Inicio (visible solo en móvil) -->
          <li class="nav-item d-lg-none">
            <a class="nav-link" href="/" on:click={closeNavbar}>
              <i class="fas fa-home"></i> Inicio
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>

<style>
  /* Variables de diseño */
  :root {
    --navbar-bg: #1a1a1a;
    --navbar-gradient: linear-gradient(135deg, #0e0d06 0%, #1b1b1b 100%);
    --primary-color: #92ae83;
    --primary-dark: #789768;
    --accent-color: #c8a97e;
    --text-light: #f8f9fa;
    --text-muted: #adb5bd;
    --border-color: rgba(146, 174, 131, 0.2);
    --shadow-sm: 0 2px 10px rgba(0,0,0,0.1);
    --shadow-md: 0 5px 20px rgba(0,0,0,0.2);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --border-radius: 10px;
  }
  
  /* Navbar principal */
  .modern-navbar {
    background: var(--navbar-gradient);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
    padding: 0;
    transition: var(--transition);
  }
  
  /* Estado cuando hay scroll */
  .modern-navbar.scrolled {
    box-shadow: 0 5px 25px rgba(0,0,0,0.3);
    background: rgba(26, 26, 26, 0.95);
  }
  
  .modern-navbar .navbar {
    padding: 0.5rem 0;
  }
  
  /* Logo y marca */
  .navbar-brand {
    padding: 0;
    text-decoration: none;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-color);
    padding: 3px;
    transition: var(--transition);
  }
  
  .logo:hover {
    transform: rotate(10deg);
    border-color: var(--accent-color);
  }
  
  .brand-text {
    display: flex;
    flex-direction: column;
  }
  
  .brand-name {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary-color);
    line-height: 1.2;
  }
  
  .brand-tagline {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.75rem;
    color: var(--accent-color);
    font-weight: 300;
  }
  
  /* Botón hamburguesa */
  .navbar-toggler {
    border: 1px solid var(--border-color);
    padding: 0.5rem 0.75rem;
    border-radius: var(--border-radius);
    background: transparent;
    cursor: pointer;
  }
  
  .navbar-toggler-icon {
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(146, 174, 131, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }
  
  /* Contenido del navbar - colapsable */
  .navbar-collapse {
    flex-grow: 0;
  }
  
  .navbar-collapse:not(.show) {
    display: none;
  }
  
  @media (min-width: 992px) {
    .navbar-collapse {
      display: flex !important;
    }
    
    .navbar-toggler {
      display: none;
    }
  }
  
  /* Enlaces de navegación */
  .navbar-nav {
    gap: 5px;
    list-style: none;
    padding-left: 0;
  }
  
  .nav-link {
    color: var(--text-light) !important;
    font-weight: 500;
    padding: 0.75rem 1rem !important;
    border-radius: var(--border-radius);
    transition: var(--transition);
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    cursor: pointer;
  }
  
  .nav-link:hover, .nav-link:focus, .nav-link.active {
    color: var(--primary-color) !important;
    background: rgba(146, 174, 131, 0.1);
  }
  
  .nav-link i {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }
  
  /* Dropdowns */
  .dropdown {
    position: relative;
  }
  
  .dropdown-menu {
    background: var(--navbar-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    padding: 0.5rem;
    min-width: 220px;
    margin-top: 0.5rem !important;
    position: absolute;
    z-index: 1000;
    display: none;
    list-style: none;
  }
  
  .dropdown-menu.show {
    display: block;
  }
  
  @media (max-width: 991.98px) {
    .dropdown-menu {
      position: static !important;
      transform: none !important;
      width: 100%;
      border: none;
      box-shadow: none;
      background: rgba(0, 0, 0, 0.2);
    }
  }
  
  .dropdown-item {
    color: var(--text-light);
    padding: 0.75rem 1rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: var(--transition);
    text-decoration: none;
    cursor: pointer;
  }
  
  .dropdown-item:hover, .dropdown-item:focus {
    background: rgba(146, 174, 131, 0.15);
    color: var(--primary-color);
  }
  
  .dropdown-item i {
    width: 18px;
    text-align: center;
    color: var(--primary-color);
  }
  
  .dropdown-header {
    color: var(--accent-color);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0.75rem 1rem;
    margin-bottom: 0;
  }
  
  .dropdown-divider {
    border-color: var(--border-color);
    margin: 0.5rem 0;
    border: 0;
    border-top: 1px solid;
  }
  
  /* Perfil de usuario */
  .user-actions {
    gap: 15px;
    display: flex;
    align-items: center;
  }
  
  .user-profile {
    text-decoration: none;
    color: var(--text-light);
    padding: 0.5rem;
    border-radius: var(--border-radius);
    transition: var(--transition);
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .user-profile:hover {
    background: rgba(146, 174, 131, 0.1);
    color: var(--primary-color);
  }
  
  .user-avatar {
    position: relative;
    width: 40px;
    height: 40px;
  }
  
  .user-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-color);
  }
  
  .online-status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background: #28a745;
    border-radius: 50%;
    border: 2px solid var(--navbar-bg);
  }
  
  .user-info {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }
  
  .user-name {
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .user-role {
    font-size: 0.75rem;
    color: var(--text-muted);
  }
  
  .dropdown-arrow {
    margin-left: 5px;
    font-size: 0.8rem;
    transition: var(--transition);
  }
  
  .user-profile.show .dropdown-arrow {
    transform: rotate(180deg);
  }
  
  /* Botón de WhatsApp */
  .whatsapp-btn {
    background: linear-gradient(135deg, #25d366, #128c7e);
    color: white;
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--transition);
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
    white-space: nowrap;
  }
  
  .whatsapp-btn:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
  }
  
  .whatsapp-btn i {
    font-size: 1.2rem;
  }
  
  /* Efectos y animaciones */
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: var(--transition);
    transform: translateX(-50%);
  }
  
  .nav-link:hover::after, .nav-link.active::after {
    width: 80%;
  }
  
  /* Responsive */
  @media (max-width: 991.98px) {
    .navbar-collapse {
      background: var(--navbar-bg);
      border-radius: var(--border-radius);
      padding: 1rem;
      margin-top: 1rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
    }
    
    .user-actions {
      margin-top: 1rem;
      justify-content: center;
      width: 100%;
      flex-direction: column;
    }
    
    .user-profile {
      justify-content: center;
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .logo-container {
      gap: 10px;
    }
    
    .brand-name {
      font-size: 0.95rem;
    }
    
    .brand-tagline {
      font-size: 0.7rem;
    }
    
    .whatsapp-btn span {
      display: none;
    }
    
    .whatsapp-btn {
      padding: 0.6rem;
      width: 40px;
      height: 40px;
      justify-content: center;
      border-radius: 50%;
    }
  }
  
  @media (max-width: 480px) {
    .brand-tagline {
      display: none;
    }
    
    .logo {
      width: 40px;
      height: 40px;
    }
  }
  
  /* Animación de entrada */
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modern-navbar {
    animation: slideDown 0.5s ease-out;
  }
</style>