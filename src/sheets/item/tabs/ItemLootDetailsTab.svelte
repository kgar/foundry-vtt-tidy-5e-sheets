<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemLootDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.ItemLootType')}
  field="system.type.value"
  let:inputId
>
  <Select
    id={inputId}
    document={$context.item}
    field="system.type.value"
    value={$context.system.type.value}
    disabled={!$context.owner}
  >
    <SelectOptions
      data={$context.config.lootTypes}
      labelProp="label"
      blank=""
    />
  </Select>
</ItemFormGroup>

{#if $context.lootSubtypes}
  {@const subTypeLabel = localize('DND5E.ItemLootSubtype', {
    category:
      $context.config.lootTypes[$context.system.type.value]?.label ?? '',
  })}
  <ItemFormGroup
    labelText={subTypeLabel}
    field="system.type.subtype"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.subtype"
      value={$context.system.type.subtype}
      disabled={!$context.owner}
    >
      <SelectOptions data={$context.lootSubtypes} blank="" />
    </Select>
  </ItemFormGroup>
{/if}
