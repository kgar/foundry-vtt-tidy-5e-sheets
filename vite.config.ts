import { defineConfig, PluginOption } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path, { resolve } from 'path';
import * as fs from 'fs';

const s_PACKAGE_ID = 'modules/tidy5e-sheet';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    svelte({ configFile: '../svelte.config.js' }),
    getVitePreloadedImagesPlugin(),
  ];

  if (mode === 'development') {
    plugins.push(getViteCssLayerInjectorPlugin());
  }

  return {
    root: 'src/',
    base: `/${s_PACKAGE_ID}/`,
    publicDir: path.resolve(import.meta.dirname, 'public'),
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
      outDir: path.resolve(import.meta.dirname, 'dist'),
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
 * @returns `virtual:preloaded-images` - Preloads a list of every image path
 *          referenced in src in the Vite build so the sheet can preload them.
 */
function getVitePreloadedImagesPlugin(): PluginOption {
  const moduleId = 'virtual:preloaded-images';
  const resolvedModuleId = '\0' + moduleId;
  const scanExtensions = new Set(['.css', '.svelte', '.ts', '.hbs']);
  const imageReference =
    /modules\/tidy5e-sheet\/images\/[\w\-./]+\.(?:webp|png|jpe?g|svg|gif|avif)/gi;

  function collectFiles(dir: string, files: string[] = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectFiles(fullPath, files);
      } else if (scanExtensions.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  return {
    name: 'vite-preloaded-images',
    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
    },
    load(id) {
      if (id !== resolvedModuleId) {
        return;
      }

      const images = new Set<string>();
      for (const file of collectFiles(path.resolve(import.meta.dirname, 'src'))) {
        const matches = fs.readFileSync(file, 'utf-8').match(imageReference);
        matches?.forEach((match) => images.add(match));
      }

      return `export const PRELOADED_IMAGE_PATHS = ${JSON.stringify([...images].sort())};`;
    },
  };
}

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
