<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let appId = $derived($context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.ItemLootDetails')}</h3>

  <!-- Loot Type -->
  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.ItemLootType')}</label>
    <Select
      id="{appId}-type-value"
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
  </div>

  <!-- Loot Subtype -->
  {#if $context.itemSubtypes}
    {@const subtypeLabel = localize('DND5E.ItemLootSubtype', {
      category:
        // @ts-expect-error
        $context.config.lootTypes[$context.system.type.value]?.label ?? '',
    })}
    <div class="form-group">
      <label for="{appId}-type-subtype">{subtypeLabel}</label>
      <Select
        id="{appId}-type-subtype"
        document={$context.item}
        field="system.type.subtype"
        value={$context.source.type.subtype}
        disabled={!$context.editable}
        blankValue=""
      >
        <SelectOptions data={$context.itemSubtypes} blank="" />
      </Select>
    </div>
  {/if}

  <!-- Loot Properties -->
  <div class="form-group stacked loot-properties">
    <label for="">{localize('DND5E.ItemLootProperties')}</label>
    <ItemProperties />
  </div>
</ContentConcealer>
