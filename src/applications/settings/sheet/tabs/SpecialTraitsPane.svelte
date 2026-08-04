<script lang="ts">
  import type { TabConfigContextEntry } from 'src/settings/editors/shared/tab-configuration.types';
  import TabVisibilityControls from './TabVisibilityControls.svelte';
  import SpecialTraitsV2 from 'src/applications/settings/special-traits/SpecialTraitsV2.svelte';
  import type { SpecialTraitsSettingsEditor } from 'src/settings/editors/special-traits-settings-editor.svelte';

  interface Props {
    settingsEditor: SpecialTraitsSettingsEditor;
    tabConfigEntry?: TabConfigContextEntry;
    tabId?: string;
  }

  let {
    settingsEditor,
    tabConfigEntry = $bindable(),
    tabId,
  }: Props = $props();
</script>

<div class="dialog-content-container flexcol">
  <SpecialTraitsV2
    actor={settingsEditor.document}
    config={settingsEditor.value}
  />

  {#if tabConfigEntry && tabId}
    <TabVisibilityControls bind:entry={tabConfigEntry} {tabId} />
  {/if}
</div>
