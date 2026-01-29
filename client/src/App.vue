<template>
  <main class="app">
    <header class="hero">
      <div>
        <h1>Intranet Cesar Heredero</h1>
        <p>Gestión completa de portfolio y CV.</p>
      </div>
      <button v-if="token" class="secondary" @click="logout">Cerrar sesión</button>
    </header>

    <AdminLogin v-if="!token" @login="handleLogin" />
    <AdminPanel v-else :token="token" @logout="logout" />

    <ToastMessage :message="message" />
  </main>
</template>

<script setup>
import { ref } from "vue";
import AdminLogin from "./components/AdminLogin.vue";
import AdminPanel from "./components/AdminPanel.vue";
import ToastMessage from "./components/ToastMessage.vue";

const token = ref(localStorage.getItem("intranet_token") || "");
const message = ref("");

const handleLogin = (newToken) => {
  token.value = newToken;
  localStorage.setItem("intranet_token", newToken);
  message.value = "Sesión iniciada";
};

const logout = () => {
  token.value = "";
  localStorage.removeItem("intranet_token");
  message.value = "Sesión cerrada";
};
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 3rem;
  background: #0f172a;
  color: #f8fafc;
  font-family: "Inter", system-ui, sans-serif;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
}

button.secondary {
  background: transparent;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
}
</style>
