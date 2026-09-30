<script>
  import '$lib/public.css';

  const updatedAt = '30 de septiembre de 2026';
</script>

<svelte:head>
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="public-site">
  <section class="cc-banner">
    <div class="cc-container">
      <span class="cc-overline">Información legal</span>
      <h1>Política de Privacidad</h1>
      <p>Cómo tratamos y protegemos la información cuando utilizas nuestro sitio web y aplicación.</p>
    </div>
  </section>

  <section class="cc-section">
    <article class="cc-container privacy-content">
      <p class="privacy-updated">Última actualización: {updatedAt}</p>

      <h2>Responsable</h2>
      <p>
        Centro Cristiano Misión Global Colón, ubicado en San Juan de Colón, Venezuela,
        es responsable del tratamiento de la información descrita en esta política.
      </p>

      <h2>Información que recopilamos</h2>
      <p>Según las funciones que utilices, podemos tratar la siguiente información:</p>
      <ul>
        <li>
          <strong>Notificaciones:</strong> si habilitas las notificaciones, la aplicación
          utiliza un identificador de instalación y un token de Firebase Cloud Messaging
          para enviarte avisos de nuevas reflexiones. También puede guardar registros
          técnicos de la entrega y el funcionamiento de esas notificaciones.
        </li>
        <li>
          <strong>Comentarios:</strong> el nombre y el texto que escribas al comentar una
          reflexión, junto con el identificador de esa reflexión.
        </li>
        <li>
          <strong>Preferencias locales:</strong> algunas preferencias, como las reflexiones
          que marcas con “me gusta”, pueden guardarse en el almacenamiento de tu dispositivo.
        </li>
        <li>
          <strong>Acceso administrativo:</strong> para iniciar sesión en las funciones
          administrativas se utilizan el correo electrónico y la contraseña de la cuenta
          correspondiente. No se ofrece registro público de cuentas desde la aplicación.
        </li>
        <li>
          <strong>Datos técnicos:</strong> los servicios de alojamiento y reproducción de
          contenido pueden recibir información técnica necesaria para cargar las páginas,
          transmisiones o videos que solicites.
        </li>
      </ul>

      <h2>Cómo usamos la información</h2>
      <p>Usamos estos datos únicamente para prestar y mantener las funciones solicitadas:</p>
      <ul>
        <li>Enviar notificaciones sobre nuevas reflexiones, si otorgas el permiso correspondiente.</li>
        <li>Mostrar y administrar los comentarios publicados en las reflexiones.</li>
        <li>Recordar ciertas preferencias en tu dispositivo.</li>
        <li>Proteger y operar las funciones administrativas y diagnosticar fallos técnicos.</li>
      </ul>
      <p>No vendemos información personal ni la usamos para publicidad personalizada.</p>

      <h2>Servicios de terceros</h2>
      <p>
        Para operar la aplicación podemos utilizar Supabase para almacenar y procesar
        información, y Firebase/Google para gestionar las notificaciones push. Al abrir
        contenido alojado o reproducido por terceros, como videos, radio, televisión o
        mapas, esos proveedores pueden tratar datos de acuerdo con sus propias políticas.
        Sus servicios pueden procesar información en servidores ubicados fuera de tu país.
      </p>

      <h2>Conservación y seguridad</h2>
      <p>
        Conservamos la información durante el tiempo necesario para prestar las funciones
        descritas, atender obligaciones aplicables o resolver incidencias. Aplicamos
        medidas razonables para protegerla; ningún método de almacenamiento o transmisión
        puede garantizar seguridad absoluta.
      </p>

      <h2>Tus opciones y solicitudes</h2>
      <p>
        Puedes desactivar las notificaciones desde los ajustes de tu dispositivo. También
        puedes solicitar acceso, corrección o eliminación de la información que nos hayas
        proporcionado, incluidos comentarios o datos asociados a notificaciones, escribiendo
        al número de contacto publicado por la iglesia. Revisaremos y atenderemos la solicitud
        de acuerdo con las obligaciones aplicables y las limitaciones técnicas de los servicios
        de terceros.
      </p>

      <h2>Privacidad de menores</h2>
      <p>
        La aplicación no está dirigida específicamente a menores ni solicita de forma
        deliberada datos personales de menores. Si consideras que un menor nos ha enviado
        información personal, contáctanos para solicitar su revisión o eliminación.
      </p>

      <h2>Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política cuando cambien nuestras funciones o prácticas.
        Publicaremos la versión vigente en esta misma página e indicaremos su fecha de
        actualización.
      </p>

      <h2>Contacto</h2>
      <p>
        Para preguntas o solicitudes de privacidad, comunícate con Centro Cristiano Misión
        Global Colón:
      </p>
      <p>
        <a href="https://wa.me/584247187229" target="_blank" rel="noopener noreferrer">
          WhatsApp: +58 424-7187229
        </a>
      </p>
    </article>
  </section>
</div>

<style>
  .privacy-content {
    max-width: 860px;
    color: inherit;
    line-height: 1.75;
  }

  .privacy-updated {
    margin-bottom: 2rem;
    opacity: 0.75;
  }

  .privacy-content h2 {
    margin: 2rem 0 0.65rem;
    font-size: 1.35rem;
  }

  .privacy-content p,
  .privacy-content li {
    line-height: 1.75;
  }

  .privacy-content ul {
    padding-left: 1.4rem;
  }

  .privacy-content li + li {
    margin-top: 0.55rem;
  }
</style>