import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Story,
  StoryOutline,
  PlotPoint,
  GenerationOptions,
  GeneratorState,
  Character,
  Setting,
  StoryTheme,
} from '../types'
import {
  StoryStructure,
  Genre,
  Theme
} from '../types'
import { ContentGenerator } from '../utils/contentGenerator'

export const useStoryStore = defineStore('story', () => {
  // State
  const stories = ref<Story[]>([])
  const currentStory = ref<Story | null>(null)
  const currentOutline = ref<StoryOutline | null>(null)
  const generatorState = ref<GeneratorState>({
    currentStep: 'characters',
    selectedCharacters: [],
    selectedSettings: [],
    selectedThemes: [],
    generationOptions: {
      useAI: false,
      creativity: 0.7,
      length: 'medium',
      includeDialogue: true,
      narrativePerspective: 'third-limited',
      tense: 'past',
    },
    isGenerating: false,
    progress: 0,
  })

  // Getters
  const storyCount = computed(() => stories.value.length)
  
  const completedStories = computed(() => 
    stories.value.filter(story => story.isComplete)
  )
  
  const draftStories = computed(() => 
    stories.value.filter(story => !story.isComplete)
  )

  const canGenerateStory = computed(() => {
    return generatorState.value.selectedCharacters.length > 0 &&
           generatorState.value.selectedSettings.length > 0 &&
           generatorState.value.selectedThemes.length > 0
  })

  const currentStepIndex = computed(() => {
    const steps = ['characters', 'settings', 'themes', 'generation', 'editing', 'complete']
    return steps.indexOf(generatorState.value.currentStep)
  })

  // Actions
  function createStoryOutline(
    characters: Character[],
    settings: Setting[],
    themes: StoryTheme[],
    options: GenerationOptions
  ): StoryOutline {
    const primaryGenre = settings[0]?.genre || Genre.FANTASY
    const primaryThemes = themes.map(t => t.primary)
    
    const outline: StoryOutline = {
      id: `outline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: generateTitle(primaryThemes, primaryGenre),
      genre: primaryGenre,
      themes: primaryThemes,
      structure: StoryStructure.THREE_ACT,
      characters: [...characters],
      settings: [...settings],
      plotPoints: generatePlotPoints(characters, settings, themes, options),
      summary: generateSummary(characters, settings, themes),
      wordCountTarget: getWordCountTarget(options.length),
      estimatedReadingTime: getEstimatedReadingTime(options.length),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return outline
  }

  function generatePlotPoints(
    characters: Character[],
    settings: Setting[],
    themes: StoryTheme[],
    options: GenerationOptions
  ): PlotPoint[] {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const antagonist = characters.find(c => c.role === 'antagonist')
    const primarySetting = settings[0]
    const primaryTheme = themes[0]

    const plotPoints: PlotPoint[] = []

    // Act I - Setup
    plotPoints.push({
      id: `plot-${Date.now()}-1`,
      title: 'Opening Scene',
      description: `Introduce ${protagonist.name} in ${primarySetting.name}. Establish the ordinary world and hint at the central conflict.`,
      act: 1,
      order: 1,
      type: 'setup',
      characters: [protagonist.id],
      setting: primarySetting.id,
    })

    plotPoints.push({
      id: `plot-${Date.now()}-2`,
      title: 'Inciting Incident',
      description: `An event disrupts ${protagonist.name}'s normal life, setting the story in motion. This relates to the theme of ${primaryTheme.primary}.`,
      act: 1,
      order: 2,
      type: 'inciting-incident',
      characters: [protagonist.id],
      setting: primarySetting.id,
    })

    plotPoints.push({
      id: `plot-${Date.now()}-3`,
      title: 'First Plot Point',
      description: `${protagonist.name} commits to the journey or quest. No turning back.`,
      act: 1,
      order: 3,
      type: 'plot-point',
      characters: [protagonist.id],
      setting: primarySetting.id,
    })

    // Act II - Confrontation
    plotPoints.push({
      id: `plot-${Date.now()}-4`,
      title: 'First Obstacle',
      description: `${protagonist.name} faces their first major challenge. ${antagonist ? `${antagonist.name} begins to emerge as a threat.` : 'The central conflict intensifies.'}`,
      act: 2,
      order: 4,
      type: 'plot-point',
      characters: antagonist ? [protagonist.id, antagonist.id] : [protagonist.id],
      setting: settings[1]?.id || primarySetting.id,
    })

    plotPoints.push({
      id: `plot-${Date.now()}-5`,
      title: 'Midpoint',
      description: `A major revelation or turning point. ${protagonist.name} gains new understanding but faces greater stakes.`,
      act: 2,
      order: 5,
      type: 'midpoint',
      characters: [protagonist.id],
      setting: settings[1]?.id || primarySetting.id,
    })

    plotPoints.push({
      id: `plot-${Date.now()}-6`,
      title: 'Crisis',
      description: `${protagonist.name} faces their darkest moment. All seems lost. This tests the theme of ${primaryTheme.primary}.`,
      act: 2,
      order: 6,
      type: 'crisis',
      characters: [protagonist.id],
      setting: settings[2]?.id || primarySetting.id,
    })

    // Act III - Resolution
    plotPoints.push({
      id: `plot-${Date.now()}-7`,
      title: 'Climax',
      description: `The final confrontation. ${protagonist.name} uses everything they've learned to face the ultimate challenge.`,
      act: 3,
      order: 7,
      type: 'climax',
      characters: characters.map(c => c.id),
      setting: settings[settings.length - 1]?.id || primarySetting.id,
    })

    plotPoints.push({
      id: `plot-${Date.now()}-8`,
      title: 'Resolution',
      description: `The aftermath. ${protagonist.name} has changed, and the world reflects the theme of ${primaryTheme.primary}.`,
      act: 3,
      order: 8,
      type: 'resolution',
      characters: [protagonist.id],
      setting: primarySetting.id,
    })

    return plotPoints
  }

  function generateTitle(themes: Theme[], genre: Genre): string {
    const titleWords: Record<Theme, string[]> = {
      [Theme.REDEMPTION]: ['Redemption', 'Second Chance', 'Forgiveness'],
      [Theme.BETRAYAL]: ['Betrayal', 'Broken Trust', 'False Friend'],
      [Theme.LOVE]: ['Love', 'Heart', 'Devotion'],
      [Theme.REVENGE]: ['Vengeance', 'Retribution', 'Payback'],
      [Theme.SURVIVAL]: ['Survival', 'Last Stand', 'Endurance'],
      [Theme.DISCOVERY]: ['Discovery', 'Revelation', 'Hidden Truth'],
      [Theme.POWER]: ['Power', 'Crown', 'Dominion'],
      [Theme.FREEDOM]: ['Freedom', 'Liberation', 'Escape'],
      [Theme.SACRIFICE]: ['Sacrifice', 'Price', 'Cost'],
      [Theme.TRANSFORMATION]: ['Transformation', 'Change', 'Metamorphosis'],
      [Theme.FRIENDSHIP]: ['Friendship', 'Bond', 'Alliance'],
      [Theme.FAMILY]: ['Family', 'Legacy', 'Heritage'],
      [Theme.IDENTITY]: ['Identity', 'Self', 'Truth'],
      [Theme.JUSTICE]: ['Justice', 'Balance', 'Judgment'],
      [Theme.COMING_OF_AGE]: ['Journey', 'Awakening', 'Growth'],
      [Theme.TIME_TRAVEL]: ['Time', 'Destiny', 'Paradox'],
    }

    const genreWords: Record<Genre, string[]> = {
      [Genre.FANTASY]: ['Realm', 'Kingdom', 'Magic', 'Dragon', 'Quest'],
      [Genre.SCIFI]: ['Galaxy', 'Star', 'Future', 'Cyber', 'Nova'],
      [Genre.MYSTERY]: ['Shadow', 'Secret', 'Clue', 'Mystery', 'Case'],
      [Genre.HORROR]: ['Darkness', 'Fear', 'Nightmare', 'Terror', 'Haunted'],
      [Genre.ROMANCE]: ['Heart', 'Love', 'Passion', 'Desire', 'Soul'],
      [Genre.ADVENTURE]: ['Adventure', 'Quest', 'Journey', 'Expedition'],
      [Genre.THRILLER]: ['Thriller', 'Chase', 'Hunt', 'Race'],
      [Genre.WESTERN]: ['Frontier', 'Trail', 'Range', 'Territory'],
      [Genre.HISTORICAL]: ['Era', 'Age', 'Time', 'Period'],
      [Genre.MODERN]: ['City', 'Life', 'World', 'Reality'],
      [Genre.POST_APOCALYPTIC]: ['Wasteland', 'Ruins', 'Ashes', 'Remnant'],
      [Genre.COMEDY]: ['Comedy', 'Farce', 'Jest', 'Humor'],
    }

    const primaryTheme = themes[0]
    const themeWord = titleWords[primaryTheme]?.[Math.floor(Math.random() * titleWords[primaryTheme].length)] || 'Story'
    const genreWord = genreWords[genre]?.[Math.floor(Math.random() * (genreWords[genre]?.length || 1))] || 'Tale'

    const patterns = [
      `The ${themeWord} of ${genreWord}`,
      `${themeWord}'s ${genreWord}`,
      `The ${genreWord} ${themeWord}`,
      `${genreWord} of ${themeWord}`,
    ]

    return patterns[Math.floor(Math.random() * patterns.length)]
  }

  function generateSummary(characters: Character[], settings: Setting[], themes: StoryTheme[]): string {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const antagonist = characters.find(c => c.role === 'antagonist')
    const primarySetting = settings[0]
    const primaryTheme = themes[0]

    let summary = `In ${primarySetting.name}, ${protagonist.name} must confront `
    
    if (antagonist) {
      summary += `${antagonist.name} while dealing with themes of ${primaryTheme.primary}`
    } else {
      summary += `challenges that test their understanding of ${primaryTheme.primary}`
    }

    if (themes.length > 1) {
      summary += ` and ${themes.slice(1).map(t => t.primary).join(', ')}`
    }

    summary += `. Through their journey, they will discover what it truly means to ${protagonist.goals[0] || 'find their purpose'}.`

    return summary
  }

  function getWordCountTarget(length: 'short' | 'medium' | 'long'): number {
    switch (length) {
      case 'short': return 2000
      case 'medium': return 5000
      case 'long': return 10000
      default: return 5000
    }
  }

  function getEstimatedReadingTime(length: 'short' | 'medium' | 'long'): number {
    const wordsPerMinute = 200
    const wordCount = getWordCountTarget(length)
    return Math.ceil(wordCount / wordsPerMinute)
  }

  async function generateStory(): Promise<Story | null> {
    if (!canGenerateStory.value) return null

    generatorState.value.isGenerating = true
    generatorState.value.progress = 0

    try {
      // Create outline
      generatorState.value.progress = 25
      const outline = createStoryOutline(
        generatorState.value.selectedCharacters,
        generatorState.value.selectedSettings,
        generatorState.value.selectedThemes,
        generatorState.value.generationOptions
      )

      currentOutline.value = outline
      generatorState.value.progress = 50

      // Generate story content (placeholder for now)
      const content = await generateStoryContent(outline)
      generatorState.value.progress = 75

      // Create story
      const story: Story = {
        id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        outline,
        content,
        isComplete: false,
        chapters: [],
        metadata: {
          wordCount: content.split(' ').length,
          readingTime: Math.ceil(content.split(' ').length / 200),
          lastEditedAt: new Date(),
          version: 1,
          tags: [],
          isPublic: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      stories.value.push(story)
      currentStory.value = story
      generatorState.value.progress = 100
      generatorState.value.currentStep = 'complete'

      return story
    } catch (error) {
      console.error('Failed to generate story:', error)
      return null
    } finally {
      generatorState.value.isGenerating = false
    }
  }

  async function generateStoryContent(outline: StoryOutline): Promise<string> {
    // Use the enhanced ContentGenerator to create full story content
    return await ContentGenerator.generateStoryContent(outline, generatorState.value.generationOptions)
  }

  // Navigation and state management
  function setCurrentStep(step: GeneratorState['currentStep']) {
    generatorState.value.currentStep = step
  }

  function nextStep() {
    const steps: GeneratorState['currentStep'][] = ['characters', 'settings', 'themes', 'generation', 'editing', 'complete']
    const currentIndex = steps.indexOf(generatorState.value.currentStep)
    if (currentIndex < steps.length - 1) {
      generatorState.value.currentStep = steps[currentIndex + 1]
    }
  }

  function previousStep() {
    const steps: GeneratorState['currentStep'][] = ['characters', 'settings', 'themes', 'generation', 'editing', 'complete']
    const currentIndex = steps.indexOf(generatorState.value.currentStep)
    if (currentIndex > 0) {
      generatorState.value.currentStep = steps[currentIndex - 1]
    }
  }

  function resetGenerator() {
    generatorState.value = {
      currentStep: 'characters',
      selectedCharacters: [],
      selectedSettings: [],
      selectedThemes: [],
      generationOptions: {
        useAI: false,
        creativity: 0.7,
        length: 'medium',
        includeDialogue: true,
        narrativePerspective: 'third-limited',
        tense: 'past',
      },
      isGenerating: false,
      progress: 0,
    }
    currentStory.value = null
    currentOutline.value = null
  }

  function updateGenerationOptions(options: Partial<GenerationOptions>) {
    generatorState.value.generationOptions = {
      ...generatorState.value.generationOptions,
      ...options,
    }
  }

  function deleteStory(id: string) {
    const index = stories.value.findIndex(story => story.id === id)
    if (index !== -1) {
      stories.value.splice(index, 1)
      if (currentStory.value?.id === id) {
        currentStory.value = null
      }
    }
  }

  function getStoryById(id: string) {
    return stories.value.find(story => story.id === id)
  }

  // Save to localStorage
  function saveToStorage() {
    localStorage.setItem('storyBuilder_stories', JSON.stringify(stories.value))
    localStorage.setItem('storyBuilder_generatorState', JSON.stringify(generatorState.value))
  }

  // Load from localStorage
  function loadFromStorage() {
    const savedStories = localStorage.getItem('storyBuilder_stories')
    const savedGeneratorState = localStorage.getItem('storyBuilder_generatorState')
    
    if (savedStories) {
      try {
        stories.value = JSON.parse(savedStories)
      } catch (error) {
        console.error('Failed to load stories from storage:', error)
      }
    }
    
    if (savedGeneratorState) {
      try {
        generatorState.value = JSON.parse(savedGeneratorState)
      } catch (error) {
        console.error('Failed to load generator state from storage:', error)
      }
    }
  }

  return {
    // State
    stories,
    currentStory,
    currentOutline,
    generatorState,
    
    // Getters
    storyCount,
    completedStories,
    draftStories,
    canGenerateStory,
    currentStepIndex,
    
    // Actions
    generateStory,
    setCurrentStep,
    nextStep,
    previousStep,
    resetGenerator,
    updateGenerationOptions,
    deleteStory,
    getStoryById,
    saveToStorage,
    loadFromStorage,
  }
})
