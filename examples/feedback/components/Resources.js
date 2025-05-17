export default {
  name: 'Resources',
  data() {
    return {
      resources: [
        {
          title: 'N8N',
          description: 'Plataforma de automatización de flujo de trabajo que permite conectar diferentes servicios y APIs sin necesidad de codificación.',
          icon: 'fas fa-cogs',
          links: [
            { text: 'Documentación Oficial', url: 'https://docs.n8n.io/' },
            { text: 'Tutoriales', url: 'https://www.youtube.com/c/n8nio' },
            { text: 'Ejemplos de Workflows', url: 'https://n8n.io/workflows' }
          ]
        },
        {
          title: 'FlowWise',
          description: 'Herramienta de diseño de flujos de trabajo para inteligencia artificial con una interfaz visual intuitiva.',
          icon: 'fas fa-project-diagram',
          links: [
            { text: 'GitHub Repository', url: 'https://github.com/FlowiseAI/Flowise' },
            { text: 'Guía de Inicio', url: 'https://flowiseai.com/' },
            { text: 'Comunidad', url: 'https://discord.gg/flowise' }
          ]
        },
        {
          title: 'Conexiones con APIs',
          description: 'Recursos para integrar diferentes servicios mediante APIs y protocolos de autenticación.',
          icon: 'fas fa-plug',
          links: [
            { text: 'Guía de Autenticación OAuth', url: 'https://oauth.net/2/' },
            { text: 'Postman - Herramienta para APIs', url: 'https://www.postman.com/' },
            { text: 'API Design Best Practices', url: 'https://swagger.io/resources/articles/best-practices-in-api-design/' }
          ]
        },
        {
          title: 'Generación de Prompts',
          description: 'Técnicas y estrategias para crear prompts efectivos para modelos de lenguaje.',
          icon: 'fas fa-magic',
          links: [
            { text: 'Guía de Prompt Engineering', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
            { text: 'Ejemplos de Prompts', url: 'https://github.com/f/awesome-chatgpt-prompts' },
            { text: 'Técnicas Avanzadas', url: 'https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/' }
          ]
        },
        {
          title: 'Automatización y Orquestación',
          description: 'Herramientas y conceptos para automatizar procesos y orquestar flujos de trabajo complejos.',
          icon: 'fas fa-robot',
          links: [
            { text: 'Airflow para Orquestación', url: 'https://airflow.apache.org/' },
            { text: 'Automatización con Python', url: 'https://automatetheboringstuff.com/' },
            { text: 'RPA con UiPath', url: 'https://www.uipath.com/rpa/robotic-process-automation' }
          ]
        },
        {
          title: 'Material del Workshop',
          description: 'Presentaciones, códigos y ejercicios utilizados durante las sesiones del workshop.',
          icon: 'fas fa-file-alt',
          links: [
            { text: 'Presentaciones', url: '#' },
            { text: 'Repositorio de Código', url: '#' },
            { text: 'Ejercicios Prácticos', url: '#' }
          ]
        }
      ]
    };
  },
  template: `
    <section id="recursos" class="section">
      <div class="container">
        <h2 class="text-center fw-bold mb-5">Recursos del Workshop</h2>
        <div class="row g-4">
          <div v-for="(resource, index) in resources" :key="index" class="col-md-6 col-lg-4">
            <div class="card h-100">
              <div class="card-body p-4">
                <div class="text-center mb-3">
                  <i :class="resource.icon + ' card-icon'"></i>
                </div>
                <h4 class="fw-bold mb-3">{{ resource.title }}</h4>
                <p class="text-muted mb-4">{{ resource.description }}</p>
                <div class="d-flex flex-column">
                  <a v-for="(link, linkIndex) in resource.links" 
                     :key="linkIndex" 
                     :href="link.url" 
                     target="_blank" 
                     class="btn btn-outline-primary mb-2">
                    {{ link.text }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}