import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'Tidy5e-Sheet-Kgar',
      fileName: 'main',
    },
    rollupOptions: {
      output: {
        globals: {
          svelte: 'svelte',
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      keep_classnames: true,
    },
  },
});
