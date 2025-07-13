<template>
  <div class="generator-view">
    <StoryGenerator />
  </div>
</template>

<script setup lang="ts">
import StoryGenerator from '../components/story/StoryGenerator.vue'
</script>

<style scoped>
.generator-view {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
