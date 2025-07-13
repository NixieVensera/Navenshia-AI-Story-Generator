<template>
  <div class="ai-config-modal">
    <div class="ai-config-modal__header">
      <h2 class="ai-config-modal__title">AI Story Generation Setup</h2>
      <BaseButton
        variant="ghost"
        size="small"
        @click="$emit('close')"
      >
        ✕
      </BaseButton>
    </div>

    <div class="ai-config-modal__content">
      <p class="ai-config-modal__description">
        Enable AI-powered story generation for richer, more detailed narratives. 
        Choose your preferred AI provider and configure your settings.
      </p>

      <div class="ai-config-modal__providers">
        <h3 class="ai-config-modal__section-title">Choose AI Provider</h3>
        
        <div class="ai-config-modal__provider-options">
          <label
            v-for="provider in providers"
            :key="provider.id"
            class="ai-config-modal__provider"
            :class="{ 'ai-config-modal__provider--selected': selectedProvider === provider.id }"
          >
            <input
              type="radio"
              :value="provider.id"
              v-model="selectedProvider"
              class="ai-config-modal__provider-radio"
            />
            <div class="ai-config-modal__provider-content">
              <div class="ai-config-modal__provider-header">
                <h4 class="ai-config-modal__provider-name">{{ provider.name }}</h4>
                <span class="ai-config-modal__provider-badge" :class="`ai-config-modal__provider-badge--${provider.tier}`">
                  {{ provider.tier }}
                </span>
              </div>
              <p class="ai-config-modal__provider-description">{{ provider.description }}</p>
              <div class="ai-config-modal__provider-features">
                <span
                  v-for="feature in provider.features"
                  :key="feature"
                  class="ai-config-modal__provider-feature"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div v-if="selectedProvider !== 'local'" class="ai-config-modal__api-config">
        <h3 class="ai-config-modal__section-title">API Configuration</h3>
        
        <BaseInput
          v-model="apiKey"
          label="API Key"
          type="password"
          :placeholder="`Enter your ${getProviderName(selectedProvider)} API key`"
          :error="errors.apiKey"
        />
        
        <BaseInput
          v-model="model"
          label="Model (Optional)"
          :placeholder="getDefaultModel(selectedProvider)"
          hint="Leave empty to use the default model"
        />

        <div class="ai-config-modal__api-help">
          <h4>How to get your API key:</h4>
          <div v-if="selectedProvider === 'openai'" class="ai-config-modal__help-content">
            <p>1. Go to <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API Keys</a></p>
            <p>2. Click "Create new secret key"</p>
            <p>3. Copy the key and paste it above</p>
            <p class="ai-config-modal__warning">⚠️ Keep your API key secure and never share it publicly</p>
          </div>
          <div v-else-if="selectedProvider === 'anthropic'" class="ai-config-modal__help-content">
            <p>1. Go to <a href="https://console.anthropic.com/" target="_blank">Anthropic Console</a></p>
            <p>2. Navigate to API Keys section</p>
            <p>3. Create a new API key</p>
            <p>4. Copy the key and paste it above</p>
            <p class="ai-config-modal__warning">⚠️ Keep your API key secure and never share it publicly</p>
          </div>
        </div>
      </div>

      <div v-else class="ai-config-modal__local-config">
        <h3 class="ai-config-modal__section-title">Local Model Configuration</h3>
        
        <BaseInput
          v-model="baseURL"
          label="Base URL"
          placeholder="http://localhost:11434"
          hint="URL of your local LLM server (e.g., Ollama)"
        />
        
        <BaseInput
          v-model="model"
          label="Model Name"
          placeholder="llama2"
          hint="Name of the local model to use"
        />

        <div class="ai-config-modal__local-help">
          <h4>Setting up a local model:</h4>
          <div class="ai-config-modal__help-content">
            <p>1. Install <a href="https://ollama.ai/" target="_blank">Ollama</a> or another local LLM server</p>
            <p>2. Download a model: <code>ollama pull llama2</code></p>
            <p>3. Start the server: <code>ollama serve</code></p>
            <p>4. The default URL should work if running locally</p>
          </div>
        </div>
      </div>

      <div class="ai-config-modal__test">
        <BaseButton
          variant="secondary"
          :loading="isTesting"
          :disabled="!canTest"
          @click="testConnection"
        >
          {{ isTesting ? 'Testing...' : 'Test Connection' }}
        </BaseButton>
        
        <div v-if="testResult" class="ai-config-modal__test-result" :class="`ai-config-modal__test-result--${testResult.type}`">
          {{ testResult.message }}
        </div>
      </div>
    </div>

    <div class="ai-config-modal__actions">
      <BaseButton
        variant="secondary"
        @click="$emit('close')"
      >
        Cancel
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="!isValid"
        @click="saveConfig"
      >
        Save Configuration
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AIStoryGenerator } from '../../utils/aiStoryGenerator'
import type { AIConfig } from '../../utils/aiStoryGenerator'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'

const emit = defineEmits<{
  close: []
  save: [config: AIConfig]
}>()

