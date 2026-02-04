<template>
  <div class="timeline">
    <div v-for="(job, index) in displayJobs" :key="job.id || index" class="timeline-item">
      <div class="timeline-content">
        <div class="timeline-date">{{ job.period }}</div>
        <h3>{{ job.title }}</h3>
        <h4>{{ job.company }}</h4>
        <p>{{ job.description }}</p>
        <div class="skills-used">
          <span v-for="(skill, skillIndex) in job.skills" :key="skillIndex">{{ skill }}</span>
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
  name: 'ExperienceTimeline',
  setup() {
    const { t, locale } = useI18n()
    const apiJobs = ref([])

    const fallbackJobs = computed(() => [
      {
        id: 'devoteam',
        title: t('experience.jobs.devoteam.title'),
        company: t('experience.jobs.devoteam.company'),
        period: t('experience.jobs.devoteam.period'),
        description: t('experience.jobs.devoteam.description'),
        skills: t('experience.jobs.devoteam.skills').split(',').map((s) => s.trim())
      },
      {
        id: 'pamicom',
        title: t('experience.jobs.pamicom.title'),
        company: t('experience.jobs.pamicom.company'),
        period: t('experience.jobs.pamicom.period'),
        description: t('experience.jobs.pamicom.description'),
        skills: t('experience.jobs.pamicom.skills').split(',').map((s) => s.trim())
      },
      {
        id: 'succodimore',
        title: t('experience.jobs.succodimore.title'),
        company: t('experience.jobs.succodimore.company'),
        period: t('experience.jobs.succodimore.period'),
        description: t('experience.jobs.succodimore.description'),
        skills: t('experience.jobs.succodimore.skills').split(',').map((s) => s.trim())
      },
      {
        id: 'megusta',
        title: t('experience.jobs.megusta.title'),
        company: t('experience.jobs.megusta.company'),
        period: t('experience.jobs.megusta.period'),
        description: t('experience.jobs.megusta.description'),
        skills: t('experience.jobs.megusta.skills').split(',').map((s) => s.trim())
      }
    ])

    const displayJobs = computed(() => {
      if (!apiJobs.value.length) {
        return fallbackJobs.value
      }
      return apiJobs.value.map((job) => ({
        id: job._id,
        title: locale.value === 'en' ? job.titleEn || job.title : job.title,
        company: job.company,
        period: job.period,
        description: locale.value === 'en' ? job.descriptionEn || job.description : job.description,
        skills: job.skills || []
      }))
    })

    onMounted(async () => {
      if (!intranetApi.hasApi) return
      try {
        const payload = await intranetApi.get('jobs')
        if (Array.isArray(payload)) {
          apiJobs.value = payload
        }
      } catch (error) {
        apiJobs.value = []
      }
    })

    return {
      displayJobs,
      t
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: var(--primary-color);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  width: 100%;

  &:nth-child(odd) {
    padding-right: 50%;
    padding-left: 2rem;
  }

  &:nth-child(even) {
    padding-left: 50%;
    padding-right: 2rem;
  }
}

.timeline-content {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 1rem;
    height: 1rem;
    background: var(--primary-color);
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
  }

  &:nth-child(odd)::before {
    right: -3rem;
  }

  &:nth-child(even)::before {
    left: -3rem;
  }
}

.timeline-date {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

h4 {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: var(--text-muted);
}

p {
  margin: 1rem 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.skills-used {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;

  span {
    background: var(--section-bg);
    color: var(--primary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .timeline {
    padding: 1rem;
    
    &::before {
      left: 1rem;
    }
  }

  .timeline-item {
    padding: 0 0 0 3rem !important;
    width: 100%;
    margin-bottom: 2rem;
  }

  .timeline-content {
    &::before {
      left: -2rem !important;
    }
  }

  .timeline-date {
    font-size: 0.85rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4 {
    font-size: 0.95rem;
  }

  p {
    font-size: 0.9rem;
  }

  .skills-used {
    margin-top: 0.75rem;
    
    span {
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
    }
  }
}

@media (max-width: 480px) {
  .timeline {
    padding: 0.5rem;
    
    &::before {
      left: 0.5rem;
    }
  }

  .timeline-item {
    padding: 0 0 0 2rem !important;
  }

  .timeline-content {
    padding: 1rem;
    
    &::before {
      left: -1.5rem !important;
      width: 0.75rem;
      height: 0.75rem;
    }
  }
}
</style> 