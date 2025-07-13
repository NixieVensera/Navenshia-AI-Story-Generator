import type {
  Character,
  Setting,
  StoryTheme,
  PlotPoint,
  StoryOutline,
  GenerationOptions,
} from '../types'
import {
  StoryStructure,
  Genre,
  Theme,
} from '../types'

// Story templates and patterns
export const STORY_TEMPLATES: Record<StoryStructure, { acts: Array<{ name: string; percentage: number; plotPoints: string[] }> }> = {
  [StoryStructure.THREE_ACT]: {
    acts: [
      { name: 'Setup', percentage: 0.25, plotPoints: ['setup', 'inciting-incident', 'plot-point'] },
      { name: 'Confrontation', percentage: 0.5, plotPoints: ['plot-point', 'midpoint', 'crisis'] },
      { name: 'Resolution', percentage: 0.25, plotPoints: ['climax', 'resolution'] },
    ],
  },
  [StoryStructure.FIVE_ACT]: {
    acts: [
      { name: 'Exposition', percentage: 0.15, plotPoints: ['setup'] },
      { name: 'Rising Action', percentage: 0.25, plotPoints: ['inciting-incident', 'plot-point'] },
      { name: 'Climax', percentage: 0.2, plotPoints: ['midpoint'] },
      { name: 'Falling Action', percentage: 0.25, plotPoints: ['crisis'] },
      { name: 'Resolution', percentage: 0.15, plotPoints: ['climax', 'resolution'] },
    ],
  },
  [StoryStructure.HERO_JOURNEY]: {
    acts: [
      { name: 'Departure', percentage: 0.3, plotPoints: ['setup', 'inciting-incident'] },
      { name: 'Initiation', percentage: 0.4, plotPoints: ['plot-point', 'midpoint', 'crisis'] },
      { name: 'Return', percentage: 0.3, plotPoints: ['climax', 'resolution'] },
    ],
  },
  [StoryStructure.FREYTAG_PYRAMID]: {
    acts: [
      { name: 'Exposition', percentage: 0.2, plotPoints: ['setup'] },
      { name: 'Rising Action', percentage: 0.3, plotPoints: ['inciting-incident', 'plot-point'] },
      { name: 'Climax', percentage: 0.2, plotPoints: ['midpoint', 'climax'] },
      { name: 'Falling Action', percentage: 0.2, plotPoints: ['crisis'] },
      { name: 'Resolution', percentage: 0.1, plotPoints: ['resolution'] },
    ],
  },
}

