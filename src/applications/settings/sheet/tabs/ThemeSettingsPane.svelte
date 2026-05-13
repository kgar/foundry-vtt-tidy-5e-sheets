<script lang="ts">
  import ThemeSettingsQuadrone from 'src/applications/theme/ThemeSettingsQuadrone.svelte';
  import type { TidySheetSettingsQuadroneApplication } from '../TidySheetSettingsQuadroneApplication.svelte';

  interface Props {
    app: TidySheetSettingsQuadroneApplication;
  }

  let { app }: Props = $props();
</script>

<ThemeSettingsQuadrone
  app={app.themeChildApp}
  settings={app.themeChildApp._settings}
  placeholders={app.themePlaceholders}
/>
