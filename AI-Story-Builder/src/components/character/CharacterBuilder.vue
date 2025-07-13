<template>
  <div class="character-builder">
    <div class="character-builder__header">
      <h2 class="character-builder__title">
        {{ editingCharacter ? 'Edit Character' : 'Create New Character' }}
      </h2>
      <BaseButton
        variant="ghost"
        size="small"
        @click="$emit('close')"
      >
        ✕
      </BaseButton>
    </div>

    <form @submit.prevent="handleSubmit" class="character-builder__form">
      <!-- Basic Info -->
      <div class="character-builder__section">
        <h3 class="character-builder__section-title">Basic Information</h3>
        
        <BaseInput
          v-model="form.name"
          label="Character Name"
          placeholder="Enter character name"
          required
          :error="errors.name"
        />

        <div class="character-builder__row">
          <BaseInput
            v-model="form.age"
            label="Age"
            type="number"
            placeholder="25"
            :error="errors.age"
          />
          
          <div class="base-input">
            <label class="base-input__label">Role</label>
            <select v-model="form.role" class="character-builder__select">
              <option value="protagonist">Protagonist</option>
              <option value="antagonist">Antagonist</option>
              <option value="supporting">Supporting</option>
              <option value="minor">Minor</option>
            </select>
          </div>
        </div>

        <div class="base-input">
          <label class="base-input__label">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Describe your character..."
            class="character-builder__textarea"
            rows="3"
          />
        </div>
      </div>

      <!-- Personality Traits -->
      <div class="character-builder__section">
        <h3 class="character-builder__section-title">Personality Traits</h3>
        <div class="character-builder__traits">
          <label
            v-for="trait in personalityTraits"
            :key="trait"
            class="character-builder__trait"
          >
            <input
              type="checkbox"
              :value="trait"
              :checked="form.personalityTraits.includes(trait)"
              @change="toggleTrait(trait)"
            />
            <span>{{ formatTrait(trait) }}</span>
          </label>
        </div>
      </div>

      <!-- Goals -->
      <div class="character-builder__section">
        <h3 class="character-builder__section-title">Goals</h3>
        <div class="character-builder__list">
          <div
            v-for="(goal, index) in form.goals"
            :key="index"
            class="character-builder__list-item"
          >
            <BaseInput
              :model-value="goal"
              placeholder="Enter a goal..."
              @update:model-value="updateGoal(index, $event)"
            />
            <BaseButton
              variant="ghost"
              size="small"
              @click="removeGoal(index)"
            >
              ✕
            </BaseButton>
          </div>
          <BaseButton
            variant="ghost"
            size="small"
            @click="addGoal"
          >
            + Add Goal
          </BaseButton>
        </div>
      </div>

      <!-- Flaws -->
      <div class="character-builder__section">
        <h3 class="character-builder__section-title">Flaws</h3>
        <div class="character-builder__list">
          <div
            v-for="(flaw, index) in form.flaws"
            :key="index"
            class="character-builder__list-item"
          >
            <BaseInput
              :model-value="flaw"
              placeholder="Enter a flaw..."
              @update:model-value="updateFlaw(index, $event)"
            />
            <BaseButton
              variant="ghost"
              size="small"
              @click="removeFlaw(index)"
            >
              ✕
            </BaseButton>
          </div>
          <BaseButton
            variant="ghost"
            size="small"
            @click="addFlaw"
          >
            + Add Flaw
          </BaseButton>
        </div>
      </div>

      <!-- Optional Details -->
      <div class="character-builder__section">
        <h3 class="character-builder__section-title">Optional Details</h3>
        
        <div class="base-input">
          <label class="base-input__label">Backstory</label>
          <textarea
            v-model="form.backstory"
            placeholder="Character's background and history..."
            class="character-builder__textarea"
            rows="3"
          />
        </div>

        <div class="base-input">
          <label class="base-input__label">Appearance</label>
          <textarea
            v-model="form.appearance"
            placeholder="Physical description..."
            class="character-builder__textarea"
            rows="2"
          />
        </div>

        <div class="character-builder__checkbox">
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
      <div class="character-builder__actions">
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
          {{ editingCharacter ? 'Update Character' : 'Create Character' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Character } from '../../types'
import { PersonalityTrait } from '../../types'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'

interface Props {
  editingCharacter?: Character | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const isSubmitting = ref(false)
const personalityTraits = Object.values(PersonalityTrait)

const form = reactive({
  name: '',
  age: '',
  description: '',
  personalityTraits: [] as PersonalityTrait[],
  goals: [''],
  flaws: [''],
  backstory: '',
  appearance: '',
  role: 'supporting' as Character['role'],
  isTemplate: false,
})

const errors = reactive({
  name: '',
  age: '',
})

// Initialize form with editing character data
watch(() => props.editingCharacter, (character) => {
  if (character) {
    form.name = character.name
    form.age = character.age?.toString() || ''
    form.description = character.description
    form.personalityTraits = [...character.personalityTraits]
    form.goals = character.goals.length ? [...character.goals] : ['']
    form.flaws = character.flaws.length ? [...character.flaws] : ['']
    form.backstory = character.backstory || ''
    form.appearance = character.appearance || ''
    form.role = character.role
    form.isTemplate = character.isTemplate
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.name = ''
  form.age = ''
  form.description = ''
  form.personalityTraits = []
  form.goals = ['']
  form.flaws = ['']
  form.backstory = ''
  form.appearance = ''
  form.role = 'supporting'
  form.isTemplate = false
  
  errors.name = ''
  errors.age = ''
}

function toggleTrait(trait: PersonalityTrait) {
  const index = form.personalityTraits.indexOf(trait)
  if (index > -1) {
    form.personalityTraits.splice(index, 1)
  } else {
    form.personalityTraits.push(trait)
  }
}

function formatTrait(trait: string): string {
  return trait.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function addGoal() {
  form.goals.push('')
}

function updateGoal(index: number, value: string) {
  form.goals[index] = value
}

function removeGoal(index: number) {
  if (form.goals.length > 1) {
    form.goals.splice(index, 1)
  }
}

function addFlaw() {
  form.flaws.push('')
}

function updateFlaw(index: number, value: string) {
  form.flaws[index] = value
}

function removeFlaw(index: number) {
  if (form.flaws.length > 1) {
    form.flaws.splice(index, 1)
  }
}

function validateForm(): boolean {
  errors.name = ''
  errors.age = ''

  if (!form.name.trim()) {
    errors.name = 'Character name is required'
    return false
  }

  if (form.age && (isNaN(Number(form.age)) || Number(form.age) < 0)) {
    errors.age = 'Age must be a valid number'
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.name.trim(),
      age: form.age ? Number(form.age) : undefined,
      description: form.description.trim(),
      personalityTraits: form.personalityTraits,
      goals: form.goals.filter(goal => goal.trim()),
      flaws: form.flaws.filter(flaw => flaw.trim()),
      backstory: form.backstory.trim() || undefined,
      appearance: form.appearance.trim() || undefined,
      role: form.role,
      isTemplate: form.isTemplate,
    }

    emit('submit', characterData)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.character-builder {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.character-builder__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.character-builder__title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.character-builder__form {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.character-builder__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.character-builder__section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.character-builder__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.character-builder__select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background: white;
}

.character-builder__textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.character-builder__traits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.character-builder__trait {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.character-builder__trait:hover {
  background: #f9fafb;
}

.character-builder__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.character-builder__list-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.character-builder__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.character-builder__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}
</style>
