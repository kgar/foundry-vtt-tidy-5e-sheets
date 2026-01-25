<script lang="ts">
  import ItemDescriptions from '../../shared/ItemDescriptions.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import SoloItemDescription from '../../shared/SoloItemDescription.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getContainerSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  // If the item isn't identified and you're not GM editing, show unidentified notice.
  let conceal = $derived(
    context.system.identified === false &&
      !FoundryAdapter.isInGmEditMode(context.document),
  );
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

{#if conceal}
  <span class="color-text-lightest">
    {localize('DND5E.Unidentified.Notice')}
  </span>
{/if}
