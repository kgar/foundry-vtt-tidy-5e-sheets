<script lang="ts">
  import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
  import TabVisibilityControls from './TabVisibilityControls.svelte';
  import SpecialTraitsV2 from 'src/applications-quadrone/special-traits/SpecialTraitsV2.svelte';
  import type { SpecialTraitsSettingsEditor } from '../../editors/special-traits-settings-editor.svelte';

  interface Props {
    app: SpecialTraitsSettingsEditor;
    tabConfigEntry?: TabConfigContextEntry;
    tabId?: string;
  }

  let { app = $bindable(), tabConfigEntry = $bindable(), tabId }: Props = $props();
</script>

<div class="dialog-content-container flexcol">
  <SpecialTraitsV2 actor={app.document} bind:config={app.value} />

  {#if tabConfigEntry && tabId}
    <TabVisibilityControls bind:entry={tabConfigEntry} {tabId} />
  {/if}
</div>
