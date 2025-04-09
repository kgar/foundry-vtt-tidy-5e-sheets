<script lang="ts">
  import ItemDescriptions from '../../shared/ItemDescriptions.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import SoloItemDescription from '../../shared/SoloItemDescription.svelte';

  let context = $derived(getContainerSheetQuadroneContext());
</script>

{#if context.itemDescriptions.length === 1}
  <SoloItemDescription
    document={context.document}
    itemDescription={context.itemDescriptions[0]}
    unlocked={context.unlocked}
  />
{:else}
  <ItemDescriptions
    document={context.document}
    itemDescriptions={context.itemDescriptions}
  />
{/if}
