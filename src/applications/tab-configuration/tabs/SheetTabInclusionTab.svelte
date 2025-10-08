<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TabConfigurationEntry from '../parts/TabConfigurationEntry.svelte';
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationQuadroneApplication,
  } from '../SheetTabConfigurationQuadroneApplication.svelte';

  interface Props {
    config: SheetTabConfigurationContext;
    title: string;
  }

  let { config, title }: Props = $props();
</script>

<h2>{title}</h2>
<TabConfigurationEntry bind:entry={config.entry} />
