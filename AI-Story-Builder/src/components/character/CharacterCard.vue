<template>
  <div 
    :class="[
      'character-card',
      {
        'character-card--selected': isSelected,
        'character-card--template': character.isTemplate,
      }
    ]"
    @click="$emit('select', character)"
  >
    <div class="character-card__header">
      <div class="character-card__info">
        <h3 class="character-card__name">{{ character.name }}</h3>
        <div class="character-card__meta">
          <span class="character-card__role" :class="`character-card__role--${character.role}`">
            {{ formatRole(character.role) }}
          </span>
          <span v-if="character.age" class="character-card__age">
            Age {{ character.age }}
          </span>
        </div>
      </div>
      
      <div class="character-card__actions">
        <button
          v-if="character.isTemplate"
          class="character-card__action"
          title="Template"
        >
          📋
        </button>
        <button
          class="character-card__action"
          title="Edit"
          @click.stop="$emit('edit', character)"
        >
          ✏️
        </button>
        <button
          class="character-card__action"
          title="Duplicate"
          @click.stop="$emit('duplicate', character.id)"
        >
          📄
        </button>
        <button
          class="character-card__action character-card__action--danger"
          title="Delete"
          @click.stop="$emit('delete', character.id)"
        >
          🗑️
        </button>
      </div>
    </div>

    <p class="character-card__description">{{ character.description }}</p>

    <div v-if="character.personalityTraits.length" class="character-card__traits">
      <span
        v-for="trait in character.personalityTraits.slice(0, 3)"
        :key="trait"
        class="character-card__trait"
      >
        {{ formatTrait(trait) }}
      </span>
      <span
        v-if="character.personalityTraits.length > 3"
        class="character-card__trait character-card__trait--more"
      >
        +{{ character.personalityTraits.length - 3 }} more
      </span>
    </div>

    <div v-if="character.goals.length" class="character-card__goals">
      <h4 class="character-card__section-title">Goals:</h4>
      <ul class="character-card__list">
        <li
          v-for="goal in character.goals.slice(0, 2)"
          :key="goal"
          class="character-card__list-item"
        >
          {{ goal }}
        </li>
        <li
          v-if="character.goals.length > 2"
          class="character-card__list-item character-card__list-item--more"
        >
          +{{ character.goals.length - 2 }} more goals
        </li>
      </ul>
    </div>

    <div v-if="character.flaws.length" class="character-card__flaws">
      <h4 class="character-card__section-title">Flaws:</h4>
      <ul class="character-card__list">
        <li
          v-for="flaw in character.flaws.slice(0, 2)"
          :key="flaw"
          class="character-card__list-item"
        >
          {{ flaw }}
        </li>
        <li
          v-if="character.flaws.length > 2"
          class="character-card__list-item character-card__list-item--more"
        >
          +{{ character.flaws.length - 2 }} more flaws
        </li>
      </ul>
    </div>

    <div v-if="isSelected" class="character-card__selected-indicator">
      ✓ Selected
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '../../types'

interface Props {
  character: Character
  isSelected?: boolean
}

defineProps<Props>()

defineEmits<{
  select: [character: Character]
  edit: [character: Character]
  duplicate: [id: string]
  delete: [id: string]
}>()

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatTrait(trait: string): string {
  return trait.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}
</script>

<style scoped>
.character-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.character-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.character-card--selected {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.character-card--template {
  border-left: 4px solid #f59e0b;
}

.character-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.character-card__info {
  flex: 1;
}

.character-card__name {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.character-card__meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.character-card__role {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.character-card__role--protagonist {
  background: #dcfce7;
  color: #166534;
}

.character-card__role--antagonist {
  background: #fee2e2;
  color: #991b1b;
}

.character-card__role--supporting {
  background: #e0e7ff;
  color: #3730a3;
}

.character-card__role--minor {
  background: #f3f4f6;
  color: #374151;
}

.character-card__age {
  font-size: 14px;
  color: #6b7280;
}

.character-card__actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.character-card:hover .character-card__actions {
  opacity: 1;
}

.character-card__action {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.character-card__action:hover {
  background: #f3f4f6;
}

.character-card__action--danger:hover {
  background: #fee2e2;
}

.character-card__description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.character-card__traits {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.character-card__trait {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.character-card__trait--more {
  background: #e5e7eb;
  color: #6b7280;
  font-style: italic;
}

.character-card__section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.character-card__list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.character-card__list-item {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
  position: relative;
  padding-left: 12px;
}

.character-card__list-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #9ca3af;
}

.character-card__list-item--more {
  font-style: italic;
  color: #9ca3af;
}

.character-card__selected-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}
</style>
