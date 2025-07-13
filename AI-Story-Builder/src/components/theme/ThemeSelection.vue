<template>
  <div class="theme-selection">
    <div class="theme-selection__header">
      <div class="theme-selection__title-section">
        <h2 class="theme-selection__title">Choose Your Themes</h2>
        <p class="theme-selection__subtitle">
          Select the central themes and conflicts that will drive your story
        </p>
      </div>
      
      <div class="theme-selection__actions">
        <BaseButton
          variant="ghost"
          size="small"
          @click="generateRandomTheme"
        >
          🎲 Random Theme
        </BaseButton>
        <BaseButton
          variant="primary"
          @click="showThemeBuilder = true"
        >
          + Create Theme
        </BaseButton>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="theme-selection__filters">
      <BaseInput
        v-model="searchQuery"
        placeholder="Search themes..."
        class="theme-selection__search"
      >
        <template #suffix>
          🔍
        </template>
      </BaseInput>
      
      <div class="theme-selection__filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.key"
          :class="[
            'theme-selection__filter-tab',
            { 'theme-selection__filter-tab--active': activeFilter === filter.key }
          ]"
          @click="activeFilter = filter.key"
        >
          {{ filter.label }}
          <span class="theme-selection__filter-count">{{ filter.count }}</span>
        </button>
      </div>

      <!-- Mood Filter -->
      <div class="theme-selection__mood-filters">
        <button
          v-for="mood in moods"
          :key="mood"
          :class="[
            'theme-selection__mood-filter',
            `theme-selection__mood-filter--${mood}`,
            { 'theme-selection__mood-filter--active': selectedMood === mood }
          ]"
          @click="toggleMoodFilter(mood)"
        >
          {{ formatMood(mood) }}
        </button>
      </div>
    </div>

    <!-- Theme Suggestions -->
    <div v-if="suggestions.length && !searchQuery" class="theme-selection__suggestions">
      <h3 class="theme-selection__suggestions-title">Popular Combinations</h3>
      <div class="theme-selection__suggestion-cards">
        <div
          v-for="suggestion in suggestions.slice(0, 4)"
          :key="suggestion.primary"
          class="theme-selection__suggestion-card"
          @click="createFromSuggestion(suggestion)"
        >
          <div class="theme-selection__suggestion-header">
            <strong>{{ formatTheme(suggestion.primary) }}</strong>
            <span class="theme-selection__suggestion-plus">+</span>
            <span>{{ suggestion.secondary.map(formatTheme).join(', ') }}</span>
          </div>
          <p class="theme-selection__suggestion-description">
            {{ suggestion.description }}
          </p>
          <BaseButton variant="ghost" size="small">
            Use This Combination
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Selected Themes Summary -->
    <div v-if="selectedThemes.length" class="theme-selection__selected">
      <h3 class="theme-selection__selected-title">
        Selected Themes ({{ selectedThemes.length }})
      </h3>
      <div class="theme-selection__selected-list">
        <div
          v-for="theme in selectedThemes"
          :key="theme.id"
          class="theme-selection__selected-item"
        >
          <span class="theme-selection__selected-primary">{{ formatTheme(theme.primary) }}</span>
          <span v-if="theme.secondary.length" class="theme-selection__selected-secondary">
            + {{ theme.secondary.length }} more
          </span>
          <span :class="`theme-selection__selected-mood theme-selection__selected-mood--${theme.mood}`">
            {{ formatMood(theme.mood) }}
          </span>
          <button
            class="theme-selection__selected-remove"
            @click="deselectTheme(theme.id)"
          >
            ✕
          </button>
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="small"
        @click="clearSelectedThemes"
      >
        Clear All
      </BaseButton>
    </div>

    <!-- Theme Grid -->
    <div class="theme-selection__grid">
      <ThemeCard
        v-for="theme in filteredThemes"
        :key="theme.id"
        :theme="theme"
        :is-selected="isThemeSelected(theme.id)"
        @select="selectTheme"
        @edit="editTheme"
        @duplicate="duplicateTheme"
        @delete="deleteTheme"
      />
      
      <div
        v-if="filteredThemes.length === 0"
        class="theme-selection__empty"
      >
        <div class="theme-selection__empty-icon">🎭</div>
        <h3 class="theme-selection__empty-title">No themes found</h3>
        <p class="theme-selection__empty-text">
          {{ searchQuery ? 'Try adjusting your search terms' : 'Create your first theme to get started' }}
        </p>
        <BaseButton
          variant="primary"
          @click="showThemeBuilder = true"
        >
          Create Theme
        </BaseButton>
      </div>
    </div>

    <!-- Theme Builder Modal -->
    <div
      v-if="showThemeBuilder"
      class="theme-selection__modal"
      @click.self="closeThemeBuilder"
    >
      <ThemeBuilder
        :editing-theme="editingTheme"
        @close="closeThemeBuilder"
        @submit="handleThemeSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../../stores/themeStore'