// Conflict patterns based on themes
export const CONFLICT_PATTERNS: Record<Theme, {
  internal: string[]
  external: string[]
  resolution: string[]
}> = {
  [Theme.REDEMPTION]: {
    internal: ['guilt over past actions', 'self-doubt', 'fear of repeating mistakes'],
    external: ['society\'s judgment', 'victims seeking revenge', 'consequences of past'],
    resolution: ['making amends', 'self-forgiveness', 'proving change is real'],
  },
  [Theme.BETRAYAL]: {
    internal: ['trust issues', 'desire for revenge', 'questioning loyalty'],
    external: ['false friends', 'hidden agendas', 'broken alliances'],
    resolution: ['learning to trust again', 'confronting the betrayer', 'finding true allies'],
  },
  [Theme.LOVE]: {
    internal: ['fear of vulnerability', 'past heartbreak', 'self-worth issues'],
    external: ['social barriers', 'rival suitors', 'family opposition'],
    resolution: ['overcoming fears', 'choosing love over safety', 'sacrifice for beloved'],
  },
  [Theme.POWER]: {
    internal: ['corruption temptation', 'responsibility burden', 'isolation'],
    external: ['political rivals', 'rebellion', 'power struggles'],
    resolution: ['learning restraint', 'sharing power', 'choosing service over dominance'],
  },
  [Theme.SURVIVAL]: {
    internal: ['despair', 'moral compromises', 'loss of humanity'],
    external: ['hostile environment', 'resource scarcity', 'predators'],
    resolution: ['finding hope', 'maintaining humanity', 'building community'],
  },
  [Theme.DISCOVERY]: {
    internal: ['fear of truth', 'cognitive dissonance', 'identity crisis'],
    external: ['hidden knowledge', 'cover-ups', 'dangerous secrets'],
    resolution: ['accepting truth', 'sharing knowledge', 'transforming understanding'],
  },
  [Theme.TRANSFORMATION]: {
    internal: ['resistance to change', 'identity confusion', 'fear of unknown'],
    external: ['external pressures', 'catalytic events', 'mentors/guides'],
    resolution: ['embracing change', 'new identity', 'helping others transform'],
  },
  [Theme.SACRIFICE]: {
    internal: ['selfishness vs altruism', 'fear of loss', 'questioning worth'],
    external: ['impossible choices', 'greater good demands', 'loved ones in danger'],
    resolution: ['willing sacrifice', 'finding meaning in loss', 'inspiring others'],
  },
  [Theme.FREEDOM]: {
    internal: ['fear of responsibility', 'comfort in chains', 'self-limitation'],
    external: ['oppressive systems', 'physical constraints', 'social expectations'],
    resolution: ['breaking chains', 'accepting responsibility', 'helping others find freedom'],
  },
  [Theme.JUSTICE]: {
    internal: ['moral ambiguity', 'desire for revenge', 'questioning right/wrong'],
    external: ['corrupt systems', 'powerful villains', 'legal obstacles'],
    resolution: ['upholding principles', 'reforming systems', 'mercy over vengeance'],
  },
  [Theme.REVENGE]: {
    internal: ['consuming hatred', 'moral degradation', 'emptiness of vengeance'],
    external: ['elusive targets', 'collateral damage', 'cycle of violence'],
    resolution: ['choosing forgiveness', 'breaking the cycle', 'finding peace'],
  },
  [Theme.FRIENDSHIP]: {
    internal: ['trust issues', 'fear of abandonment', 'loyalty conflicts'],
    external: ['external pressures', 'misunderstandings', 'competing loyalties'],
    resolution: ['deepening bonds', 'mutual sacrifice', 'unconditional support'],
  },
  [Theme.FAMILY]: {
    internal: ['generational trauma', 'identity vs heritage', 'obligation vs desire'],
    external: ['family conflicts', 'external threats', 'social pressures'],
    resolution: ['healing relationships', 'creating new traditions', 'chosen family'],
  },
  [Theme.IDENTITY]: {
    internal: ['self-doubt', 'multiple selves', 'authenticity struggles'],
    external: ['social expectations', 'role conflicts', 'identity theft/confusion'],
    resolution: ['self-acceptance', 'authentic expression', 'integrated identity'],
  },
  [Theme.COMING_OF_AGE]: {
    internal: ['innocence vs experience', 'responsibility fears', 'identity formation'],
    external: ['adult challenges', 'mentor relationships', 'rites of passage'],
    resolution: ['accepting adulthood', 'wisdom gained', 'helping next generation'],
  },
  [Theme.TIME_TRAVEL]: {
    internal: ['regret over past', 'anxiety about future', 'temporal displacement'],
    external: ['paradoxes', 'timeline conflicts', 'temporal authorities'],
    resolution: ['accepting timeline', 'learning from experience', 'protecting history'],
  },
}

// Character arc templates
export const CHARACTER_ARCS = {
  protagonist: {
    positive: ['reluctant hero', 'growth arc', 'redemption arc'],
    negative: ['corruption arc', 'fall from grace', 'tragic hero'],
    flat: ['steadfast hero', 'catalyst character', 'testing character'],
  },
  antagonist: {
    positive: ['redeemed villain', 'misguided antagonist', 'rival to ally'],
    negative: ['pure evil', 'corrupted hero', 'escalating threat'],
    flat: ['force of nature', 'system antagonist', 'unchanging evil'],
  },
}

export class StoryEngine {
  static generatePlotPoints(
    characters: Character[],
    settings: Setting[],
    themes: StoryTheme[],
    options: GenerationOptions,
    structure: StoryStructure = StoryStructure.THREE_ACT
  ): PlotPoint[] {
    const template = STORY_TEMPLATES[structure]
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const antagonist = characters.find(c => c.role === 'antagonist')
    const primaryTheme = themes[0]
    const primarySetting = settings[0]

    const plotPoints: PlotPoint[] = []
    let order = 1

    template.acts.forEach((act: any, actIndex: number) => {
      act.plotPoints.forEach((pointType: string) => {
        const plotPoint = this.generatePlotPoint(
          pointType as PlotPoint['type'],
          actIndex + 1,
          order++,
          protagonist,
          antagonist,
          primaryTheme,
          settings,
          options
        )
        plotPoints.push(plotPoint)
      })
    })

    return plotPoints
  }

