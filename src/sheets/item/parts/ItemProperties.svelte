<script lang="ts">
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { mapPropertiesToSave } from 'src/utils/system-properties';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

  $: properties = Object.entries<any>($context.properties);
</script>

{#each properties as [key, property]}
  <Checkbox
    labelCssClass="checkbox"
    document={$context.item}
    field="system.properties.{key}"
    checked={property.selected}
    disabled={!$context.editable}
    onDataPreparing={(ev) => mapPropertiesToSave($context.properties, ev, key)}
  >
    {property.label}
  </Checkbox>
{/each}
