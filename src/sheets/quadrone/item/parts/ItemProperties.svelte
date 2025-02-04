<script lang="ts">
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { mapPropertiesToSave } from 'src/utils/system-properties';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);
</script>

{#each context.properties.options as property}
  {@const field = `system.properties.${property.value}`}
  <label for="" class="checkbox">
    <CheckboxQuadrone
      id="{appId}-properties-{property.value?.slugify()}"
      document={context.item}
      {field}
      checked={property.selected}
      disabled={!context.unlocked}
      disabledChecked={context.properties.object[property.value]}
      onDataPreparing={(ev) => mapPropertiesToSave(context, ev, property.value)}
    />
    {property.label}
  </label>
{/each}
