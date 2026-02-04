<template>
  <div class="additional-experience skills">
    <h3>{{ t('experience.additional.title') }}</h3>
    <div class="skills-grid">
      <template v-if="hasRemote">
        <div v-for="experience in remoteAdditional" :key="experience.id" class="skill-item">
          <i class="fas fa-briefcase"></i>
          <h4>{{ experience.title }}</h4>
          <div class="period">{{ experience.date }}</div>
          <p>{{ experience.description }}</p>
          <ul v-if="experience.skills.length">
            <li v-for="(skill, i) in experience.skills" :key="i">{{ skill }}</li>
          </ul>
        </div>
      </template>
      <template v-else>
        <div v-for="experience in fallbackAdditional" :key="experience.id" class="skill-item">
          <i class="fas fa-briefcase"></i>
          <h4>{{ t(experience.titleKey) }}</h4>
          <div class="period">{{ t(experience.periodKey) }}</div>
          <p>{{ t(experience.descriptionKey) }}</p>
          <ul>
            <li v-for="(skill, i) in t(experience.skillsKey).split(',')" :key="i">{{ skill.trim() }}</li>
          </ul>
        </div>
      </template>
    </div>

    <!-- Experiencia en otras áreas -->
    <section class="other-experience">
      <h2>{{ t('experience.other.title') }}</h2>
      <div class="experience-grid">
        <template v-if="hasRemote">
          <div v-for="experience in remoteOther" :key="experience.id" class="experience-item">
            <div class="icon-container">
              <i class="fas fa-video"></i>
            </div>
            <h3>{{ experience.title }}</h3>
            <p class="date">{{ experience.date }}</p>
            <p class="role">{{ experience.role }}</p>
          </div>
        </template>
        <template v-else>
          <div class="experience-item">
            <div class="icon-container">
              <i class="fas fa-video"></i>
            </div>
            <h3>{{ t('experience.other.mulafest.title') }}</h3>
            <p class="date">{{ t('experience.other.mulafest.date') }}</p>
            <p class="role">{{ t('experience.other.mulafest.role') }}</p>
          </div>
          <div class="experience-item">
            <div class="icon-container">
              <i class="fas fa-film"></i>
            </div>
            <h3>{{ t('experience.other.delux.title') }}</h3>
            <p class="date">{{ t('experience.other.delux.date') }}</p>
            <p class="role">{{ t('experience.other.delux.role') }}</p>
          </div>
          <div class="experience-item">
            <div class="icon-container">
              <i class="fas fa-tv"></i>
            </div>
            <h3>{{ t('experience.other.chello.title') }}</h3>
            <p class="date">{{ t('experience.other.chello.date') }}</p>
            <p class="role">{{ t('experience.other.chello.role') }}</p>
          </div>
          <div class="experience-item">
            <div class="icon-container">
              <i class="fas fa-camera"></i>
            </div>
            <h3>{{ t('experience.other.serena.title') }}</h3>
            <p class="date">{{ t('experience.other.serena.date') }}</p>
            <p class="role">{{ t('experience.other.serena.role') }}</p>
          </div>
        </template>
      </div>
    </section>

    <!-- Cursos y Certificaciones -->
    <section class="certifications">
      <h2>{{ t('experience.certifications.title') }}</h2>
      
      <div class="cert-group">
        <h3>{{ t('experience.certifications.devoteam.title') }}</h3>
        <ul>
          <li v-for="(course, index) in t('experience.certifications.devoteam.courses').split(',')" :key="index">
            {{ course.trim() }}
          </li>
        </ul>
      </div>

      <div class="cert-group">
        <h3>{{ t('experience.certifications.udemy.title') }}</h3>
        <ul>
          <li v-for="(course, index) in t('experience.certifications.udemy.courses').split(',')" :key="index">
            {{ course.trim() }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { intranetApi } from '../services/intranetApi'

export default {
  name: 'AdditionalExperience',
  setup() {
    const { t, locale } = useI18n()
    const remoteExperiences = ref([])

    const fallbackAdditional = [
      {
        id: 1,
        titleKey: 'experience.additional.items.0.title',
        periodKey: 'experience.additional.items.0.period',
        descriptionKey: 'experience.additional.items.0.description',
        skillsKey: 'experience.additional.items.0.skills'
      },
      {
        id: 2,
        titleKey: 'experience.additional.items.1.title',
        periodKey: 'experience.additional.items.1.period',
        descriptionKey: 'experience.additional.items.1.description',
        skillsKey: 'experience.additional.items.1.skills'
      }
    ]

    const mapExperience = (experience) => ({
      id: experience._id,
      title: locale.value === 'en' ? experience.titleEn || experience.title : experience.title,
      role: locale.value === 'en' ? experience.roleEn || experience.role : experience.role,
      date: experience.date,
      description: locale.value === 'en' ? experience.descriptionEn || experience.description : experience.description,
      skills: experience.role
        ? experience.role.split(',').map((item) => item.trim()).filter(Boolean)
        : []
    })

    const remoteAdditional = computed(() =>
      remoteExperiences.value
        .filter((item) => item.description || item.descriptionEn)
        .map(mapExperience)
    )

    const remoteOther = computed(() =>
      remoteExperiences.value
        .filter((item) => !item.description && !item.descriptionEn)
        .map(mapExperience)
    )

    const hasRemote = computed(() => remoteExperiences.value.length > 0)

    onMounted(async () => {
      if (!intranetApi.hasApi) return
      try {
        const payload = await intranetApi.get('secondary-experiences')
        if (Array.isArray(payload)) {
          remoteExperiences.value = payload
        }
      } catch (error) {
        remoteExperiences.value = []
      }
    })

    return {
      t,
      locale,
      fallbackAdditional,
      remoteAdditional,
      remoteOther,
      hasRemote
    }
  }
}
</script>

<style lang="scss" scoped>
.other-experience {
  margin-top: 3rem;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.experience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.experience-item {
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  text-align: center;
  transition: transform var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.experience-item:hover {
  transform: translateY(-5px);
}
.icon-container {
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem auto;
  background: var(--section-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-container i {
  font-size: 2rem;
  color: var(--primary-color);
}
.experience-item h3 {
  font-size: 1.25rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}
.experience-item .date {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.experience-item .role {
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.certifications {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}
.cert-group {
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}
.cert-group h3 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}
.cert-group ul {
  list-style: none;
  padding: 0;
}
.cert-group li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  color: var(--text-color);
  display: flex;
  align-items: center;
}
.cert-group li:before {
  content: '•';
  color: var(--primary-color);
  font-weight: bold;
  margin-right: 1rem;
}
.cert-group li:last-child {
  border-bottom: none;
}
@media (max-width: 768px) {
  .experience-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .experience-item {
    padding: 1rem;
  }
  .cert-group {
    padding: 1.5rem;
  }
}
</style>
