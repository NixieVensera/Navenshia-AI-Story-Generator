<template>
  <div class="story-generator">
    <!-- Header -->
    <div class="story-generator__header">
      <h1 class="story-generator__title">AI Story Builder</h1>
      <p class="story-generator__subtitle">
        Create compelling stories by selecting characters, settings, and themes
      </p>
    </div>

    <!-- Step Indicator -->
    <StepIndicator
      :steps="steps"
      :current-step-index="currentStepIndex"
      @step-click="handleStepClick"
    />

    <!-- Main Content -->
    <div class="story-generator__content">
      <!-- Characters Step -->
      <div v-if="currentStep === 'characters'" class="story-generator__step">
        <CharacterSelection />
        <div class="story-generator__step-actions">
          <BaseButton
            variant="primary"
            :disabled="!canProceedFromCharacters"
            @click="nextStep"
          >
            Continue to Settings
          </BaseButton>
        </div>
      </div>

      <!-- Settings Step -->
      <div v-if="currentStep === 'settings'" class="story-generator__step">
        <SettingSelection />
        <div class="story-generator__step-actions">
          <BaseButton
            variant="secondary"
            @click="previousStep"
          >
            Back to Characters
          </BaseButton>
          <BaseButton
            variant="primary"
            :disabled="!canProceedFromSettings"
            @click="nextStep"
          >
            Continue to Themes
          </BaseButton>
        </div>
      </div>

      <!-- Themes Step -->
      <div v-if="currentStep === 'themes'" class="story-generator__step">
        <ThemeSelection />
        <div class="story-generator__step-actions">
          <BaseButton
            variant="secondary"
            @click="previousStep"
          >
            Back to Settings
          </BaseButton>
          <BaseButton
            variant="primary"
            :disabled="!canProceedFromThemes"
            @click="nextStep"
          >
            Generate Story
          </BaseButton>
        </div>
      </div>

      <!-- Generation Step -->
      <div v-if="currentStep === 'generation'" class="story-generator__step">
        <div class="story-generator__generation">
          <div class="story-generator__generation-header">
            <h2 class="story-generator__generation-title">Story Generation Options</h2>
            <p class="story-generator__generation-subtitle">
              Customize how your story will be generated
            </p>
          </div>

          <!-- Generation Options -->
          <div class="story-generator__options">
            <div class="story-generator__option-group">
              <h3 class="story-generator__option-title">Story Length</h3>
              <div class="story-generator__option-buttons">
                <button
                  v-for="length in lengthOptions"
                  :key="length.value"
                  :class="[
                    'story-generator__option-button',
                    { 'story-generator__option-button--active': generationOptions.length === length.value }
                  ]"
                  @click="updateGenerationOption('length', length.value)"
                >
                  <div class="story-generator__option-label">{{ length.label }}</div>
                  <div class="story-generator__option-description">{{ length.description }}</div>
                </button>
              </div>
            </div>

            <div class="story-generator__option-group">
              <h3 class="story-generator__option-title">Narrative Perspective</h3>
              <div class="story-generator__option-buttons">
                <button
                  v-for="perspective in perspectiveOptions"
                  :key="perspective.value"
                  :class="[
                    'story-generator__option-button',
                    { 'story-generator__option-button--active': generationOptions.narrativePerspective === perspective.value }
                  ]"
                  @click="updateGenerationOption('narrativePerspective', perspective.value)"
                >
                  <div class="story-generator__option-label">{{ perspective.label }}</div>
                  <div class="story-generator__option-description">{{ perspective.description }}</div>
                </button>
              </div>
            </div>

            <div class="story-generator__option-group">
              <h3 class="story-generator__option-title">Additional Options</h3>
              <div class="story-generator__checkboxes">
                <label class="story-generator__checkbox">
                  <input
                    type="checkbox"
                    :checked="generationOptions.includeDialogue"
                    @change="updateGenerationOption('includeDialogue', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Include dialogue between characters</span>
                </label>
                <label class="story-generator__checkbox">
                  <input
                    type="checkbox"
                    :checked="generationOptions.useAI"
                    @change="updateGenerationOption('useAI', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Use AI assistance for enhanced content</span>
                </label>
                <div v-if="generationOptions.useAI" class="story-generator__ai-config">
                  <BaseButton
                    variant="ghost"
                    size="small"
                    @click="showAIConfig = true"
                  >
                    ⚙️ Configure AI Settings
                  </BaseButton>
                  <span v-if="aiConfigStatus" class="story-generator__ai-status" :class="`story-generator__ai-status--${aiConfigStatus.type}`">
                    {{ aiConfigStatus.message }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Generation Actions -->
          <div class="story-generator__generation-actions">
            <BaseButton
              variant="secondary"
              @click="previousStep"
            >
              Back to Themes
            </BaseButton>
            <BaseButton
              variant="primary"
              :loading="isGenerating"
              @click="generateStory"
            >
              {{ isGenerating ? 'Generating Story...' : 'Generate My Story' }}
            </BaseButton>
          </div>

          <!-- Progress Bar -->
          <div v-if="isGenerating" class="story-generator__progress">
            <h3 class="story-generator__progress-title">Generating Your Story</h3>
            <ProgressBar :progress="generationProgress" />
            <p class="story-generator__progress-text">{{ progressText }}</p>
          </div>
        </div>
      </div>

      <!-- Complete Step -->
      <div v-if="currentStep === 'complete'" class="story-generator__step">
        <div class="story-generator__complete">
          <div class="story-generator__complete-header">
            <div class="story-generator__complete-icon">🎉</div>
            <h2 class="story-generator__complete-title">Story Generated Successfully!</h2>
            <p class="story-generator__complete-subtitle">
              Your story outline has been created and is ready for editing
            </p>
          </div>

          <div v-if="currentStory" class="story-generator__story-preview">
            <h3 class="story-generator__story-title">{{ currentStory.outline.title }}</h3>
            <p class="story-generator__story-summary">{{ currentStory.outline.summary }}</p>
            
            <div class="story-generator__story-stats">
              <div class="story-generator__stat">
                <span class="story-generator__stat-label">Characters:</span>
                <span class="story-generator__stat-value">{{ currentStory.outline.characters.length }}</span>
              </div>
              <div class="story-generator__stat">
                <span class="story-generator__stat-label">Settings:</span>
                <span class="story-generator__stat-value">{{ currentStory.outline.settings.length }}</span>
              </div>
              <div class="story-generator__stat">
                <span class="story-generator__stat-label">Plot Points:</span>
                <span class="story-generator__stat-value">{{ currentStory.outline.plotPoints.length }}</span>
              </div>
              <div class="story-generator__stat">
                <span class="story-generator__stat-label">Est. Reading Time:</span>
                <span class="story-generator__stat-value">{{ currentStory.outline.estimatedReadingTime }} min</span>
              </div>
            </div>
          </div>

          <div class="story-generator__complete-actions">
            <BaseButton
              variant="secondary"
              @click="startOver"
            >
              Create Another Story
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="viewStory"
            >
              View & Edit Story
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Config Modal -->
    <div
      v-if="showAIConfig"
      class="story-generator__modal"
      @click.self="closeAIConfig"
    >
      <AIConfigModal
        @close="closeAIConfig"
        @save="handleAIConfigSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryStore } from '../../stores/storyStore'
import { useCharacterStore } from '../../stores/characterStore'
import { useSettingStore } from '../../stores/settingStore'
import { useThemeStore } from '../../stores/themeStore'
import type { GenerationOptions } from '../../types'

import BaseButton from '../ui/BaseButton.vue'
import ProgressBar from '../ui/ProgressBar.vue'
import StepIndicator from '../ui/StepIndicator.vue'
import CharacterSelection from '../character/CharacterSelection.vue'
import SettingSelection from '../setting/SettingSelection.vue'
import ThemeSelection from '../theme/ThemeSelection.vue'
import AIConfigModal from '../ai/AIConfigModal.vue'

const router = useRouter()
const storyStore = useStoryStore()
const characterStore = useCharacterStore()
const settingStore = useSettingStore()
const themeStore = useThemeStore()

const progressText = ref('')
const showAIConfig = ref(false)
const aiConfigStatus = ref<{ type: 'success' | 'error', message: string } | null>(null)

const steps = [
  { key: 'characters', label: 'Characters' },
  { key: 'settings', label: 'Settings' },
  { key: 'themes', label: 'Themes' },
  { key: 'generation', label: 'Generate' },
  { key: 'complete', label: 'Complete' },
]

const lengthOptions = [
  { value: 'short', label: 'Short', description: '~2,000 words, 10 min read' },
  { value: 'medium', label: 'Medium', description: '~5,000 words, 25 min read' },
  { value: 'long', label: 'Long', description: '~10,000 words, 50 min read' },
]

const perspectiveOptions = [
  { value: 'first', label: 'First Person', description: 'I, me, my' },
  { value: 'third-limited', label: 'Third Person Limited', description: 'He, she, they (one viewpoint)' },
  { value: 'third-omniscient', label: 'Third Person Omniscient', description: 'All-knowing narrator' },
]

// Computed properties
const currentStep = computed(() => storyStore.generatorState.currentStep)
const currentStepIndex = computed(() => storyStore.currentStepIndex)
const generationOptions = computed(() => storyStore.generatorState.generationOptions)
const isGenerating = computed(() => storyStore.generatorState.isGenerating)
const generationProgress = computed(() => storyStore.generatorState.progress)
const currentStory = computed(() => storyStore.currentStory)

const canProceedFromCharacters = computed(() => 
  characterStore.selectedCharacters.length > 0
)

const canProceedFromSettings = computed(() => 
  settingStore.selectedSettings.length > 0
)

const canProceedFromThemes = computed(() => 
  themeStore.selectedThemes.length > 0
)

// Methods
function handleStepClick(stepKey: string, index: number) {
  if (index <= currentStepIndex.value) {
    storyStore.setCurrentStep(stepKey as any)
  }
}

function nextStep() {
  if (currentStep.value === 'themes') {
    // Copy selected items to story store
    storyStore.generatorState.selectedCharacters = [...characterStore.selectedCharacters]
    storyStore.generatorState.selectedSettings = [...settingStore.selectedSettings]
    storyStore.generatorState.selectedThemes = [...themeStore.selectedThemes]
  }
  storyStore.nextStep()
}

function previousStep() {
  storyStore.previousStep()
}

function updateGenerationOption(key: keyof GenerationOptions, value: any) {
  storyStore.updateGenerationOptions({ [key]: value })
}

async function generateStory() {
  progressText.value = 'Analyzing your selections...'
  
  try {
    const story = await storyStore.generateStory()
    if (story) {
      progressText.value = 'Story generated successfully!'
    } else {
      progressText.value = 'Failed to generate story. Please try again.'
    }
  } catch (error) {
    console.error('Story generation failed:', error)
    progressText.value = 'An error occurred during generation.'
  }
}

function startOver() {
  storyStore.resetGenerator()
  characterStore.clearSelectedCharacters()
  settingStore.clearSelectedSettings()
  themeStore.clearSelectedThemes()
}

function viewStory() {
  if (currentStory.value) {
    router.push(`/story/${currentStory.value.id}`)
  }
}

function closeAIConfig() {
  showAIConfig.value = false
}

function handleAIConfigSave(config: any) {
  // Config is already saved to localStorage in the modal
  aiConfigStatus.value = {
    type: 'success',
    message: '✅ AI configuration saved successfully'
  }
  showAIConfig.value = false

  // Clear status after 3 seconds
  setTimeout(() => {
    aiConfigStatus.value = null
  }, 3000)
}
</script>

<style scoped>
.story-generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.story-generator__header {
  text-align: center;
  margin-bottom: 32px;
}

.story-generator__title {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
}

.story-generator__subtitle {
  font-size: 20px;
  color: #6b7280;
  margin: 0;
}

.story-generator__content {
  margin-top: 32px;
}

.story-generator__step {
  min-height: 600px;
}

.story-generator__step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
}

