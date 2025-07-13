<template>
  <div class="home">
    <div class="home__hero">
      <div class="home__hero-content">
        <h1 class="home__title">AI Story Builder</h1>
        <p class="home__subtitle">
          Create compelling stories with our interactive story generator. 
          Choose characters, settings, and themes to craft unique narratives.
        </p>
        <div class="home__actions">
          <router-link to="/generator" class="home__cta">
            Start Creating
          </router-link>
          <router-link to="/library" class="home__secondary">
            View Library
          </router-link>
        </div>
      </div>
      <div class="home__hero-visual">
        <div class="home__feature-grid">
          <div class="home__feature">
            <div class="home__feature-icon">👤</div>
            <h3>Rich Characters</h3>
            <p>Create detailed characters with personalities, goals, and flaws</p>
          </div>
          <div class="home__feature">
            <div class="home__feature-icon">🌍</div>
            <h3>Vivid Settings</h3>
            <p>Build immersive worlds across multiple genres and time periods</p>
          </div>
          <div class="home__feature">
            <div class="home__feature-icon">🎭</div>
            <h3>Compelling Themes</h3>
            <p>Explore deep themes like redemption, love, and transformation</p>
          </div>
          <div class="home__feature">
            <div class="home__feature-icon">📚</div>
            <h3>Story Generation</h3>
            <p>Generate structured outlines with 3-act story progression</p>
          </div>
        </div>
      </div>
    </div>

    <div class="home__stats">
      <div class="home__stat">
        <div class="home__stat-number">{{ characterCount }}</div>
        <div class="home__stat-label">Characters Created</div>
      </div>
      <div class="home__stat">
        <div class="home__stat-number">{{ settingCount }}</div>
        <div class="home__stat-label">Settings Available</div>
      </div>
      <div class="home__stat">
        <div class="home__stat-number">{{ themeCount }}</div>
        <div class="home__stat-label">Themes to Explore</div>
      </div>
      <div class="home__stat">
        <div class="home__stat-number">{{ storyCount }}</div>
        <div class="home__stat-label">Stories Generated</div>
      </div>
    </div>

    <div class="home__how-it-works">
      <h2 class="home__section-title">How It Works</h2>
      <div class="home__steps">
        <div class="home__step">
          <div class="home__step-number">1</div>
          <h3 class="home__step-title">Choose Characters</h3>
          <p class="home__step-description">
            Select from pre-made characters or create your own with unique personalities and motivations
          </p>
        </div>
        <div class="home__step">
          <div class="home__step-number">2</div>
          <h3 class="home__step-title">Pick Settings</h3>
          <p class="home__step-description">
            Choose the worlds and locations where your story will unfold, from fantasy realms to sci-fi cities
          </p>
        </div>
        <div class="home__step">
          <div class="home__step-number">3</div>
          <h3 class="home__step-title">Select Themes</h3>
          <p class="home__step-description">
            Define the central conflicts and themes that will drive your narrative forward
          </p>
        </div>
        <div class="home__step">
          <div class="home__step-number">4</div>
          <h3 class="home__step-title">Generate Story</h3>
          <p class="home__step-description">
            Our engine creates a structured story outline with plot points, character arcs, and narrative flow
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCharacterStore } from '../stores/characterStore'
import { useSettingStore } from '../stores/settingStore'
import { useThemeStore } from '../stores/themeStore'
import { useStoryStore } from '../stores/storyStore'

const characterStore = useCharacterStore()
const settingStore = useSettingStore()
const themeStore = useThemeStore()
const storyStore = useStoryStore()

const characterCount = computed(() => characterStore.characterCount)
const settingCount = computed(() => settingStore.settingCount)
const themeCount = computed(() => themeStore.themeCount)
const storyCount = computed(() => storyStore.storyCount)

onMounted(() => {
  characterStore.loadFromStorage()
  settingStore.loadFromStorage()
  themeStore.loadFromStorage()
  storyStore.loadFromStorage()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.home__hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.home__title {
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 24px 0;
  line-height: 1.1;
}

.home__subtitle {
  font-size: 20px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.home__actions {
  display: flex;
  gap: 16px;
}

.home__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.2s ease;
}

.home__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.home__secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  border: 2px solid #e5e7eb;
  color: #374151;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.2s ease;
}

.home__secondary:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.home__feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.home__feature {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  text-align: center;
}

.home__feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.home__feature h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.home__feature p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.home__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 64px 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
}

.home__stat {
  text-align: center;
}

.home__stat-number {
  font-size: 48px;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 8px;
}

.home__stat-label {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

.home__how-it-works {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.home__section-title {
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  color: #111827;
  margin: 0 0 64px 0;
}

.home__steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.home__step {
  text-align: center;
  padding: 32px 24px;
}

.home__step-number {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.home__step-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.home__step-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .home__hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 24px;
    text-align: center;
  }
  
  .home__title {
    font-size: 48px;
  }
  
  .home__feature-grid {
    grid-template-columns: 1fr;
  }
  
  .home__stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 40px 24px;
  }
  
  .home__steps {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
