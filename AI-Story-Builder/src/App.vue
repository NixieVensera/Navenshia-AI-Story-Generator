<script setup lang="ts">
// App component for AI Story Builder
</script>

<template>
  <div id="app">
    <nav class="app-nav">
      <div class="app-nav__content">
        <router-link to="/" class="app-nav__logo">
          🎲 AI Story Builder
        </router-link>

        <div class="app-nav__links">
          <router-link to="/" class="app-nav__link">Home</router-link>
          <router-link to="/generator" class="app-nav__link">Generator</router-link>
          <router-link to="/library" class="app-nav__link">Library</router-link>
        </div>
      </div>
    </nav>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f8fafc;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-nav__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.app-nav__logo {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-nav__logo:hover {
  color: #3b82f6;
}

.app-nav__links {
  display: flex;
  gap: 32px;
}

.app-nav__link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.app-nav__link:hover {
  color: #3b82f6;
}

.app-nav__link.router-link-active {
  color: #3b82f6;
}

.app-main {
  flex: 1;
}

@media (max-width: 768px) {
  .app-nav__content {
    padding: 0 16px;
  }

  .app-nav__links {
    gap: 16px;
  }

  .app-nav__logo {
    font-size: 20px;
  }
}
</style>
