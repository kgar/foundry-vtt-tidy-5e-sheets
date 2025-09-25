import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'control-alt-shift',
    },
  },
  customElement: true,
  onwarn: (warning, handler) => {
    // Unless we're specifically doing work to resolve warnings, 
    // suppress all warnings during build. 
    // Every build results in flooding github actions with logs.
  }
};
