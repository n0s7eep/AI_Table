<template>
  <div class="card" :class="{ 'with-hover': withHover, 'with-glow': withGlow }">
    <div v-if="showHeader" class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <slot name="header-actions"></slot>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  withHover: {
    type: Boolean,
    default: false
  },
  withGlow: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.card {
  background: var(--color-bg-glass);
  backdrop-filter: var(--blur-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  overflow: hidden;
  transition: var(--transition-normal);
}

.with-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.with-glow {
  box-shadow: var(--shadow-card);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.card-content {
  padding: var(--spacing-lg);
}

.card-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}
</style> 