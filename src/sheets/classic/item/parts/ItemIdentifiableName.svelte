<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

{#if context.system.identified}
  <TextInput
    id="{appId}-name"
    document={context.item}
    field="name"
    value={context.item.name}
    attributes={{ 'data-tidy-item-name': context.item.name }}
    placeholder={localize('DND5E.ItemName')}
    disabled={!context.editable}
    title={context.item.name}
  />
{:else}
  <TextInput
    id="{appId}-name"
    document={context.item}
    field="system.unidentified.name"
    value={context.system.unidentified.name}
    attributes={{
      'data-tidy-item-name': context.system.unidentified.name,
    }}
    placeholder={localize('DND5E.NameUnidentified')}
    disabled={!context.editable}
    title={context.identifiedName}
  />
{/if}
