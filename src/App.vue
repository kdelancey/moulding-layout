<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-title>Wainscot Layout Designer</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer app color="primary" class="text-center">
      <span class="text-white">Wainscot Layout Designer - A tool for visualizing wainscoting layouts</span>
    </v-footer>
  </v-app>
</template>

<style>
:root {
  --color-background: #f8f8f8;
  --color-text: #333;
  --color-primary: hsl(272, 76%, 31%);
  --color-secondary: hsl(267, 56%, 40%);
  --color-border: #ddd;
  --color-accent: #d2b48c;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: normal;
}

html, body {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

body {
  color: var(--color-text);
  background: var(--color-background);
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  width: 100%;
}

h1 {
  font-size: 1.8rem;
  font-weight: 600;
}
</style>