import type { StoryTheme } from '../../types'
import { themeComboSuggestions } from '../../data/sampleData'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import ThemeCard from './ThemeCard.vue'
import ThemeBuilder from './ThemeBuilder.vue'

const themeStore = useThemeStore()

const searchQuery = ref('')
const activeFilter = ref('all')
const selectedMood = ref<string | null>(null)
const showThemeBuilder = ref(false)
const editingTheme = ref<StoryTheme | null>(null)

const moods = ['light', 'dark', 'neutral', 'mixed']
const suggestions = themeComboSuggestions

const filters = computed(() => [
  { key: 'all', label: 'All', count: themeStore.themes.length },
  { key: 'templates', label: 'Templates', count: themeStore.templates.length },
  { key: 'internal', label: 'Internal Conflict', count: themeStore.themesByConflictType.internal?.length || 0 },
  { key: 'external', label: 'External Conflict', count: themeStore.themesByConflictType.external?.length || 0 },
])

const filteredThemes = computed(() => {
  let themes = themeStore.themes

  // Apply filter
  if (activeFilter.value === 'templates') {
    themes = themeStore.templates
  } else if (activeFilter.value === 'internal') {
    themes = themeStore.getThemesByConflictType('internal')
  } else if (activeFilter.value === 'external') {
    themes = themeStore.getThemesByConflictType('external')
  }

  // Apply mood filter
  if (selectedMood.value) {
    themes = themes.filter(theme => theme.mood === selectedMood.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    themes = themeStore.searchThemes(searchQuery.value)
  }

  return themes
})

const selectedThemes = computed(() => themeStore.selectedThemes)

function isThemeSelected(id: string): boolean {
  return selectedThemes.value.some(theme => theme.id === id)
}

function selectTheme(theme: StoryTheme) {
  if (isThemeSelected(theme.id)) {
    themeStore.deselectTheme(theme.id)
  } else {
    themeStore.selectTheme(theme)
  }
}

function deselectTheme(id: string) {
  themeStore.deselectTheme(id)
}

function clearSelectedThemes() {
  themeStore.clearSelectedThemes()
}

function editTheme(theme: StoryTheme) {
  editingTheme.value = theme
  showThemeBuilder.value = true
}

function duplicateTheme(id: string) {
  themeStore.duplicateTheme(id)
}

function deleteTheme(id: string) {
  if (confirm('Are you sure you want to delete this theme?')) {
    themeStore.deleteTheme(id)
  }
}

function generateRandomTheme() {
  themeStore.generateRandomTheme()
}

function createFromSuggestion(suggestion: typeof suggestions[0]) {
  const newTheme = themeStore.createThemeFromSuggestion(suggestion)
  if (newTheme) {
    themeStore.selectTheme(newTheme)
  }
}

function toggleMoodFilter(mood: string) {
  selectedMood.value = selectedMood.value === mood ? null : mood
}

function formatTheme(theme: string): string {
  return theme.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatMood(mood: string): string {
  return mood.charAt(0).toUpperCase() + mood.slice(1)
}

function closeThemeBuilder() {
  showThemeBuilder.value = false
  editingTheme.value = null
}

function handleThemeSubmit(themeData: Omit<StoryTheme, 'id' | 'createdAt' | 'updatedAt'>) {
  if (editingTheme.value) {
    themeStore.updateTheme(editingTheme.value.id, themeData)
  } else {
    themeStore.addTheme(themeData)
  }
  closeThemeBuilder()
}

onMounted(() => {
  themeStore.loadFromStorage()
})
</script>

<style scoped>
.theme-selection {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.theme-selection__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.theme-selection__title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.theme-selection__subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.theme-selection__actions {
  display: flex;
  gap: 12px;
}

.theme-selection__filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.theme-selection__search {
  max-width: 400px;
}

.theme-selection__filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.theme-selection__filter-tab {
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

.theme-selection__filter-tab:hover {
  border-color: #8b5cf6;
  background: #faf5ff;
}

.theme-selection__filter-tab--active {
  border-color: #8b5cf6;
  background: #8b5cf6;
  color: white;
}

.theme-selection__filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.theme-selection__mood-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.theme-selection__mood-filter {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.theme-selection__mood-filter--light {
  border-color: #fbbf24;
  color: #92400e;
}

.theme-selection__mood-filter--light:hover,
.theme-selection__mood-filter--light.theme-selection__mood-filter--active {
  background: #fbbf24;
  color: white;
}

.theme-selection__mood-filter--dark {
  border-color: #374151;
  color: #374151;
}

.theme-selection__mood-filter--dark:hover,
.theme-selection__mood-filter--dark.theme-selection__mood-filter--active {
  background: #374151;
  color: white;
}

.theme-selection__mood-filter--neutral {
  border-color: #9ca3af;
  color: #6b7280;
}

.theme-selection__mood-filter--neutral:hover,
.theme-selection__mood-filter--neutral.theme-selection__mood-filter--active {
  background: #9ca3af;
  color: white;
}

.theme-selection__mood-filter--mixed {
  border-color: #8b5cf6;
  color: #7c3aed;
}

.theme-selection__mood-filter--mixed:hover,
.theme-selection__mood-filter--mixed.theme-selection__mood-filter--active {
  background: #8b5cf6;
  color: white;
}

.theme-selection__suggestions {
  background: #faf5ff;
  border: 1px solid #d8b4fe;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.theme-selection__suggestions-title {
  font-size: 20px;
  font-weight: 600;
  color: #7c3aed;
  margin: 0 0 16px 0;
}

.theme-selection__suggestion-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.theme-selection__suggestion-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-selection__suggestion-card:hover {
  border-color: #8b5cf6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
}

.theme-selection__suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
}

.theme-selection__suggestion-plus {
  color: #8b5cf6;
  font-weight: bold;
}

.theme-selection__suggestion-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.theme-selection__selected {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.theme-selection__selected-title {
  font-size: 18px;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0 0 16px 0;
}

.theme-selection__selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.theme-selection__selected-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 8px 12px;
}

.theme-selection__selected-primary {
  font-weight: 500;
  color: #0c4a6e;
}

.theme-selection__selected-secondary {
  font-size: 12px;
  color: #0369a1;
}

.theme-selection__selected-mood {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.theme-selection__selected-mood--light {
  background: #fef3c7;
  color: #92400e;
}

.theme-selection__selected-mood--dark {
  background: #374151;
  color: #f9fafb;
}

.theme-selection__selected-mood--neutral {
  background: #f3f4f6;
  color: #374151;
}

.theme-selection__selected-mood--mixed {
  background: #ddd6fe;
  color: #5b21b6;
}

.theme-selection__selected-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

.theme-selection__selected-remove:hover {
  background: #fee2e2;
}

.theme-selection__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.theme-selection__empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.theme-selection__empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.theme-selection__empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.theme-selection__empty-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.theme-selection__modal {
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
