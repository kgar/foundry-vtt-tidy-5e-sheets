<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let data: Record<string, unknown>;
  export let valueProp: string | null = null;
  export let labelProp: string | null = null;
  export let blank: string | null = null;

  function getLabel(value: unknown): string {
    if (
      labelProp !== null &&
      value !== null &&
      typeof value === 'object' &&
      labelProp in value
    ) {
      return (value as Record<string, unknown>)[labelProp]?.toString() ?? '';
    }

    return value?.toString() ?? '';
  }

  function getValue(key: string, value: unknown): string {
    if (
      valueProp !== null &&
      value !== null &&
      typeof value === 'object' &&
      valueProp in value
    ) {
      return (value as Record<string, unknown>)[valueProp]?.toString() ?? '';
    }

    return key;
  }

  const localize = FoundryAdapter.localize;
</script>

{#if blank !== null}
  <option value="">{localize(blank)}</option>
{/if}
{#each Object.entries(data) as [key, value]}
  <option value={getValue(key, value)}>{localize(getLabel(value))}</option>
{/each}
