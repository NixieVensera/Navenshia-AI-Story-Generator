<template>
  <div class="library-view">
    <div class="library-view__header">
      <div class="library-view__title-section">
        <h1 class="library-view__title">Story Library</h1>
        <p class="library-view__subtitle">
          Manage and explore your generated stories
        </p>
      </div>
      
      <div class="library-view__actions">
        <router-link to="/generator" class="library-view__create-button">
          + Create New Story
        </router-link>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="library-view__filters">
      <div class="library-view__search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search stories..."
          class="library-view__search-input"
        />
      </div>
      
      <div class="library-view__filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.key"
          :class="[
            'library-view__filter-tab',
            { 'library-view__filter-tab--active': activeFilter === filter.key }
          ]"
          @click="activeFilter = filter.key"
        >
          {{ filter.label }}
          <span class="library-view__filter-count">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <!-- Story Grid -->
    <div v-if="filteredStories.length" class="library-view__grid">
      <div
        v-for="story in filteredStories"
        :key="story.id"
        class="library-view__story-card"
        @click="viewStory(story.id)"
      >
        <div class="library-view__story-header">
          <h3 class="library-view__story-title">{{ story.outline.title }}</h3>
          <div class="library-view__story-actions">
            <button
              class="library-view__story-action"
              title="Export"
              @click.stop="exportStory(story.id)"
            >
              📄
            </button>
            <button
              class="library-view__story-action"
              title="Share"
              @click.stop="shareStory(story.id)"
            >
              🔗
            </button>
            <button
              class="library-view__story-action library-view__story-action--danger"
              title="Delete"
              @click.stop="deleteStory(story.id)"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="library-view__story-meta">
          <span class="library-view__story-genre">{{ formatGenre(story.outline.genre) }}</span>
          <span class="library-view__story-status" :class="`library-view__story-status--${story.isComplete ? 'complete' : 'draft'}`">
            {{ story.isComplete ? 'Complete' : 'Draft' }}
          </span>
        </div>

        <p class="library-view__story-summary">{{ story.outline.summary }}</p>

        <div class="library-view__story-stats">
          <div class="library-view__story-stat">
            <span class="library-view__story-stat-label">Characters:</span>
            <span class="library-view__story-stat-value">{{ story.outline.characters.length }}</span>
          </div>
          <div class="library-view__story-stat">
            <span class="library-view__story-stat-label">Word Count:</span>
            <span class="library-view__story-stat-value">{{ story.metadata.wordCount }}</span>
          </div>
          <div class="library-view__story-stat">
            <span class="library-view__story-stat-label">Reading Time:</span>
            <span class="library-view__story-stat-value">{{ story.outline.estimatedReadingTime }}m</span>
          </div>
        </div>

        <div class="library-view__story-themes">
          <span
            v-for="theme in story.outline.themes.slice(0, 3)"
            :key="theme"
            class="library-view__story-theme"
          >
            {{ formatTheme(theme) }}
          </span>
          <span
            v-if="story.outline.themes.length > 3"
            class="library-view__story-theme library-view__story-theme--more"
          >
            +{{ story.outline.themes.length - 3 }}
          </span>
        </div>

        <div class="library-view__story-footer">
          <span class="library-view__story-date">{{ formatDate(story.createdAt) }}</span>
          <span class="library-view__story-version">v{{ story.metadata.version }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="library-view__empty">
      <div class="library-view__empty-icon">📚</div>
      <h2 class="library-view__empty-title">
        {{ searchQuery ? 'No stories found' : 'No stories yet' }}
      </h2>
      <p class="library-view__empty-text">
        {{ searchQuery 
          ? 'Try adjusting your search terms or filters' 
          : 'Create your first story to get started' 
        }}
      </p>
      <router-link to="/generator" class="library-view__empty-button">
        Create Your First Story
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryStore } from '../stores/storyStore'

const router = useRouter()
const storyStore = useStoryStore()

const searchQuery = ref('')
const activeFilter = ref('all')

const filters = computed(() => [
  { key: 'all', label: 'All Stories', count: storyStore.stories.length },
  { key: 'complete', label: 'Complete', count: storyStore.completedStories.length },
  { key: 'draft', label: 'Drafts', count: storyStore.draftStories.length },
])

const filteredStories = computed(() => {
  let stories = storyStore.stories

  // Apply status filter
  if (activeFilter.value === 'complete') {
    stories = storyStore.completedStories
  } else if (activeFilter.value === 'draft') {
    stories = storyStore.draftStories
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    stories = stories.filter(story =>
      story.outline.title.toLowerCase().includes(query) ||
      story.outline.summary.toLowerCase().includes(query) ||
      story.outline.themes.some(theme => theme.toLowerCase().includes(query)) ||
      story.outline.genre.toLowerCase().includes(query)
    )
  }

  // Sort by creation date (newest first)
  return stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

function viewStory(id: string) {
  router.push(`/story/${id}`)
}

function exportStory(id: string) {
  // TODO: Implement export functionality
  console.log('Export story:', id)
}

function shareStory(id: string) {
  // TODO: Implement share functionality
  console.log('Share story:', id)
}

function deleteStory(id: string) {
  if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
    storyStore.deleteStory(id)
  }
}

function formatGenre(genre: string): string {
  return genre.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatTheme(theme: string): string {
  return theme.split('-').map(word => 
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
.library-view {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.library-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.library-view__title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.library-view__subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.library-view__create-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.library-view__create-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.library-view__filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.library-view__search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
}

.library-view__filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.library-view__filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.library-view__filter-tab:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.library-view__filter-tab--active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.library-view__filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.library-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.library-view__story-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.library-view__story-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.library-view__story-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.library-view__story-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
}

.library-view__story-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.library-view__story-card:hover .library-view__story-actions {
  opacity: 1;
}

.library-view__story-action {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.library-view__story-action:hover {
  background: #f3f4f6;
}

.library-view__story-action--danger:hover {
  background: #fee2e2;
}

.library-view__story-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.library-view__story-genre {
  padding: 4px 8px;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.library-view__story-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.library-view__story-status--complete {
  background: #dcfce7;
  color: #166534;
}

.library-view__story-status--draft {
  background: #fef3c7;
  color: #92400e;
}

.library-view__story-summary {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.library-view__story-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.library-view__story-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.library-view__story-stat-label {
  font-size: 12px;
  color: #6b7280;
}

.library-view__story-stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.library-view__story-themes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.library-view__story-theme {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.library-view__story-theme--more {
  background: #e5e7eb;
  color: #6b7280;
  font-style: italic;
}

.library-view__story-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9ca3af;
  border-top: 1px solid #f3f4f6;
  padding-top: 12px;
}

.library-view__empty {
  text-align: center;
  padding: 80px 20px;
}

.library-view__empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.library-view__empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.library-view__empty-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.library-view__empty-button {
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

.library-view__empty-button:hover {
  background: #2563eb;
}
</style>
