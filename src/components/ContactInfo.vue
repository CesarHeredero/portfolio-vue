<template>
  <section class="contact-section" aria-labelledby="contact-title">
    <div class="container">
      <h2 id="contact-title">Contacto</h2>
      <form
        class="contact-form"
        @submit.prevent="handleSubmit"
        action="https://formspree.io/f/xdkdpjkw"  
        method="POST"
        ref="form"
      >
        <div>
          <label for="name">Nombre</label>
          <input type="text" id="name" name="name" v-model="form.name" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" v-model="form.email" required />
        </div>
        <div>
          <label for="message">Mensaje</label>
          <textarea id="message" name="message" v-model="form.message" required></textarea>
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>
        <p v-if="success" class="success-msg">¡Mensaje enviado correctamente!</p>
        <p v-if="error" class="error-msg">Error al enviar. Inténtalo de nuevo.</p>
      </form>
      
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactInfo',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      loading: false,
      success: false,
      error: false
    }
  },
  methods: {
    async handleSubmit(e) {
      this.loading = true;
      this.success = false;
      this.error = false;
      try {
        const formData = new FormData(this.$refs.form);
        const response = await fetch(this.$refs.form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });
        if (response.ok) {
          this.success = true;
          this.form.name = '';
          this.form.email = '';
          this.form.message = '';
        } else {
          this.error = true;
        }
      } catch {
        this.error = true;
      } finally {
        this.loading = false;
      }
    }
  },
  metaInfo: {
    title: 'Contacto - César Heredero',
    meta: [
      {
        name: 'description',
        content: 'Información de contacto de César Heredero. UX/UI Designer & Desarrollador Frontend. Disponible por teléfono, email y LinkedIn.'
      },
      {
        property: 'og:title',
        content: 'Contacto - César Heredero'
      },
      {
        property: 'og:description',
        content: 'Información de contacto de César Heredero. UX/UI Designer & Desarrollador Frontend.'
      },
      {
        name: 'twitter:title',
        content: 'Contacto - César Heredero'
      },
      {
        name: 'twitter:description',
        content: 'Información de contacto de César Heredero. UX/UI Designer & Desarrollador Frontend.'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.contact-section {
  padding: 4rem 0;
  background: var(--section-bg);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h2 {
    font-size: 2rem;
    color: var(--text-color);
    text-align: center;
    margin-bottom: 3rem;
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  font-style: normal; // Reset address styling
}

.contact-item {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover, &:focus-within {
    transform: translateY(-5px);
  }

  .icon-container {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    background: var(--section-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 1.5rem;
      color: var(--primary-color);
    }
  }

  .contact-info {
    flex-grow: 1;
    min-width: 0;

    h3 {
      font-size: 1.25rem;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    p {
      margin: 0;
    }

    a {
      color: var(--text-muted);
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
      word-break: break-word;
      display: inline-block;
      padding: 0.25rem 0;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: var(--primary-color);
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease;
      }

      &:hover, &:focus {
        color: var(--primary-color);
        outline: none;

        &::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      }
    }

    .email {
      font-family: monospace;
    }
  }
}

.contact-form {
  max-width: 500px;
  margin: 2rem auto 3rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.contact-form label {
  font-weight: 500;
}
.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.contact-form button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.contact-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.success-msg {
  color: green;
  font-weight: 500;
}
.error-msg {
  color: red;
  font-weight: 500;
}

@media (max-width: 768px) {
  .contact-section {
    padding: 3rem 0;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .contact-item {
    padding: 1.5rem;
    
    .icon-container {
      width: 50px;
      height: 50px;
      
      i {
        font-size: 1.25rem;
      }
    }
    
    .contact-info {
      h3 {
        font-size: 1.1rem;
      }
      
      a {
        font-size: 0.95rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .contact-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    
    .contact-info {
      width: 100%;
    }
  }
}

/* Estilos para usuarios que prefieren reducir el movimiento */
@media (prefers-reduced-motion: reduce) {
  .contact-item {
    transition: none;

    &:hover, &:focus-within {
      transform: none;
    }

    a::after {
      transition: none;
    }
  }
}
</style>