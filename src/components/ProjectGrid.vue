<template>
  <div class="projects-grid">
    <div v-for="(project, index) in displayProjects" :key="project.id || index" class="project-card">
      <div class="project-image">
        <img :src="project.image" :alt="project.title">
      </div>
      <div class="project-content">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <div class="project-tech">
          <span v-for="(tech, techIndex) in project.technologies" :key="techIndex">{{ tech }}</span>
        </div>
        <div class="project-links">
          <a v-if="project.demo" :href="project.demo" target="_blank" class="btn-link">
            <i class="fas fa-external-link-alt"></i> Demo
          </a>
          <a v-if="project.github" :href="project.github" target="_blank" class="btn-link">
            <i class="fab fa-github"></i> GitHub
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { intranetApi } from '../services/intranetApi'

export default {
  name: 'ProjectGrid',
  setup() {
    const { locale } = useI18n()
    const apiProjects = ref([])

    const fallbackProjects = [
      {
        title: 'Sistema de Diseño UI',
        description: 'Diseño y desarrollo de un sistema de diseño completo para una aplicación web empresarial, incluyendo componentes reutilizables y documentación detallada.',
        image: 'https://via.placeholder.com/400x300',
        technologies: ['Figma', 'Vue.js', 'Storybook', 'SCSS'],
        demo: 'https://design-system-demo.com',
        github: 'https://github.com/cesarheredero/design-system'
      },
      {
        title: 'E-commerce UX Redesign',
        description: 'Rediseño completo de la experiencia de usuario de una plataforma e-commerce, mejorando la conversión y satisfacción del usuario.',
        image: 'https://via.placeholder.com/400x300',
        technologies: ['UX Research', 'UI Design', 'Prototipado', 'Figma'],
        demo: 'https://ecommerce-redesign.com',
        github: null
      },
      {
        title: 'App de Gestión Empresarial',
        description: 'Diseño y desarrollo de una aplicación web para gestión empresarial con enfoque en usabilidad y eficiencia.',
        image: 'https://via.placeholder.com/400x300',
        technologies: ['React', 'TypeScript', 'Material UI', 'Node.js'],
        demo: 'https://business-app-demo.com',
        github: 'https://github.com/cesarheredero/business-app'
      }
    ]

    const displayProjects = computed(() => {
      if (!apiProjects.value.length) return fallbackProjects

      return apiProjects.value.map((project) => ({
        id: project._id,
        title: locale.value === 'en' ? project.titleEn || project.title : project.title,
        description: locale.value === 'en'
          ? project.descriptionEn || project.description
          : project.description,
        image: project.mainImage || 'https://via.placeholder.com/400x300',
        technologies: project.techStack || [],
        demo: project.link || '',
        github: project.github || null
      }))
    })

    onMounted(async () => {
      if (!intranetApi.hasApi) return
      try {
        const payload = await intranetApi.get('projects')
        if (Array.isArray(payload)) {
          apiProjects.value = payload
        }
      } catch (error) {
        apiProjects.value = []
      }
    })

    return {
      displayProjects
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.project-card {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.project-image {
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.project-content {
  padding: 1.5rem;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

p {
  margin: 1rem 0;
  color: #4b5563;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;

  span {
    background: var(--section-bg);
    color: var(--primary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
  }
}

.project-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--primary-color);
  background: var(--section-bg);
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
  }

  i {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style> 