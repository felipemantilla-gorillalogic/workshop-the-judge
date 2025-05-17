export default {
  name: 'NavBar',
  data() {
    return {
      isScrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark" :class="{'scrolled': isScrolled}">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" data-aos="fade-right" data-aos-delay="100">
          <i class="fas fa-robot me-2"></i>
          <span class="gradient-text">Workshop IA</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" data-aos="fade-down" data-aos-delay="200">
              <a class="nav-link" href="#inicio" @click="scrollToSection('inicio')">
                <i class="fas fa-home me-1"></i> Inicio
              </a>
            </li>
            <li class="nav-item" data-aos="fade-down" data-aos-delay="300">
              <a class="nav-link" href="#acerca" @click="scrollToSection('acerca')">
                <i class="fas fa-info-circle me-1"></i> Acerca
              </a>
            </li>
            <li class="nav-item" data-aos="fade-down" data-aos-delay="400">
              <a class="nav-link" href="#recursos" @click="scrollToSection('recursos')">
                <i class="fas fa-book-open me-1"></i> Recursos
              </a>
            </li>
            <li class="nav-item" data-aos="fade-down" data-aos-delay="500">
              <a class="nav-link" href="#encuesta" @click="scrollToSection('encuesta')">
                <i class="fas fa-clipboard-check me-1"></i> Encuesta
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleScroll() {
      if (window.scrollY > 80) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    }
  }
}