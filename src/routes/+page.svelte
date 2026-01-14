
<body>
    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 hero-content">
                    <h1 class="hero-title animate-up">CENTRO CRISTIANO COLÓN</h1>
                    <p class="hero-subtitle animate-up delay-1">Un sitio ideal para un momento espiritual</p>
                    <p class="lead mb-4 animate-up delay-2" style="color: #ccc;">Somos una comunidad de fe comprometida con el crecimiento espiritual y el servicio a nuestra comunidad. Únete a nosotros en este camino de fe.</p>
                    <a href="https://wa.me/584169752291?&text=Me%20gustaría%20obtener%20más%20información%20sobre%20la%20iglesia." target="_blank" class="cta-button animate-up delay-3">
                        Contáctanos <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
                <div class="col-lg-6 d-none d-lg-block">
                    <!-- Logo se mostrará en el fondo en móviles -->
                </div>
            </div>
        </div>
    </section>

    <!-- Sección de Crecimiento -->
   <div class="modern-carousel animate-left">
    <div id="growthCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <!-- Imagen 1 con fallback -->
                <img src="./carru2.jpg" 
                     onerror="this.src='https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                     class="d-block w-100" 
                     alt="Reunión en la iglesia">
            </div>
            <div class="carousel-item">
                <!-- Imagen 2 con fallback -->
                <img src="./carru1.jpg" 
                     onerror="this.src='https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                     class="d-block w-100" 
                     alt="Alabanza y adoración">
            </div>
            <div class="carousel-item">
                <!-- Imagen 3 con fallback -->
                <img src="./carru3.jpg" 
                     onerror="this.src='https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                     class="d-block w-100" 
                     alt="Comunidad cristiana">
            </div>
        </div>
        
        <!-- Controles -->
        <button class="carousel-control-prev" type="button" data-bs-target="#growthCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#growthCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
        </button>
        
        <!-- Indicadores -->
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#growthCarousel" data-bs-slide-to="0" class="active"></button>
            <button type="button" data-bs-target="#growthCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#growthCarousel" data-bs-slide-to="2"></button>
        </div>
    </div>
