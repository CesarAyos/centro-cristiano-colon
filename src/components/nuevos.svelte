<script>
  import { supabase } from "../components/supabase.js";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  // Variables del formulario
  let nuevos = {
    nombrelidernuevo: '',
    nombregruponuevo: '',
    nombresnuevo: '',
    apellidosnuevo: '',
    direccionnuevo: '',
    edadnuevo: '',
    telefononuevo: '',
  };

  // Variables de estado
  let formValid = false;
  let isSubmitting = false;
  let touchedFields = {};
  
  // Variables para notificaciones
  let mostrarNotif = false;
  let mensajeNotif = "";
  let tipoNotif = "success"; // success, error, info

  // Grupos bíblicos disponibles (puedes personalizar esta lista)
  const gruposBiblicos = [
    'Agente de Paz',
    'Alfa y Omega', 
    'Belén',
    'Betel',
    'Elohim',
    'Emanuel',
    'Judá',
    'Jireth',
    'Otro'
  ];

  // Función para marcar campo como tocado
  const marcarCampoTocado = (fieldName) => {
    touchedFields[fieldName] = true;
    validarFormulario();
  };

  // Función para validar el formulario
  const validarFormulario = () => {
    const requiredFields = [
      'nombrelidernuevo', 
      'nombregruponuevo', 
      'nombresnuevo', 
      'apellidosnuevo', 
      'direccionnuevo', 
      'edadnuevo', 
      'telefononuevo'
    ];
    
    formValid = requiredFields.every(field => {
      const value = nuevos[field];
      return value !== null && value !== undefined && value.toString().trim() !== '';
    });
  };

  // Función para mostrar notificación
  const mostrarNotificacion = (mensaje = "✅ Reporte de amigo enviado exitosamente!", tipo = "success") => {
    mensajeNotif = mensaje;
    tipoNotif = tipo;
    mostrarNotif = true;
    
    // Ocultar la notificación después de 4 segundos
    setTimeout(() => {
      mostrarNotif = false;
    }, 4000);
  };

  // Función para limpiar el formulario
  const Clear = () => {
    nuevos = {
      nombrelidernuevo: '',
      nombregruponuevo: '',
      nombresnuevo: '',
      apellidosnuevo: '',
      direccionnuevo: '',
      edadnuevo: '',
      telefononuevo: '',
    };
    touchedFields = {};
    validarFormulario();
  };

  // Función para insertar en Supabase
  const insertNuevos = async () => {
    isSubmitting = true;
    
    try {
      const { data, error } = await supabase
        .from("nuevos")
        .insert([nuevos])
        .select();

      if (error) {
        console.error("Error al insertar datos:", error.message, error.details);
        mostrarNotificacion("❌ Error al enviar los datos", "error");
        return;
      } else {
        console.log("Datos insertados correctamente:", data);
        
        // Mostrar notificación de éxito
        mostrarNotificacion();
        
        // Limpiar formulario después de 1 segundo
        setTimeout(() => {
          Clear();
        }, 1000);
      }
    } catch (error) {
      console.error("Error general:", error.message);
      mostrarNotificacion("❌ Ocurrió un error al procesar la solicitud", "error");
    } finally {
      isSubmitting = false;
    }
  };

  // Función para manejar el submit
  const onSubmitHandlers = (event) => {
    event.preventDefault();
    
    if (!formValid) {
      mostrarNotificacion("❌ Por favor, completa todos los campos requeridos", "error");
      return;
    }
    
    insertNuevos();
  };

  // Inicialización
  onMount(() => {
    validarFormulario();
  });
</script>

