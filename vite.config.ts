import { defineConfig, PluginOption } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path, { resolve } from 'path';

const s_PACKAGE_ID = 'modules/tidy5e-sheet';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    svelte({ configFile: '../svelte.config.js' }),
  ];

  if (mode === 'development') {
    plugins.push(getViteCssLayerInjectorPlugin(), getViewLessLayerWrapper());
  }

  return {
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
    plugins,
    build: {
      cssCodeSplit: true,
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      target: ['es2022'],
      lib: {
        entry: './main.svelte.ts',
        name: 'Tidy5e-Sheet-Kgar',
        fileName: 'tidy5e-sheet',
        formats: ['es'],
      },
      rolldownOptions: {
        output: {
          globals: {
            svelte: 'svelte',
          },
          keepNames: true,
        },
      },
      sourcemap: true,
      minify: 'esbuild',
    },
  };
});

/**
 * @returns A vite plugin that ensures CSS `@imports` with no specified layer 
 *          are given the "modules" layer, and the remainder (when it doesn't have any layer
 *          specifications) is wrapped with the modules layer.
 */
function getViteCssLayerInjectorPlugin(): PluginOption {
  return {
    name: 'vite-css-layer-injector',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.css')) {
        return;
      }

      // Extract all @import rules
      const importRegex = /@import\s+(['"][^'"]+['"])([^;]*);/g;

      let imports: { full: string; path: string; rest: string }[] = [];

      let remainder = code
        .replace(importRegex, (full, path, rest) => {
          imports.push({ full, path, rest });
          return ''; // remove import from remainder
        })
        .trim();

      // Rewrite imports to include layer(modules) if missing
      const rewrittenImports = imports.map(({ full, path, rest }) => {
        if (/layer\s*\(/.test(rest)) {
          return full; // already has a layer(...)
        }
        return `@import ${path} layer(modules);`;
      });

      // If there are no imports at all, wrap whole file
      if (imports.length === 0) {
        return {
          code: `@layer modules {\n${code}\n}`,
          map: null,
        };
      }

      // If imports exist but remainder is empty, only rewrite imports
      if (remainder.length === 0) {
        return {
          code: rewrittenImports.join('\n'),
          map: null,
        };
      }

      // If imports exist and remainder exists, rejoin them all.
      // Wrap the remainder in the modules layer if layering is not already being used.
      const effectiveRemainder = remainder.includes('@layer')
        ? remainder
        : `@layer modules {\n${remainder}\n}`;

      return {
        code: rewrittenImports.join('\n') + '\n' + effectiveRemainder,
        map: null,
      };
    },
  };
}

/**
 * @returns A vite plugin that wrapps LESS files with no specified `@layer` with
 *          the Foundry modules layer.
 */
function getViewLessLayerWrapper(): PluginOption {
  return {
    name: 'vite-less-layer-wrapper',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.less') || code.includes('@layer')) {
        return;
      }

      return {
        code: `@layer modules {\n${code}\n}`,
        map: null,
      };
    },
  };
}
