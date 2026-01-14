<script>
  import Bosquejo from "../../components/bosquejo.svelte";
  import Nuevos from "../../components/nuevos.svelte";
  import Planilla from "../../components/planilla.svelte";
  import Reportes from "../../components/reportes.svelte";
  import Subirvideos from "../../components/subirvideos.svelte";
  import { supabase } from "../../components/supabase.js";
  import { onMount } from "svelte";
  import Verbosquejo from "../../components/verbosquejo.svelte";
  import Vervideoadmin from "../../components/vervideoadmin.svelte";
  import Estadistica from "../../components/estadistica.svelte";
  import { fade } from 'svelte/transition';

  // Variables reactivas
  let user = null;
  let userName = "";
  let activeSection = 'planilla';
  let isMobile = false;

  onMount(async () => {
    // 1. Verificar sesión del usuario
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      window.location.href = "/login";
      return;
    }
    
    user = session.user;
    userName = user.user_metadata.full_name || user.email;

    // 2. Detectar si es móvil
    const checkMobile = () => {
      isMobile = window.innerWidth <= 900;
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Función para mostrar contenido (nueva versión)
  function showContent(section) {
    activeSection = section;
    
    // Solo intentar cerrar offcanvas si estamos en móvil y bootstrap está disponible
    if (isMobile && typeof bootstrap !== 'undefined') {
      try {
        const offcanvasElement = document.getElementById('offcanvasNavbar');
        if (offcanvasElement) {
          const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
          if (offcanvas) offcanvas.hide();
        }
      } catch (error) {
        console.log('No se pudo cerrar el offcanvas:', error);
      }
    }
  }

  // Función para manejar la navegación de contenido (mantener compatibilidad con el método antiguo si es necesario)
  function showContentLegacy(id) {
    // Esta función es para mantener compatibilidad con el código antiguo
    // Convierte el ID a la sección correspondiente
    const sectionMap = {
      'planilla': 'planilla',
      'nuevos': 'nuevos', 
      'reportes': 'reportes',
      'verbosquejoadmin': 'verbosquejoadmin',
      'vervideoadmin': 'vervideoadmin',
      'bosquejos': 'bosquejos',
      'subirvideos': 'subirvideos',
      'estadistica': 'estadistica'
    };
    
    if (sectionMap[id]) {
      showContent(sectionMap[id]);
    }
  }
</script>



<main class="admin-dashboard">
  <!-- Versión Desktop -->
  <div class="container-fluid d-none d-lg-flex admin-desktop">
    <div class="row g-0">
      <!-- Sidebar Moderno -->
      <div class="col-lg-3 col-xl-2 admin-sidebar">
        <div class="sidebar-header">
          <div class="user-info">
            <div class="user-details">
              <h6 class="user-name">Bienvenido, {userName}</h6>
            </div>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h6 class="nav-section-title">REPORTES</h6>
            <button 
              class="nav-item {activeSection === 'planilla' ? 'active' : ''}" 
              on:click={() => showContent('planilla')}>
              <i class="fas fa-clipboard-list"></i>
              <span>Reporte de Grupo Bíblico</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
            
            <button 
              class="nav-item {activeSection === 'nuevos' ? 'active' : ''}" 
              on:click={() => showContent('nuevos')}>
              <i class="fas fa-user-plus"></i>
              <span>Reporte de Personas Nuevas</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
            
            <button 
              class="nav-item {activeSection === 'reportes' ? 'active' : ''}" 
              on:click={() => showContent('reportes')}>
              <i class="fas fa-chart-bar"></i>
              <span>Ver Reportes</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
          </div>
          
          <div class="nav-section">
            <h6 class="nav-section-title">CONTENIDO</h6>
            <button 
              class="nav-item {activeSection === 'verbosquejoadmin' ? 'active' : ''}" 
              on:click={() => showContent('verbosquejoadmin')}>
              <i class="fas fa-file-alt"></i>
              <span>Ver Bosquejos</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
            
            <button 
              class="nav-item {activeSection === 'vervideoadmin' ? 'active' : ''}" 
              on:click={() => showContent('vervideoadmin')}>
              <i class="fas fa-video"></i>
              <span>Ver Videos</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
          </div>
          
          <div class="nav-section">
            <h6 class="nav-section-title">GESTIÓN</h6>
            <button 
              class="nav-item {activeSection === 'bosquejos' ? 'active' : ''}" 
              on:click={() => showContent('bosquejos')}>
              <i class="fas fa-upload"></i>
              <span>Subir Bosquejos</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
            
            <button 
              class="nav-item {activeSection === 'subirvideos' ? 'active' : ''}" 
              on:click={() => showContent('subirvideos')}>
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Subir Videos</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
            
            <button 
              class="nav-item {activeSection === 'estadistica' ? 'active' : ''}" 
              on:click={() => showContent('estadistica')}>
              <i class="fas fa-chart-pie"></i>
              <span>Estadísticas</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </button>
          </div>
          
          <div class="nav-section mt-auto">
            <button 
              class="nav-item logout-btn" 
              on:click={handleLogout}>
              <i class="fas fa-sign-out-alt"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <div class="app-version">
            <span>v1.0.0</span>
            <small>Centro Cristiano Colón</small>
          </div>
        </div>
      </div>
      
      <!-- Contenido Principal -->
      <div class="col-lg-9 col-xl-10 admin-content">
        <!-- Header del contenido -->
        <div class="content-header">
           <div class="breadcrumb">
    <span class="breadcrumb-item active">
      {#if activeSection === 'planilla'}
        Reporte de Grupo Bíblico
      {:else if activeSection === 'nuevos'}
        Reporte de Personas Nuevas
      {:else if activeSection === 'reportes'}
        Ver Reportes
      {:else if activeSection === 'verbosquejoadmin'}
        Ver Bosquejos
      {:else if activeSection === 'vervideoadmin'}
        Ver Videos
      {:else if activeSection === 'bosquejos'}
        Subir Bosquejos
      {:else if activeSection === 'subirvideos'}
        Subir Videos
      {:else if activeSection === 'estadistica'}
        Estadísticas
      {:else}
        Dashboard
      {/if}
    </span>
  </div>
          
          <div class="content-actions">
            <div class="date-info">
              <i class="fas fa-calendar-alt"></i>
              <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <!-- Contenido Dinámico -->
        <div class="content-body" transition:fade={{ duration: 300 }}>
          {#if activeSection === 'planilla'}
            <div class="content-section">
              <Planilla/>
            </div>
          {:else if activeSection === 'nuevos'}
            <div class="content-section">
              <Nuevos/>
            </div>
          {:else if activeSection === 'reportes'}
            <div class="content-section">
              <Reportes/>
            </div>
          {:else if activeSection === 'verbosquejoadmin'}
            <div class="content-section">
              <Verbosquejo/>
            </div>
          {:else if activeSection === 'estadistica'}
            <div class="content-section">
              <Estadistica/>
            </div>
          {:else if activeSection === 'vervideoadmin'}
            <div class="content-section">
              <Vervideoadmin/>
            </div>
          {:else if activeSection === 'bosquejos'}
            <div class="content-section">
              <Bosquejo/>
            </div>
          {:else if activeSection === 'subirvideos'}
            <div class="content-section">
              <Subirvideos/>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Versión Mobile -->
  <div class="d-lg-none admin-mobile">
    <!-- Navbar Superior -->
    <nav class="navbar admin-mobile-navbar">
      <div class="container-fluid">
        <div class="navbar-brand">
          <div class="mobile-user-info">
            <div class="mobile-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div>
              <h6 class="mb-0">{userName}</h6>
             
            </div>
          </div>
        </div>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <i class="fas fa-bars"></i>
        </button>
        
        <!-- Offcanvas Menu -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">
              <i class="fas fa-bars me-2"></i>
              Menú
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          
          <div class="offcanvas-body">
            <div class="mobile-nav-content">
              <div class="mobile-nav-section">
                <h6 class="mobile-section-title">REPORTES</h6>
                <button 
                  class="mobile-nav-item {activeSection === 'planilla' ? 'active' : ''}" 
                  on:click={() => showContent('planilla')}>
                  <i class="fas fa-clipboard-list"></i>
                  <span>Reporte de Grupo Bíblico</span>
                </button>
                
                <button 
                  class="mobile-nav-item {activeSection === 'nuevos' ? 'active' : ''}" 
                  on:click={() => showContent('nuevos')}>
                  <i class="fas fa-user-plus"></i>
                  <span>Reporte de Personas Nuevas</span>
                </button>
                
                <button 
                  class="mobile-nav-item {activeSection === 'reportes' ? 'active' : ''}" 
                  on:click={() => showContent('reportes')}>
                  <i class="fas fa-chart-bar"></i>
                  <span>Ver Reportes</span>
                </button>
              </div>
              
              <div class="mobile-nav-section">
                <h6 class="mobile-section-title">CONTENIDO</h6>
                <button 
                  class="mobile-nav-item {activeSection === 'verbosquejoadmin' ? 'active' : ''}" 
                  on:click={() => showContent('verbosquejoadmin')}>
                  <i class="fas fa-file-alt"></i>
                  <span>Ver Bosquejos</span>
                </button>
                
                <button 
                  class="mobile-nav-item {activeSection === 'vervideoadmin' ? 'active' : ''}" 
                  on:click={() => showContent('vervideoadmin')}>
                  <i class="fas fa-video"></i>
                  <span>Ver Videos</span>
                </button>
              </div>
              
              <div class="mobile-nav-section">
                <h6 class="mobile-section-title">GESTIÓN</h6>
                <button 
                  class="mobile-nav-item {activeSection === 'bosquejos' ? 'active' : ''}" 
                  on:click={() => showContent('bosquejos')}>
                  <i class="fas fa-upload"></i>
                  <span>Subir Bosquejos</span>
                </button>
                
                <button 
                  class="mobile-nav-item {activeSection === 'subirvideos' ? 'active' : ''}" 
                  on:click={() => showContent('subirvideos')}>
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>Subir Videos</span>
                </button>
                
                <button 
                  class="mobile-nav-item {activeSection === 'estadistica' ? 'active' : ''}" 
                  on:click={() => showContent('estadistica')}>
                  <i class="fas fa-chart-pie"></i>
                  <span>Estadísticas</span>
                </button>
              </div>
              
              <div class="mobile-nav-section mt-4">
                <button class="mobile-logout-btn" on:click={handleLogout}>
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Contenido Móvil -->
    <div class="mobile-content">
      <div class="mobile-content-header">
        <h4 class="mobile-title">
         {#if activeSection === 'planilla'}
        Reporte de Grupo Bíblico
      {:else if activeSection === 'nuevos'}
        Reporte de Personas Nuevas
      {:else if activeSection === 'reportes'}
        Ver Reportes
      {:else if activeSection === 'verbosquejoadmin'}
        Ver Bosquejos
      {:else if activeSection === 'vervideoadmin'}
        Ver Videos
      {:else if activeSection === 'bosquejos'}
        Subir Bosquejos
      {:else if activeSection === 'subirvideos'}
        Subir Videos
      {:else if activeSection === 'estadistica'}
        Estadísticas
      {:else}
        Dashboard
      {/if}
        </h4>
        <div class="mobile-date">
          <i class="fas fa-calendar-day"></i>
          <span>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>
      
      <div class="mobile-content-body" transition:fade={{ duration: 300 }}>
        {#if activeSection === 'planilla'}
          <div class="mobile-section">
            <Planilla/>
          </div>
        {:else if activeSection === 'nuevos'}
          <div class="mobile-section">
            <Nuevos/>
          </div>
        {:else if activeSection === 'reportes'}
          <div class="mobile-section">
            <Reportes/>
          </div>
        {:else if activeSection === 'verbosquejoadmin'}
          <div class="mobile-section">
            <Verbosquejo/>
          </div>
        {:else if activeSection === 'estadistica'}
          <div class="mobile-section">
            <Estadistica/>
          </div>
        {:else if activeSection === 'vervideoadmin'}
          <div class="mobile-section">
            <Vervideoadmin/>
          </div>
        {:else if activeSection === 'bosquejos'}
          <div class="mobile-section">
            <Bosquejo/>
          </div>
        {:else if activeSection === 'subirvideos'}
          <div class="mobile-section">
            <Subirvideos/>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  /* Variables de diseño */
  :root {
    --sidebar-bg: #1a1f36;
    --sidebar-text: #e2e8f0;
    --sidebar-hover: #2d3748;
    --sidebar-active: #92ae83;
    --sidebar-border: #2d3748;
    --content-bg: #f7fafc;
    --card-bg: #ffffff;
    --text-primary: #2d3748;
    --text-secondary: #718096;
    --border-color: #e2e8f0;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Dashboard principal */
  .admin-dashboard {
    min-height: 100vh;
    
  }
  
  /* ===== VERSIÓN DESKTOP ===== */
  .admin-desktop {
    min-height: 100vh;
  }
  
  /* Sidebar */
  .admin-sidebar {
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    border-right: 1px solid var(--sidebar-border);
    box-shadow: var(--shadow-lg);
  }
  
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--sidebar-border);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #92ae83 0%, #789768 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: white;
  }
  
  .user-details {
    flex: 1;
  }
  
  .user-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: white;
  }
  
  .user-role {
    font-size: 0.8rem;
    color: var(--sidebar-text);
    opacity: 0.8;
  }
  
  /* Navegación del sidebar */
  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0;
    overflow-y: auto;
  }
  
  .nav-section {
    margin-bottom: 1.5rem;
    padding: 0 1.5rem;
  }
  
  .nav-section:last-of-type {
    margin-bottom: 0;
  }
  
  .nav-section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #a0aec0;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }
  
  .nav-item {
    width: 100%;
    background: transparent;
    border: none;
    color: var(--sidebar-text);
    padding: 0.875rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
  }
  
  .nav-item:hover {
    background: var(--sidebar-hover);
    transform: translateX(5px);
  }
  
  .nav-item.active {
    background: var(--sidebar-active);
    color: white;
    box-shadow: 0 4px 12px rgba(146, 174, 131, 0.3);
  }
  
  .nav-item i:first-child {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }
  
  .nav-item span {
    flex: 1;
    font-weight: 500;
  }
  
  .nav-arrow {
    font-size: 0.8rem;
    opacity: 0;
    transition: var(--transition);
  }
  
  .nav-item:hover .nav-arrow {
    opacity: 1;
  }
  
  .logout-btn {
    color: #fc8181;
    background: rgba(252, 129, 129, 0.1);
    margin-top: 1rem;
  }
  
  .logout-btn:hover {
    background: rgba(252, 129, 129, 0.2);
  }
  
  .sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--sidebar-border);
  }
  
  .app-version {
    text-align: center;
    color: #a0aec0;
    font-size: 0.8rem;
  }
  
  .app-version small {
    display: block;
    font-size: 0.7rem;
    margin-top: 0.25rem;
  }
  
  /* Contenido principal */
  .admin-content {
    background: var(--content-bg);
    min-height: 100vh;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  
  .content-header {
    background: white;
    padding: 1.25rem 2rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-sm);
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .breadcrumb-item {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1.25rem;
  }
  
  .content-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .date-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .content-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
  
  .content-section {
    background: white;
    border-radius: var(--radius-md);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    min-height: calc(100vh - 200px);
  }
  
  /* ===== VERSIÓN MÓVIL ===== */
  .admin-mobile {
    min-height: 100vh;
    background: var(--content-bg);
  }
  
  /* Navbar móvil */
  .admin-mobile-navbar {
    background: white;
    padding: 1rem;
    box-shadow: var(--shadow-md);
    border-bottom: 1px solid var(--border-color);
  }
  
  .mobile-user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .mobile-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #92ae83 0%, #789768 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
  }
  
  .navbar-toggler {
    border: none;
    background: transparent;
    font-size: 1.25rem;
    color: var(--text-primary);
  }
  
  /* Offcanvas móvil */
  .offcanvas {
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
  }
  
  .offcanvas-header {
    border-bottom: 1px solid var(--sidebar-border);
  }
  
  .offcanvas-title {
    color: white;
    font-weight: 600;
  }
  
  .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
  }
  
  .mobile-nav-content {
    padding: 1rem 0;
  }
  
  .mobile-nav-section {
    margin-bottom: 1.5rem;
  }
  
  .mobile-section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #a0aec0;
    margin-bottom: 0.75rem;
    font-weight: 600;
    padding: 0 1rem;
  }
  
  .mobile-nav-item {
    width: 100%;
    background: transparent;
    border: none;
    color: var(--sidebar-text);
    padding: 1rem 1.25rem;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .mobile-nav-item:hover {
    background: var(--sidebar-hover);
  }
  
  .mobile-nav-item.active {
    background: var(--sidebar-active);
    color: white;
  }
  
  .mobile-nav-item i {
    font-size: 1.1rem;
    width: 20px;
  }
  
  .mobile-logout-btn {
    width: 100%;
    background: rgba(252, 129, 129, 0.1);
    border: none;
    color: #fc8181;
    padding: 1rem 1.25rem;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: var(--transition);
    margin-top: 1rem;
  }
  
  .mobile-logout-btn:hover {
    background: rgba(252, 129, 129, 0.2);
  }
  
  /* Contenido móvil */
  .mobile-content {
    padding: 1rem;
  }
  
  .mobile-content-header {
    margin-bottom: 1.5rem;
  }
  
  .mobile-title {
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .mobile-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .mobile-content-body {
    background: white;
    border-radius: var(--radius-md);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
  }
  
  .mobile-section {
    min-height: 70vh;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .content-body {
      padding: 1rem;
    }
    
    .content-section {
      padding: 1.5rem;
    }
    
    .mobile-content-body {
      padding: 1rem;
    }
  }
  
  @media (max-width: 576px) {
    .content-section {
      padding: 1rem;
    }
    
    .mobile-section {
      min-height: 60vh;
    }
  }
  
  /* Transiciones */
  .fade-transition {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
