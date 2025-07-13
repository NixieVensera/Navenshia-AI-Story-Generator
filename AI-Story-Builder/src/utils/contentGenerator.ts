import type { StoryOutline, PlotPoint, Character, Setting, GenerationOptions } from '../types'
import { AIStoryGenerator, createAIConfig } from './aiStoryGenerator'

export class ContentGenerator {
  static async generateStoryContent(
    outline: StoryOutline,
    options: GenerationOptions
  ): Promise<string> {
    let content = `# ${outline.title}\n\n`
    content += `*${outline.summary}*\n\n`
    
    // Generate content for each plot point
    for (let i = 0; i < outline.plotPoints.length; i++) {
      const plotPoint = outline.plotPoints[i]
      const chapterContent = await this.generateChapterContent(
        plotPoint,
        outline,
        options,
        i + 1
      )
      content += chapterContent + '\n\n'
    }
    
    return content
  }

  private static async generateChapterContent(
    plotPoint: PlotPoint,
    outline: StoryOutline,
    options: GenerationOptions,
    chapterNumber: number
  ): Promise<string> {
    // Try AI generation if enabled and configured
    if (options.useAI) {
      const aiConfig = createAIConfig()
      if (aiConfig && AIStoryGenerator.isConfigured(aiConfig)) {
        try {
          const aiGenerator = new AIStoryGenerator(aiConfig)
          const aiContent = await aiGenerator.generateChapterContent(plotPoint, outline, options, chapterNumber)
          if (aiContent && aiContent.length > 100) {
            return `## Chapter ${chapterNumber}: ${plotPoint.title}\n\n${aiContent}`
          }
        } catch (error) {
          console.warn('AI generation failed, falling back to rule-based generation:', error)
        }
      }
    }

    // Enhanced rule-based generation
    const characters = outline.characters.filter(c =>
      plotPoint.characters.includes(c.id)
    )
    const setting = outline.settings.find(s => s.id === plotPoint.setting)

    let content = `## Chapter ${chapterNumber}: ${plotPoint.title}\n\n`

    // Generate scene description
    content += this.generateSceneDescription(plotPoint, setting, characters, options)
    content += '\n\n'

    // Generate narrative content
    content += this.generateNarrativeContent(plotPoint, characters, setting, options)

    // Add dialogue if requested
    if (options.includeDialogue && characters.length > 1) {
      content += '\n\n'
      content += this.generateDialogueSection(plotPoint, characters, options)
    }

    return content
  }

  private static generateSceneDescription(
    plotPoint: PlotPoint,
    setting: Setting | undefined,
    characters: Character[],
    options: GenerationOptions
  ): string {
    if (!setting) return ''
    
    const timeOfDay = setting.timeOfDay ? ` during ${setting.timeOfDay}` : ''
    const weather = setting.weather ? ` The weather is ${setting.weather.toLowerCase()}.` : ''
    const atmosphere = setting.atmosphere ? ` ${setting.atmosphere}.` : ''
    
    let description = `The scene takes place in ${setting.name}${timeOfDay}.${weather}${atmosphere}`
    
    if (characters.length > 0) {
      const characterNames = characters.map(c => c.name).join(', ')
      description += ` Present in this scene: ${characterNames}.`
    }
    
    return description
  }

  private static generateNarrativeContent(
    plotPoint: PlotPoint,
    characters: Character[],
    setting: Setting | undefined,
    options: GenerationOptions
  ): string {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    
    // Generate content based on plot point type
    switch (plotPoint.type) {
      case 'setup':
        return this.generateSetupContent(protagonist, setting, options)
      case 'inciting-incident':
        return this.generateIncitingIncidentContent(protagonist, plotPoint, options)
      case 'plot-point':
        return this.generatePlotPointContent(protagonist, characters, plotPoint, options)
      case 'midpoint':
        return this.generateMidpointContent(protagonist, characters, plotPoint, options)
      case 'crisis':
        return this.generateCrisisContent(protagonist, plotPoint, options)
      case 'climax':
        return this.generateClimaxContent(characters, plotPoint, options)
      case 'resolution':
        return this.generateResolutionContent(protagonist, plotPoint, options)
      default:
        return this.generateGenericContent(protagonist, plotPoint, options)
    }
  }

