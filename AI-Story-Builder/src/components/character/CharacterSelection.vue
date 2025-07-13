<template>
  <div class="character-selection">
    <div class="character-selection__header">
      <div class="character-selection__title-section">
        <h2 class="character-selection__title">Choose Your Characters</h2>
        <p class="character-selection__subtitle">
          Select characters for your story or create new ones
        </p>
      </div>
      
      <div class="character-selection__actions">
        <BaseButton
          variant="ghost"
          size="small"
          @click="generateRandomCharacter"
        >
          🎲 Random Character
        </BaseButton>
        <BaseButton
          variant="primary"
          @click="showCharacterBuilder = true"
        >
          + Create Character
        </BaseButton>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="character-selection__filters">
      <BaseInput
        v-model="searchQuery"
        placeholder="Search characters..."
        class="character-selection__search"
      >
        <template #suffix>
          🔍
        </template>
      </BaseInput>
      
      <div class="character-selection__filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.key"
          :class="[
            'character-selection__filter-tab',
            { 'character-selection__filter-tab--active': activeFilter === filter.key }
          ]"
          @click="activeFilter = filter.key"
        >
          {{ filter.label }}
          <span class="character-selection__filter-count">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <!-- Selected Characters Summary -->
    <div v-if="selectedCharacters.length" class="character-selection__selected">
      <h3 class="character-selection__selected-title">
        Selected Characters ({{ selectedCharacters.length }})
      </h3>
      <div class="character-selection__selected-list">
        <div
          v-for="character in selectedCharacters"
          :key="character.id"
          class="character-selection__selected-item"
        >
          <span class="character-selection__selected-name">{{ character.name }}</span>
          <span class="character-selection__selected-role">{{ character.role }}</span>
          <button
            class="character-selection__selected-remove"
            @click="deselectCharacter(character.id)"
          >
            ✕
          </button>
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="small"
        @click="clearSelectedCharacters"
      >
        Clear All
      </BaseButton>
    </div>

    <!-- Character Grid -->
    <div class="character-selection__grid">
      <CharacterCard
        v-for="character in filteredCharacters"
        :key="character.id"
        :character="character"
        :is-selected="isCharacterSelected(character.id)"
        @select="selectCharacter"
        @edit="editCharacter"
        @duplicate="duplicateCharacter"
        @delete="deleteCharacter"
      />
      
      <div
        v-if="filteredCharacters.length === 0"
        class="character-selection__empty"
      >
        <div class="character-selection__empty-icon">👤</div>
        <h3 class="character-selection__empty-title">No characters found</h3>
        <p class="character-selection__empty-text">
          {{ searchQuery ? 'Try adjusting your search terms' : 'Create your first character to get started' }}
        </p>
        <BaseButton
          variant="primary"
          @click="showCharacterBuilder = true"
        >
          Create Character
        </BaseButton>
      </div>
    </div>

    <!-- Character Builder Modal -->
    <div
      v-if="showCharacterBuilder"
      class="character-selection__modal"
      @click.self="closeCharacterBuilder"
    >
      <CharacterBuilder
        :editing-character="editingCharacter"
        @close="closeCharacterBuilder"
        @submit="handleCharacterSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCharacterStore } from '../../stores/characterStore'
import type { Character } from '../../types'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import CharacterCard from './CharacterCard.vue'
import CharacterBuilder from './CharacterBuilder.vue'

const characterStore = useCharacterStore()

const searchQuery = ref('')
const activeFilter = ref('all')
const showCharacterBuilder = ref(false)
const editingCharacter = ref<Character | null>(null)

const filters = computed(() => [
  { key: 'all', label: 'All', count: characterStore.characters.length },
  { key: 'protagonists', label: 'Protagonists', count: characterStore.protagonists.length },
  { key: 'antagonists', label: 'Antagonists', count: characterStore.antagonists.length },
  { key: 'supporting', label: 'Supporting', count: characterStore.supportingCharacters.length },
  { key: 'templates', label: 'Templates', count: characterStore.templates.length },
])

const filteredCharacters = computed(() => {
  let characters = characterStore.characters

  // Apply role filter
  if (activeFilter.value === 'protagonists') {
    characters = characterStore.protagonists
  } else if (activeFilter.value === 'antagonists') {
    characters = characterStore.antagonists
  } else if (activeFilter.value === 'supporting') {
    characters = characterStore.supportingCharacters
  } else if (activeFilter.value === 'templates') {
    characters = characterStore.templates
  }

  // Apply search filter
  if (searchQuery.value) {
    characters = characterStore.searchCharacters(searchQuery.value)
  }

  return characters
})

const selectedCharacters = computed(() => characterStore.selectedCharacters)

function isCharacterSelected(id: string): boolean {
  return selectedCharacters.value.some(char => char.id === id)
}

function selectCharacter(character: Character) {
  if (isCharacterSelected(character.id)) {
    characterStore.deselectCharacter(character.id)
  } else {
    characterStore.selectCharacter(character)
  }
}

function deselectCharacter(id: string) {
  characterStore.deselectCharacter(id)
}

function clearSelectedCharacters() {
  characterStore.clearSelectedCharacters()
}

function editCharacter(character: Character) {
  editingCharacter.value = character
  showCharacterBuilder.value = true
}

function duplicateCharacter(id: string) {
  characterStore.duplicateCharacter(id)
}

function deleteCharacter(id: string) {
  if (confirm('Are you sure you want to delete this character?')) {
    characterStore.deleteCharacter(id)
  }
}

function generateRandomCharacter() {
  characterStore.generateRandomCharacter()
}

function closeCharacterBuilder() {
  showCharacterBuilder.value = false
  editingCharacter.value = null
}

function handleCharacterSubmit(characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) {
  if (editingCharacter.value) {
    characterStore.updateCharacter(editingCharacter.value.id, characterData)
  } else {
    characterStore.addCharacter(characterData)
  }
  closeCharacterBuilder()
}

onMounted(() => {
  characterStore.loadFromStorage()
})
</script>

<style scoped>
.character-selection {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.character-selection__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.character-selection__title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.character-selection__subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.character-selection__actions {
  display: flex;
  gap: 12px;
}

.character-selection__filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.character-selection__search {
  max-width: 400px;
}

.character-selection__filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.character-selection__filter-tab {
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

.character-selection__filter-tab:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.character-selection__filter-tab--active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.character-selection__filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.character-selection__filter-tab--active .character-selection__filter-count {
  background: rgba(255, 255, 255, 0.3);
}

.character-selection__selected {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.character-selection__selected-title {
  font-size: 18px;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0 0 16px 0;
}

.character-selection__selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.character-selection__selected-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 8px 12px;
}

.character-selection__selected-name {
  font-weight: 500;
  color: #0c4a6e;
}

.character-selection__selected-role {
  font-size: 12px;
  color: #0369a1;
  text-transform: capitalize;
}

.character-selection__selected-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

.character-selection__selected-remove:hover {
  background: #fee2e2;
}

.character-selection__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.character-selection__empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.character-selection__empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.character-selection__empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.character-selection__empty-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.character-selection__modal {
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
