import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path, { resolve } from 'path';

const s_PACKAGE_ID = 'modules/tidy5e-sheet-kgar';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/',
  base: `/${s_PACKAGE_ID}/`,
  publicDir: path.resolve(__dirname, 'public'),
  esbuild: {
    target: ['es2022'],
  },
  server: {
    port: 30001,
    open: '/game',
    proxy: {
      // Serves static files from main Foundry server.
      [`^(/${s_PACKAGE_ID}/(style.css))`]: {
        target: 'http://localhost:30000',
        selfHandleResponse: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (_, __, res) => {
            res.end(`/* O HAI Tidy 5e Dev 🙋‍♂️ */`);
          });
        },
      },

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
      entry: './main.ts',
      name: 'Tidy5e-Sheet-Kgar',
      fileName: 'main',
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
    minify: 'terser',
    terserOptions: {
      mangle: {
        toplevel: true,
        keep_classnames: true,
      },
      ecma: 2020,
      module: true,
    },
  },
});