  private static generateSetupContent(
    protagonist: Character,
    setting: Setting | undefined,
    options: GenerationOptions
  ): string {
    const perspective = this.getPerspectivePrefix(protagonist, options)
    const settingDesc = setting ? ` in ${setting.name}` : ''

    // Generate multiple paragraphs for setup
    let content = ''

    // Opening paragraph - establish setting and atmosphere
    if (setting) {
      content += `${setting.atmosphere} ${setting.description} `
      if (setting.timeOfDay) {
        content += `The ${setting.timeOfDay} light cast long shadows across ${setting.keyLocations[0] || 'the landscape'}. `
      }
      if (setting.weather) {
        content += `${setting.weather} weather added to the mood of the place. `
      }
      content += '\n\n'
    }

    // Character introduction
    content += `${perspective} ${protagonist.name} moved through this world with the practiced ease of someone who belonged here. `
    content += `${this.getDetailedCharacterDescription(protagonist)} `

    if (protagonist.age) {
      content += `At ${protagonist.age}, ${protagonist.name} had seen enough of life to understand its complexities. `
    }

    content += '\n\n'

    // Character's current situation and goals
    content += `${protagonist.name}'s days were consumed by a single driving purpose: ${protagonist.goals[0] || 'finding their true calling'}. `

    if (protagonist.goals.length > 1) {
      content += `Beyond that, they also sought to ${protagonist.goals[1]}. `
    }

    content += `Yet despite their determination, ${protagonist.name} wrestled with ${protagonist.flaws[0] || 'an inner uncertainty'}. `

    if (protagonist.flaws.length > 1) {
      content += `This was compounded by their tendency toward ${protagonist.flaws[1]}. `
    }

    content += '\n\n'

    // Foreshadowing
    content += `As ${protagonist.name} went about their routine this particular day, they had no way of knowing that forces beyond their understanding were already in motion. `
    content += `The ordinary world they knew so well was about to be shattered, and nothing would ever be the same again.`

    return content
  }

  private static generateIncitingIncidentContent(
    protagonist: Character,
    plotPoint: PlotPoint,
    options: GenerationOptions
  ): string {
    const perspective = this.getPerspectivePrefix(protagonist, options)

    let content = ''

    // Build tension before the incident
    content += `${protagonist.name} had been going about their day when something felt... different. `
    content += `The air seemed charged with an energy they couldn't quite place. `
    content += `Perhaps it was intuition, or perhaps it was simply coincidence, but ${protagonist.name} found themselves more alert than usual. `
    content += '\n\n'

    // The incident itself
    content += `Then it happened. `
    content += `${plotPoint.description} `
    content += `The moment stretched like an eternity, every detail burning itself into ${protagonist.name}'s memory. `
    content += `The sound, the sight, the very feeling of the world shifting beneath their feet. `
    content += '\n\n'

    // Immediate reaction
    content += `${protagonist.name}'s first instinct was ${this.getCharacterReaction(protagonist, 'shock')}. `
    content += `Their mind raced, trying to process what had just occurred. `
    content += `This wasn't supposed to happen. This wasn't part of the plan. `
    content += '\n\n'

    // Realization of change
    content += `As the initial shock wore off, a terrible understanding began to dawn. `
    content += `The comfortable, predictable world ${protagonist.name} had known was gone. `
    content += `In its place stood something unknown, something that demanded a choice. `
    content += `They could try to return to the way things were, or they could step forward into uncertainty. `
    content += `But deep down, ${protagonist.name} already knew there was no going back.`

    return content
  }

  private static generatePlotPointContent(
    protagonist: Character,
    characters: Character[],
    plotPoint: PlotPoint,
    options: GenerationOptions
  ): string {
    const perspective = this.getPerspectivePrefix(protagonist, options)
    const antagonist = characters.find(c => c.role === 'antagonist')
    
    let content = `${perspective} ${protagonist.name} faces a significant challenge. ${plotPoint.description} `
    
    if (antagonist) {
      content += `${antagonist.name} presents a formidable obstacle, testing ${protagonist.name}'s resolve. `
    }
    
    content += `This moment requires ${protagonist.name} to dig deeper and find strength they didn't know they possessed.`
    
    return content
  }

  private static generateMidpointContent(
    protagonist: Character,
    characters: Character[],
    plotPoint: PlotPoint,
    options: GenerationOptions
  ): string {
    const perspective = this.getPerspectivePrefix(protagonist, options)
    
    return `${perspective} ${protagonist.name} reaches a crucial turning point. ${plotPoint.description} ` +
           `Everything they thought they knew is called into question. ` +
           `The stakes have never been higher, and there's no going back to the way things were. ` +
           `${protagonist.name} must embrace their transformation or risk losing everything.`
  }

