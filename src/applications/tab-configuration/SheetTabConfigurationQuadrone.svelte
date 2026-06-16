<script lang="ts">
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationSettingsEditor,
  } from 'src/settings/editors/sheet-tab-configuration-settings-editor.svelte';
  import SortableListbox from './parts/SortableListbox.svelte';

  interface Props {
    app: SheetTabConfigurationSettingsEditor;
    config: SheetTabConfigurationContext;
    title: string;
  }

  let { config = $bindable(), title }: Props = $props();
</script>

<div class="dialog-content-container sheet-tab-configuration flexcol">
  <h2>{title}</h2>
  <SortableListbox bind:tabConfigContext={config.entry} />
</div>
