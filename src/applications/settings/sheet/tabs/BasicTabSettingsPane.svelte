<script lang="ts">
  import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
  import TabVisibilityControls from './TabVisibilityControls.svelte';

  interface Props {
    title: string;
    tabId: string;
    tabConfigEntry: TabConfigContextEntry;
  }

  let { title, tabId, tabConfigEntry = $bindable() }: Props = $props();
</script>

<div class="dialog-content-container flexcol">
  <h2>{title}</h2>
  <TabVisibilityControls bind:entry={tabConfigEntry} {tabId} />
</div>