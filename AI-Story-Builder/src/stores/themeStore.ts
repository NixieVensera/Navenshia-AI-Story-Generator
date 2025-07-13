import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StoryTheme } from '../types'
import { Theme } from '../types'
import { sampleThemes, themeComboSuggestions } from '../data/sampleData'

export const useThemeStore = defineStore('theme', () => {
  // State
  const themes = ref<StoryTheme[]>([...sampleThemes])
  const selectedThemes = ref<StoryTheme[]>([])
  const isCreatingTheme = ref(false)
  const editingTheme = ref<StoryTheme | null>(null)

  // Getters
  const themesByMood = computed(() => {
    const grouped: Record<string, StoryTheme[]> = {}
    themes.value.forEach(theme => {
      if (!grouped[theme.mood]) {
        grouped[theme.mood] = []
      }
      grouped[theme.mood].push(theme)
    })
    return grouped
  })

  const themesByConflictType = computed(() => {
    const grouped: Record<string, StoryTheme[]> = {}
    themes.value.forEach(theme => {
      if (!grouped[theme.conflictType]) {
        grouped[theme.conflictType] = []
      }
      grouped[theme.conflictType].push(theme)
    })
    return grouped
  })

  const templates = computed(() => 
    themes.value.filter(theme => theme.isTemplate)
  )

  const themeCount = computed(() => themes.value.length)

  const suggestions = computed(() => themeComboSuggestions)

  // Actions
  function addTheme(theme: Omit<StoryTheme, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTheme: StoryTheme = {
      ...theme,
      id: `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    themes.value.push(newTheme)
    return newTheme
  }

  function updateTheme(id: string, updates: Partial<StoryTheme>) {
    const index = themes.value.findIndex(theme => theme.id === id)
    if (index !== -1) {
      themes.value[index] = {
        ...themes.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteTheme(id: string) {
    const index = themes.value.findIndex(theme => theme.id === id)
    if (index !== -1) {
      themes.value.splice(index, 1)
      // Remove from selected if it was selected
      const selectedIndex = selectedThemes.value.findIndex(theme => theme.id === id)
      if (selectedIndex !== -1) {
        selectedThemes.value.splice(selectedIndex, 1)
      }
    }
  }

  function selectTheme(theme: StoryTheme) {
    if (!selectedThemes.value.find(t => t.id === theme.id)) {
      selectedThemes.value.push(theme)
    }
  }

  function deselectTheme(id: string) {
    const index = selectedThemes.value.findIndex(theme => theme.id === id)
    if (index !== -1) {
      selectedThemes.value.splice(index, 1)
    }
  }

  function clearSelectedThemes() {
    selectedThemes.value = []
  }

  function duplicateTheme(id: string) {
    const theme = themes.value.find(t => t.id === id)
    if (theme) {
      const duplicate = {
        ...theme,
        description: `${theme.description} (Copy)`,
        isTemplate: false,
      }
      return addTheme(duplicate)
    }
    return null
  }

  function generateRandomTheme() {
    const primaryThemes = Object.values(Theme)
    const moods = ['light', 'dark', 'neutral', 'mixed'] as const
    const conflictTypes = ['internal', 'external', 'both'] as const

    const primaryTheme = primaryThemes[Math.floor(Math.random() * primaryThemes.length)]
    const secondaryThemes = primaryThemes
      .filter(t => t !== primaryTheme)
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1)

    const mood = moods[Math.floor(Math.random() * moods.length)]
    const conflictType = conflictTypes[Math.floor(Math.random() * conflictTypes.length)]

    return addTheme({
      primary: primaryTheme,
      secondary: secondaryThemes,
      description: `A story exploring ${primaryTheme} with elements of ${secondaryThemes.join(', ')}`,
      conflictType,
      mood,
      isTemplate: false,
    })
  }

  function createThemeFromSuggestion(suggestion: typeof themeComboSuggestions[0]) {
    return addTheme({
      primary: suggestion.primary,
      secondary: suggestion.secondary,
      description: suggestion.description,
      conflictType: 'both',
      mood: 'mixed',
      isTemplate: false,
    })
  }

  function getThemeById(id: string) {
    return themes.value.find(theme => theme.id === id)
  }

  function searchThemes(query: string) {
    const lowercaseQuery = query.toLowerCase()
    return themes.value.filter(theme =>
      theme.description.toLowerCase().includes(lowercaseQuery) ||
      theme.primary.toLowerCase().includes(lowercaseQuery) ||
      theme.secondary.some(t => t.toLowerCase().includes(lowercaseQuery)) ||
      theme.mood.toLowerCase().includes(lowercaseQuery) ||
      theme.conflictType.toLowerCase().includes(lowercaseQuery)
    )
  }

  function getThemesByMood(mood: string) {
    return themes.value.filter(theme => theme.mood === mood)
  }

  function getThemesByConflictType(conflictType: string) {
    return themes.value.filter(theme => theme.conflictType === conflictType)
  }

  function getThemesByPrimary(primary: Theme) {
    return themes.value.filter(theme => theme.primary === primary)
  }

  function hasTheme(themeType: Theme) {
    return selectedThemes.value.some(theme => 
      theme.primary === themeType || theme.secondary.includes(themeType)
    )
  }

  function getConflictingThemes(newTheme: StoryTheme) {
    // Define themes that might conflict with each other
    const conflicts: Partial<Record<Theme, Theme[]>> = {
      [Theme.LOVE]: [Theme.BETRAYAL],
      [Theme.JUSTICE]: [Theme.REVENGE],
      [Theme.REDEMPTION]: [Theme.REVENGE],
      [Theme.FRIENDSHIP]: [Theme.BETRAYAL],
      [Theme.FREEDOM]: [Theme.POWER],
    }

    const conflicting: StoryTheme[] = []
    selectedThemes.value.forEach(selectedTheme => {
      const primaryConflicts = conflicts[selectedTheme.primary] || []
      const secondaryConflicts = selectedTheme.secondary.flatMap(t => conflicts[t] || [])
      
      if (primaryConflicts.includes(newTheme.primary) || 
          secondaryConflicts.includes(newTheme.primary) ||
          newTheme.secondary.some(t => primaryConflicts.includes(t) || secondaryConflicts.includes(t))) {
        conflicting.push(selectedTheme)
      }
    })

    return conflicting
  }

  function setEditingTheme(theme: StoryTheme | null) {
    editingTheme.value = theme
  }

  function toggleCreatingTheme() {
    isCreatingTheme.value = !isCreatingTheme.value
  }

  // Save to localStorage
  function saveToStorage() {
    localStorage.setItem('storyBuilder_themes', JSON.stringify(themes.value))
    localStorage.setItem('storyBuilder_selectedThemes', JSON.stringify(selectedThemes.value))
  }

  // Load from localStorage
  function loadFromStorage() {
    const savedThemes = localStorage.getItem('storyBuilder_themes')
    const savedSelected = localStorage.getItem('storyBuilder_selectedThemes')
    
    if (savedThemes) {
      try {
        themes.value = JSON.parse(savedThemes)
      } catch (error) {
        console.error('Failed to load themes from storage:', error)
      }
    }
    
    if (savedSelected) {
      try {
        selectedThemes.value = JSON.parse(savedSelected)
      } catch (error) {
        console.error('Failed to load selected themes from storage:', error)
      }
    }
  }

  return {
    // State
    themes,
    selectedThemes,
    isCreatingTheme,
    editingTheme,
    
    // Getters
    themesByMood,
    themesByConflictType,
    templates,
    themeCount,
    suggestions,
    
    // Actions
    addTheme,
    updateTheme,
    deleteTheme,
    selectTheme,
    deselectTheme,
    clearSelectedThemes,
    duplicateTheme,
    generateRandomTheme,
    createThemeFromSuggestion,
    getThemeById,
    searchThemes,
    getThemesByMood,
    getThemesByConflictType,
    getThemesByPrimary,
    hasTheme,
    getConflictingThemes,
    setEditingTheme,
    toggleCreatingTheme,
    saveToStorage,
    loadFromStorage,
  }
})
