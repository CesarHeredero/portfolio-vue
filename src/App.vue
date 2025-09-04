<template>
  <div class="app">
  <a class="skip-link" href="#main" aria-label="Saltar al contenido principal">
    <i class="fas fa-chevron-up" aria-hidden="true"></i>
    <span class="sr-only">Saltar al contenido principal</span>
  </a>
    <NavMenu />
    <div class="language-selector">
      <button 
        class="language-btn" 
        :class="{ active: currentLocale === 'es' }"
    type="button"
    :aria-pressed="currentLocale === 'es'"
    aria-label="Cambiar idioma a español"
        @click="setLocale('es')"
      >
        ES
      </button>
      <button 
        class="language-btn" 
        :class="{ active: currentLocale === 'en' }"
    type="button"
    :aria-pressed="currentLocale === 'en'"
    aria-label="Switch language to English"
        @click="setLocale('en')"
      >
        EN
      </button>
    </div>
  <main id="main" role="main" tabindex="-1">
      <section id="inicio" class="hero">
        <div class="hero-content">
          <h1>{{ t('hero.title') }}</h1>
          <h2>{{ t('hero.subtitle') }}</h2>
          <p>{{ t('hero.description') }}</p>
        </div>
      </section>

      <section id="sobre-mi" class="about">
        <div class="container">
          <h2>{{ t('about.title') }}</h2>
          <p>{{ t('about.description') }}</p>
          <div class="skills">
            <h3>{{ t('about.skills.title') }}</h3>
            <div class="skills-grid">
              <div class="skill-item">
                <i class="fas fa-paint-brush"></i>
                <h4>{{ t('about.skills.design') }}</h4>
                <ul>
                  <li>UX/UI Design</li>
                  <li>Prototyping</li>
                  <li>User Research</li>
                  <li>Design Systems</li>
                  <li>Figma</li>
                </ul>
              </div>
              <!-- <div class="skill-item">
                <i class="fas fa-code"></i>
                <h4>{{ t('about.skills.development') }}</h4>
                <ul>
                  <li>HTML5/CSS3</li>
                  <li>JavaScript</li>
                  <li>Vue.js</li>
                  <li>React</li>
                  <li>Node.js</li>
                </ul>
              </div> -->
              <div class="skill-item">
                <i class="fas fa-tools"></i>
                <h4>{{ t('about.skills.tools') }}</h4>
                <ul>
                  <li>Jira</li>
                  <li>Confluence</li>
                  <li>IA</li>
                  <li>Miro</li>
                  <li>Agile/Scrum</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" class="experience">
        <div class="container">
          <h2>{{ t('experience.title') }}</h2>
          <ExperienceTimeline />
          <AdditionalExperience />
        </div>
      </section>

      <section id="contact" class="contact">
        <div class="container">
          <h2>{{ t('contact.title') }}</h2>
          <form
            class="contact-form"
            action="https://formspree.io/f/xdkdpjkw"  
            method="POST"
            ref="form"
            @submit.prevent="handleSubmit"
            novalidate
          >
            <div class="form-group">
              <label for="name">{{ t('contact.name') }}</label>
              <input type="text" id="name" name="name" v-model="form.name" required autocomplete="name">
            </div>
            <div class="form-group">
              <label for="email">{{ t('contact.email') }}</label>
              <input type="email" id="email" name="email" v-model="form.email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="message">{{ t('contact.message') }}</label>
              <textarea id="message" name="message"  v-model="form.message" required></textarea>
            </div>
            <button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? t('contact.sending') : t('contact.send') }}
            </button>
            <div v-if="submitStatus" :class="['submit-status', submitStatus.type]" aria-live="polite">
              {{ submitStatus.message }}
            </div>
          </form>
        </div>
      </section>
    </main>

    <footer>
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} {{ t('footer.rights') }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import ExperienceTimeline from './components/ExperienceTimeline.vue'
import NavMenu from './components/NavMenu.vue'
import AdditionalExperience from './components/AdditionalExperience.vue'

export default {
  name: 'App',
  components: {
    ExperienceTimeline,
    NavMenu,
    AdditionalExperience
  },
  setup() {
    const store = useStore()
    const { locale, t } = useI18n()
    const isSubmitting = ref(false)
    const submitStatus = ref(null)

    const currentLocale = computed(() => store.state.locale)

    const setLocale = (newLocale) => {
      store.dispatch('setLocale', newLocale)
      locale.value = newLocale
      // Actualiza el atributo lang del documento para tecnologías asistivas
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', newLocale)
        document.documentElement.setAttribute('dir', 'ltr')
      }
    }

    onMounted(() => {
      // Establecer el lang inicial del documento
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', locale.value || 'es')
        document.documentElement.setAttribute('dir', 'ltr')
      }
    })

    return {
      t,
      currentLocale,
      setLocale,
      isSubmitting,
      submitStatus
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true
      this.submitStatus = null

      try {
        // Envío directo a Formspree (proveedor principal)
        const formEl = this.$refs.form
        const action = formEl && formEl.getAttribute ? formEl.getAttribute('action') : null
        if (!action) throw new Error('No se ha configurado la URL de Formspree en el formulario')
        const formData = new FormData(formEl)
        const resp = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        if (!resp.ok) {
          // Intentar leer detalle del error
          let detail = ''
          try { const j = await resp.json(); detail = (j && j.message) || JSON.stringify(j) } catch (_) {}
          throw new Error(`Formspree error: ${resp.status} ${detail}`)
        }
        this.submitStatus = { type: 'success', message: this.t('contact.success') }
        this.form = { name: '', email: '', message: '' }
      } catch (error) {
        console.error('[Contacto] Error al enviar:', error)
        this.submitStatus = { type: 'error', message: this.t('contact.error') }
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '@fortawesome/fontawesome-free/css/all.css';

:root {
  --primary-color: #42b883;
  --text-color: #2c3e50;
  --section-bg: #f8f9fa;
  --header-height: 60px;
}

/* Botón Skip Link fijo (abajo-derecha) */
.skip-link {
  position: fixed;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0));
  right: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  background: var(--primary-color);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  z-index: 1100;
  transition: transform 0.2s ease, background 0.2s ease;
}
.skip-link i { font-size: 1.1rem; }
.skip-link:hover,
.skip-link:focus { background: #2fa57a; outline: none; transform: translateY(-2px); }
.skip-link:active { transform: translateY(0); }

/* Solo texto para lectores de pantalla */
.sr-only {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0);
  white-space: nowrap; border: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height);
}