  private static generateCrisisContent(
    protagonist: Character,
    plotPoint: PlotPoint,
    options: GenerationOptions
  ): string {
    const perspective = this.getPerspectivePrefix(protagonist, options)
    
    return `${perspective} ${protagonist.name} faces their darkest hour. ${plotPoint.description} ` +
           `All hope seems lost, and their greatest fears are realized. ` +
           `${protagonist.flaws[0] ? `Their tendency toward ${protagonist.flaws[0]} threatens to overwhelm them. ` : ''}` +
           `In this moment of despair, ${protagonist.name} must find the inner strength to continue.`
  }

  private static generateClimaxContent(
    characters: Character[],
    plotPoint: PlotPoint,
    options: GenerationOptions
  ): string {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const antagonist = characters.find(c => c.role === 'antagonist')
    const perspective = this.getPerspectivePrefix(protagonist, options)

    let content = ''

    // Build up to the confrontation
    content += `The moment ${protagonist.name} had been dreading and preparing for had finally arrived. `
    content += `Every step of their journey, every lesson learned, every sacrifice made had led to this single point in time. `
    content += `There was no more running, no more preparation, no more doubt. `
    content += `This was it. `
    content += '\n\n'

    // The confrontation itself
    if (antagonist) {
      content += `${protagonist.name} stood face to face with ${antagonist.name}, the air between them crackling with tension. `
      content += `"${this.generateClimaxDialogue(protagonist, 'confrontation')}" ${protagonist.name} said, their voice steady despite the storm raging within. `
      content += '\n\n'
      content += `${antagonist.name} smiled, but there was no warmth in it. "${this.generateClimaxDialogue(antagonist, 'response')}" `
      content += '\n\n'
    }

    // The actual conflict
    content += `${plotPoint.description} `
    content += `Everything ${protagonist.name} had learned about themselves, about courage, about what truly mattered, was put to the ultimate test. `
    content += '\n\n'

    // The resolution of the conflict
    content += `In that crucial moment, ${protagonist.name} found strength they never knew they possessed. `
    content += `Not just physical strength, but the strength that comes from knowing who you are and what you stand for. `
    content += `The ${protagonist.flaws[0] || 'doubt'} that had plagued them throughout their journey finally fell away, replaced by clarity and purpose. `
    content += '\n\n'

    // The outcome
    content += `When the dust settled, ${protagonist.name} stood transformed. `
    content += `They had not just survived the confrontation—they had grown beyond what they ever thought possible. `
    content += `The goal they had started with—${protagonist.goals[0] || 'finding their purpose'}—had evolved into something far greater. `

    return content
  }

  private static generateResolutionContent(
    protagonist: Character,
    plotPoint: PlotPoint,
    options: GenerationOptions
  ): string {
    const perspective = this.getPerspectivePrefix(protagonist, options)
    
    return `${perspective} the dust settles and a new equilibrium emerges. ${plotPoint.description} ` +
           `${protagonist.name} has been fundamentally changed by their journey. ` +
           `The goal they once sought - ${protagonist.goals[0] || 'their purpose'} - ` +
           `has evolved into something deeper and more meaningful. ` +
           `Though the adventure is over, the lessons learned will last a lifetime.`
  }

  private static generateGenericContent(
    protagonist: Character,
    plotPoint: PlotPoint,
    options: GenerationOptions
  ): string {
    const perspective = this.getPerspectivePrefix(protagonist, options)
    
    return `${perspective} ${protagonist.name} continues their journey. ${plotPoint.description} ` +
           `Each step forward brings new challenges and revelations. ` +
           `The path ahead remains uncertain, but their determination grows stronger.`
  }

  private static generateDialogueSection(
    plotPoint: PlotPoint,
    characters: Character[],
    options: GenerationOptions
  ): string {
    if (characters.length < 2) return ''
    
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const otherCharacter = characters.find(c => c.id !== protagonist.id) || characters[1]
    
    let dialogue = '---\n\n'
    dialogue += `"${this.generateCharacterLine(protagonist, plotPoint, 'opening')}" ${protagonist.name} said.\n\n`
    dialogue += `"${this.generateCharacterLine(otherCharacter, plotPoint, 'response')}" ${otherCharacter.name} replied.\n\n`
    dialogue += `"${this.generateCharacterLine(protagonist, plotPoint, 'reaction')}" ${protagonist.name} responded.\n\n`
    
    return dialogue
  }

