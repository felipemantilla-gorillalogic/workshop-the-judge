export default {
  name: 'Survey',
  data() {
    return {
      survey: {
        name: '',
        email: '',
        overallRating: 0,
        contentRating: 0,
        facilitatorRating: 0,
        materialsRating: 0,
        applicabilityRating: 0,
        expectations: '',
        bestAspect: '',
        improvementArea: '',
        additionalFeedback: '',
        recommendLikelihood: 0
      },
      submitted: false
    };
  },
  methods: {
    submitSurvey() {
      // Aquí iría la lógica para enviar los datos a un backend
      console.log('Encuesta enviada:', this.survey);
      
      // Simulamos el envío exitoso
      setTimeout(() => {
        this.submitted = true;
      }, 1000);
      
      // En una implementación real, aquí enviarías los datos a un servidor
      // fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(this.survey)
      // })
      // .then(response => response.json())
      // .then(data => {
      //   this.submitted = true;
      // });
    },
    resetSurvey() {
      this.survey = {
        name: '',
        email: '',
        overallRating: 0,
        contentRating: 0,
        facilitatorRating: 0,
        materialsRating: 0,
        applicabilityRating: 0,
        expectations: '',
        bestAspect: '',
        improvementArea: '',
        additionalFeedback: '',
        recommendLikelihood: 0
      };
      this.submitted = false;
    }
  },
  template: `
    <section id="encuesta" class="section bg-light">
      <div class="container">
        <h2 class="text-center fw-bold mb-5">Encuesta de Satisfacción</h2>
        
        <div v-if="!submitted" class="survey-form mx-auto" style="max-width: 800px;">
          <div class="mb-4">
            <p class="lead">Tu feedback es muy valioso para nosotros. Por favor, tómate unos minutos para completar esta encuesta.</p>
          </div>
          
          <form @submit.prevent="submitSurvey">
            <!-- Información Personal -->
            <div class="row mb-4">
              <div class="col-md-6 mb-3 mb-md-0">
                <label for="name" class="form-label">Nombre (opcional)</label>
                <input type="text" class="form-control" id="name" v-model="survey.name">
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">Email (opcional)</label>
                <input type="email" class="form-control" id="email" v-model="survey.email">
              </div>
            </div>
            
            <!-- Evaluación General -->
            <div class="survey-question">
              <label class="form-label">¿Cómo calificarías el workshop en general?</label>
              <div class="rating-container">
                <div v-for="n in 5" :key="n" 
                     class="rating-option" 
                     :class="{ 'selected': survey.overallRating === n }"
                     @click="survey.overallRating = n">
                  <i class="fas" :class="n <= survey.overallRating ? 'fa-star' : 'fa-star-o'"></i>
                  <div>{{ n }}</div>
                </div>
              </div>
            </div>
            
            <!-- Evaluación de Contenido -->
            <div class="survey-question">
              <label class="form-label">Relevancia y calidad del contenido</label>
              <div class="rating-container">
                <div v-for="n in 5" :key="n" 
                     class="rating-option" 
                     :class="{ 'selected': survey.contentRating === n }"
                     @click="survey.contentRating = n">
                  <i class="fas" :class="n <= survey.contentRating ? 'fa-star' : 'fa-star-o'"></i>
                  <div>{{ n }}</div>
                </div>
              </div>
            </div>
            
            <!-- Evaluación del Facilitador -->
            <div class="survey-question">
              <label class="form-label">Claridad y efectividad del facilitador</label>
              <div class="rating-container">
                <div v-for="n in 5" :key="n" 
                     class="rating-option" 
                     :class="{ 'selected': survey.facilitatorRating === n }"
                     @click="survey.facilitatorRating = n">
                  <i class="fas" :class="n <= survey.facilitatorRating ? 'fa-star' : 'fa-star-o'"></i>
                  <div>{{ n }}</div>
                </div>
              </div>
            </div>
            
            <!-- Evaluación de Materiales -->
            <div class="survey-question">
              <label class="form-label">Calidad de los materiales y recursos</label>
              <div class="rating-container">
                <div v-for="n in 5" :key="n" 
                     class="rating-option" 
                     :class="{ 'selected': survey.materialsRating === n }"
                     @click="survey.materialsRating = n">
                  <i class="fas" :class="n <= survey.materialsRating ? 'fa-star' : 'fa-star-o'"></i>
                  <div>{{ n }}</div>
                </div>
              </div>
            </div>
            
            <!-- Aplicabilidad -->
            <div class="survey-question">
              <label class="form-label">Aplicabilidad en tu trabajo o proyectos</label>
              <div class="rating-container">
                <div v-for="n in 5" :key="n" 
                     class="rating-option" 
                     :class="{ 'selected': survey.applicabilityRating === n }"
                     @click="survey.applicabilityRating = n">
                  <i class="fas" :class="n <= survey.applicabilityRating ? 'fa-star' : 'fa-star-o'"></i>
                  <div>{{ n }}</div>
                </div>
              </div>
            </div>
            
            <!-- Expectativas -->
            <div class="mb-4">
              <label for="expectations" class="form-label">¿El workshop cumplió con tus expectativas? ¿Por qué?</label>
              <textarea class="form-control" id="expectations" v-model="survey.expectations"></textarea>
            </div>
            
            <!-- Mejor Aspecto -->
            <div class="mb-4">
              <label for="bestAspect" class="form-label">¿Qué aspecto del workshop te pareció más valioso?</label>
              <textarea class="form-control" id="bestAspect" v-model="survey.bestAspect"></textarea>
            </div>
            
            <!-- Áreas de Mejora -->
            <div class="mb-4">
              <label for="improvementArea" class="form-label">¿Qué aspectos del workshop crees que podríamos mejorar?</label>
              <textarea class="form-control" id="improvementArea" v-model="survey.improvementArea"></textarea>
            </div>
            
            <!-- Feedback Adicional -->
            <div class="mb-4">
              <label for="additionalFeedback" class="form-label">¿Tienes algún comentario o sugerencia adicional?</label>
              <textarea class="form-control" id="additionalFeedback" v-model="survey.additionalFeedback"></textarea>
            </div>
            
            <!-- Probabilidad de Recomendar -->
            <div class="survey-question">
              <label class="form-label">¿Qué tan probable es que recomiendes este workshop a un colega? (1-10)</label>
              <div class="d-flex justify-content-between">
                <div v-for="n in 10" :key="n" 
                     class="rating-option" 
                     :class="{ 'selected': survey.recommendLikelihood === n }"
                     @click="survey.recommendLikelihood = n">
                  <div>{{ n }}</div>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-5">
              <button type="submit" class="btn btn-primary btn-lg">Enviar Encuesta</button>
            </div>
          </form>
        </div>
        
        <div v-else class="text-center">
          <div class="mb-4">
            <i class="fas fa-check-circle text-success" style="font-size: 5rem;"></i>
          </div>
          <h3 class="mb-3">¡Gracias por tu feedback!</h3>
          <p class="lead mb-4">Tu opinión es muy valiosa y nos ayudará a mejorar futuros workshops.</p>
          <button @click="resetSurvey" class="btn btn-outline-primary">Enviar otra respuesta</button>
        </div>
      </div>
    </section>
  `
}