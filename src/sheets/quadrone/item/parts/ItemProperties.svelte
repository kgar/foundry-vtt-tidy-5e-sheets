<script lang="ts">
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { mapPropertiesToSave } from 'src/utils/system-properties-quadrone';

  const context = $derived(getItemSheetContextQuadrone());

  const appId = $derived(context.document.id);

  const showReferences = $derived(
    SettingsProvider.settings.referenceTooltipProperty.get(),
  );
</script>

{#each context.properties.options as property}
  {const field = $derived(`system.properties.${property.value}`)}
  {const reference = $derived(
    showReferences
      ? CONFIG.DND5E.itemProperties[property.value]?.reference
      : undefined,
  )}
  <label
    class="checkbox"
    for="{appId}-properties-{property.value?.slugify()}"
    data-reference-tooltip={reference}
  >
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
