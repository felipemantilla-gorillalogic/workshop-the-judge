import NavBar from './components/NavBar.js';
import Hero from './components/Hero.js';
import About from './components/About.js';
import Resources from './components/Resources.js';
import Survey from './components/Survey.js';
import Footer from './components/Footer.js';

const app = Vue.createApp({
  components: {
    NavBar,
    Hero,
    About,
    Resources,
    Survey,
    Footer
  },
  template: `
    <div>
      <header class="header">
        <NavBar />
        <Hero />
      </header>
      <main>
        <About />
        <Resources />
        <Survey />
      </main>
      <Footer />
    </div>
  `
});

app.mount('#app');