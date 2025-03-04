<template>
  <button 
    :class="[
      'button', 
      `variant-${variant}`, 
      { 'is-loading': loading, 'is-block': block, 'is-disabled': disabled }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'ghost', 'danger'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-small);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  min-height: 40px;
  min-width: 100px;
  border: none;
  outline: none;
}

.variant-primary {
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  color: var(--color-text-primary);
}

.variant-primary:hover:not(.is-disabled) {
  box-shadow: var(--shadow-button-hover);
  transform: translateY(-2px);
}

.variant-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: var(--blur-input);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.variant-secondary:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary);
}

.variant-ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid transparent;
}

.variant-ghost:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 0.05);
}

.variant-danger {
  background: var(--color-error);
  color: var(--color-text-primary);
}

.variant-danger:hover:not(.is-disabled) {
  background: var(--color-error-dark);
}

.is-block {
  display: flex;
  width: 100%;
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.is-loading {
  position: relative;
  color: transparent;
}

.loading-spinner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-text-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 