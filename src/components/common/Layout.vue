<template>
  <div class="layout">
    <Navbar />
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue';
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.content {
  flex: 1;
  padding: var(--spacing-xl);
  margin-left: 240px;
  width: calc(100% - 240px);
}

@media (max-width: 768px) {
  .content {
    padding: var(--spacing-lg);
    margin-left: 60px;
    width: calc(100% - 60px);
  }
}
</style> 