<main class="modern-form-container">
  <!-- Notificación moderna -->
  {#if mostrarNotif}
    <div class="modern-notification-container" in:fade out:fade>
      <div class="modern-notification {tipoNotif}">
        <div class="notification-icon">
          {#if tipoNotif === 'success'}
            <i class="fas fa-check-circle"></i>
          {:else if tipoNotif === 'error'}
            <i class="fas fa-exclamation-circle"></i>
          {:else}
            <i class="fas fa-info-circle"></i>
          {/if}
        </div>
        <span class="notification-message">{mensajeNotif}</span>
        <button class="notification-close" on:click={() => mostrarNotif = false}>
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  {/if}

  <div class="form-wrapper">
    <div class="modern-card">
      <!-- Header del formulario -->
      <div class="form-header">
        <div class="header-logo">
          <img src="/logo.png" alt="Centro Cristiano Colón" class="logo-image" />
          <div class="header-title">
            <h1>REPORTE DE AMIGOS NUEVOS</h1>
            <p class="header-subtitle">Registra la información de nuevas personas que se unen a nuestro ministerio</p>
          </div>
        </div>
        <div class="header-status">
          <div class="status-indicator {formValid ? 'valid' : 'invalid'}">
            <i class="fas {formValid ? 'fa-check' : 'fa-exclamation'}"></i>
            <span>{formValid ? 'Formulario completo' : 'Campos pendientes'}</span>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <form on:submit|preventDefault={onSubmitHandlers} class="modern-form">
        <!-- Sección 1: Información del Liderazgo y Grupo -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-users"></i>
            <h3>INFORMACIÓN DEL LIDERAZGO Y GRUPO</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group" class:has-value={nuevos.nombrelidernuevo} class:touched={touchedFields.nombrelidernuevo}>
              <label for="nombreLider">Nombre del Líder</label>
              <div class="input-with-icon">
                <i class="fas fa-user-tie"></i>
                <input
                  id="nombreLider"
                  type="text"
                  bind:value={nuevos.nombrelidernuevo}
                  on:blur={() => marcarCampoTocado('nombrelidernuevo')}
                  placeholder="Ingrese el nombre completo del líder"
                  required
                />
              </div>
              <div class="input-hint">Persona responsable del seguimiento</div>
            </div>

            <div class="form-group" class:has-value={nuevos.nombregruponuevo} class:touched={touchedFields.nombregruponuevo}>
              <label for="nombreGrupo">Nombre del Grupo Bíblico</label>
              <div class="select-with-icon">
                <i class="fas fa-church"></i>
                <select
                  id="nombreGrupo"
                  bind:value={nuevos.nombregruponuevo}
                  on:change={() => marcarCampoTocado('nombregruponuevo')}
                  required
                >
                  <option value="" disabled selected>Seleccione un grupo</option>
                  {#each gruposBiblicos as grupo}
                    <option value={grupo}>{grupo}</option>
                  {/each}
                </select>
                <i class="fas fa-chevron-down select-arrow"></i>
              </div>
              <div class="input-hint">Grupo al que se está integrando</div>
            </div>
          </div>
        </div>

        <!-- Sección 2: Información Personal -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-user-plus"></i>
            <h3>INFORMACIÓN PERSONAL</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group" class:has-value={nuevos.nombresnuevo} class:touched={touchedFields.nombresnuevo}>
              <label for="nombres">Nombres</label>
              <div class="input-with-icon">
                <i class="fas fa-user"></i>
                <input
                  id="nombres"
                  type="text"
                  bind:value={nuevos.nombresnuevo}
                  on:blur={() => marcarCampoTocado('nombresnuevo')}
                  placeholder="Ingrese los nombres de la persona"
                  required
                />
              </div>
              <div class="input-hint">Ej: María José</div>
            </div>

            <div class="form-group" class:has-value={nuevos.apellidosnuevo} class:touched={touchedFields.apellidosnuevo}>
              <label for="apellidos">Apellidos</label>
              <div class="input-with-icon">
                <i class="fas fa-user-tag"></i>
                <input
                  id="apellidos"
                  type="text"
                  bind:value={nuevos.apellidosnuevo}
                  on:blur={() => marcarCampoTocado('apellidosnuevo')}
                  placeholder="Ingrese los apellidos de la persona"
                  required
                />
              </div>
              <div class="input-hint">Ej: Pérez Rodríguez</div>
            </div>

            <div class="form-group" class:has-value={nuevos.edadnuevo} class:touched={touchedFields.edadnuevo}>
              <label for="edad">Edad</label>
              <div class="input-with-icon">
                <i class="fas fa-birthday-cake"></i>
                <input
                  id="edad"
                  type="number"
                  bind:value={nuevos.edadnuevo}
                  on:blur={() => marcarCampoTocado('edadnuevo')}
                  min="1"
                  max="120"
                  placeholder="Ingrese la edad"
                  required
                />
              </div>
              <div class="input-hint">Años cumplidos</div>
            </div>
          </div>
        </div>

        <!-- Sección 3: Información de Contacto -->
        <div class="form-section">
          <div class="section-header">
            <i class="fas fa-address-book"></i>
            <h3>INFORMACIÓN DE CONTACTO</h3>
          </div>
          
          <div class="form-grid">
            <div class="form-group wide" class:has-value={nuevos.direccionnuevo} class:touched={touchedFields.direccionnuevo}>
              <label for="direccion">Dirección de Residencia</label>
              <div class="input-with-icon">
                <i class="fas fa-map-marker-alt"></i>
                <input
                  id="direccion"
                  type="text"
                  bind:value={nuevos.direccionnuevo}
                  on:blur={() => marcarCampoTocado('direccionnuevo')}
                  placeholder="Ingrese la dirección completa"
                  required
                />
              </div>
              <div class="input-hint">Calle, número, sector, referencia</div>
            </div>

            <div class="form-group" class:has-value={nuevos.telefononuevo} class:touched={touchedFields.telefononuevo}>
              <label for="telefono">Número de Teléfono</label>
              <div class="input-with-icon">
                <i class="fas fa-phone"></i>
                <input
                  id="telefono"
                  type="tel"
                  bind:value={nuevos.telefononuevo}
                  on:blur={() => marcarCampoTocado('telefononuevo')}
                  placeholder="Ej: 0412-1234567"
                  required
                />
              </div>
              <div class="input-hint">Incluir código de área</div>
            </div>
          </div>
        </div>

        <!-- Confirmación y Envío -->
        <div class="form-section submit-section">
          <div class="confirmation-check">
            <input
              type="checkbox"
              id="confirmationCheck"
              required
              class="modern-checkbox"
            />
            <label for="confirmationCheck">
              <i class="fas fa-shield-alt"></i>
              He verificado que la información proporcionada es correcta y tengo permiso para compartirla
            </label>
          </div>

          <div class="submit-actions">
            <button 
              type="submit" 
              class="submit-button"
              disabled={!formValid || isSubmitting}
              class:loading={isSubmitting}
            >
              {#if isSubmitting}
                <i class="fas fa-spinner fa-spin"></i>
                <span>Registrando...</span>
              {:else}
                <i class="fas fa-user-plus"></i>
                <span>Registrar Amigo Nuevo</span>
              {/if}
            </button>
            
            <div class="form-stats">
              <div class="stat-item">
                <i class="fas fa-check-circle"></i>
                <span>Campos completados: {Object.values(nuevos).filter(v => v && v.toString().trim() !== '').length}/7</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Fecha: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</main>

<style>
  /* Variables de diseño */
  :root {
    --primary-color: #92ae83;
    --primary-dark: #789768;
    --secondary-color: #5504f8;
    --accent-color: #36827b;
    --success-color: #4CAF50;
    --error-color: #f44336;
    --warning-color: #FF9800;
    --info-color: #2196F3;
    --bg-light: #f8f9fa;
    --bg-dark: #333333;
    --text-light: #ffffff;
    --text-dark: #333333;
    --text-muted: #6c757d;
    --border-color: #dee2e6;
    --card-bg: #ffffff;
    --card-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Contenedor principal */
  .modern-form-container {
    padding: 1.5rem;
    min-height: 100vh;
  }
  
  .form-wrapper {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  /* Tarjeta principal */
  .modern-card {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: var(--transition);
  }
  
  /* Header del formulario */
  .form-header {
    background: linear-gradient(135deg, var(--bg-dark) 0%, #444 100%);
    padding: 2rem;
    color: var(--text-light);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .header-logo {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .logo-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary-color);
    padding: 3px;
  }
  
  .header-title h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .header-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
  }
  
  .header-status {
    display: flex;
    justify-content: flex-end;
  }
  
  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .status-indicator.valid {
    background: rgba(76, 175, 80, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  .status-indicator.invalid {
    background: rgba(255, 152, 0, 0.1);
    color: var(--warning-color);
    border: 1px solid rgba(255, 152, 0, 0.3);
  }
  
  /* Formulario */
  .modern-form {
    padding: 2rem;
  }
  
  /* Secciones del formulario */
  .form-section {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .form-section:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .section-header i {
    font-size: 1.5rem;
    color: var(--primary-color);
    background: rgba(146, 174, 131, 0.1);
    padding: 0.75rem;
    border-radius: 50%;
  }
  
  .section-header h3 {
    font-size: 1.25rem;
    color: var(--text-dark);
    font-weight: 600;
    margin: 0;
  }
  
  /* Grid del formulario */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .form-group.wide {
    grid-column: 1 / -1;
  }
  
  /* Grupos de formulario */
  .form-group {
    position: relative;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.9rem;
    transition: var(--transition);
  }
  
  .form-group:focus-within label {
    color: var(--primary-color);
  }
  
  .form-group.touched:not(.has-value) label {
    color: var(--error-color);
  }
  
  .input-hint {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
    font-style: italic;
  }
  
  /* Inputs con iconos */
  .input-with-icon, .select-with-icon {
    position: relative;
  }
  
  .input-with-icon i, .select-with-icon i:first-child {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 1rem;
    z-index: 1;
    transition: var(--transition);
  }
  
  .input-with-icon input, .select-with-icon select {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    transition: var(--transition);
    background: var(--bg-light);
  }
  
  .input-with-icon input:focus, .select-with-icon select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(146, 174, 131, 0.1);
  }
  
  .select-with-icon .select-arrow {
    left: auto;
    right: 1rem;
    pointer-events: none;
  }
  
  .select-with-icon select {
    appearance: none;
    cursor: pointer;
  }
  
  /* Checkbox moderno */
  .confirmation-check {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(146, 174, 131, 0.05);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
  }
  
  .modern-checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid var(--border-color);
    appearance: none;
    cursor: pointer;
    position: relative;
    transition: var(--transition);
    flex-shrink: 0;
  }
  
  .modern-checkbox:checked {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }
  
  .modern-checkbox:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.8rem;
  }
  
  .confirmation-check label {
    cursor: pointer;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    flex: 1;
  }
  
  /* Botón de enviar */
  .submit-actions {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .submit-button {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-width: 300px;
    align-self: center;
  }
  
  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(146, 174, 131, 0.3);
  }
  
  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .submit-button.loading {
    opacity: 0.8;
  }
  
  /* Estadísticas del formulario */
  .form-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    background: var(--bg-light);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
  }
  
  .stat-item i {
    font-size: 1rem;
  }
  
  /* Notificaciones modernas */
  .modern-notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  }
  
  .modern-notification {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    min-width: 350px;
    max-width: 400px;
    color: white;
    background: var(--info-color);
  }
  
  .modern-notification.success {
    background: linear-gradient(135deg, var(--success-color) 0%, #45a049 100%);
  }
  
  .modern-notification.error {
    background: linear-gradient(135deg, var(--error-color) 0%, #d32f2f 100%);
  }
  
  .modern-notification.info {
    background: linear-gradient(135deg, var(--info-color) 0%, #1976D2 100%);
  }
  
  .notification-icon {
    font-size: 1.5rem;
  }
  
  .notification-message {
    flex: 1;
    font-weight: 500;
  }
  
  .notification-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .notification-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .modern-form-container {
      padding: 1rem;
    }
    
    .form-header {
      padding: 1.5rem;
    }
    
    .header-logo {
      flex-direction: column;
      text-align: center;
    }
    
    .header-title h1 {
      font-size: 1.5rem;
    }
    
    .modern-form {
      padding: 1.5rem;
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .submit-button {
      min-width: auto;
      width: 100%;
    }
    
    .form-stats {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .modern-notification {
      min-width: calc(100vw - 40px);
      max-width: calc(100vw - 40px);
    }
    
    .confirmation-check {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  
  @media (max-width: 480px) {
    .form-header {
      padding: 1rem;
    }
    
    .modern-form {
      padding: 1rem;
    }
    
    .form-section {
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .section-header {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
    
    .section-header i {
      margin-bottom: 0.5rem;
    }
  }
  
  /* Animaciones */
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>