.story-generator__generation {
  max-width: 800px;
  margin: 0 auto;
}

.story-generator__generation-header {
  text-align: center;
  margin-bottom: 32px;
}

.story-generator__generation-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.story-generator__generation-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.story-generator__options {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
}

.story-generator__option-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.story-generator__option-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.story-generator__option-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.story-generator__option-button {
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.story-generator__option-button:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.story-generator__option-button--active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.story-generator__option-label {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.story-generator__option-description {
  font-size: 14px;
  color: #6b7280;
}

.story-generator__checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.story-generator__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.story-generator__ai-config {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding-left: 24px;
}

.story-generator__ai-status {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
}

.story-generator__ai-status--success {
  background: #dcfce7;
  color: #166534;
}

.story-generator__ai-status--error {
  background: #fee2e2;
  color: #991b1b;
}

.story-generator__generation-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid #e5e7eb;
}

.story-generator__progress {
  margin-top: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
}

.story-generator__progress-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.story-generator__progress-text {
  font-size: 14px;
  color: #6b7280;
  margin: 8px 0 0 0;
  text-align: center;
}

.story-generator__complete {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.story-generator__complete-header {
  margin-bottom: 32px;
}

.story-generator__complete-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.story-generator__complete-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.story-generator__complete-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.story-generator__story-preview {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
}

.story-generator__story-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.story-generator__story-summary {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.story-generator__story-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.story-generator__stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.story-generator__stat-label {
  font-size: 14px;
  color: #6b7280;
}

.story-generator__stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.story-generator__complete-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