</div>

    <!-- Servicios Semanales -->
    <section id="servicios" class="services-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title animate-up">NUESTROS SERVICIOS SEMANALES</h2>
                <p class="section-subtitle animate-up delay-1">Únete a nosotros en cualquiera de nuestras reuniones semanales</p>
            </div>
            
            <div class="row g-4">
                <!-- Martes -->
                <div class="col-lg-3 col-md-6 animate-up">
                    <div class="service-card">
                        <img src="/vea.jpg" class="service-img" alt="Servicio de martes">
                        <div class="service-body">
                            <h3 class="service-title">MARTES</h3>
                            <h4 class="service-description">VISIÓN <br> EVALUACIÓN <br> AGENDA</h4>
                            <div class="service-times">
                                <span class="time-btn">5:45 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Miércoles -->
                <div class="col-lg-3 col-md-6 animate-up delay-1">
                    <div class="service-card">
                        <img src="/miercoles.jpg" class="service-img" alt="Servicio de miércoles">
                        <div class="service-body">
                            <h3 class="service-title">MIÉRCOLES</h3>
                            <h4 class="service-description">CULTO DE EMPODERAMIENTO Y GLORIA</h4>
                            <div class="service-times">
                                <span class="time-btn">5:45 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sábados -->
                <div class="col-lg-3 col-md-6 animate-up delay-2">
                    <div class="service-card">
                        <img src="/sabado.jpg" class="service-img" alt="Servicio de sábados">
                        <div class="service-body">
                            <h3 class="service-title">SÁBADOS</h3>
                            <h4 class="service-description">ENSAYO DE DANZA <br> CULTO DE JÓVENES <br> ENSAYO DE ALABANZA</h4>
                            <div class="service-times">
                                <span class="time-btn">2:00 PM</span>
                                <span class="time-btn">5:00 PM</span>
                                <span class="time-btn">6:00 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Domingos -->
                <div class="col-lg-3 col-md-6 animate-up delay-3">
                    <div class="service-card">
                        <img src="/domingo.jpg" class="service-img" alt="Servicio de domingos">
                        <div class="service-body">
                            <h3 class="service-title">DOMINGOS</h3>
                            <h4 class="service-description">DEVOCIONAL <br> RUTA ACADÉMICA <br> CULTO MAÑANA DE BENDICIÓN</h4>
                            <div class="service-times">
                                <span class="time-btn">8:45 AM</span>
                                <span class="time-btn">9:00 AM</span>
                                <span class="time-btn">10:30 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Predicas Recientes -->
    <section class="sermons-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title animate-up">NUESTRAS PRÉDICAS</h2>
                <p class="section-subtitle animate-up delay-1">Mensajes que transforman vidas</p>
            </div>
            
            <div class="row g-4">
                <!-- Predica 1 -->
                <div class="col-lg-4 col-md-6 animate-up">
                    <div class="sermon-card">
                        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" class="sermon-img" alt="Predica sobre la fe">
                        <div class="sermon-body">
                            <h3 class="sermon-title">La Fe que Mueve Montañas</h3>
                            <p class="sermon-date">15 de Julio, 2023</p>
                            <p class="sermon-text">Explorando el poder de la fe genuina en nuestras vidas diarias y cómo puede transformar circunstancias imposibles.</p>
                            <a href="https://youtube.com" target="_blank" class="youtube-btn">
                                <i class="fab fa-youtube"></i> Ver en YouTube
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Predica 2 -->
                <div class="col-lg-4 col-md-6 animate-up delay-1">
                    <div class="sermon-card">
                        <img src="https://images.unsplash.com/photo-1530036861598-2f8e72b4bd61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" class="sermon-img" alt="Predica sobre el amor">
                        <div class="sermon-body">
                            <h3 class="sermon-title">El Amor Ágape</h3>
                            <p class="sermon-date">8 de Julio, 2023</p>
                            <p class="sermon-text">Descubriendo la profundidad del amor incondicional de Dios y cómo manifestarlo en nuestras relaciones.</p>
                            <a href="https://youtube.com" target="_blank" class="youtube-btn">
                                <i class="fab fa-youtube"></i> Ver en YouTube
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Predica 3 -->
                <div class="col-lg-4 col-md-6 animate-up delay-2">
                    <div class="sermon-card">
                        <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" class="sermon-img" alt="Predica sobre esperanza">
                        <div class="sermon-body">
                            <h3 class="sermon-title">Esperanza en Tiempos Difíciles</h3>
                            <p class="sermon-date">1 de Julio, 2023</p>
                            <p class="sermon-text">Encontrando esperanza y propósito en medio de las pruebas, con la seguridad del cuidado divino.</p>
                            <a href="https://youtube.com" target="_blank" class="youtube-btn">
                                <i class="fab fa-youtube"></i> Ver en YouTube
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-5 animate-up delay-3">
                <a href="https://youtube.com" target="_blank" class="cta-button">
                    <i class="fab fa-youtube"></i> Suscríbete a nuestro canal
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-5 mb-lg-0 animate-up">
                    <img src="/logo.png" alt="Centro Cristiano Colón" class="footer-logo">
                    <p class="mb-4" style="color: #bbb;">Una comunidad de fe comprometida con el crecimiento espiritual y el servicio a nuestra comunidad.</p>
                    <div class="social-icons">
                        <a href="https://facebook.com" target="_blank" class="social-icon">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" class="social-icon">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://youtube.com" target="_blank" class="social-icon">
                            <i class="fab fa-youtube"></i>
                        </a>
                        <a href="https://wa.me/584169752291" target="_blank" class="social-icon">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
                
                <div class="col-lg-4 mb-5 mb-lg-0 animate-up delay-1">
                    <h3 class="footer-heading">Horarios de Servicios</h3>
                    <ul class="list-unstyled">
                        <li><a class="footer-link">Martes: 5:45 PM</a></li>
                        <li><a class="footer-link">Miércoles: 5:45 PM</a></li>
                        <li><a class="footer-link">Sábados: 2:00 PM - 6:00 PM</a></li>
                        <li><a class="footer-link">Domingos: 8:45 AM - 10:30 AM</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-4 animate-up delay-2">
                    <h3 class="footer-heading">Contacto</h3>
                    <ul class="list-unstyled">
                        <li><a href="https://goo.gl/maps" target="_blank" class="footer-link"><i class="fas fa-map-marker-alt me-2"></i> Dirección de la iglesia</a></li>
                        <li><a href="tel:+584169752291" class="footer-link"><i class="fas fa-phone me-2"></i> (584) 169-752291</a></li>
                        <li><a href="mailto:info@centrocristianocolon.com" class="footer-link"><i class="fas fa-envelope me-2"></i> info@centrocristianocolon.com</a></li>
                        <li><a href="https://wa.me/584169752291" target="_blank" class="footer-link"><i class="fab fa-whatsapp me-2"></i> Escríbenos por WhatsApp</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="copyright animate-up delay-3">
                <p>&copy; 2023 Centro Cristiano Colón. Todos los derechos reservados.</p>
                <p class="mt-2">Diseñado con <i class="fas fa-heart" style="color: #ff6b6b;"></i> para la comunidad de fe</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Animaciones al hacer scroll
        document.addEventListener('DOMContentLoaded', function() {
            const animateElements = document.querySelectorAll('.animate-up, .animate-left');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, {
                threshold: 0.1
            });
            
            animateElements.forEach(el => {
                el.style.opacity = 0;
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(el);
            });
            
            // Inicializar carousel
            const growthCarousel = document.getElementById('growthCarousel');
            if (growthCarousel) {
                const carousel = new bootstrap.Carousel(growthCarousel, {
                    interval: 5000,
                    wrap: true
                });
            }
        });
    </script>