  private static generatePlotPoint(
    type: PlotPoint['type'],
    act: number,
    order: number,
    protagonist: Character,
    antagonist: Character | undefined,
    theme: StoryTheme,
    settings: Setting[],
    options: GenerationOptions
  ): PlotPoint {
    const setting = settings[Math.min(order - 1, settings.length - 1)] || settings[0]
    const conflictPattern = CONFLICT_PATTERNS[theme.primary]

    const templates = {
      setup: {
        title: 'Opening Scene',
        description: `Introduce ${protagonist.name} in their ordinary world at ${setting.name}. Show their current life, goals, and the world's rules. Hint at the central conflict of ${theme.primary}.`,
      },
      'inciting-incident': {
        title: 'The Call to Adventure',
        description: `An event disrupts ${protagonist.name}'s normal life, presenting the central conflict. ${this.getRandomElement(conflictPattern.external)} forces them to act.`,
      },
      'plot-point': {
        title: act === 1 ? 'Crossing the Threshold' : 'Major Obstacle',
        description: act === 1 
          ? `${protagonist.name} commits to the journey, leaving their comfort zone. No turning back from the path of ${theme.primary}.`
          : `${protagonist.name} faces a significant challenge. ${antagonist ? `${antagonist.name} escalates the conflict.` : 'The stakes are raised.'} ${this.getRandomElement(conflictPattern.internal)} becomes apparent.`,
      },
      midpoint: {
        title: 'Point of No Return',
        description: `A major revelation changes everything. ${protagonist.name} gains new understanding about ${theme.primary} but faces greater stakes. ${this.getRandomElement(conflictPattern.external)} intensifies.`,
      },
      crisis: {
        title: 'Dark Night of the Soul',
        description: `${protagonist.name} faces their lowest point. ${this.getRandomElement(conflictPattern.internal)} reaches its peak. All seems lost in the struggle with ${theme.primary}.`,
      },
      climax: {
        title: 'Final Confrontation',
        description: `The ultimate test. ${protagonist.name} uses everything they've learned to face the final challenge. ${antagonist ? `Direct confrontation with ${antagonist.name}.` : 'The central conflict reaches its peak.'} The theme of ${theme.primary} is fully explored.`,
      },
      resolution: {
        title: 'New Equilibrium',
        description: `The aftermath of the climax. ${protagonist.name} has changed, and the world reflects this transformation. ${this.getRandomElement(conflictPattern.resolution)} brings closure to the theme of ${theme.primary}.`,
      },
    }

    const template = templates[type]
    
    return {
      id: `plot-${Date.now()}-${order}`,
      title: template.title,
      description: template.description,
      act,
      order,
      type,
      characters: this.getRelevantCharacters(type, protagonist, antagonist),
      setting: setting.id,
    }
  }

