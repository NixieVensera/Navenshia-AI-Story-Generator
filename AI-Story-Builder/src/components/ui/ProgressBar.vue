<template>
  <div class="progress-bar">
    <div class="progress-bar__track">
      <div 
        class="progress-bar__fill"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <div v-if="showPercentage" class="progress-bar__percentage">
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number // 0-100
  showPercentage?: boolean
}

withDefaults(defineProps<Props>(), {
  showPercentage: true,
})
</script>

<style scoped>
.progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar__track {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-bar__percentage {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  min-width: 40px;
  text-align: right;
}
</style>
