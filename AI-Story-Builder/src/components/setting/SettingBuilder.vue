<template>
  <div class="setting-builder">
    <div class="setting-builder__header">
      <h2 class="setting-builder__title">
        {{ editingSetting ? 'Edit Setting' : 'Create New Setting' }}
      </h2>
      <BaseButton
        variant="ghost"
        size="small"
        @click="$emit('close')"
      >
        ✕
      </BaseButton>
    </div>

    <form @submit.prevent="handleSubmit" class="setting-builder__form">
      <!-- Basic Info -->
      <div class="setting-builder__section">
        <h3 class="setting-builder__section-title">Basic Information</h3>
        
        <BaseInput
          v-model="form.name"
          label="Setting Name"
          placeholder="Enter setting name"
          required
          :error="errors.name"
        />

        <div class="setting-builder__row">
          <div class="base-input">
            <label class="base-input__label">Genre</label>
            <select v-model="form.genre" class="setting-builder__select">
              <option v-for="genre in genres" :key="genre" :value="genre">
                {{ formatGenre(genre) }}
              </option>
            </select>
          </div>
          
          <div class="base-input">
            <label class="base-input__label">Type</label>
            <select v-model="form.type" class="setting-builder__select">
              <option v-for="type in settingTypes" :key="type" :value="type">
                {{ formatType(type) }}
              </option>
            </select>
          </div>
        </div>

        <div class="base-input">
          <label class="base-input__label">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Describe your setting..."
            class="setting-builder__textarea"
            rows="3"
          />
        </div>

        <div class="base-input">
          <label class="base-input__label">Atmosphere</label>
          <textarea
            v-model="form.atmosphere"
            placeholder="Describe the mood and feeling of this place..."
            class="setting-builder__textarea"
            rows="2"
          />
        </div>
      </div>

      <!-- Key Locations -->
      <div class="setting-builder__section">
        <h3 class="setting-builder__section-title">Key Locations</h3>
        <div class="setting-builder__list">
          <div
            v-for="(location, index) in form.keyLocations"
            :key="index"
            class="setting-builder__list-item"
          >
            <BaseInput
              :model-value="location"
              placeholder="Enter a location..."
              @update:model-value="updateLocation(index, $event)"
            />
            <BaseButton
              variant="ghost"
              size="small"
              @click="removeLocation(index)"
            >
              ✕
            </BaseButton>
          </div>
          <BaseButton
            variant="ghost"
            size="small"
            @click="addLocation"
          >
            + Add Location
          </BaseButton>
        </div>
      </div>

      <!-- Environmental Details -->
      <div class="setting-builder__section">
        <h3 class="setting-builder__section-title">Environmental Details</h3>
        
        <div class="setting-builder__row">
          <div class="base-input">
            <label class="base-input__label">Time of Day</label>
            <select v-model="form.timeOfDay" class="setting-builder__select">
              <option value="">Not specified</option>
              <option value="dawn">Dawn</option>
              <option value="morning">Morning</option>
              <option value="noon">Noon</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
              <option value="midnight">Midnight</option>
            </select>
          </div>
          
          <div class="base-input">
            <label class="base-input__label">Season</label>
            <select v-model="form.season" class="setting-builder__select">
              <option value="">Not specified</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>

        <BaseInput
          v-model="form.weather"
          label="Weather"
          placeholder="e.g., Sunny, Rainy, Stormy, Misty"
        />

        <div class="setting-builder__checkbox">
          <label>
            <input
              type="checkbox"
              v-model="form.isTemplate"
            />
            <span>Save as template for future use</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="setting-builder__actions">
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
          {{ editingSetting ? 'Update Setting' : 'Create Setting' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Setting } from '../../types'
import { Genre, SettingType } from '../../types'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'

interface Props {
  editingSetting?: Setting | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [setting: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const isSubmitting = ref(false)
const genres = Object.values(Genre)
const settingTypes = Object.values(SettingType)

const form = reactive({
  name: '',
  genre: Genre.FANTASY,
  type: SettingType.FOREST,
  description: '',
  atmosphere: '',
  keyLocations: [''],
  timeOfDay: '',
  weather: '',
  season: '',
  isTemplate: false,
})

const errors = reactive({
  name: '',
})

// Initialize form with editing setting data
watch(() => props.editingSetting, (setting) => {
  if (setting) {
    form.name = setting.name
    form.genre = setting.genre
    form.type = setting.type
    form.description = setting.description
    form.atmosphere = setting.atmosphere
    form.keyLocations = setting.keyLocations.length ? [...setting.keyLocations] : ['']
    form.timeOfDay = setting.timeOfDay || ''
    form.weather = setting.weather || ''
    form.season = setting.season || ''
    form.isTemplate = setting.isTemplate
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.name = ''
  form.genre = Genre.FANTASY
  form.type = SettingType.FOREST
  form.description = ''
  form.atmosphere = ''
  form.keyLocations = ['']
  form.timeOfDay = ''
  form.weather = ''
  form.season = ''
  form.isTemplate = false
  
  errors.name = ''
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

function addLocation() {
  form.keyLocations.push('')
}

function updateLocation(index: number, value: string) {
  form.keyLocations[index] = value
}

function removeLocation(index: number) {
  if (form.keyLocations.length > 1) {
    form.keyLocations.splice(index, 1)
  }
}

function validateForm(): boolean {
  errors.name = ''

  if (!form.name.trim()) {
    errors.name = 'Setting name is required'
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const settingData: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.name.trim(),
      genre: form.genre,
      type: form.type,
      description: form.description.trim(),
      atmosphere: form.atmosphere.trim(),
      keyLocations: form.keyLocations.filter(location => location.trim()),
      timeOfDay: form.timeOfDay as any || undefined,
      weather: form.weather.trim() || undefined,
      season: form.season as any || undefined,
      isTemplate: form.isTemplate,
    }

    emit('submit', settingData)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.setting-builder {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.setting-builder__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.setting-builder__title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.setting-builder__form {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-builder__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-builder__section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.setting-builder__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.setting-builder__select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background: white;
}

.setting-builder__textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.setting-builder__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-builder__list-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.setting-builder__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-builder__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}
</style>
