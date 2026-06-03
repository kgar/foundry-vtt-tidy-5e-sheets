<script lang="ts">
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationQuadroneApplication,
  } from './SheetTabConfigurationQuadroneApplication.svelte';
  import SortableListbox from './parts/SortableListbox.svelte';

  interface Props {
    app: SheetTabConfigurationQuadroneApplication;
    config: SheetTabConfigurationContext;
    title: string;
  }

  let { config, title }: Props = $props();
</script>

<div class="dialog-content-container sheet-tab-configuration flexcol">
  <h2>{title}</h2>
  <SortableListbox entry={config.entry} />
</div>
