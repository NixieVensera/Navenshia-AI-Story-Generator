<template>
  <div class="step-indicator">
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      :class="[
        'step-indicator__step',
        {
          'step-indicator__step--active': index === currentStepIndex,
          'step-indicator__step--completed': index < currentStepIndex,
          'step-indicator__step--disabled': index > currentStepIndex,
        }
      ]"
      @click="$emit('step-click', step.key, index)"
    >
      <div class="step-indicator__circle">
        <span v-if="index < currentStepIndex" class="step-indicator__check">✓</span>
        <span v-else class="step-indicator__number">{{ index + 1 }}</span>
      </div>
      <div class="step-indicator__label">{{ step.label }}</div>
      <div v-if="index < steps.length - 1" class="step-indicator__connector" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  key: string
  label: string
}

interface Props {
  steps: Step[]
  currentStepIndex: number
}

defineProps<Props>()

defineEmits<{
  'step-click': [stepKey: string, index: number]
}>()
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  position: relative;
}

.step-indicator__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.step-indicator__step--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.step-indicator__circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  border: 2px solid #e5e7eb;
  background: white;
  color: #9ca3af;
}

.step-indicator__step--active .step-indicator__circle {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.step-indicator__step--completed .step-indicator__circle {
  border-color: #10b981;
  background: #10b981;
  color: white;
}

.step-indicator__check {
  font-size: 18px;
}

.step-indicator__number {
  font-size: 16px;
}

.step-indicator__label {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #6b7280;
  transition: color 0.2s ease;
}

.step-indicator__step--active .step-indicator__label {
  color: #3b82f6;
}

.step-indicator__step--completed .step-indicator__label {
  color: #10b981;
}

.step-indicator__connector {
  position: absolute;
  top: 20px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: -1;
  transition: background-color 0.2s ease;
}

.step-indicator__step--completed .step-indicator__connector {
  background: #10b981;
}

@media (max-width: 768px) {
  .step-indicator {
    flex-direction: column;
    gap: 16px;
  }
  
  .step-indicator__step {
    flex-direction: row;
    min-width: auto;
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }
  
  .step-indicator__circle {
    margin-bottom: 0;
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .step-indicator__label {
    text-align: left;
  }
  
  .step-indicator__connector {
    display: none;
  }
}
</style>