section {
  padding: 4rem 1rem;
  scroll-margin-top: var(--header-height);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);

  .hero-content {
    h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;

      .highlight {
        color: var(--primary-color);
      }
    }

    .subtitle {
      font-size: 1.5rem;
      color: #4b5563;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }
  }
}

.btn {
  display: inline-block;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &.primary {
    background: var(--primary-color);
    color: white;

    &:hover {
      background: var(--secondary-color);
    }
  }

  &.secondary {
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);

    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }
}

.about, .experience, .projects, .contact {
  background: var(--section-bg);
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;

  span {
    background: var(--primary-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
  }
}

.contact-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;

  i {
    color: var(--primary-color);
  }

  a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-color);
    }
  }
}

footer {
  text-align: center;
  padding: 2rem;
  background: var(--text-color);
  color: white;
}

@media (max-width: 768px) {
  .hero {
    .hero-content {
      h1 {
        font-size: 2.5rem;
        padding: 0 1rem;
      }

      .subtitle {
        font-size: 1.2rem;
        padding: 0 1rem;
      }
    }
  }

  .cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    padding: 0 1rem;

    .btn {
      width: 100%;
      max-width: 300px;
    }
  }

  section {
    padding: 3rem 1rem;
  }
}

.language-selector {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  background: white;
  padding: 5px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.language-btn {
  padding: 5px 15px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-color);
  transition: all 0.3s ease;
  border-radius: 15px;

  &:hover {
    background: var(--section-bg);
  }

  &.active {
    background: var(--primary-color);
    color: white;
  }
}

.contact {
  form {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }

    textarea {
      min-height: 150px;
      resize: vertical;
    }
  }

  button {
    width: 100%;
    padding: 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: #2c8f63;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }

  .submit-status {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;

    &.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    &.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  }
}

.skills {
  margin-top: 3rem;

  h3 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 1rem;
  }

  .skill-item {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    i {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    h4 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: left;

      li {
        padding: 0.5rem 0;
        color: #666;
        position: relative;
        padding-left: 1.5rem;

        &:before {
          content: "•";
          color: var(--primary-color);
          position: absolute;
          left: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .skills {
    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
