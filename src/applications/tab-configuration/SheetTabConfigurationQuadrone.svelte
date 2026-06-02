<script lang="ts">
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationQuadroneApplication,
  } from './SheetTabConfigurationQuadroneApplication.svelte';
  import TabSelectionList from './parts/TabSelectionList.svelte';

  interface Props {
    app: SheetTabConfigurationQuadroneApplication;
    config: SheetTabConfigurationContext;
    title: string;
  }

  let { config, title }: Props = $props();
</script>

<div class="dialog-content-container sheet-tab-configuration flexcol">
  <h2>{title}</h2>
  <!-- TabSelectionList rebuilds its rows when config.entry is replaced
       (Undo / Use Global Defaults); in-place edits keep the same entry. -->
  <TabSelectionList entry={config.entry} />
</div>