  private static generateCharacterLine(
    character: Character,
    plotPoint: PlotPoint,
    lineType: 'opening' | 'response' | 'reaction'
  ): string {
    const traits = character.personalityTraits
    const goals = character.goals[0] || 'find the truth'
    const flaws = character.flaws[0] || 'doubt myself'
    
    const lines = {
      opening: [
        `I never expected things to turn out this way`,
        `We need to talk about what happened`,
        `There's something I need to tell you`,
        `I'm not sure I can handle this alone`,
      ],
      response: [
        `I understand how you feel`,
        `That's not what I expected to hear`,
        `We'll figure this out together`,
        `You're stronger than you think`,
      ],
      reaction: [
        `Thank you for believing in me`,
        `I hope you're right about this`,
        `I won't let you down`,
        `Let's do what needs to be done`,
      ],
    }
    
    // Modify based on character traits
    let selectedLine = lines[lineType][Math.floor(Math.random() * lines[lineType].length)]
    
    if (traits.includes('brave' as any) && lineType === 'opening') {
      selectedLine = `I'm ready to face whatever comes next`
    } else if (traits.includes('deceptive' as any) && lineType === 'response') {
      selectedLine = `Of course, you can trust me completely`
    }
    
    return selectedLine
  }

  private static generateClimaxDialogue(character: Character, type: 'confrontation' | 'response'): string {
    const dialogues = {
      confrontation: [
        "This ends now. I won't let you hurt anyone else.",
        "I've come too far to back down now.",
        "You've taken everything from me, but you won't take my future.",
        "I'm not the same person who started this journey.",
        "Whatever happens next, I'm ready for it."
      ],
      response: [
        "You think you've grown stronger? You're still the same weak fool.",
        "Your journey ends here, just as I always planned.",
        "You cannot stop what has already been set in motion.",
        "Strength? You know nothing of true power.",
        "This is where your story ends."
      ]
    }

    const options = dialogues[type]
    return options[Math.floor(Math.random() * options.length)]
  }

  private static getPerspectivePrefix(
    protagonist: Character,
    options: GenerationOptions
  ): string {
    switch (options.narrativePerspective) {
      case 'first':
        return 'I'
      case 'second':
        return 'You'
      case 'third-limited':
        return `${protagonist.name}`
      case 'third-omniscient':
        return 'In this moment,'
      default:
        return `${protagonist.name}`
    }
  }

  private static getCharacterDescription(character: Character): string {
    const traits = character.personalityTraits.slice(0, 2).join(' and ')
    const description = character.description || 'a person of mystery'

    return `${character.name} is ${description}, known for being ${traits}.`
  }

  private static getDetailedCharacterDescription(character: Character): string {
    let description = character.description || 'a person of mystery'

    if (character.appearance) {
      description += ` ${character.appearance}`
    }

    if (character.personalityTraits.length > 0) {
      const traits = character.personalityTraits.slice(0, 3)
      description += ` Their personality was marked by being ${traits.join(', ')}.`
    }

    if (character.backstory) {
      description += ` ${character.backstory}`
    }

    return description
  }

  private static getCharacterReaction(character: Character, situation: string): string {
    const reactions: Record<string, Record<string, string[]>> = {
      shock: {
        brave: ['to stand firm despite the chaos', 'to face the situation head-on', 'to protect others nearby'],
        cowardly: ['to step back in fear', 'to look for an escape route', 'to hide behind something solid'],
        intelligent: ['to analyze what was happening', 'to look for logical explanations', 'to assess the situation carefully'],
        kind: ['to worry about others who might be affected', 'to check if anyone needed help', 'to think of those they cared about'],
        deceptive: ['to consider how this might be used to their advantage', 'to wonder who might be behind this', 'to mask their true feelings'],
      }
    }

    // Find the first matching trait
    for (const trait of character.personalityTraits) {
      if (reactions[situation] && reactions[situation][trait]) {
        const options = reactions[situation][trait]
        return options[Math.floor(Math.random() * options.length)]
      }
    }

    // Default reaction
    return 'to freeze momentarily, unsure how to respond'
  }

  static estimateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  static generateChapterTitles(plotPoints: PlotPoint[]): string[] {
    return plotPoints.map((point, index) => {
      const chapterNumber = index + 1
      return `Chapter ${chapterNumber}: ${point.title}`
    })
  }
}
