<script lang="ts">
  import type { ComponentType } from 'svelte';
  import TextInput from '../inputs/TextInput.svelte';

  export let document: any;
  export let value: number;
  export let valueField: string;
  export let valueTitle: string | null = null;
  export let valueDisabled: boolean = false;
  export let max: number;
  export let maxField: string;
  export let maxTitle: string | null = null;
  export let maxDisabled: boolean = false;
  export let percentage: number | null = null;
  export let Bar: ComponentType | null = null;
</script>

<div class="resource-container">
  {#if Bar}
    <svelte:component this={Bar} {percentage} {value} {max} />
  {/if}
  {#if !valueDisabled}
    <TextInput
      class="resource-value"
      {document}
      field={valueField}
      {value}
      placeholder="0"
      title={valueTitle}
      selectOnFocus={true}
      allowDeltaChanges={true}
      maxlength={5}
      ariaDescribedBy="tooltip"
    />
  {:else}
    <span class="resource-value" title={valueTitle}>{value}</span>
  {/if}
  <span class="resource-separator">/</span>
  {#if !maxDisabled}
    <TextInput
      class="resource-max"
      {document}
      field={maxField}
      value={max}
      placeholder="0"
      title={maxTitle}
      selectOnFocus={true}
      allowDeltaChanges={true}
      maxlength={5}
      ariaDescribedBy="tooltip"
      disabled={maxDisabled}
    />
  {:else}
    <span class="resource-max" title={maxTitle}>{max}</span>
  {/if}
</div>

<style lang="scss">
  .resource-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--t5e-icon-background);
    box-shadow: 0 0 0.3125rem var(--t5e-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5e-icon-outline-color);
    width: inherit;
    height: inherit;
    font-family: inherit;
    font-weight: inherit;
    border-radius: inherit;

    :global(:not(.bar)) {
      position: relative;
    }

    :global(.resource-value) {
      text-align: right;
    }

    :global(.resource-max) {
      text-align: left;
    }

    :global(.resource-max),
    :global(.resource-value) {
      flex: 1 1 0;
    }
  }
</style>
