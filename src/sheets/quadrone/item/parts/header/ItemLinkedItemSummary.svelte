<script lang="ts">
  import { Enrichers } from 'src/features/enrichers/Enrichers';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    linked: Item5e;
  }

  let { linked }: Props = $props();
</script>

{#if linked}
  {#await FoundryAdapter.enrichHtml(Enrichers.reference(linked.uuid, linked.name)) then enriched}
    {@html enriched}
  {/await}
{/if}
