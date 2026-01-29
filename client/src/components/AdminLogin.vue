<template>
  <section class="card">
    <h2>Acceso Intranet</h2>
    <form class="form" @submit.prevent="onSubmit">
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>
      <label>
        Password
        <input v-model="password" type="password" required />
      </label>
      <button type="submit" :disabled="loading">
        {{ loading ? "Entrando..." : "Entrar" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { api } from "../services/api.js";

const emit = defineEmits(["login"]);
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const onSubmit = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { token } = await api.login({ email: email.value, password: password.value });
    emit("login", token);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form {
  display: grid;
  gap: 1rem;
}

input {
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #f8fafc;
}

button {
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #38bdf8;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
}

.error {
  color: #fca5a5;
}
</style>
