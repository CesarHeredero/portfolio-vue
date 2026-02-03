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
      :fields="categoryFields"
    />
    <ResourceManager
      v-if="activeTab === 'projects'"
      resource="projects"
      :token="token"
      title="Proyectos"
      description="Enlaza proyectos con categorías y experiencias."
      label-key="title"
      :fields="projectFields"
    />
    <ResourceManager
      v-if="activeTab === 'skills'"
      resource="skills"
      :token="token"
      title="Skills"
      description="Design, Development, Tools"
      label-key="name"
      :fields="skillFields"
    />
    <ResourceManager
      v-if="activeTab === 'about'"
      resource="about"
      :token="token"
      title="Sobre mí"
      description="Texto principal de la sección Sobre mí."
      label-key="title"
      :fields="aboutFields"
    />
    <ResourceManager
      v-if="activeTab === 'jobs'"
      resource="jobs"
      :token="token"
      title="Experiencia"
      description="Trayectoria principal"
      label-key="company"
      :fields="jobFields"
    />
    <ResourceManager
      v-if="activeTab === 'secondary'"
      resource="secondary-experiences"
      :token="token"
      title="Otros trabajos"
      description="Audiovisual y técnico"
      label-key="title"
      :fields="secondaryFields"
    />
    <ResourceManager
      v-if="activeTab === 'special'"
      resource="special-sections"
      :token="token"
      title="Wrestling & Formación"
      description="Secciones especiales"
      label-key="title"
      :fields="specialFields"
    />
  </section>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import ResourceManager from "./ResourceManager.vue";
import { api } from "../services/api.js";

const props = defineProps({
  token: { type: String, required: true },
});

const emit = defineEmits(["logout"]);

const tabs = [
  { key: "categories", label: "Categorías" },
  { key: "projects", label: "Proyectos" },
  { key: "skills", label: "Skills" },
  { key: "about", label: "Sobre mí" },
  { key: "jobs", label: "Experiencia" },
  { key: "secondary", label: "Otros" },
  { key: "special", label: "Wrestling/Formación" },
];

const activeTab = ref("categories");
const categories = ref([]);
const jobs = ref([]);

const loadLookups = async () => {
  try {
    categories.value = await api.get("categories", props.token);
    jobs.value = await api.get("jobs", props.token);
  } catch (error) {
    categories.value = [];
    jobs.value = [];
  }
};

watchEffect(() => {
  if (props.token) {
    loadLookups();
  }
});

const categoryOptions = computed(() =>
  categories.value.map((category) => ({
    value: category._id,
    label: category.name,
  }))
);

const jobOptions = computed(() =>
  jobs.value.map((job) => ({
    value: job._id,
    label: `${job.company} · ${job.title}`,
  }))
);

const categoryFields = [
  { key: "name", label: "Nombre", type: "text" },
  { key: "nameEn", label: "Nombre (EN)", type: "text" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "descriptionEn", label: "Descripción (EN)", type: "textarea" },
  { key: "coverImage", label: "Imagen portada", type: "text" },
  { key: "isVisible", label: "Visible", type: "boolean" },
];

const projectFields = computed(() => [
  { key: "title", label: "Título", type: "text" },
  { key: "titleEn", label: "Título (EN)", type: "text" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "descriptionEn", label: "Descripción (EN)", type: "textarea" },
  { key: "mainImage", label: "Imagen principal", type: "text" },
  { key: "techStack", label: "Stack (coma) ", type: "array" },
  { key: "link", label: "Link", type: "text" },
  { key: "categoryId", label: "Categoría", type: "select", options: categoryOptions.value },
  { key: "experienceId", label: "Experiencia", type: "select", options: jobOptions.value },
  { key: "isVisible", label: "Visible", type: "boolean" },
]);

const skillFields = [
  { key: "name", label: "Nombre", type: "text" },
  { key: "nameEn", label: "Nombre (EN)", type: "text" },
  { key: "category", label: "Categoría", type: "text" },
  { key: "level", label: "Nivel", type: "number" },
  { key: "isVisible", label: "Visible", type: "boolean" },
];

const aboutFields = [
  { key: "title", label: "Título", type: "text" },
  { key: "titleEn", label: "Título (EN)", type: "text" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "descriptionEn", label: "Descripción (EN)", type: "textarea" },
  { key: "isVisible", label: "Visible", type: "boolean" },
];

const jobFields = [
  { key: "company", label: "Empresa", type: "text" },
  { key: "title", label: "Título", type: "text" },
  { key: "titleEn", label: "Título (EN)", type: "text" },
  { key: "period", label: "Periodo", type: "text" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "descriptionEn", label: "Descripción (EN)", type: "textarea" },
  { key: "skills", label: "Skills (coma)", type: "array" },
  { key: "highlights", label: "Highlights (coma)", type: "array" },
  { key: "notableClients", label: "Clientes (coma)", type: "array" },
  { key: "isVisible", label: "Visible", type: "boolean" },
];

const secondaryFields = [
  { key: "title", label: "Título", type: "text" },
  { key: "titleEn", label: "Título (EN)", type: "text" },
  { key: "role", label: "Rol", type: "text" },
  { key: "roleEn", label: "Rol (EN)", type: "text" },
  { key: "date", label: "Fecha", type: "text" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "descriptionEn", label: "Descripción (EN)", type: "textarea" },
  { key: "isVisible", label: "Visible", type: "boolean" },
];

const specialFields = [
  { key: "slug", label: "Slug", type: "text" },
  { key: "title", label: "Título", type: "text" },
  { key: "titleEn", label: "Título (EN)", type: "text" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "descriptionEn", label: "Descripción (EN)", type: "textarea" },
  { key: "longDescription", label: "Descripción larga", type: "textarea" },
  { key: "longDescriptionEn", label: "Descripción larga (EN)", type: "textarea" },
  { key: "image", label: "Imagen", type: "text" },
  { key: "isVisible", label: "Visible", type: "boolean" },
];

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
