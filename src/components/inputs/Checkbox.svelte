<script lang="ts">
  import { buildDataset } from 'src/utils/data';

  export let value: number | null = null;
  export let checked: boolean = false;
  export let field: string;
  export let document: any;
  export let title: string | null = null;
  export let id: string | null = null;
  export let disabled: boolean | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let labelCssClass: string | null = null;
  export let checkboxCssClass: string | null = null;

  $: draftValue = value;
  $: datasetAttributes = buildDataset(dataset);

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    document.update({
      [field]: value ?? event.currentTarget.checked,
    });

    draftValue = value;
  }
</script>

<!-- TODO: Make label wrapper conditional when Svelte offers inline template component nodes -->
{#if $$slots.default}
  <label class={labelCssClass} {title}>
    <input
      type="checkbox"
      {id}
      bind:value={draftValue}
      {checked}
      on:change={saveChange}
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
    bind:value={draftValue}
    {checked}
    on:change={saveChange}
    {title}
    {disabled}
    {...datasetAttributes}
    class={checkboxCssClass}
  />
{/if}
