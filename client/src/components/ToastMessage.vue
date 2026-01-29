<template>
  <p v-if="message" class="toast">{{ message }}</p>
</template>

<script setup>
defineProps({
  message: { type: String, default: "" },
});
</script>

<style scoped>
.toast {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background: rgba(56, 189, 248, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.5);
  border-radius: 0.5rem;
}
</style>
