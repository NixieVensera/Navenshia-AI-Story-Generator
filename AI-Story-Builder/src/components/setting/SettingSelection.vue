<template>
  <div class="setting-selection">
    <div class="setting-selection__header">
      <div class="setting-selection__title-section">
        <h2 class="setting-selection__title">Choose Your Settings</h2>
        <p class="setting-selection__subtitle">
          Select the worlds and locations where your story takes place
        </p>
      </div>
      
      <div class="setting-selection__actions">
        <BaseButton
          variant="ghost"
          size="small"
          @click="generateRandomSetting"
        >
          🎲 Random Setting
        </BaseButton>
        <BaseButton
          variant="primary"
          @click="showSettingBuilder = true"
        >
          + Create Setting
        </BaseButton>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="setting-selection__filters">
      <BaseInput
        v-model="searchQuery"
        placeholder="Search settings..."
        class="setting-selection__search"
      >
        <template #suffix>
          🔍
        </template>
      </BaseInput>
      
      <div class="setting-selection__filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.key"
          :class="[
            'setting-selection__filter-tab',
            { 'setting-selection__filter-tab--active': activeFilter === filter.key }
          ]"
          @click="activeFilter = filter.key"
        >
          {{ filter.label }}
          <span class="setting-selection__filter-count">{{ filter.count }}</span>
        </button>
      </div>

      <!-- Genre Filter -->
      <div class="setting-selection__genre-filters">
        <button
          v-for="genre in genres"
          :key="genre"
          :class="[
            'setting-selection__genre-filter',
            { 'setting-selection__genre-filter--active': selectedGenre === genre }
          ]"
          @click="toggleGenreFilter(genre)"
        >
          {{ formatGenre(genre) }}
        </button>
      </div>
    </div>

    <!-- Selected Settings Summary -->
    <div v-if="selectedSettings.length" class="setting-selection__selected">
      <h3 class="setting-selection__selected-title">
        Selected Settings ({{ selectedSettings.length }})
      </h3>
      <div class="setting-selection__selected-list">
        <div
          v-for="setting in selectedSettings"
          :key="setting.id"
          class="setting-selection__selected-item"
        >
          <span class="setting-selection__selected-name">{{ setting.name }}</span>
          <span class="setting-selection__selected-type">{{ formatType(setting.type) }}</span>
          <button
            class="setting-selection__selected-remove"
            @click="deselectSetting(setting.id)"
          >
            ✕
          </button>
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="small"
        @click="clearSelectedSettings"
      >
        Clear All
      </BaseButton>
    </div>

    <!-- Setting Grid -->
    <div class="setting-selection__grid">
      <SettingCard
        v-for="setting in filteredSettings"
        :key="setting.id"
        :setting="setting"
        :is-selected="isSettingSelected(setting.id)"
        @select="selectSetting"
        @edit="editSetting"
        @duplicate="duplicateSetting"
        @delete="deleteSetting"
      />
      
      <div
        v-if="filteredSettings.length === 0"
        class="setting-selection__empty"
      >
        <div class="setting-selection__empty-icon">🌍</div>
        <h3 class="setting-selection__empty-title">No settings found</h3>
        <p class="setting-selection__empty-text">
          {{ searchQuery ? 'Try adjusting your search terms' : 'Create your first setting to get started' }}
        </p>
        <BaseButton
          variant="primary"
          @click="showSettingBuilder = true"
        >
          Create Setting
        </BaseButton>
      </div>
    </div>

    <!-- Setting Builder Modal -->
    <div
      v-if="showSettingBuilder"
      class="setting-selection__modal"
      @click.self="closeSettingBuilder"
    >
      <SettingBuilder
        :editing-setting="editingSetting"
        @close="closeSettingBuilder"
        @submit="handleSettingSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingStore } from '../../stores/settingStore'
import type { Setting } from '../../types'
import { Genre } from '../../types'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import SettingCard from './SettingCard.vue'
import SettingBuilder from './SettingBuilder.vue'

const settingStore = useSettingStore()

const searchQuery = ref('')
const activeFilter = ref('all')
const selectedGenre = ref<Genre | null>(null)
const showSettingBuilder = ref(false)
const editingSetting = ref<Setting | null>(null)

const genres = Object.values(Genre)

const filters = computed(() => [
  { key: 'all', label: 'All', count: settingStore.settings.length },
  { key: 'templates', label: 'Templates', count: settingStore.templates.length },
])

const filteredSettings = computed(() => {
  let settings = settingStore.settings

  // Apply template filter
  if (activeFilter.value === 'templates') {
    settings = settingStore.templates
  }

  // Apply genre filter
  if (selectedGenre.value) {
    settings = settings.filter(setting => setting.genre === selectedGenre.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    settings = settingStore.searchSettings(searchQuery.value)
  }

  return settings
})

const selectedSettings = computed(() => settingStore.selectedSettings)

function isSettingSelected(id: string): boolean {
  return selectedSettings.value.some(setting => setting.id === id)
}

function selectSetting(setting: Setting) {
  if (isSettingSelected(setting.id)) {
    settingStore.deselectSetting(setting.id)
  } else {
    settingStore.selectSetting(setting)
  }
}

function deselectSetting(id: string) {
  settingStore.deselectSetting(id)
}

function clearSelectedSettings() {
  settingStore.clearSelectedSettings()
}

function editSetting(setting: Setting) {
  editingSetting.value = setting
  showSettingBuilder.value = true
}

function duplicateSetting(id: string) {
  settingStore.duplicateSetting(id)
}

function deleteSetting(id: string) {
  if (confirm('Are you sure you want to delete this setting?')) {
    settingStore.deleteSetting(id)
  }
}

function generateRandomSetting() {
  settingStore.generateRandomSetting()
}

function toggleGenreFilter(genre: Genre) {
  selectedGenre.value = selectedGenre.value === genre ? null : genre
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

function closeSettingBuilder() {
  showSettingBuilder.value = false
  editingSetting.value = null
}

function handleSettingSubmit(settingData: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>) {
  if (editingSetting.value) {
    settingStore.updateSetting(editingSetting.value.id, settingData)
  } else {
    settingStore.addSetting(settingData)
  }
  closeSettingBuilder()
}

onMounted(() => {
  settingStore.loadFromStorage()
})
</script>

<style scoped>
.setting-selection {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.setting-selection__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.setting-selection__title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.setting-selection__subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.setting-selection__actions {
  display: flex;
  gap: 12px;
}

.setting-selection__filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.setting-selection__search {
  max-width: 400px;
}

.setting-selection__filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.setting-selection__filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-selection__filter-tab:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.setting-selection__filter-tab--active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.setting-selection__filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.setting-selection__genre-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.setting-selection__genre-filter {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.setting-selection__genre-filter:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.setting-selection__genre-filter--active {
  border-color: #10b981;
  background: #10b981;
  color: white;
}

.setting-selection__selected {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.setting-selection__selected-title {
  font-size: 18px;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0 0 16px 0;
}

.setting-selection__selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.setting-selection__selected-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 8px 12px;
}

.setting-selection__selected-name {
  font-weight: 500;
  color: #0c4a6e;
}

.setting-selection__selected-type {
  font-size: 12px;
  color: #0369a1;
  text-transform: capitalize;
}

.setting-selection__selected-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

.setting-selection__selected-remove:hover {
  background: #fee2e2;
}

.setting-selection__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.setting-selection__empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.setting-selection__empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.setting-selection__empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.setting-selection__empty-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.setting-selection__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
</style>
