<template>
  <div class="input-wrapper" :class="{ 'is-error': error }">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-container">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input-field"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div v-if="error" class="input-error">{{ error }}</div>
    <div v-else-if="hint" class="input-hint">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue', 'blur', 'focus']);
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}

.input-label {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: var(--blur-input);
  border: 1px solid rgba(42, 63, 251, 0.3);
  border-radius: var(--radius-small);
  color: var(--color-text-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  transition: var(--transition-normal);
}

.input-field:focus {
  border: 1px solid rgba(42, 63, 251, 0.8);
  box-shadow: 0 0 8px rgba(42, 63, 251, 0.4);
  outline: none;
}

.input-field::placeholder {
  color: var(--color-text-disabled);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-suffix {
  position: absolute;
  right: var(--spacing-md);
  display: flex;
  align-items: center;
}

.input-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
}

.input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.is-error .input-field {
  border-color: var(--color-error);
}

.is-error .input-field:focus {
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}
</style> 