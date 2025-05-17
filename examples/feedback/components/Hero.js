export default {
  name: 'Hero',
  template: `
    <section id="inicio" class="header section">
      <div class="container text-center">
        <div class="row align-items-center">
          <div class="col-lg-8 mx-auto" data-aos="fade-up">
            <h1 class="display-4 fw-bold mb-4">Workshop de Inteligencia Artificial</h1>
            <p class="lead mb-5">Explora el futuro con recursos y aprendizajes sobre N8N, FlowWise, conexiones con APIs, autenticación, generación de prompts y más.</p>
            <div class="d-flex flex-wrap justify-content-center gap-3">
              <a href="#recursos" class="btn btn-light btn-lg" data-aos="fade-up" data-aos-delay="200">
                <i class="fas fa-book-open me-2"></i> Ver Recursos
              </a>
              <a href="#encuesta" class="btn btn-outline-light btn-lg" data-aos="fade-up" data-aos-delay="300">
                <i class="fas fa-clipboard-check me-2"></i> Completar Encuesta
              </a>
            </div>
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="hero-shapes">
          <div class="shape shape-1" data-aos="fade-up-right" data-aos-delay="500"></div>
          <div class="shape shape-2" data-aos="fade-down-left" data-aos-delay="700"></div>
          <div class="shape shape-3" data-aos="zoom-in" data-aos-delay="900"></div>
        </div>
        
        <!-- Mouse scroll indicator -->
        <div class="scroll-indicator" data-aos="fade-up" data-aos-delay="1000" data-aos-offset="0">
          <div class="mouse">
            <div class="wheel"></div>
          </div>
          <p>Scroll Down</p>
        </div>
      </div>
    </section>
  `
}