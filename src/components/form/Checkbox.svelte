<script lang="ts">
  import type { FoundryDocument } from 'src/types/document';
  import { buildDataset } from 'src/utils/data';

  export let value: number | null = null;
  export let checked: boolean = false;
  export let field: string;
  export let document: FoundryDocument;
  export let tooltip: string | null = null;
  export let id: string | null = null;
  export let disabled: boolean | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let labelCssClass: string | null = null;
  export let checkboxCssClass: string | null = null;

  $: datasetAttributes = buildDataset(dataset);

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    document.update({
      [field]: value ?? event.currentTarget.checked,
    });
  }
</script>

<!-- TODO: Make label wrapper conditional when Svelte offers inline template component nodes -->
{#if $$slots.default}
  <label class={labelCssClass}>
    <input
      type="checkbox"
      {id}
      {value}
      {checked}
      on:change={saveChange}
      data-tooltip={tooltip}
      {disabled}
      {...datasetAttributes}
      class={checkboxCssClass}
    />
    <slot />
  </label>
{:else}
  <input
    type="checkbox"
    {id}
    {value}
    {checked}
    on:change={saveChange}
    data-tooltip={tooltip}
    {disabled}
    {...datasetAttributes}
    class={checkboxCssClass}
  />
{/if}
