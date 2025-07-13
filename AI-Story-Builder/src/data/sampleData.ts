import type {
  Character,
  Setting,
  StoryTheme,
} from '../types'
import {
  Genre,
  PersonalityTrait,
  Theme,
  SettingType,
} from '../types'

// Sample Characters
export const sampleCharacters: Character[] = [
  {
    id: 'char-1',
    name: 'Aria Shadowbane',
    age: 24,
    description: 'A skilled rogue with a mysterious past',
    personalityTraits: [PersonalityTrait.BRAVE, PersonalityTrait.DECEPTIVE, PersonalityTrait.LOYAL],
    goals: ['Find her lost brother', 'Uncover the truth about her heritage'],
    flaws: ['Trusts too easily', 'Haunted by past mistakes'],
    backstory: 'Raised in the streets after her family disappeared',
    appearance: 'Dark hair, green eyes, always wears a hooded cloak',
    role: 'protagonist',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'char-2',
    name: 'Lord Malachar',
    age: 45,
    description: 'A powerful sorcerer seeking immortality',
    personalityTraits: [PersonalityTrait.AMBITIOUS, PersonalityTrait.INTELLIGENT, PersonalityTrait.CRUEL],
    goals: ['Achieve immortality', 'Rule the kingdom'],
    flaws: ['Arrogant', 'Underestimates others'],
    backstory: 'Former court wizard who was banished for dark magic',
    appearance: 'Tall, pale, with silver hair and piercing blue eyes',
    role: 'antagonist',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'char-3',
    name: 'Captain Rex Sterling',
    age: 35,
    description: 'A space marine with a strong moral compass',
    personalityTraits: [PersonalityTrait.BRAVE, PersonalityTrait.HONEST, PersonalityTrait.LOYAL],
    goals: ['Protect the innocent', 'Uncover the conspiracy'],
    flaws: ['Too rigid in thinking', 'Struggles with authority'],
    backstory: 'Veteran of the Galactic Wars, now fights corruption',
    appearance: 'Muscular build, scarred face, always in military gear',
    role: 'protagonist',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Sample Settings
export const sampleSettings: Setting[] = [
  {
    id: 'setting-1',
    name: 'The Whispering Woods',
    genre: Genre.FANTASY,
    type: SettingType.FOREST,
    description: 'An ancient forest where the trees seem to whisper secrets',
    atmosphere: 'Mysterious and enchanting, with dappled sunlight filtering through ancient oaks',
    keyLocations: ['The Elder Tree', 'Moonlit Clearing', 'Hidden Grove'],
    timeOfDay: 'evening',
    weather: 'Misty',
    season: 'autumn',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'setting-2',
    name: 'Neo-Tokyo Megacity',
    genre: Genre.SCIFI,
    type: SettingType.URBAN,
    description: 'A sprawling cyberpunk metropolis with towering skyscrapers',
    atmosphere: 'Neon-lit, bustling, and technologically advanced',
    keyLocations: ['Corporate District', 'Underground Markets', 'Skyway Networks'],
    timeOfDay: 'night',
    weather: 'Rain',
    season: 'winter',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'setting-3',
    name: 'The Crimson Desert',
    genre: Genre.POST_APOCALYPTIC,
    type: SettingType.DESERT,
    description: 'A vast wasteland of red sand and ruined cities',
    atmosphere: 'Harsh, unforgiving, with remnants of lost civilization',
    keyLocations: ['The Glass City Ruins', 'Oasis of Hope', 'The Bone Bridge'],
    timeOfDay: 'noon',
    weather: 'Sandstorm',
    season: 'summer',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Sample Themes
export const sampleThemes: StoryTheme[] = [
  {
    id: 'theme-1',
    primary: Theme.REDEMPTION,
    secondary: [Theme.FRIENDSHIP, Theme.SACRIFICE],
    description: 'A story about finding redemption through friendship and sacrifice',
    conflictType: 'both',
    mood: 'mixed',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'theme-2',
    primary: Theme.SURVIVAL,
    secondary: [Theme.DISCOVERY, Theme.TRANSFORMATION],
    description: 'A tale of survival that leads to self-discovery and transformation',
    conflictType: 'external',
    mood: 'dark',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'theme-3',
    primary: Theme.LOVE,
    secondary: [Theme.BETRAYAL, Theme.JUSTICE],
    description: 'A love story complicated by betrayal and the pursuit of justice',
    conflictType: 'internal',
    mood: 'mixed',
    isTemplate: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Genre descriptions
export const genreDescriptions: Record<Genre, string> = {
  [Genre.FANTASY]: 'Magical worlds with mythical creatures and supernatural elements',
  [Genre.SCIFI]: 'Futuristic settings with advanced technology and space exploration',
  [Genre.MODERN]: 'Contemporary settings in the present day',
  [Genre.HISTORICAL]: 'Stories set in past eras with period-accurate details',
  [Genre.POST_APOCALYPTIC]: 'Worlds after a catastrophic event has changed civilization',
  [Genre.MYSTERY]: 'Puzzles and secrets to be solved through investigation',
  [Genre.ROMANCE]: 'Stories focused on love and relationships',
  [Genre.HORROR]: 'Dark tales designed to frighten and unsettle',
  [Genre.COMEDY]: 'Light-hearted stories meant to entertain and amuse',
  [Genre.ADVENTURE]: 'Action-packed journeys and exciting quests',
  [Genre.THRILLER]: 'Suspenseful stories with tension and excitement',
  [Genre.WESTERN]: 'Stories set in the American Old West frontier',
}

// Theme combinations that work well together
export const themeComboSuggestions: Array<{ primary: Theme; secondary: Theme[]; description: string }> = [
  {
    primary: Theme.REDEMPTION,
    secondary: [Theme.SACRIFICE, Theme.FRIENDSHIP],
    description: 'A powerful combination exploring how sacrifice and friendship can lead to redemption',
  },
  {
    primary: Theme.POWER,
    secondary: [Theme.BETRAYAL, Theme.JUSTICE],
    description: 'Classic themes of corruption, betrayal, and the fight for justice',
  },
  {
    primary: Theme.DISCOVERY,
    secondary: [Theme.TRANSFORMATION, Theme.IDENTITY],
    description: 'A journey of self-discovery that transforms the character\'s identity',
  },
  {
    primary: Theme.SURVIVAL,
    secondary: [Theme.FAMILY, Theme.SACRIFICE],
    description: 'Survival story where family bonds drive characters to sacrifice for each other',
  },
]
