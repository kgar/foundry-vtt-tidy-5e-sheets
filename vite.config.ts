import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path, { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      src: path.resolve('./src'),
    },
  },
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
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      keep_classnames: true,
    },
  },
});
