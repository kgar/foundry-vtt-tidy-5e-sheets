<script lang="ts">
  import type { PropertyEntry } from 'src/features/properties/properties.types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    showLabel?: boolean;
    showParenthetical?: boolean;
    prop: PropertyEntry | string;
    class?: ClassValue;
  }

  let {
    showLabel,
    showParenthetical,
    prop: property,
    class: cssClass = 'tag',
  }: Props = $props();
</script>

<span class={cssClass}>
  {#if typeof property === 'string'}
    <span class="value">{property}</span>
  {:else}
    {#if showLabel && property.label}
      <span class="label">{property.label}</span>
    {/if}
    <span class="value">{property.value}</span>
    {#if showParenthetical && property.parenthetical}
      <span class="parenthetical">({property.parenthetical})</span>
    {/if}
  {/if}
</span>
