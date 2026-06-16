<script lang="ts">
  import type {
    SheetTabConfigurationSettingsEditor,
  } from 'src/settings/editors/sheet-tab-configuration-settings-editor.svelte';
  import SortableListbox from './parts/SortableListbox.svelte';

  interface Props {
    app: SheetTabConfigurationSettingsEditor;
  }

  let { app }: Props = $props();

  const config = $derived(app.value);
  const title = $derived(app.inclusionTabTitle);
</script>

<div class="dialog-content-container sheet-tab-configuration flexcol">
  <h2>{title}</h2>
  <SortableListbox bind:tabConfigContext={config.entry} />
</div>
