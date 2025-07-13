<template>
  <div 
    :class="[
      'theme-card',
      {
        'theme-card--selected': isSelected,
        'theme-card--template': theme.isTemplate,
        [`theme-card--${theme.mood}`]: true,
      }
    ]"
    @click="$emit('select', theme)"
  >
    <div class="theme-card__header">
      <div class="theme-card__info">
        <h3 class="theme-card__primary">{{ formatTheme(theme.primary) }}</h3>
        <div class="theme-card__meta">
          <span :class="`theme-card__mood theme-card__mood--${theme.mood}`">
            {{ formatMood(theme.mood) }}
          </span>
          <span :class="`theme-card__conflict theme-card__conflict--${theme.conflictType}`">
            {{ formatConflictType(theme.conflictType) }}
          </span>
        </div>
      </div>
      
      <div class="theme-card__actions">
        <button
          v-if="theme.isTemplate"
          class="theme-card__action"
          title="Template"
        >
          📋
        </button>
        <button
          class="theme-card__action"
          title="Edit"
          @click.stop="$emit('edit', theme)"
        >
          ✏️
        </button>
        <button
          class="theme-card__action"
          title="Duplicate"
          @click.stop="$emit('duplicate', theme.id)"
        >
          📄
        </button>
        <button
          class="theme-card__action theme-card__action--danger"
          title="Delete"
          @click.stop="$emit('delete', theme.id)"
        >
          🗑️
        </button>
      </div>
    </div>

    <p class="theme-card__description">{{ theme.description }}</p>

    <div v-if="theme.secondary.length" class="theme-card__secondary">
      <h4 class="theme-card__section-title">Secondary Themes:</h4>
      <div class="theme-card__secondary-themes">
        <span
          v-for="secondaryTheme in theme.secondary"
          :key="secondaryTheme"
          class="theme-card__secondary-theme"
        >
          {{ formatTheme(secondaryTheme) }}
        </span>
      </div>
    </div>

    <div class="theme-card__icon">
      {{ getThemeIcon(theme.primary) }}
    </div>

    <div v-if="isSelected" class="theme-card__selected-indicator">
      ✓ Selected
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoryTheme, Theme } from '../../types'

interface Props {
  theme: StoryTheme
  isSelected?: boolean
}

defineProps<Props>()

defineEmits<{
  select: [theme: StoryTheme]
  edit: [theme: StoryTheme]
  duplicate: [id: string]
  delete: [id: string]
}>()

function formatTheme(theme: string): string {
  return theme.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatMood(mood: string): string {
  return mood.charAt(0).toUpperCase() + mood.slice(1)
}

function formatConflictType(conflictType: string): string {
  return conflictType.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function getThemeIcon(theme: Theme): string {
  const icons: Record<Theme, string> = {
    'betrayal': '🗡️',
    'friendship': '🤝',
    'love': '❤️',
    'revenge': '⚔️',
    'redemption': '🕊️',
    'sacrifice': '⚖️',
    'power': '👑',
    'freedom': '🦅',
    'justice': '⚖️',
    'survival': '🛡️',
    'discovery': '🔍',
    'transformation': '🦋',
    'time-travel': '⏰',
    'family': '👨‍👩‍👧‍👦',
    'identity': '🪞',
    'coming-of-age': '🌱',
  }
  return icons[theme] || '✨'
}
</script>

<style scoped>
.theme-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.theme-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.theme-card--selected {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
}

.theme-card--template {
  border-left: 4px solid #f59e0b;
}

.theme-card--light {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.theme-card--dark {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
}

.theme-card--mixed {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
}

.theme-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.theme-card__info {
  flex: 1;
}

.theme-card__primary {
  font-size: 20px;
  font-weight: 600;
  color: #8b5cf6;
  margin: 0 0 8px 0;
}

.theme-card--dark .theme-card__primary {
  color: #c4b5fd;
}

.theme-card__meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.theme-card__mood {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.theme-card__mood--light {
  background: #fef3c7;
  color: #92400e;
}

.theme-card__mood--dark {
  background: #374151;
  color: #f9fafb;
}

.theme-card__mood--neutral {
  background: #f3f4f6;
  color: #374151;
}

.theme-card__mood--mixed {
  background: linear-gradient(90deg, #fef3c7, #374151);
  color: #1f2937;
}

.theme-card__conflict {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.theme-card__conflict--internal {
  background: #ddd6fe;
  color: #5b21b6;
}

.theme-card__conflict--external {
  background: #fecaca;
  color: #991b1b;
}

.theme-card__conflict--both {
  background: #d1fae5;
  color: #065f46;
}

.theme-card__actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.theme-card:hover .theme-card__actions {
  opacity: 1;
}

.theme-card__action {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.theme-card__action:hover {
  background: #f3f4f6;
}

.theme-card--dark .theme-card__action:hover {
  background: #4b5563;
}

.theme-card__action--danger:hover {
  background: #fee2e2;
}

.theme-card__description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.theme-card--dark .theme-card__description {
  color: #d1d5db;
}

.theme-card__section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.theme-card--dark .theme-card__section-title {
  color: #f9fafb;
}

.theme-card__secondary-themes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.theme-card__secondary-theme {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.theme-card--dark .theme-card__secondary-theme {
  background: #4338ca;
  color: #e0e7ff;
}

.theme-card__icon {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  opacity: 0.3;
}

.theme-card__selected-indicator {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #8b5cf6;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}
</style>
