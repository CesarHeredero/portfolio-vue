<template>
  <section class="card">
    <header class="card-header">
      <div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <button @click="addItem">Añadir</button>
    </header>

    <div v-if="loading">Cargando...</div>
    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th v-for="column in tableColumns" :key="column.key">
              {{ column.label }}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item._id">
            <td v-for="column in tableColumns" :key="column.key">
              {{ formatValue(item[column.key], column.type) }}
            </td>
            <td class="item-actions">
              <button @click="editItem(item)">Editar</button>
              <button class="danger" @click="removeItem(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showDialog" class="dialog-backdrop" @click.self="closeDialog">
      <div class="dialog" role="dialog" aria-modal="true">
        <form class="form" @submit.prevent="saveItem">
          <h3>{{ formTitle }}</h3>
          <label class="toggle">
            <input type="checkbox" v-model="autoTranslate" />
            Auto traducir EN
          </label>
          <div class="form-grid">
            <label v-for="field in fields" :key="field.key">
              {{ field.label }}
              <select
                v-if="field.type === 'select'"
                v-model="formState[field.key]"
                @input="handleManualEdit(field.key)"
              >
                <option value="">-- Selecciona --</option>
                <option
                  v-for="option in field.options || []"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input
                v-else-if="field.type !== 'textarea' && field.type !== 'boolean'"
                v-model="formState[field.key]"
                @input="handleManualEdit(field.key); handleTranslate(field.key, $event.target.value)"
                :type="field.type === 'number' ? 'number' : 'text'"
              />
              <textarea
                v-else-if="field.type === 'textarea'"
                v-model="formState[field.key]"
                @input="handleManualEdit(field.key); handleTranslate(field.key, $event.target.value)"
                rows="4"
              ></textarea>
              <input
                v-else
                v-model="formState[field.key]"
                type="checkbox"
              />
            </label>
          </div>
          <div class="dialog-actions">
            <button type="button" @click="closeDialog">Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { api } from "../services/api.js";

const props = defineProps({
  resource: { type: String, required: true },
  token: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  labelKey: { type: String, default: "name" },
  fields: { type: Array, default: () => [] },
});

const items = ref([]);
const loading = ref(true);
const error = ref("");
const showDialog = ref(false);
const editingId = ref(null);
const formState = ref({});
const autoTranslate = ref(true);
const manualEdits = ref(new Set());

const resetTranslationState = () => {
  manualEdits.value = new Set();
  translateTimers.forEach((timer) => clearTimeout(timer));
  translateTimers.clear();
  translateControllers.forEach((controller) => controller.abort());
  translateControllers.clear();
};

const translateTimers = new Map();
const translateControllers = new Map();

const requestTranslation = async (englishKey, value) => {
  const controller = new AbortController();
  const previousController = translateControllers.get(englishKey);
  if (previousController) {
    previousController.abort();
  }
  translateControllers.set(englishKey, controller);

  try {
    const response = await api.translate(
      { text: value, source: "es", target: "en" },
      props.token,
      controller.signal
    );
    return response.translatedText;
  } finally {
    translateControllers.delete(englishKey);
  }
};

const englishFieldMap = {
  name: "nameEn",
  title: "titleEn",
  description: "descriptionEn",
  role: "roleEn",
  longDescription: "longDescriptionEn",
};

const handleManualEdit = (fieldKey) => {
  if (fieldKey && fieldKey.endsWith("En")) {
    manualEdits.value.add(fieldKey);
    const pendingTimer = translateTimers.get(fieldKey);
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      translateTimers.delete(fieldKey);
    }
    const pendingController = translateControllers.get(fieldKey);
    if (pendingController) {
      pendingController.abort();
    }
  }
};

const handleTranslate = (fieldKey, rawValue) => {
  if (!autoTranslate.value) return;
  const englishKey = englishFieldMap[fieldKey];
  if (!englishKey || !(englishKey in formState.value)) return;
  if (manualEdits.value.has(englishKey)) return;
  const nextValue = (rawValue ?? formState.value[fieldKey] ?? "").trim();

  if (!nextValue) {
    formState.value[englishKey] = "";
    return;
  }

  const pendingTimer = translateTimers.get(englishKey);
  if (pendingTimer) {
    clearTimeout(pendingTimer);
  }

  translateTimers.set(
    englishKey,
    setTimeout(async () => {
      try {
        const translated = await requestTranslation(englishKey, nextValue);
        if (manualEdits.value.has(englishKey)) return;
        formState.value[englishKey] = translated || "";
      } catch (err) {
        if (err?.name === "AbortError") return;
        error.value = "No se pudo traducir automáticamente.";
      } finally {
        translateTimers.delete(englishKey);
      }
    }, 350)
  );
};

