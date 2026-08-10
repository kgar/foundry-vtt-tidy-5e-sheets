<script lang="ts">
  import type { SheetTabsConfigurationSettingsEditor } from 'src/settings/editors/sheet-tabs-configuration-settings-editor.svelte';
  import { CONSTANTS } from 'src/constants';
  import CharacterSidebarTabConfigurationPanel from './CharacterSidebarTabConfigurationPanel.svelte';
  import TabConfigurationSortableListbox from './parts/TabConfigurationSortableListbox.svelte';

  interface Props {
    app: SheetTabsConfigurationSettingsEditor;
  }

  let { app }: Props = $props();

  const config = $derived(app.value);
  const title = $derived(app.inclusionTabTitle);

  const isCharacterSidebarConfig = $derived(
    config.entry.docTypeKeyOverride ===
      CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
  );
</script>

<div class="dialog-content-container flexcol">
  <h2>{title}</h2>

  {#if isCharacterSidebarConfig}
    <CharacterSidebarTabConfigurationPanel tabConfigEntry={config.entry} />
  {:else}
    <TabConfigurationSortableListbox tabConfigEntry={config.entry} />
  {/if}
</div>
