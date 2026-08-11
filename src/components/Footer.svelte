<script>
  const year = new Date().getFullYear();
</script>

<footer class="cc-footer">
  <div class="cc-container">
    <div class="cc-footer__top">
      <div class="cc-footer__col cc-footer__about">
        <img src="/logo.png" alt="Logo Centro Cristiano Colón" class="cc-footer__logo" />
        <p>
          Una comunidad de fe comprometida con el crecimiento espiritual y el
          servicio a nuestra comunidad, con un ADN misionero de ganar, edificar
          y enviar.
        </p>
        <div class="cc-footer__social">
          <a
            href="https://www.instagram.com/coloncentrocristiano/"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            ><i class="fa-brands fa-instagram"></i
          ></a>
          <a
            href="https://www.facebook.com/profile.php?id=100002215235467"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            ><i class="fa-brands fa-facebook-f"></i
          ></a>
          <a
            href="https://wa.me/584247187229"
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
            ><i class="fa-brands fa-whatsapp"></i
          ></a>
        </div>
      </div>

      <div class="cc-footer__col">
        <h4>Quiénes Somos</h4>
        <ul>
          <li><a href="/adn">Nuestro ADN</a></li>
          <li><a href="/fundadores">Nuestros Fundadores</a></li>
          <li><a href="/misiones">Misiones</a></li>
        </ul>
        <h4 class="cc-footer__subhead">Recursos</h4>
        <ul>
          <li><a href="/predica">Prédicas</a></li>
          <li><a href="/reflexiones">Reflexiones</a></li>
          <li><a href="/biblia">Lee la Biblia</a></li>
        </ul>
      </div>

      <div class="cc-footer__col">
        <h4>Horarios</h4>
        <ul>
          <li><i class="fa-solid fa-clock"></i>Martes · 5:45 PM</li>
          <li><i class="fa-solid fa-clock"></i>Miércoles · 5:45 PM</li>
          <li><i class="fa-solid fa-clock"></i>Sábados · 2:00 – 6:00 PM</li>
          <li><i class="fa-solid fa-clock"></i>Domingos · 8:45 – 10:30 AM</li>
        </ul>
      </div>

      <div class="cc-footer__col">
        <h4>Contacto</h4>
        <ul>
          <li>
            <i class="fa-solid fa-location-dot"></i>Calle 3 con Carrera 11,
            Barrio El Topón, San Juan de Colón
          </li>
          <li>
            <a href="tel:+584241871229"><i class="fa-solid fa-phone"></i>+58 424-7187229</a>
          </li>
          <li>
            <a href="https://wa.me/584247187229" target="_blank" rel="noopener"
              ><i class="fa-brands fa-whatsapp"></i>Escríbenos por WhatsApp</a
            >
          </li>
        </ul>
        <div class="cc-footer__map">
          <iframe
            title="Mapa de Centro Cristiano Colón"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.7156445312617!2d-72.26213622550951!3d8.028227003851917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6661c4a2b6d037%3A0xb863abb51aac8fd6!2sCentro%20Cristiano%20Colon!5e0!3m2!1ses!2sve!4v1705430899804!5m2!1ses!2sve"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>

    <div class="cc-footer__bottom">
      <p>&copy; {year} Centro Cristiano Colón. Todos los derechos reservados.</p>
      <p>Diseñado con <i class="fa-solid fa-heart"></i> para la gloria de Dios</p>
    </div>
  </div>
</footer>

<style>
  .cc-footer {
    background: linear-gradient(180deg, #14120e 0%, #0e0d06 100%);
    border-top: 1px solid rgba(200, 169, 126, 0.18);
    padding: 80px 0 0;
    font-family: 'Jost', sans-serif;
    color: #b7b0a3;
    position: relative;
  }

  .cc-container {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .cc-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #92ae83 30%, #c8a97e 70%, transparent);
  }

  .cc-footer__top {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
    gap: 48px;
    padding-bottom: 54px;
  }

  .cc-footer__logo {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(146, 174, 131, 0.5);
    padding: 4px;
    margin-bottom: 18px;
  }

  .cc-footer__about p {
    font-size: 0.94rem;
    line-height: 1.8;
    margin-bottom: 20px;
    max-width: 340px;
  }

  .cc-footer__social {
    display: flex;
    gap: 12px;
  }

  .cc-footer__social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid rgba(200, 169, 126, 0.28);
    color: #c8a97e;
    font-size: 1.05rem;
    transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
  }

  .cc-footer__social a:hover {
    background: linear-gradient(135deg, #92ae83, #5f7d52);
    color: #fff;
    transform: translateY(-3px);
  }

  .cc-footer h4 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 1.35rem;
    color: #f5f1e8;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 12px;
  }

  .cc-footer__subhead {
    margin-top: 34px;
  }

  .cc-footer h4::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 38px;
    height: 2px;
    background: linear-gradient(90deg, #92ae83, #c8a97e);
    border-radius: 2px;
  }

  .cc-footer ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cc-footer ul li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .cc-footer ul li i {
    margin-top: 4px;
    color: #92ae83;
    font-size: 0.85rem;
    min-width: 14px;
    text-align: center;
  }

  .cc-footer ul a {
    color: #b7b0a3;
    text-decoration: none;
    transition: color 0.3s ease, transform 0.3s ease;
  }

  .cc-footer ul a:hover {
    color: #c8a97e;
    transform: translateX(4px);
  }

  .cc-footer__map {
    margin-top: 18px;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(200, 169, 126, 0.18);
  }

  .cc-footer__map iframe {
    width: 100%;
    height: 130px;
    display: block;
    filter: grayscale(0.6) contrast(1.05);
  }

  .cc-footer__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    padding: 24px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    font-size: 0.85rem;
    color: #8a847a;
  }

  .cc-footer__bottom i {
    color: #c8a97e;
    margin: 0 3px;
  }

  @media (max-width: 992px) {
    .cc-footer__top {
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
  }

  @media (max-width: 576px) {
    .cc-footer__top {
      grid-template-columns: 1fr;
      gap: 34px;
    }

    .cc-footer {
      padding-top: 56px;
    }
  }
</style>
