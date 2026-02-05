<template>
  <section class="card">
    <header class="panel-header">
      <div>
        <h3>Usuarios</h3>
        <p>Gestiona cuentas de acceso a la intranet.</p>
      </div>
      <button class="secondary" @click="reload" :disabled="loading">
        {{ loading ? "Cargando..." : "Refrescar" }}
      </button>
    </header>

    <form class="user-form" @submit.prevent="createUser">
      <label>
        Email
        <input v-model="newUser.email" type="email" required />
      </label>
      <label>
        Password
        <input v-model="newUser.password" type="password" required />
      </label>
      <button type="submit" :disabled="saving">
        {{ saving ? "Creando..." : "Crear usuario" }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <div class="table-wrapper" v-if="users.length">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Creado</th>
            <th>Reset password</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <input
                v-model="passwords[user.id]"
                type="password"
                placeholder="Nuevo password"
              />
            </td>
            <td class="actions">
              <button
                type="button"
                class="secondary"
                @click="resetPassword(user.id)"
                :disabled="saving"
              >
                Actualizar
              </button>
              <button
                type="button"
                class="danger"
                @click="removeUser(user.id)"
                :disabled="saving"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="empty">No hay usuarios registrados.</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";

const props = defineProps({
  token: { type: String, required: true },
});

const users = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const success = ref("");
const newUser = ref({ email: "", password: "" });
const passwords = ref({});

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const reload = async () => {
  loading.value = true;
  error.value = "";
  try {
    users.value = await api.getUsers(props.token);
  } catch (err) {
    error.value = err.message || "No se pudieron cargar los usuarios";
  } finally {
    loading.value = false;
  }
};

const createUser = async () => {
  saving.value = true;
  error.value = "";
  success.value = "";
  try {
    await api.createUser(newUser.value, props.token);
    success.value = "Usuario creado";
    newUser.value = { email: "", password: "" };
    await reload();
  } catch (err) {
    error.value = err.message || "No se pudo crear el usuario";
  } finally {
    saving.value = false;
  }
};

const resetPassword = async (id) => {
  const password = passwords.value[id];
  if (!password) {
    error.value = "Introduce un nuevo password";
    return;
  }
  saving.value = true;
  error.value = "";
  success.value = "";
  try {
    await api.updateUserPassword(id, { password }, props.token);
    passwords.value[id] = "";
    success.value = "Password actualizado";
  } catch (err) {
    error.value = err.message || "No se pudo actualizar el password";
  } finally {
    saving.value = false;
  }
};

const removeUser = async (id) => {
  if (!confirm("¿Eliminar usuario?")) return;
  saving.value = true;
  error.value = "";
  success.value = "";
  try {
    await api.removeUser(id, props.token);
    success.value = "Usuario eliminado";
    await reload();
  } catch (err) {
    error.value = err.message || "No se pudo eliminar el usuario";
  } finally {
    saving.value = false;
  }
};

onMounted(reload);
</script>

<style scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-form input,
.table-wrapper input {
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #f8fafc;
}

.table-wrapper {
  overflow-x: auto;
}

.table-wrapper table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.table-wrapper th,
.table-wrapper td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

button.secondary {
  background: transparent;
  border: 1px solid #334155;
  color: #f8fafc;
}

button.danger {
  background: #f87171;
  border: none;
  color: #0f172a;
}

.error {
  color: #fca5a5;
}

.success {
  color: #86efac;
}

.empty {
  color: #94a3b8;
}
</style>
