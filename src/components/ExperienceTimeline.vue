<template>
  <div class="timeline">
    <div v-for="(job, index) in jobs" :key="index" class="timeline-item">
      <div class="timeline-content">
        <div class="timeline-date">{{ t(`experience.jobs.${job.id}.period`) }}</div>
        <h3>{{ t(`experience.jobs.${job.id}.title`) }}</h3>
        <h4>{{ t(`experience.jobs.${job.id}.company`) }}</h4>
        <p>{{ t(`experience.jobs.${job.id}.description`) }}</p>
        <div class="skills-used">
          <span v-for="(skill, skillIndex) in t(`experience.jobs.${job.id}.skills`).split(',')" :key="skillIndex">{{ skill.trim() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'ExperienceTimeline',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      jobs: [
        {
          id: 'devoteam'
        },
        {
          id: 'pamicom'
        },
        {
          id: 'succodimore'
        },
        {
          id: 'megusta'
        }
      ]
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