const formTitle = computed(() => (editingId.value ? "Editar" : "Nuevo"));

const tableColumns = computed(() => {
  if (props.fields.length > 0) {
    return props.fields;
  }

  return [{ key: props.labelKey, label: "Nombre", type: "text" }];
});

const formatValue = (value, type) => {
  if (type === "array") {
    return Array.isArray(value) ? value.join(", ") : "";
  }
  if (type === "boolean") {
    return value ? "Sí" : "No";
  }
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
};

const fetchItems = async () => {
  loading.value = true;
  error.value = "";
  try {
    items.value = await api.get(props.resource, props.token);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const addItem = () => {
  editingId.value = null;
  resetTranslationState();
  formState.value = Object.fromEntries(
    props.fields.map((field) => {
      if (field.type === "boolean") {
        return [field.key, false];
      }
      return [field.key, ""]; 
    })
  );
  showDialog.value = true;
};

const editItem = (item) => {
  editingId.value = item._id;
  resetTranslationState();
  formState.value = Object.fromEntries(
    props.fields.map((field) => {
      const value = item[field.key];
      if (field.type === "array") {
        return [field.key, Array.isArray(value) ? value.join(", ") : ""];
      }
      if (field.type === "boolean") {
        return [field.key, Boolean(value)];
      }
      return [field.key, value ?? ""];
    })
  );
  showDialog.value = true;
};

const removeItem = async (item) => {
  if (!confirm("¿Eliminar este registro?")) return;
  try {
    await api.remove(props.resource, item._id, props.token);
    await fetchItems();
  } catch (err) {
    error.value = err.message;
  }
};

const saveItem = async () => {
  error.value = "";
  try {
    const data = {};
    props.fields.forEach((field) => {
      const rawValue = formState.value[field.key];
      if (field.type === "array") {
        data[field.key] = rawValue
          ? rawValue.split(",").map((item) => item.trim()).filter(Boolean)
          : [];
      } else if (field.type === "number") {
        data[field.key] = rawValue === "" ? null : Number(rawValue);
      } else if (field.type === "boolean") {
        data[field.key] = Boolean(rawValue);
      } else {
        data[field.key] = rawValue;
      }
    });

    if (editingId.value) {
      await api.update(props.resource, editingId.value, data, props.token);
    } else {
      await api.create(props.resource, data, props.token);
    }
    showDialog.value = false;
    await fetchItems();
  } catch (err) {
    error.value = err.message;
  }
};

const closeDialog = () => {
  showDialog.value = false;
  error.value = "";
  resetTranslationState();
};

watch(
  () => props.resource,
  () => fetchItems(),
  { immediate: true }
);

watch(
  () => autoTranslate.value,
  (enabled) => {
    if (enabled) {
      resetTranslationState();
    }
  }
);
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.table-wrapper {
  margin-top: 1rem;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: #111827;
  border-radius: 0.75rem;
  overflow: hidden;
}

.table th,
.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #334155;
  text-align: left;
  vertical-align: top;
}

.table th {
  background: rgba(15, 23, 42, 0.6);
  font-weight: 600;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  border: none;
  background: #38bdf8;
  color: #0f172a;
  cursor: pointer;
}

button.danger {
  background: #f97316;
  color: #fff;
}

.dialog {
  border: none;
  border-radius: 1rem;
  padding: 1rem;
  background: #0f172a;
  color: #f8fafc;
  width: min(600px, 90vw);
  margin: 0;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.7);
  max-height: min(90vh, 760px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  gap: 0.75rem;
}

.form-grid input,
.form-grid textarea,
.form-grid select {
  width: 100%;
  margin-top: 0.25rem;
  border-radius: 0.5rem;
  background: #0f172a;
  color: #f8fafc;
  border: 1px solid #334155;
  padding: 0.5rem;
}



.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.error {
  color: #fca5a5;
}
</style>
