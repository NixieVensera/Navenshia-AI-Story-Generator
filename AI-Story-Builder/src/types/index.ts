// Core enums
export enum Genre {
  FANTASY = 'fantasy',
  SCIFI = 'sci-fi',
  MODERN = 'modern',
  HISTORICAL = 'historical',
  POST_APOCALYPTIC = 'post-apocalyptic',
  MYSTERY = 'mystery',
  ROMANCE = 'romance',
  HORROR = 'horror',
  COMEDY = 'comedy',
  ADVENTURE = 'adventure',
  THRILLER = 'thriller',
  WESTERN = 'western',
}

export enum PersonalityTrait {
  BRAVE = 'brave',
  COWARDLY = 'cowardly',
  INTELLIGENT = 'intelligent',
  NAIVE = 'naive',
  KIND = 'kind',
  CRUEL = 'cruel',
  AMBITIOUS = 'ambitious',
  LAZY = 'lazy',
  HONEST = 'honest',
  DECEPTIVE = 'deceptive',
  LOYAL = 'loyal',
  TREACHEROUS = 'treacherous',
  OPTIMISTIC = 'optimistic',
  PESSIMISTIC = 'pessimistic',
  CREATIVE = 'creative',
  PRACTICAL = 'practical',
}

export enum Theme {
  BETRAYAL = 'betrayal',
  FRIENDSHIP = 'friendship',
  LOVE = 'love',
  REVENGE = 'revenge',
  REDEMPTION = 'redemption',
  SACRIFICE = 'sacrifice',
  POWER = 'power',
  FREEDOM = 'freedom',
  JUSTICE = 'justice',
  SURVIVAL = 'survival',
  DISCOVERY = 'discovery',
  TRANSFORMATION = 'transformation',
  TIME_TRAVEL = 'time-travel',
  FAMILY = 'family',
  IDENTITY = 'identity',
  COMING_OF_AGE = 'coming-of-age',
}

export enum StoryStructure {
  THREE_ACT = 'three-act',
  FIVE_ACT = 'five-act',
  HERO_JOURNEY = 'hero-journey',
  FREYTAG_PYRAMID = 'freytag-pyramid',
}

export enum SettingType {
  URBAN = 'urban',
  RURAL = 'rural',
  WILDERNESS = 'wilderness',
  UNDERGROUND = 'underground',
  SPACE = 'space',
  UNDERWATER = 'underwater',
  MAGICAL_REALM = 'magical-realm',
  DYSTOPIAN_CITY = 'dystopian-city',
  SMALL_TOWN = 'small-town',
  CASTLE = 'castle',
  SPACESHIP = 'spaceship',
  DESERT = 'desert',
  FOREST = 'forest',
  MOUNTAIN = 'mountain',
  ISLAND = 'island',
}

// Core interfaces
export interface Character {
  id: string
  name: string
  age?: number
  description: string
  personalityTraits: PersonalityTrait[]
  goals: string[]
  flaws: string[]
  backstory?: string
  appearance?: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Setting {
  id: string
  name: string
  genre: Genre
  type: SettingType
  description: string
  atmosphere: string
  keyLocations: string[]
  timeOfDay?: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'midnight'
  weather?: string
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StoryTheme {
  id: string
  primary: Theme
  secondary: Theme[]
  description: string
  conflictType: 'internal' | 'external' | 'both'
  mood: 'light' | 'dark' | 'neutral' | 'mixed'
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PlotPoint {
  id: string
  title: string
  description: string
  act: number
  order: number
  type: 'setup' | 'inciting-incident' | 'plot-point' | 'midpoint' | 'crisis' | 'climax' | 'resolution'
  characters: string[] // Character IDs
  setting?: string // Setting ID
}

export interface StoryOutline {
  id: string
  title: string
  genre: Genre
  themes: Theme[]
  structure: StoryStructure
  characters: Character[]
  settings: Setting[]
  plotPoints: PlotPoint[]
  summary: string
  wordCountTarget?: number
  estimatedReadingTime?: number
  createdAt: Date
  updatedAt: Date
}

export interface Story {
  id: string
  outline: StoryOutline
  content: string
  isComplete: boolean
  chapters: Chapter[]
  metadata: StoryMetadata
  createdAt: Date
  updatedAt: Date
}

export interface Chapter {
  id: string
  title: string
  content: string
  order: number
  wordCount: number
  plotPoints: string[] // PlotPoint IDs
}

export interface StoryMetadata {
  wordCount: number
  readingTime: number
  lastEditedAt: Date
  version: number
  tags: string[]
  isPublic: boolean
  shareUrl?: string
}

// Generation options
export interface GenerationOptions {
  useAI: boolean
  aiProvider?: 'openai' | 'anthropic' | 'local'
  creativity: number // 0-1 scale
  length: 'short' | 'medium' | 'long'
  includeDialogue: boolean
  narrativePerspective: 'first' | 'second' | 'third-limited' | 'third-omniscient'
  tense: 'past' | 'present' | 'future'
}

// Export options
export interface ExportOptions {
  format: 'pdf' | 'txt' | 'html' | 'json'
  includeMetadata: boolean
  includeOutline: boolean
  fontSize?: number
  fontFamily?: string
}

// TTS options
export interface TTSOptions {
  voice?: string
  rate: number
  pitch: number
  volume: number
  characterVoices: Record<string, string> // Character ID -> Voice name
}

// UI State types
export interface GeneratorState {
  currentStep: 'characters' | 'settings' | 'themes' | 'generation' | 'editing' | 'complete'
  selectedCharacters: Character[]
  selectedSettings: Setting[]
  selectedThemes: StoryTheme[]
  generationOptions: GenerationOptions
  isGenerating: boolean
  progress: number
}

export interface UIState {
  sidebarOpen: boolean
  darkMode: boolean
  currentView: string
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  createdAt: Date
}
