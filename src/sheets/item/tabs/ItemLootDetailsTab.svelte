<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.ItemLootDetails')}</h3>

  <!-- Loot Type -->
  <ItemFormGroup
    labelText={localize('DND5E.ItemLootType')}
    field="system.type.value"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.value"
      value={$context.source.type.value}
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.lootTypes}
        labelProp="label"
        blank=""
      />
    </Select>
  </ItemFormGroup>

  <!-- Loot Subtype -->
  {#if $context.itemSubtypes}
    {@const subtypeLabel = localize('DND5E.ItemLootSubtype', {
      category:
        // @ts-expect-error 
        $context.config.lootTypes[$context.system.type.value]?.label ?? '',
    })}
    <ItemFormGroup
      labelText={subtypeLabel}
      field="system.type.subtype"
      let:inputId
    >
      <Select
        id={inputId}
        document={$context.item}
        field="system.type.subtype"
        value={$context.source.type.subtype}
        disabled={!$context.editable}
        blankValue=""
      >
        <SelectOptions data={$context.itemSubtypes} blank="" />
      </Select>
    </ItemFormGroup>
  {/if}

  <!-- Loot Properties -->
  <ItemFormGroup
    cssClass="stacked loot-properties"
    labelText={localize('DND5E.ItemLootProperties')}
  >
    <ItemProperties />
  </ItemFormGroup>
</ContentConcealer>
