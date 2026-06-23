<script lang="ts">
  import type { SheetTabsConfigurationSettingsEditor } from 'src/settings/editors/sheet-tabs-configuration-settings-editor.svelte';
  import TabConfigurationSortableListbox from './parts/TabConfigurationSortableListbox.svelte';

  interface Props {
    app: SheetTabsConfigurationSettingsEditor;
  }

  let { app }: Props = $props();

  const config = $derived(app.value);
  const title = $derived(app.inclusionTabTitle);
</script>

<div class="dialog-content-container sheet-tab-configuration flexcol">
  <h2>{title}</h2>
  <TabConfigurationSortableListbox tabConfigEntry={config.entry} />
</div>
