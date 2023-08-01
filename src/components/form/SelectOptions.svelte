<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let data: Record<string, unknown>;
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

  const localize = FoundryAdapter.localize;
</script>

{#if blank !== null}
  <option value="">{localize(blank)}</option>
{/if}
{#each Object.entries(data) as [key, value]}
  <option value={key}>{localize(getLabel(value))}</option>
{/each}
