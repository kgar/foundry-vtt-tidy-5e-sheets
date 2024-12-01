<script lang="ts">
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let appId = $derived($context.document.id);

  const localize = FoundryAdapter.localize;
</script>

{#if $context.system.identified}
  <TextInput
    id="{appId}-name"
    document={$context.item}
    field="name"
    value={$context.item.name}
    attributes={{ 'data-tidy-item-name': $context.item.name }}
    placeholder={localize('DND5E.ItemName')}
    disabled={!$context.editable}
    title={$context.item.name}
  />
{:else}
  <TextInput
    id="{appId}-name"
    document={$context.item}
    field="system.unidentified.name"
    value={$context.system.unidentified.name}
    attributes={{
      'data-tidy-item-name': $context.system.unidentified.name,
    }}
    placeholder={localize('DND5E.NameUnidentified')}
    disabled={!$context.editable}
    title={$context.identifiedName}
  />
{/if}
