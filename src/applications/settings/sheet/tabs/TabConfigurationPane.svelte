<script lang="ts">
  import SheetTabConfigurationQuadrone from 'src/applications/tab-configuration/SheetTabConfigurationQuadrone.svelte';
  import type { TidySheetSettingsQuadroneApplication } from '../TidySheetSettingsQuadroneApplication.svelte';

  interface Props {
    app: TidySheetSettingsQuadroneApplication;
  }

  let { app }: Props = $props();
</script>

<SheetTabConfigurationQuadrone
  app={app.tabConfigChildApp}
  config={app.tabConfigChildApp._config}
  title={app.tabConfigChildApp._inclusionTabTitle}
/>
