<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      {
        'base-button--loading': loading,
        'base-button--disabled': disabled,
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="base-button__spinner">⟳</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  loading: false,
  disabled: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
}

.base-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Sizes */
.base-button--small {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 32px;
}

.base-button--medium {
  padding: 12px 24px;
  font-size: 16px;
  min-height: 40px;
}

.base-button--large {
  padding: 16px 32px;
  font-size: 18px;
  min-height: 48px;
}

/* Variants */
.base-button--primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.base-button--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.base-button--secondary:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.base-button--danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.base-button--ghost {
  background: transparent;
  color: #6b7280;
  border: 1px solid transparent;
}

.base-button--ghost:hover:not(:disabled) {
  background: #f9fafb;
  color: #374151;
}

/* States */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.base-button--loading {
  cursor: wait;
}

.base-button__spinner {
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