  private static getRelevantCharacters(
    type: PlotPoint['type'],
    protagonist: Character,
    antagonist?: Character
  ): string[] {
    switch (type) {
      case 'setup':
      case 'crisis':
      case 'resolution':
        return [protagonist.id]
      case 'climax':
        return antagonist ? [protagonist.id, antagonist.id] : [protagonist.id]
      default:
        return antagonist && Math.random() > 0.5 
          ? [protagonist.id, antagonist.id] 
          : [protagonist.id]
    }
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  static generateTitle(themes: Theme[], genre: Genre, characters: Character[]): string {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const primaryTheme = themes[0]

    const titlePatterns = [
      `The ${this.getThemeNoun(primaryTheme)} of ${protagonist.name}`,
      `${protagonist.name} and the ${this.getGenreNoun(genre)}`,
      `The ${this.getGenreAdjective(genre)} ${this.getThemeNoun(primaryTheme)}`,
      `${this.getThemeNoun(primaryTheme)}'s ${this.getGenreNoun(genre)}`,
      `Beyond the ${this.getGenreNoun(genre)}`,
      `The Last ${this.getThemeNoun(primaryTheme)}`,
    ]

    return this.getRandomElement(titlePatterns)
  }

  private static getThemeNoun(theme: Theme): string {
    const nouns: Record<Theme, string[]> = {
      [Theme.REDEMPTION]: ['Redemption', 'Second Chance', 'Atonement'],
      [Theme.BETRAYAL]: ['Betrayal', 'Broken Trust', 'False Promise'],
      [Theme.LOVE]: ['Love', 'Heart', 'Passion'],
      [Theme.POWER]: ['Crown', 'Throne', 'Empire'],
      [Theme.SURVIVAL]: ['Survivor', 'Last Stand', 'Endurance'],
      [Theme.DISCOVERY]: ['Discovery', 'Revelation', 'Truth'],
      [Theme.TRANSFORMATION]: ['Metamorphosis', 'Change', 'Evolution'],
      [Theme.SACRIFICE]: ['Sacrifice', 'Price', 'Cost'],
      [Theme.FREEDOM]: ['Freedom', 'Liberation', 'Escape'],
      [Theme.JUSTICE]: ['Justice', 'Judgment', 'Balance'],
      [Theme.REVENGE]: ['Vengeance', 'Retribution', 'Reckoning'],
      [Theme.FRIENDSHIP]: ['Bond', 'Alliance', 'Brotherhood'],
      [Theme.FAMILY]: ['Legacy', 'Bloodline', 'Heritage'],
      [Theme.IDENTITY]: ['Identity', 'Self', 'Truth'],
      [Theme.COMING_OF_AGE]: ['Journey', 'Awakening', 'Passage'],
      [Theme.TIME_TRAVEL]: ['Timeline', 'Paradox', 'Destiny'],
    }
    return this.getRandomElement(nouns[theme])
  }

  private static getGenreNoun(genre: Genre): string {
    const nouns: Record<Genre, string[]> = {
      [Genre.FANTASY]: ['Realm', 'Kingdom', 'Quest', 'Magic'],
      [Genre.SCIFI]: ['Galaxy', 'Future', 'Stars', 'Void'],
      [Genre.MYSTERY]: ['Mystery', 'Secret', 'Shadow', 'Clue'],
      [Genre.HORROR]: ['Nightmare', 'Terror', 'Darkness', 'Fear'],
      [Genre.ROMANCE]: ['Heart', 'Love', 'Desire', 'Passion'],
      [Genre.ADVENTURE]: ['Adventure', 'Journey', 'Quest', 'Expedition'],
      [Genre.THRILLER]: ['Chase', 'Hunt', 'Game', 'Race'],
      [Genre.WESTERN]: ['Frontier', 'Trail', 'Range', 'Territory'],
      [Genre.HISTORICAL]: ['Era', 'Age', 'Time', 'Period'],
      [Genre.MODERN]: ['City', 'Life', 'World', 'Reality'],
      [Genre.POST_APOCALYPTIC]: ['Wasteland', 'Ruins', 'Ashes', 'Remnant'],
      [Genre.COMEDY]: ['Comedy', 'Farce', 'Jest', 'Humor'],
    }
    return this.getRandomElement(nouns[genre] || ['Story'])
  }

  private static getGenreAdjective(genre: Genre): string {
    const adjectives: Record<Genre, string[]> = {
      [Genre.FANTASY]: ['Enchanted', 'Mystical', 'Ancient', 'Magical'],
      [Genre.SCIFI]: ['Cosmic', 'Stellar', 'Quantum', 'Cyber'],
      [Genre.MYSTERY]: ['Hidden', 'Secret', 'Mysterious', 'Shadowy'],
      [Genre.HORROR]: ['Dark', 'Haunted', 'Cursed', 'Forbidden'],
      [Genre.ROMANCE]: ['Passionate', 'Tender', 'Eternal', 'Devoted'],
      [Genre.ADVENTURE]: ['Epic', 'Daring', 'Bold', 'Heroic'],
      [Genre.THRILLER]: ['Deadly', 'Dangerous', 'Intense', 'Urgent'],
      [Genre.WESTERN]: ['Wild', 'Lawless', 'Rugged', 'Untamed'],
      [Genre.HISTORICAL]: ['Ancient', 'Noble', 'Forgotten', 'Lost'],
      [Genre.MODERN]: ['Urban', 'Contemporary', 'Real', 'Current'],
      [Genre.POST_APOCALYPTIC]: ['Broken', 'Desolate', 'Shattered', 'Lost'],
      [Genre.COMEDY]: ['Hilarious', 'Absurd', 'Witty', 'Amusing'],
    }
    return this.getRandomElement(adjectives[genre] || ['Great'])
  }

  static generateSummary(
    characters: Character[],
    settings: Setting[],
    themes: StoryTheme[],
    plotPoints: PlotPoint[]
  ): string {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const antagonist = characters.find(c => c.role === 'antagonist')
    const primarySetting = settings[0]
    const primaryTheme = themes[0]

    let summary = `In ${primarySetting.name}, ${protagonist.name} must confront `

    if (antagonist) {
      summary += `${antagonist.name} while grappling with themes of ${primaryTheme.primary}`
    } else {
      summary += `challenges that test their understanding of ${primaryTheme.primary}`
    }

    if (themes.length > 1) {
      summary += ` and ${themes.slice(1).map(t => t.primary).join(', ')}`
    }

    summary += `. Through their journey, they will discover what it truly means to ${protagonist.goals[0] || 'find their purpose'}.`

    return summary
  }

  static generateCharacterArc(character: Character, theme: StoryTheme): string[] {
    const arcStages = []
    const conflictPattern = CONFLICT_PATTERNS[theme.primary]

    // Beginning - Character's starting state
    arcStages.push(`${character.name} begins as someone who ${character.flaws[0] || 'struggles with self-doubt'}`)

    // Early development
    arcStages.push(`When faced with ${this.getRandomElement(conflictPattern.external)}, they must confront ${this.getRandomElement(conflictPattern.internal)}`)

    // Midpoint transformation
    arcStages.push(`Through trials, ${character.name} learns that ${character.goals[0] || 'their true purpose'} requires personal growth`)

    // Crisis point
    arcStages.push(`At their lowest point, ${character.name} must choose between their old ways and embracing change`)

    // Resolution
    arcStages.push(`By the end, ${character.name} achieves ${this.getRandomElement(conflictPattern.resolution)} and becomes someone who embodies the theme of ${theme.primary}`)

    return arcStages
  }

  static calculatePacing(plotPoints: PlotPoint[], targetWordCount: number): Record<string, number> {
    const pacing: Record<string, number> = {}
    const totalPoints = plotPoints.length

    plotPoints.forEach((point, index) => {
      // Distribute word count based on plot point importance and position
      let weight = 1

      // Give more weight to key plot points
      if (point.type === 'climax') weight = 2
      else if (point.type === 'midpoint' || point.type === 'crisis') weight = 1.5
      else if (point.type === 'inciting-incident') weight = 1.3

      // Adjust for act structure (middle act gets more content)
      if (point.act === 2) weight *= 1.2

      pacing[point.id] = Math.floor((targetWordCount / totalPoints) * weight)
    })

    return pacing
  }

  static generateDialoguePrompts(character: Character, situation: string): string[] {
    const prompts = []
    const traits = character.personalityTraits

    // Generate dialogue based on personality traits
    if (traits.includes('brave' as any)) {
      prompts.push(`${character.name} speaks boldly about facing the challenge`)
    }
    if (traits.includes('intelligent' as any)) {
      prompts.push(`${character.name} analyzes the situation logically`)
    }
    if (traits.includes('kind' as any)) {
      prompts.push(`${character.name} shows concern for others affected`)
    }
    if (traits.includes('deceptive' as any)) {
      prompts.push(`${character.name} carefully chooses words to mislead`)
    }

    // Add situation-specific prompts
    prompts.push(`${character.name} reveals their motivation: "${character.goals[0] || 'I must do what\'s right'}"`)
    prompts.push(`${character.name} struggles with their flaw: "${character.flaws[0] || 'I\'m not sure I can do this'}"`)

    return prompts
  }
}
