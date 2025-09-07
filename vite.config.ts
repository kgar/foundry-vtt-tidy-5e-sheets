import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path, { resolve } from 'path';

const s_PACKAGE_ID = 'modules/tidy5e-sheet';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/',
  base: `/${s_PACKAGE_ID}/`,
  publicDir: path.resolve(__dirname, 'public'),
  esbuild: {
    target: ['es2022'],
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
    keepNames: true,
  },
  server: {
    port: 30001,
    proxy: {
      // Serves static files from main Foundry server.
      [`^(/${s_PACKAGE_ID}/(assets|lang|packs|tidy5e-sheet.css))`]:
        'http://localhost:30000',

      // All other paths besides package ID path are served from main Foundry server.
      [`^(?!/${s_PACKAGE_ID}/)`]: 'http://localhost:30000',

      // Enable socket.io from main Foundry server.
      '/socket.io': { target: 'ws://localhost:30000', ws: true },
    },
  },
  resolve: {
    alias: {
      src: path.resolve('./src'),
    },
  },
  plugins: [svelte({ configFile: '../svelte.config.js' })],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    target: ['es2022'],
    lib: {
      entry: './main.svelte.ts',
      name: 'Tidy5e-Sheet-Kgar',
      fileName: 'tidy5e-sheet',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        globals: {
          svelte: 'svelte',
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
});