const selectedProvider = ref<'openai' | 'anthropic' | 'local'>('openai')
const apiKey = ref('')
const model = ref('')
const baseURL = ref('http://localhost:11434')
const isTesting = ref(false)
const testResult = ref<{ type: 'success' | 'error', message: string } | null>(null)

const errors = ref({
  apiKey: '',
})

const providers = [
  {
    id: 'openai',
    name: 'OpenAI',
    tier: 'premium',
    description: 'High-quality story generation with GPT-4. Requires API key and credits.',
    features: ['GPT-4 Turbo', 'Excellent creativity', 'Fast generation'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    tier: 'premium',
    description: 'Sophisticated storytelling with Claude. Requires API key and credits.',
    features: ['Claude 3 Sonnet', 'Great dialogue', 'Nuanced characters'],
  },
  {
    id: 'local',
    name: 'Local Model',
    tier: 'free',
    description: 'Use your own local LLM. Free but requires technical setup.',
    features: ['Privacy focused', 'No API costs', 'Offline capable'],
  },
]

const canTest = computed(() => {
  if (selectedProvider.value === 'local') {
    return baseURL.value.trim() !== '' && model.value.trim() !== ''
  }
  return apiKey.value.trim() !== ''
})

const isValid = computed(() => {
  if (selectedProvider.value === 'local') {
    return baseURL.value.trim() !== '' && model.value.trim() !== ''
  }
  return apiKey.value.trim() !== '' && !errors.value.apiKey
})

function getProviderName(provider: string): string {
  const providerMap: Record<string, string> = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    local: 'Local Model',
  }
  return providerMap[provider] || provider
}

function getDefaultModel(provider: string): string {
  const modelMap: Record<string, string> = {
    openai: 'gpt-4',
    anthropic: 'claude-3-sonnet-20240229',
    local: 'llama2',
  }
  return modelMap[provider] || ''
}

async function testConnection() {
  isTesting.value = true
  testResult.value = null
  errors.value.apiKey = ''

  try {
    const config: AIConfig = {
      provider: selectedProvider.value,
      apiKey: selectedProvider.value !== 'local' ? apiKey.value : undefined,
      model: model.value || getDefaultModel(selectedProvider.value),
      baseURL: selectedProvider.value === 'local' ? baseURL.value : undefined,
    }

    const generator = new AIStoryGenerator(config)
    
    // Test with a simple prompt
    const testPrompt = 'Write a single sentence about a brave knight.'
    
    if (selectedProvider.value === 'openai') {
      await generator['generateWithOpenAI'](testPrompt)
    } else if (selectedProvider.value === 'anthropic') {
      await generator['generateWithAnthropic'](testPrompt)
    } else {
      await generator['generateWithLocalModel'](testPrompt)
    }

    testResult.value = {
      type: 'success',
      message: '✅ Connection successful! AI generation is ready to use.',
    }
  } catch (error: any) {
    testResult.value = {
      type: 'error',
      message: `❌ Connection failed: ${error.message}`,
    }
    
    if (error.message.includes('API key')) {
      errors.value.apiKey = 'Invalid API key'
    }
  } finally {
    isTesting.value = false
  }
}

function saveConfig() {
  if (!isValid.value) return

  const config: AIConfig = {
    provider: selectedProvider.value,
    apiKey: selectedProvider.value !== 'local' ? apiKey.value : undefined,
    model: model.value || getDefaultModel(selectedProvider.value),
    baseURL: selectedProvider.value === 'local' ? baseURL.value : undefined,
  }

  // Save to localStorage for persistence
  localStorage.setItem('aiStoryConfig', JSON.stringify(config))

  emit('save', config)
}
</script>

<style scoped>
.ai-config-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.ai-config-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.ai-config-modal__title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.ai-config-modal__content {
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ai-config-modal__description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.ai-config-modal__section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.ai-config-modal__provider-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-config-modal__provider {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-config-modal__provider:hover {
  border-color: #3b82f6;
}

.ai-config-modal__provider--selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.ai-config-modal__provider-radio {
  margin-top: 4px;
}

.ai-config-modal__provider-content {
  flex: 1;
}

.ai-config-modal__provider-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ai-config-modal__provider-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.ai-config-modal__provider-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.ai-config-modal__provider-badge--premium {
  background: #fef3c7;
  color: #92400e;
}

.ai-config-modal__provider-badge--free {
  background: #dcfce7;
  color: #166534;
}

.ai-config-modal__provider-description {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.ai-config-modal__provider-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ai-config-modal__provider-feature {
  background: #f3f4f6;
  color: #374151;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.ai-config-modal__api-config,
.ai-config-modal__local-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-config-modal__help-content {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.ai-config-modal__help-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #4b5563;
}

.ai-config-modal__help-content a {
  color: #3b82f6;
  text-decoration: none;
}

.ai-config-modal__help-content a:hover {
  text-decoration: underline;
}

.ai-config-modal__help-content code {
  background: #e5e7eb;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
}

.ai-config-modal__warning {
  color: #dc2626 !important;
  font-weight: 500;
}

.ai-config-modal__test {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.ai-config-modal__test-result {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.ai-config-modal__test-result--success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.ai-config-modal__test-result--error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.ai-config-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}
</style>
