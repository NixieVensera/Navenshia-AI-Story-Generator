<template>
  <div class="story-view">
    <div v-if="story" class="story-view__content">
      <div class="story-view__header">
        <router-link to="/library" class="story-view__back">
          ← Back to Library
        </router-link>
        <div class="story-view__actions">
          <BaseButton variant="ghost" size="small">
            🔊 Read Aloud
          </BaseButton>
          <BaseButton variant="ghost" size="small">
            📄 Export PDF
          </BaseButton>
          <BaseButton variant="ghost" size="small">
            🔗 Share
          </BaseButton>
        </div>
      </div>

      <div class="story-view__story">
        <h1 class="story-view__title">{{ story.outline.title }}</h1>
        
        <div class="story-view__meta">
          <div class="story-view__meta-item">
            <span class="story-view__meta-label">Genre:</span>
            <span class="story-view__meta-value">{{ formatGenre(story.outline.genre) }}</span>
          </div>
          <div class="story-view__meta-item">
            <span class="story-view__meta-label">Reading Time:</span>
            <span class="story-view__meta-value">{{ story.outline.estimatedReadingTime }} minutes</span>
          </div>
          <div class="story-view__meta-item">
            <span class="story-view__meta-label">Word Count:</span>
            <span class="story-view__meta-value">{{ story.metadata.wordCount }} words</span>
          </div>
          <div class="story-view__meta-item">
            <span class="story-view__meta-label">Created:</span>
            <span class="story-view__meta-value">{{ formatDate(story.createdAt) }}</span>
          </div>
        </div>

        <div class="story-view__summary">
          <h2>Summary</h2>
          <p>{{ story.outline.summary }}</p>
        </div>

        <div class="story-view__characters">
          <h2>Characters</h2>
          <div class="story-view__character-list">
            <div
              v-for="character in story.outline.characters"
              :key="character.id"
              class="story-view__character"
            >
              <h3>{{ character.name }}</h3>
              <p class="story-view__character-role">{{ formatRole(character.role) }}</p>
              <p class="story-view__character-description">{{ character.description }}</p>
            </div>
          </div>
        </div>

        <div class="story-view__settings">
          <h2>Settings</h2>
          <div class="story-view__setting-list">
            <div
              v-for="setting in story.outline.settings"
              :key="setting.id"
              class="story-view__setting"
            >
              <h3>{{ setting.name }}</h3>
              <p class="story-view__setting-type">{{ formatType(setting.type) }} • {{ formatGenre(setting.genre) }}</p>
              <p class="story-view__setting-description">{{ setting.description }}</p>
            </div>
          </div>
        </div>

        <div class="story-view__content-section">
          <h2>Story Content</h2>
          <div class="story-view__story-content" v-html="formattedContent"></div>
        </div>
      </div>
    </div>

    <div v-else class="story-view__not-found">
      <h1>Story Not Found</h1>
      <p>The story you're looking for doesn't exist or has been deleted.</p>
      <router-link to="/library" class="story-view__back-link">
        Return to Library
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStoryStore } from '../stores/storyStore'
import BaseButton from '../components/ui/BaseButton.vue'

const route = useRoute()
const storyStore = useStoryStore()

const story = computed(() => {
  const id = route.params.id as string
  return storyStore.getStoryById(id)
})

const formattedContent = computed(() => {
  if (!story.value) return ''
  
  // Convert markdown-like content to HTML
  return story.value.content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
})

function formatGenre(genre: string): string {
  return genre.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatType(type: string): string {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  storyStore.loadFromStorage()
})
</script>

<style scoped>
.story-view {
  min-height: 100vh;
  background: #f8fafc;
}

.story-view__content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.story-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.story-view__back {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.story-view__back:hover {
  text-decoration: underline;
}

.story-view__actions {
  display: flex;
  gap: 8px;
}

.story-view__story {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.story-view__title {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.story-view__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.story-view__meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.story-view__meta-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.story-view__meta-value {
  font-size: 16px;
  color: #111827;
  font-weight: 600;
}

.story-view__summary,
.story-view__characters,
.story-view__settings,
.story-view__content-section {
  margin-bottom: 32px;
}

.story-view__summary h2,
.story-view__characters h2,
.story-view__settings h2,
.story-view__content-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.story-view__summary p {
  font-size: 16px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.story-view__character-list,
.story-view__setting-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.story-view__character,
.story-view__setting {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.story-view__character h3,
.story-view__setting h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.story-view__character-role,
.story-view__setting-type {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 8px 0;
  text-transform: capitalize;
}

.story-view__character-description,
.story-view__setting-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.story-view__story-content {
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
}

.story-view__story-content :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 32px 0 16px 0;
}

.story-view__story-content :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 28px 0 14px 0;
}

.story-view__story-content :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 24px 0 12px 0;
}

.story-view__story-content :deep(p) {
  margin: 0 0 16px 0;
}

.story-view__not-found {
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
}

.story-view__not-found h1 {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.story-view__not-found p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.story-view__back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
}

.story-view__back-link:hover {
  background: #2563eb;
}
</style>
