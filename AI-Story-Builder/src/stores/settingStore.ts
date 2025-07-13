import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Setting } from '../types'
import { Genre, SettingType } from '../types'
import { sampleSettings } from '../data/sampleData'

export const useSettingStore = defineStore('setting', () => {
  // State
  const settings = ref<Setting[]>([...sampleSettings])
  const selectedSettings = ref<Setting[]>([])
  const isCreatingSetting = ref(false)
  const editingSetting = ref<Setting | null>(null)

  // Getters
  const settingsByGenre = computed(() => {
    const grouped: Record<Genre, Setting[]> = {} as Record<Genre, Setting[]>
    settings.value.forEach(setting => {
      if (!grouped[setting.genre]) {
        grouped[setting.genre] = []
      }
      grouped[setting.genre].push(setting)
    })
    return grouped
  })

  const settingsByType = computed(() => {
    const grouped: Record<SettingType, Setting[]> = {} as Record<SettingType, Setting[]>
    settings.value.forEach(setting => {
      if (!grouped[setting.type]) {
        grouped[setting.type] = []
      }
      grouped[setting.type].push(setting)
    })
    return grouped
  })

  const templates = computed(() => 
    settings.value.filter(setting => setting.isTemplate)
  )

  const settingCount = computed(() => settings.value.length)

  // Actions
  function addSetting(setting: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>) {
    const newSetting: Setting = {
      ...setting,
      id: `setting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    settings.value.push(newSetting)
    return newSetting
  }

  function updateSetting(id: string, updates: Partial<Setting>) {
    const index = settings.value.findIndex(setting => setting.id === id)
    if (index !== -1) {
      settings.value[index] = {
        ...settings.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteSetting(id: string) {
    const index = settings.value.findIndex(setting => setting.id === id)
    if (index !== -1) {
      settings.value.splice(index, 1)
      // Remove from selected if it was selected
      const selectedIndex = selectedSettings.value.findIndex(setting => setting.id === id)
      if (selectedIndex !== -1) {
        selectedSettings.value.splice(selectedIndex, 1)
      }
    }
  }

  function selectSetting(setting: Setting) {
    if (!selectedSettings.value.find(s => s.id === setting.id)) {
      selectedSettings.value.push(setting)
    }
  }

  function deselectSetting(id: string) {
    const index = selectedSettings.value.findIndex(setting => setting.id === id)
    if (index !== -1) {
      selectedSettings.value.splice(index, 1)
    }
  }

  function clearSelectedSettings() {
    selectedSettings.value = []
  }

  function duplicateSetting(id: string) {
    const setting = settings.value.find(s => s.id === id)
    if (setting) {
      const duplicate = {
        ...setting,
        name: `${setting.name} (Copy)`,
        isTemplate: false,
      }
      return addSetting(duplicate)
    }
    return null
  }

  function generateRandomSetting(genre?: Genre, type?: SettingType) {
    const settingNames = {
      [SettingType.URBAN]: ['Neon City', 'Steel Harbor', 'Glass Metropolis', 'Chrome District'],
      [SettingType.FOREST]: ['Whispering Woods', 'Shadowleaf Forest', 'Ancient Grove', 'Moonlit Thicket'],
      [SettingType.DESERT]: ['Crimson Sands', 'Glass Desert', 'Bone Valley', 'Mirage Wastes'],
      [SettingType.MOUNTAIN]: ['Frost Peaks', 'Dragon Spine', 'Cloud Reach', 'Stone Crown'],
      [SettingType.SPACE]: ['Void Station', 'Nebula Outpost', 'Star Gate', 'Cosmic Harbor'],
      [SettingType.CASTLE]: ['Iron Keep', 'Shadowmere Castle', 'Thornwall Fortress', 'Moonstone Palace'],
      [SettingType.ISLAND]: ['Coral Haven', 'Storm Isle', 'Mist Island', 'Treasure Cove'],
      [SettingType.UNDERGROUND]: ['Deep Tunnels', 'Crystal Caverns', 'Shadow Depths', 'Lost Catacombs'],
      [SettingType.UNDERWATER]: ['Coral City', 'Abyssal Depths', 'Kelp Gardens', 'Sunken Palace'],
      [SettingType.MAGICAL_REALM]: ['Ethereal Plane', 'Dreamscape', 'Fae Realm', 'Spirit World'],
      [SettingType.DYSTOPIAN_CITY]: ['Sector 7', 'The Ruins', 'New Babylon', 'Iron District'],
      [SettingType.SMALL_TOWN]: ['Millbrook', 'Cedar Falls', 'Willowdale', 'Harmony Springs'],
      [SettingType.SPACESHIP]: ['Star Cruiser', 'Deep Space Vessel', 'Battle Frigate', 'Explorer Ship'],
      [SettingType.RURAL]: ['Green Valley', 'Harvest Fields', 'Countryside', 'Meadowlands'],
      [SettingType.WILDERNESS]: ['Wild Frontier', 'Untamed Lands', 'Savage Territory', 'Lost Wilderness'],
    }

    const atmospheres = [
      'Mysterious and foreboding',
      'Bright and welcoming',
      'Dark and oppressive',
      'Peaceful and serene',
      'Chaotic and dangerous',
      'Ancient and mystical',
      'Modern and sleek',
      'Rustic and charming'
    ]

    const selectedType = type || Object.values(SettingType)[Math.floor(Math.random() * Object.values(SettingType).length)]
    const selectedGenre = genre || Object.values(Genre)[Math.floor(Math.random() * Object.values(Genre).length)]
    const names = settingNames[selectedType] || ['Mysterious Place']
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomAtmosphere = atmospheres[Math.floor(Math.random() * atmospheres.length)]

    return addSetting({
      name: randomName,
      genre: selectedGenre,
      type: selectedType,
      description: `A ${selectedType.replace('-', ' ')} with a unique character`,
      atmosphere: randomAtmosphere,
      keyLocations: ['Main Area', 'Hidden Spot', 'Important Landmark'],
      isTemplate: false,
    })
  }

  function getSettingById(id: string) {
    return settings.value.find(setting => setting.id === id)
  }

  function searchSettings(query: string) {
    const lowercaseQuery = query.toLowerCase()
    return settings.value.filter(setting =>
      setting.name.toLowerCase().includes(lowercaseQuery) ||
      setting.description.toLowerCase().includes(lowercaseQuery) ||
      setting.atmosphere.toLowerCase().includes(lowercaseQuery) ||
      setting.genre.toLowerCase().includes(lowercaseQuery) ||
      setting.type.toLowerCase().includes(lowercaseQuery)
    )
  }

  function getSettingsByGenre(genre: Genre) {
    return settings.value.filter(setting => setting.genre === genre)
  }

  function getSettingsByType(type: SettingType) {
    return settings.value.filter(setting => setting.type === type)
  }

  function setEditingSetting(setting: Setting | null) {
    editingSetting.value = setting
  }

  function toggleCreatingSetting() {
    isCreatingSetting.value = !isCreatingSetting.value
  }

  // Save to localStorage
  function saveToStorage() {
    localStorage.setItem('storyBuilder_settings', JSON.stringify(settings.value))
    localStorage.setItem('storyBuilder_selectedSettings', JSON.stringify(selectedSettings.value))
  }

  // Load from localStorage
  function loadFromStorage() {
    const savedSettings = localStorage.getItem('storyBuilder_settings')
    const savedSelected = localStorage.getItem('storyBuilder_selectedSettings')
    
    if (savedSettings) {
      try {
        settings.value = JSON.parse(savedSettings)
      } catch (error) {
        console.error('Failed to load settings from storage:', error)
      }
    }
    
    if (savedSelected) {
      try {
        selectedSettings.value = JSON.parse(savedSelected)
      } catch (error) {
        console.error('Failed to load selected settings from storage:', error)
      }
    }
  }

  return {
    // State
    settings,
    selectedSettings,
    isCreatingSetting,
    editingSetting,
    
    // Getters
    settingsByGenre,
    settingsByType,
    templates,
    settingCount,
    
    // Actions
    addSetting,
    updateSetting,
    deleteSetting,
    selectSetting,
    deselectSetting,
    clearSelectedSettings,
    duplicateSetting,
    generateRandomSetting,
    getSettingById,
    searchSettings,
    getSettingsByGenre,
    getSettingsByType,
    setEditingSetting,
    toggleCreatingSetting,
    saveToStorage,
    loadFromStorage,
  }
})
