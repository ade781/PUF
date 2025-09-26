import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Vite configuration for the birthday website
export default defineConfig({
  plugins: [svelte()],
});