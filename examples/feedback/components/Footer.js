export default {
  name: 'Footer',
  template: `
    <footer class="footer">
      <div class="container text-center py-4">
        <div class="mb-4">
          <h4 class="mb-3">Workshop de Inteligencia Artificial</h4>
          <p>Recursos y aprendizajes compartidos</p>
        </div>
        <div class="mb-4">
          <a href="#" class="text-white mx-2"><i class="fab fa-github"></i></a>
          <a href="#" class="text-white mx-2"><i class="fab fa-linkedin"></i></a>
          <a href="#" class="text-white mx-2"><i class="fab fa-twitter"></i></a>
        </div>
        <div class="mt-3">
          <p class="mb-0">&copy; {{ new Date().getFullYear() }} Workshop IA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `
}