<template>
  <div class="theme-builder">
    <div class="theme-builder__header">
      <h2 class="theme-builder__title">
        {{ editingTheme ? 'Edit Theme' : 'Create New Theme' }}
      </h2>
      <BaseButton
        variant="ghost"
        size="small"
        @click="$emit('close')"
      >
        ✕
      </BaseButton>
    </div>

    <form @submit.prevent="handleSubmit" class="theme-builder__form">
      <!-- Primary Theme -->
      <div class="theme-builder__section">
        <h3 class="theme-builder__section-title">Primary Theme</h3>
        
        <div class="base-input">
          <label class="base-input__label">Main Theme</label>
          <select v-model="form.primary" class="theme-builder__select">
            <option v-for="theme in themes" :key="theme" :value="theme">
              {{ formatTheme(theme) }}
            </option>
          </select>
        </div>

        <div class="base-input">
          <label class="base-input__label">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Describe how this theme will be explored in your story..."
            class="theme-builder__textarea"
            rows="3"
          />
        </div>
      </div>

      <!-- Secondary Themes -->
      <div class="theme-builder__section">
        <h3 class="theme-builder__section-title">Secondary Themes</h3>
        <p class="theme-builder__section-description">
          Choose additional themes that complement your primary theme
        </p>
        
        <div class="theme-builder__theme-grid">
          <label
            v-for="theme in availableSecondaryThemes"
            :key="theme"
            class="theme-builder__theme-option"
          >
            <input
              type="checkbox"
              :value="theme"
              :checked="form.secondary.includes(theme)"
              @change="toggleSecondaryTheme(theme)"
            />
            <span class="theme-builder__theme-label">{{ formatTheme(theme) }}</span>
          </label>
        </div>
      </div>

      <!-- Theme Properties -->
      <div class="theme-builder__section">
        <h3 class="theme-builder__section-title">Theme Properties</h3>
        
        <div class="theme-builder__row">
          <div class="base-input">
            <label class="base-input__label">Conflict Type</label>
            <select v-model="form.conflictType" class="theme-builder__select">
              <option value="internal">Internal - Character vs Self</option>
              <option value="external">External - Character vs World</option>
              <option value="both">Both - Internal and External</option>
            </select>
          </div>
          
          <div class="base-input">
            <label class="base-input__label">Mood</label>
            <select v-model="form.mood" class="theme-builder__select">
              <option value="light">Light - Hopeful and uplifting</option>
              <option value="dark">Dark - Serious and somber</option>
              <option value="neutral">Neutral - Balanced tone</option>
              <option value="mixed">Mixed - Varies throughout</option>
            </select>
          </div>
        </div>

        <div class="theme-builder__checkbox">
          <label>
            <input
              type="checkbox"
              v-model="form.isTemplate"
            />
            <span>Save as template for future use</span>
          </label>
        </div>
      </div>

      <!-- Theme Suggestions -->
      <div v-if="suggestions.length" class="theme-builder__section">
        <h3 class="theme-builder__section-title">Suggested Combinations</h3>
        <p class="theme-builder__section-description">
          Popular theme combinations that work well together
        </p>
        
        <div class="theme-builder__suggestions">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.primary"
            class="theme-builder__suggestion"
            @click="applySuggestion(suggestion)"
          >
            <div class="theme-builder__suggestion-header">
              <strong>{{ formatTheme(suggestion.primary) }}</strong>
              <span class="theme-builder__suggestion-secondary">
                + {{ suggestion.secondary.map(formatTheme).join(', ') }}
              </span>
            </div>
            <p class="theme-builder__suggestion-description">
              {{ suggestion.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="theme-builder__actions">
        <BaseButton
          variant="secondary"
          @click="$emit('close')"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          :loading="isSubmitting"
        >
          {{ editingTheme ? 'Update Theme' : 'Create Theme' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { StoryTheme } from '../../types'
import { Theme } from '../../types'
import { themeComboSuggestions } from '../../data/sampleData'
import BaseButton from '../ui/BaseButton.vue'

interface Props {
  editingTheme?: StoryTheme | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [theme: Omit<StoryTheme, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const isSubmitting = ref(false)
const themes = Object.values(Theme)
const suggestions = themeComboSuggestions

const form = reactive({
  primary: Theme.REDEMPTION,
  secondary: [] as Theme[],
  description: '',
  conflictType: 'both' as 'internal' | 'external' | 'both',
  mood: 'mixed' as 'light' | 'dark' | 'neutral' | 'mixed',
  isTemplate: false,
})

const availableSecondaryThemes = computed(() => 
  themes.filter(theme => theme !== form.primary)
)

// Initialize form with editing theme data
watch(() => props.editingTheme, (theme) => {
  if (theme) {
    form.primary = theme.primary
    form.secondary = [...theme.secondary]
    form.description = theme.description
    form.conflictType = theme.conflictType
    form.mood = theme.mood
    form.isTemplate = theme.isTemplate
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.primary = Theme.REDEMPTION
  form.secondary = []
  form.description = ''
  form.conflictType = 'both'
  form.mood = 'mixed'
  form.isTemplate = false
}

function formatTheme(theme: string): string {
  return theme.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function toggleSecondaryTheme(theme: Theme) {
  const index = form.secondary.indexOf(theme)
  if (index > -1) {
    form.secondary.splice(index, 1)
  } else {
    form.secondary.push(theme)
  }
}

function applySuggestion(suggestion: typeof suggestions[0]) {
  form.primary = suggestion.primary
  form.secondary = [...suggestion.secondary]
  form.description = suggestion.description
}

async function handleSubmit() {
  isSubmitting.value = true

  try {
    const themeData: Omit<StoryTheme, 'id' | 'createdAt' | 'updatedAt'> = {
      primary: form.primary,
      secondary: [...form.secondary],
      description: form.description.trim() || `A story exploring ${formatTheme(form.primary)}${form.secondary.length ? ` with elements of ${form.secondary.map(formatTheme).join(', ')}` : ''}`,
      conflictType: form.conflictType,
      mood: form.mood,
      isTemplate: form.isTemplate,
    }

    emit('submit', themeData)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.theme-builder {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.theme-builder__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.theme-builder__title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.theme-builder__form {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.theme-builder__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.theme-builder__section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.theme-builder__section-description {
  font-size: 14px;
  color: #6b7280;
  margin: -8px 0 0 0;
}

.theme-builder__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.theme-builder__select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background: white;
}

.theme-builder__textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.theme-builder__theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.theme-builder__theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.theme-builder__theme-option:hover {
  background: #f9fafb;
  border-color: #8b5cf6;
}

.theme-builder__theme-option:has(input:checked) {
  background: #faf5ff;
  border-color: #8b5cf6;
}

.theme-builder__theme-label {
  font-weight: 500;
  color: #374151;
}

.theme-builder__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-builder__suggestions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-builder__suggestion {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-builder__suggestion:hover {
  border-color: #8b5cf6;
  background: #faf5ff;
}

.theme-builder__suggestion-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.theme-builder__suggestion-secondary {
  font-size: 14px;
  color: #6b7280;
}

.theme-builder__suggestion-description {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  line-height: 1.4;
}

.theme-builder__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}
</style>
