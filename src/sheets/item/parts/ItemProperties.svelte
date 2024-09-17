<script lang="ts">
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { mapPropertiesToSave } from 'src/utils/system-properties';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

{#each $context.properties.options as property}
  {@const field = `system.properties.${property.value}`}
  {@const isEnchanted = $context.itemOverrides.has(field)}
  {@const enchantedTooltip = isEnchanted
    ? localize('DND5E.ENCHANTMENT.Warning.Override')
    : null}

  <Checkbox
    labelCssClass="checkbox"
    document={$context.item}
    {field}
    checked={property.selected}
    disabled={!$context.editable || isEnchanted}
    onDataPreparing={(ev) => mapPropertiesToSave($context, ev, property.value)}
    tooltip={enchantedTooltip}
  >
    {property.label}
  </Checkbox>
{/each}
