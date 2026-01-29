<template>
  <section class="card">
    <header class="panel-header">
      <div>
        <h2>Panel Intranet</h2>
        <p>Gestiona recursos principales del portfolio.</p>
      </div>
      <button class="secondary" @click="logout">Cerrar sesión</button>
    </header>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: tab.key === activeTab }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <ResourceManager
      v-if="activeTab === 'categories'"
      resource="categories"
      :token="token"
      title="Categorías"
      description="UX/UI, Automatización, Experimentación..."
      label-key="name"
    />
    <ResourceManager
      v-if="activeTab === 'projects'"
      resource="projects"
      :token="token"
      title="Proyectos"
      description="Enlaza proyectos con categorías y experiencias."
      label-key="title"
    />
    <ResourceManager
      v-if="activeTab === 'skills'"
      resource="skills"
      :token="token"
      title="Skills"
      description="Design, Development, Tools"
      label-key="name"
    />
    <ResourceManager
      v-if="activeTab === 'jobs'"
      resource="jobs"
      :token="token"
      title="Experiencia"
      description="Trayectoria principal"
      label-key="company"
    />
    <ResourceManager
      v-if="activeTab === 'secondary'"
      resource="secondary-experiences"
      :token="token"
      title="Otros trabajos"
      description="Audiovisual y técnico"
      label-key="title"
    />
    <ResourceManager
      v-if="activeTab === 'special'"
      resource="special-sections"
      :token="token"
      title="Wrestling & Formación"
      description="Secciones especiales"
      label-key="title"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";
import ResourceManager from "./ResourceManager.vue";

const props = defineProps({
  token: { type: String, required: true },
});

const emit = defineEmits(["logout"]);

const tabs = [
  { key: "categories", label: "Categorías" },
  { key: "projects", label: "Proyectos" },
  { key: "skills", label: "Skills" },
  { key: "jobs", label: "Experiencia" },
  { key: "secondary", label: "Otros" },
  { key: "special", label: "Wrestling/Formación" },
];

const activeTab = ref("categories");

const logout = () => emit("logout");
</script>

<style scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tabs button {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid #334155;
  background: transparent;
  color: #f8fafc;
}

.tabs button.active {
  background: #38bdf8;
  color: #0f172a;
  border-color: transparent;
}

button.secondary {
  background: transparent;
  border: 1px solid #334155;
  color: #f8fafc;
}
</style>
