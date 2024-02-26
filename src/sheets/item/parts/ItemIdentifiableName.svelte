<script lang="ts">
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');
  const localize = FoundryAdapter.localize;
</script>

{#if $context.system.identified}
  <TextInput
    document={$context.item}
    field="name"
    value={$context.item.name}
    attributes={{ 'data-tidy-item-name': $context.item.name }}
    placeholder={localize('DND5E.ItemName')}
    disabled={!$context.editable}
  />
{:else}
  <TextInput
    document={$context.item}
    field="system.unidentified.name"
    value={$context.system.unidentified.name}
    attributes={{
      'data-tidy-item-name': $context.system.unidentified.name,
    }}
    placeholder={localize('DND5E.NameUnidentified')}
    disabled={!$context.editable}
  />
{/if}
