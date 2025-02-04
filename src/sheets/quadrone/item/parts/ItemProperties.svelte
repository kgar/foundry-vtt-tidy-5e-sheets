<script lang="ts">
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { mapPropertiesToSave } from 'src/utils/system-properties';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

{#each context.properties.options as property}
  {@const field = `system.properties.${property.value}`}
  {@const isEnchanted = context.itemOverrides.has(field)}
  {@const enchantedTooltip = isEnchanted
    ? localize('DND5E.ENCHANTMENT.Warning.Override')
    : null}

  <Checkbox
    id="{appId}-properties-{property.value?.slugify()}"
    labelCssClass="checkbox"
    document={context.item}
    {field}
    checked={property.selected}
    disabled={!context.editable || isEnchanted}
    onDataPreparing={(ev) => mapPropertiesToSave(context, ev, property.value)}
    tooltip={enchantedTooltip}
  >
    {property.label}
  </Checkbox>
{/each}
