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
    <div v-else class="list">
      <article v-for="item in items" :key="item._id" class="item">
        <div class="item-body">
          <h3>{{ item[labelKey] || item.title || item.name }}</h3>
          <pre>{{ stringify(item) }}</pre>
        </div>
        <div class="item-actions">
          <button @click="editItem(item)">Editar</button>
          <button class="danger" @click="removeItem(item)">Eliminar</button>
        </div>
      </article>
    </div>

    <dialog v-if="showDialog" open class="dialog">
      <form class="form" @submit.prevent="saveItem">
        <h3>{{ formTitle }}</h3>
        <label>
          JSON
          <textarea v-model="payload" rows="10"></textarea>
        </label>
        <div class="dialog-actions">
          <button type="button" @click="closeDialog">Cancelar</button>
          <button type="submit">Guardar</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </dialog>
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
});

const items = ref([]);
const loading = ref(true);
const error = ref("");
const showDialog = ref(false);
const editingId = ref(null);
const payload = ref("{}");

const formTitle = computed(() => (editingId.value ? "Editar" : "Nuevo"));

const stringify = (item) => JSON.stringify(item, null, 2);

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
  payload.value = "{}";
  showDialog.value = true;
};

const editItem = (item) => {
  editingId.value = item._id;
  payload.value = stringify(item);
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
    const data = JSON.parse(payload.value || "{}");
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
};

watch(
  () => props.resource,
  () => fetchItems(),
  { immediate: true }
);
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.item {
  background: #111827;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #334155;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
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
}

textarea {
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
