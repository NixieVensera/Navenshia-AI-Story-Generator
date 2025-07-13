<template>
  <div 
    :class="[
      'setting-card',
      {
        'setting-card--selected': isSelected,
        'setting-card--template': setting.isTemplate,
      }
    ]"
    @click="$emit('select', setting)"
  >
    <div class="setting-card__image">
      <div :class="`setting-card__image-placeholder setting-card__image-placeholder--${setting.type}`">
        {{ getSettingIcon(setting.type) }}
      </div>
      <div class="setting-card__genre-badge">
        {{ formatGenre(setting.genre) }}
      </div>
    </div>

    <div class="setting-card__content">
      <div class="setting-card__header">
        <div class="setting-card__info">
          <h3 class="setting-card__name">{{ setting.name }}</h3>
          <div class="setting-card__meta">
            <span class="setting-card__type">{{ formatType(setting.type) }}</span>
            <span v-if="setting.timeOfDay" class="setting-card__time">
              {{ formatTimeOfDay(setting.timeOfDay) }}
            </span>
          </div>
        </div>
        
        <div class="setting-card__actions">
          <button
            v-if="setting.isTemplate"
            class="setting-card__action"
            title="Template"
          >
            📋
          </button>
          <button
            class="setting-card__action"
            title="Edit"
            @click.stop="$emit('edit', setting)"
          >
            ✏️
          </button>
          <button
            class="setting-card__action"
            title="Duplicate"
            @click.stop="$emit('duplicate', setting.id)"
          >
            📄
          </button>
          <button
            class="setting-card__action setting-card__action--danger"
            title="Delete"
            @click.stop="$emit('delete', setting.id)"
          >
            🗑️
          </button>
        </div>
      </div>

      <p class="setting-card__description">{{ setting.description }}</p>
      
      <div class="setting-card__atmosphere">
        <strong>Atmosphere:</strong> {{ setting.atmosphere }}
      </div>

      <div v-if="setting.keyLocations.length" class="setting-card__locations">
        <h4 class="setting-card__section-title">Key Locations:</h4>
        <div class="setting-card__location-tags">
          <span
            v-for="location in setting.keyLocations.slice(0, 3)"
            :key="location"
            class="setting-card__location-tag"
          >
            {{ location }}
          </span>
          <span
            v-if="setting.keyLocations.length > 3"
            class="setting-card__location-tag setting-card__location-tag--more"
          >
            +{{ setting.keyLocations.length - 3 }} more
          </span>
        </div>
      </div>

      <div class="setting-card__details">
        <div v-if="setting.weather" class="setting-card__detail">
          <span class="setting-card__detail-label">Weather:</span>
          <span class="setting-card__detail-value">{{ setting.weather }}</span>
        </div>
        <div v-if="setting.season" class="setting-card__detail">
          <span class="setting-card__detail-label">Season:</span>
          <span class="setting-card__detail-value">{{ formatSeason(setting.season) }}</span>
        </div>
      </div>
    </div>

    <div v-if="isSelected" class="setting-card__selected-indicator">
      ✓ Selected
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Setting, SettingType } from '../../types'

interface Props {
  setting: Setting
  isSelected?: boolean
}

defineProps<Props>()

defineEmits<{
  select: [setting: Setting]
  edit: [setting: Setting]
  duplicate: [id: string]
  delete: [id: string]
}>()

function getSettingIcon(type: SettingType): string {
  const icons: Record<SettingType, string> = {
    'urban': '🏙️',
    'rural': '🌾',
    'wilderness': '🌲',
    'underground': '🕳️',
    'space': '🚀',
    'underwater': '🌊',
    'magical-realm': '✨',
    'dystopian-city': '🏭',
    'small-town': '🏘️',
    'castle': '🏰',
    'spaceship': '🛸',
    'desert': '🏜️',
    'forest': '🌳',
    'mountain': '⛰️',
    'island': '🏝️',
  }
  return icons[type] || '🌍'
}

function formatGenre(genre: string): string {
  return genre.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatType(type: string): string {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatTimeOfDay(time: string): string {
  return time.charAt(0).toUpperCase() + time.slice(1)
}

function formatSeason(season: string): string {
  return season.charAt(0).toUpperCase() + season.slice(1)
}
</script>

<style scoped>
.setting-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.setting-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.setting-card--selected {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.setting-card--template {
  border-left: 4px solid #f59e0b;
}

.setting-card__image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.setting-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

.setting-card__image-placeholder--urban {
  background: linear-gradient(135deg, #374151, #6b7280);
}

.setting-card__image-placeholder--forest {
  background: linear-gradient(135deg, #065f46, #10b981);
}

.setting-card__image-placeholder--desert {
  background: linear-gradient(135deg, #92400e, #f59e0b);
}

.setting-card__image-placeholder--space {
  background: linear-gradient(135deg, #1e1b4b, #3730a3);
}

.setting-card__image-placeholder--underwater {
  background: linear-gradient(135deg, #0c4a6e, #0ea5e9);
}

.setting-card__image-placeholder--mountain {
  background: linear-gradient(135deg, #44403c, #78716c);
}

.setting-card__image-placeholder--castle {
  background: linear-gradient(135deg, #7c2d12, #dc2626);
}

.setting-card__genre-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.setting-card__content {
  padding: 20px;
}

.setting-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.setting-card__info {
  flex: 1;
}

.setting-card__name {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.setting-card__meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.setting-card__type {
  padding: 4px 8px;
  background: #f3f4f6;
  color: #374151;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-card__time {
  font-size: 14px;
  color: #6b7280;
}

.setting-card__actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.setting-card:hover .setting-card__actions {
  opacity: 1;
}

.setting-card__action {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.setting-card__action:hover {
  background: #f3f4f6;
}

.setting-card__action--danger:hover {
  background: #fee2e2;
}

.setting-card__description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.setting-card__atmosphere {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.setting-card__section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.setting-card__location-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.setting-card__location-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.setting-card__location-tag--more {
  background: #e5e7eb;
  color: #6b7280;
  font-style: italic;
}

.setting-card__details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.setting-card__detail {
  display: flex;
  gap: 4px;
  font-size: 14px;
}

.setting-card__detail-label {
  color: #6b7280;
  font-weight: 500;
}

.setting-card__detail-value {
  color: #374151;
  text-transform: capitalize;
}

.setting-card__selected-indicator {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}
</style>