</body>

 <style>
        :root {
            --primary-color: #92ae83;
            --secondary-color: #0e0d06;
            --accent-color: #c8a97e;
            --light-color: #f8f9fa;
            --dark-color: #1b1b1b;
            --gradient-primary: linear-gradient(135deg, #92ae83 0%, #789768 100%);
            --gradient-dark: linear-gradient(135deg, #0e0d06 0%, #1b1b1b 100%);
            --shadow-sm: 0 5px 15px rgba(0,0,0,0.08);
            --shadow-md: 0 10px 30px rgba(0,0,0,0.15);
            --shadow-lg: 0 20px 50px rgba(0,0,0,0.2);
            --border-radius: 12px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--dark-color);
            color: var(--light-color);
            overflow-x: hidden;
            line-height: 1.6;
        }
        
        h1, h2, h3, h4, h5 {
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        /* Header y Hero */
        .hero-section {
            min-height: 100vh;
            background: var(--gradient-dark);
            padding-top: 80px;
            position: relative;
            overflow: hidden;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('/logo.png') no-repeat center right -100px;
            background-size: contain;
            opacity: 0.05;
            z-index: 0;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
        
        .hero-title {
            font-size: 4.5rem;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
            color: var(--accent-color);
            margin-bottom: 2.5rem;
        }
        
        .cta-button {
            display: inline-block;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-md);
            border: none;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .cta-button:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
            color: white;
        }
        
        .cta-button i {
            margin-left: 10px;
        }
        
        /* Sección de Crecimiento */
        .growth-section {
            background: var(--gradient-dark);
            padding: 100px 0;
            position: relative;
        }
        
        .growth-section::before {
            content: '';
            position: absolute;
            top: -50px;
            left: 0;
            width: 100%;
            height: 100px;
            background: var(--dark-color);
            clip-path: polygon(0 100%, 100% 0, 100% 100%, 0% 100%);
        }
        
        .growth-title {
            font-size: 3.5rem;
            margin-bottom: 2rem;
            text-align: right;
        }
        
        .growth-text {
            font-size: 1.2rem;
            color: #ccc;
        }
        
        /* Carousel personalizado */
        .modern-carousel {
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
        }
        
        .carousel-item {
            height: 500px;
        }
        
        .carousel-item img {
            object-fit: cover;
            height: 100%;
            width: 100%;
        }
        
        .carousel-control-prev, .carousel-control-next {
            width: 60px;
            height: 60px;
            background-color: rgba(146, 174, 131, 0.8);
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.8;
            transition: all 0.3s ease;
        }
        
        .carousel-control-prev:hover, .carousel-control-next:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-control-prev {
            left: 20px;
        }
        
        .carousel-control-next {
            right: 20px;
        }
        
        /* Sección de Servicios */
        .services-section {
            padding: 100px 0;
            background-color: var(--dark-color);
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 70px;
        }
        
        .section-title {
            font-size: 3.5rem;
            position: relative;
            display: inline-block;
            padding-bottom: 20px;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: var(--gradient-primary);
            border-radius: 2px;
        }
        
        .section-subtitle {
            color: var(--accent-color);
            font-size: 1.2rem;
            margin-top: 15px;
        }
        
        /* Tarjetas de servicios */
        .service-card {
            background: rgba(30, 30, 30, 0.7);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: all 0.4s ease;
            height: 100%;
            border: 1px solid rgba(146, 174, 131, 0.1);
        }
        
        .service-card:hover {
            transform: translateY(-15px);
            box-shadow: var(--shadow-lg);
            border-color: rgba(146, 174, 131, 0.3);
        }
        
        .service-img {
            height: 250px;
            width: 100%;
            object-fit: cover;
        }
        
        .service-body {
            padding: 2rem;
        }
        
        .service-title {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .service-times {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 1.5rem;
        }
        
        .time-btn {
            background: transparent;
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
            padding: 0.5rem 1.2rem;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .time-btn:hover {
            background: var(--primary-color);
            color: var(--dark-color);
        }
        
        /* Sección de Predicas */
        .sermons-section {
            padding: 100px 0;
            background: var(--gradient-dark);
        }
        
        .sermon-card {
            background: rgba(30, 30, 30, 0.7);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: all 0.4s ease;
            height: 100%;
        }
        
        .sermon-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-lg);
        }
        
        .sermon-img {
            height: 200px;
            width: 100%;
            object-fit: cover;
        }
        
        .sermon-body {
            padding: 1.5rem;
        }
        
        .sermon-title {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .sermon-date {
            color: var(--accent-color);
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .youtube-btn {
            display: inline-flex;
            align-items: center;
            background: #ff0000;
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .youtube-btn:hover {
            background: #cc0000;
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(255, 0, 0, 0.2);
        }
        
        .youtube-btn i {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        /* Footer */
        .footer {
            background: var(--secondary-color);
            padding: 60px 0 30px;
            position: relative;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: -50px;
            left: 0;
            width: 100%;
            height: 100px;
            background: var(--gradient-dark);
            clip-path: polygon(0 0, 100% 100%, 100% 100%, 0% 100%);
        }
        
        .footer-logo {
            max-width: 200px;
            margin-bottom: 2rem;
        }
        
        .footer-heading {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: var(--primary-color);
        }
        
        .footer-link {
            color: #bbb;
            text-decoration: none;
            transition: all 0.3s ease;
            display: block;
            margin-bottom: 0.8rem;
        }
        
        .footer-link:hover {
            color: var(--primary-color);
            transform: translateX(5px);
        }
        
        .social-icons {
            display: flex;
            gap: 20px;
            margin-top: 2rem;
        }
        
        .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            background: rgba(146, 174, 131, 0.1);
            border-radius: 50%;
            color: var(--primary-color);
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background: var(--primary-color);
            color: var(--dark-color);
            transform: translateY(-5px);
        }
        
        .copyright {
            text-align: center;
            padding-top: 3rem;
            margin-top: 3rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #888;
            font-size: 0.9rem;
        }
        
        /* Animaciones */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes slideInLeft {
            from {
                transform: translateX(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .animate-left {
            animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .delay-1 {
            animation-delay: 0.2s;
        }
        
        .delay-2 {
            animation-delay: 0.4s;
        }
        
        .delay-3 {
            animation-delay: 0.6s;
        }
        
        /* Responsive */
        @media (max-width: 992px) {
            .hero-title {
                font-size: 3.5rem;
            }
            
            .growth-title {
                font-size: 2.8rem;
            }
            
            .section-title {
                font-size: 2.8rem;
            }
        }
        
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.8rem;
            }
            
            .hero-section::before {
                opacity: 0.03;
                background-position: center right -200px;
            }
            
            .growth-title {
                text-align: center;
                margin-top: 3rem;
            }
            
            .growth-text {
                text-align: center;
            }
        }
        
        @media (max-width: 576px) {
            .hero-title {
                font-size: 2.2rem;
            }
            
            .hero-subtitle {
                font-size: 1.2rem;
            }
            
            .section-title {
                font-size: 2.2rem;
            }
            
            .carousel-item {
                height: 350px;
            }
        }
    </style>