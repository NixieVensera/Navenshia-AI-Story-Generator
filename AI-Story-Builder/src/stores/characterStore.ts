import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character } from '../types'
import { PersonalityTrait } from '../types'
import { sampleCharacters } from '../data/sampleData'

export const useCharacterStore = defineStore('character', () => {
  // State
  const characters = ref<Character[]>([...sampleCharacters])
  const selectedCharacters = ref<Character[]>([])
  const isCreatingCharacter = ref(false)
  const editingCharacter = ref<Character | null>(null)

  // Getters
  const protagonists = computed(() => 
    characters.value.filter(char => char.role === 'protagonist')
  )
  
  const antagonists = computed(() => 
    characters.value.filter(char => char.role === 'antagonist')
  )
  
  const supportingCharacters = computed(() => 
    characters.value.filter(char => char.role === 'supporting')
  )
  
  const templates = computed(() => 
    characters.value.filter(char => char.isTemplate)
  )

  const characterCount = computed(() => characters.value.length)

  // Actions
  function addCharacter(character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) {
    const newCharacter: Character = {
      ...character,
      id: `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    characters.value.push(newCharacter)
    return newCharacter
  }

  function updateCharacter(id: string, updates: Partial<Character>) {
    const index = characters.value.findIndex(char => char.id === id)
    if (index !== -1) {
      characters.value[index] = {
        ...characters.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteCharacter(id: string) {
    const index = characters.value.findIndex(char => char.id === id)
    if (index !== -1) {
      characters.value.splice(index, 1)
      // Remove from selected if it was selected
      const selectedIndex = selectedCharacters.value.findIndex(char => char.id === id)
      if (selectedIndex !== -1) {
        selectedCharacters.value.splice(selectedIndex, 1)
      }
    }
  }

  function selectCharacter(character: Character) {
    if (!selectedCharacters.value.find(char => char.id === character.id)) {
      selectedCharacters.value.push(character)
    }
  }

  function deselectCharacter(id: string) {
    const index = selectedCharacters.value.findIndex(char => char.id === id)
    if (index !== -1) {
      selectedCharacters.value.splice(index, 1)
    }
  }

  function clearSelectedCharacters() {
    selectedCharacters.value = []
  }

  function duplicateCharacter(id: string) {
    const character = characters.value.find(char => char.id === id)
    if (character) {
      const duplicate = {
        ...character,
        name: `${character.name} (Copy)`,
        isTemplate: false,
      }
      return addCharacter(duplicate)
    }
    return null
  }

  function generateRandomCharacter(traits?: PersonalityTrait[]) {
    const names = [
      'Aiden', 'Luna', 'Kai', 'Zara', 'Orion', 'Nova', 'Sage', 'Phoenix',
      'River', 'Storm', 'Ember', 'Atlas', 'Iris', 'Jasper', 'Lyra', 'Dante'
    ]
    
    const goals = [
      'Find their true purpose',
      'Protect their loved ones',
      'Uncover a hidden truth',
      'Master their abilities',
      'Seek revenge',
      'Find redemption',
      'Discover their heritage',
      'Save their world'
    ]

    const flaws = [
      'Too trusting',
      'Quick to anger',
      'Haunted by the past',
      'Overly cautious',
      'Struggles with self-doubt',
      'Too proud',
      'Fears commitment',
      'Impulsive decisions'
    ]

    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomGoals = goals.sort(() => 0.5 - Math.random()).slice(0, 2)
    const randomFlaws = flaws.sort(() => 0.5 - Math.random()).slice(0, 2)

    return addCharacter({
      name: randomName,
      age: Math.floor(Math.random() * 50) + 18,
      description: `A mysterious character with an unknown past`,
      personalityTraits: traits || [],
      goals: randomGoals,
      flaws: randomFlaws,
      role: 'supporting',
      isTemplate: false,
    })
  }

  function getCharacterById(id: string) {
    return characters.value.find(char => char.id === id)
  }

  function searchCharacters(query: string) {
    const lowercaseQuery = query.toLowerCase()
    return characters.value.filter(char =>
      char.name.toLowerCase().includes(lowercaseQuery) ||
      char.description.toLowerCase().includes(lowercaseQuery) ||
      char.personalityTraits.some(trait => trait.toLowerCase().includes(lowercaseQuery))
    )
  }

  function setEditingCharacter(character: Character | null) {
    editingCharacter.value = character
  }

  function toggleCreatingCharacter() {
    isCreatingCharacter.value = !isCreatingCharacter.value
  }

  // Save to localStorage
  function saveToStorage() {
    localStorage.setItem('storyBuilder_characters', JSON.stringify(characters.value))
    localStorage.setItem('storyBuilder_selectedCharacters', JSON.stringify(selectedCharacters.value))
  }

  // Load from localStorage
  function loadFromStorage() {
    const savedCharacters = localStorage.getItem('storyBuilder_characters')
    const savedSelected = localStorage.getItem('storyBuilder_selectedCharacters')
    
    if (savedCharacters) {
      try {
        characters.value = JSON.parse(savedCharacters)
      } catch (error) {
        console.error('Failed to load characters from storage:', error)
      }
    }
    
    if (savedSelected) {
      try {
        selectedCharacters.value = JSON.parse(savedSelected)
      } catch (error) {
        console.error('Failed to load selected characters from storage:', error)
      }
    }
  }

  return {
    // State
    characters,
    selectedCharacters,
    isCreatingCharacter,
    editingCharacter,
    
    // Getters
    protagonists,
    antagonists,
    supportingCharacters,
    templates,
    characterCount,
    
    // Actions
    addCharacter,
    updateCharacter,
    deleteCharacter,
    selectCharacter,
    deselectCharacter,
    clearSelectedCharacters,
    duplicateCharacter,
    generateRandomCharacter,
    getCharacterById,
    searchCharacters,
    setEditingCharacter,
    toggleCreatingCharacter,
    saveToStorage,
    loadFromStorage,
  }
})
