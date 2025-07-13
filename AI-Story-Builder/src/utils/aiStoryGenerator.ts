import type { StoryOutline, PlotPoint, Character, Setting, StoryTheme, GenerationOptions } from '../types'

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'local'
  apiKey?: string
  model?: string
  baseURL?: string
}

export class AIStoryGenerator {
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  async generateChapterContent(
    plotPoint: PlotPoint,
    outline: StoryOutline,
    options: GenerationOptions,
    chapterNumber: number
  ): Promise<string> {
    const prompt = this.buildPrompt(plotPoint, outline, options, chapterNumber)
    
    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.generateWithOpenAI(prompt)
        case 'anthropic':
          return await this.generateWithAnthropic(prompt)
        case 'local':
          return await this.generateWithLocalModel(prompt)
        default:
          throw new Error(`Unsupported AI provider: ${this.config.provider}`)
      }
    } catch (error) {
      console.error('AI generation failed:', error)
      // Fallback to rule-based generation
      return this.generateFallbackContent(plotPoint, outline, options, chapterNumber)
    }
  }

  private buildPrompt(
    plotPoint: PlotPoint,
    outline: StoryOutline,
    options: GenerationOptions,
    chapterNumber: number
  ): string {
    const characters = outline.characters.filter(c => 
      plotPoint.characters.includes(c.id)
    )
    const setting = outline.settings.find(s => s.id === plotPoint.setting)
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]

    let prompt = `Write Chapter ${chapterNumber} of a ${outline.genre} story titled "${outline.title}".\n\n`
    
    prompt += `STORY CONTEXT:\n`
    prompt += `- Genre: ${outline.genre}\n`
    prompt += `- Themes: ${outline.themes.join(', ')}\n`
    prompt += `- Summary: ${outline.summary}\n\n`
    
    prompt += `CHAPTER DETAILS:\n`
    prompt += `- Title: ${plotPoint.title}\n`
    prompt += `- Plot Point Type: ${plotPoint.type}\n`
    prompt += `- Act: ${plotPoint.act}\n`
    prompt += `- Description: ${plotPoint.description}\n\n`
    
    if (setting) {
      prompt += `SETTING:\n`
      prompt += `- Name: ${setting.name}\n`
      prompt += `- Type: ${setting.type}\n`
      prompt += `- Description: ${setting.description}\n`
      prompt += `- Atmosphere: ${setting.atmosphere}\n`
      if (setting.keyLocations.length > 0) {
        prompt += `- Key Locations: ${setting.keyLocations.join(', ')}\n`
      }
      prompt += '\n'
    }
    
    prompt += `CHARACTERS IN THIS CHAPTER:\n`
    characters.forEach(char => {
      prompt += `- ${char.name} (${char.role}): ${char.description}\n`
      if (char.personalityTraits.length > 0) {
        prompt += `  Personality: ${char.personalityTraits.join(', ')}\n`
      }
      if (char.goals.length > 0) {
        prompt += `  Goals: ${char.goals.join(', ')}\n`
      }
      if (char.flaws.length > 0) {
        prompt += `  Flaws: ${char.flaws.join(', ')}\n`
      }
    })
    prompt += '\n'
    
    prompt += `WRITING STYLE:\n`
    prompt += `- Perspective: ${options.narrativePerspective}\n`
    prompt += `- Tense: ${options.tense}\n`
    prompt += `- Include dialogue: ${options.includeDialogue ? 'Yes' : 'No'}\n`
    prompt += `- Target length: ${this.getTargetLength(options.length)} words\n\n`
    
    prompt += `INSTRUCTIONS:\n`
    prompt += `Write a compelling chapter that:\n`
    prompt += `1. Advances the plot according to the plot point description\n`
    prompt += `2. Develops the characters and their relationships\n`
    prompt += `3. Maintains the established tone and atmosphere\n`
    prompt += `4. Includes vivid descriptions of the setting\n`
    if (options.includeDialogue) {
      prompt += `5. Features natural dialogue that reveals character\n`
    }
    prompt += `6. Builds toward the overall story themes\n`
    prompt += `7. Ends with appropriate tension or resolution for this plot point\n\n`
    
    prompt += `Write the chapter now:`

    return prompt
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not provided')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a skilled creative writer specializing in narrative fiction. Write engaging, well-structured prose with vivid descriptions and compelling character development.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  }

  private async generateWithAnthropic(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key not provided')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.content[0]?.text || ''
  }

  private async generateWithLocalModel(prompt: string): Promise<string> {
    // This would connect to a local LLM like Ollama
    const baseURL = this.config.baseURL || 'http://localhost:11434'
    
    const response = await fetch(`${baseURL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model || 'llama2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`Local model API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.response || ''
  }

  private generateFallbackContent(
    plotPoint: PlotPoint,
    outline: StoryOutline,
    options: GenerationOptions,
    chapterNumber: number
  ): string {
    // Fallback to enhanced rule-based generation
    return `# Chapter ${chapterNumber}: ${plotPoint.title}\n\n` +
           `${plotPoint.description}\n\n` +
           `[This chapter would be generated using the enhanced rule-based system as a fallback when AI generation is unavailable.]`
  }

  private getTargetLength(length: 'short' | 'medium' | 'long'): number {
    switch (length) {
      case 'short': return 300
      case 'medium': return 600
      case 'long': return 1000
      default: return 600
    }
  }

  static isConfigured(config: AIConfig): boolean {
    switch (config.provider) {
      case 'openai':
      case 'anthropic':
        return !!config.apiKey
      case 'local':
        return true // Local models don't require API keys
      default:
        return false
    }
  }
}

// Utility function to create AI config from environment or user settings
export function createAIConfig(): AIConfig | null {
  // First check localStorage for user configuration
  try {
    const savedConfig = localStorage.getItem('aiStoryConfig')
    if (savedConfig) {
      const config = JSON.parse(savedConfig) as AIConfig
      if (AIStoryGenerator.isConfigured(config)) {
        return config
      }
    }
  } catch (error) {
    console.warn('Failed to load AI config from localStorage:', error)
  }

  // Check for environment variables (for development)
  try {
    // Use import.meta.env for Vite environment variables
    const env = import.meta.env
    if (env.VITE_OPENAI_API_KEY) {
      return {
        provider: 'openai',
        apiKey: env.VITE_OPENAI_API_KEY,
        model: env.VITE_OPENAI_MODEL || 'gpt-4',
      }
    }

    if (env.VITE_ANTHROPIC_API_KEY) {
      return {
        provider: 'anthropic',
        apiKey: env.VITE_ANTHROPIC_API_KEY,
        model: env.VITE_ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      }
    }
  } catch (error) {
    // Environment variables not available
  }

  // Return null if no configuration is available
  return null
}
