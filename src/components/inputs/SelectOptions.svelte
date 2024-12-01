<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    data: Record<string, unknown> | Record<string, unknown>[];
    valueProp?: string | null;
    labelProp?: string | null;
    blank?: string | null;
  }

  let {
    data,
    valueProp = null,
    labelProp = null,
    blank = null,
  }: Props = $props();

  let entries = $derived(Object.entries<any>(data));

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

  // Apply optional grouping
  let groups = $derived(FoundryAdapter.groupSelectOptions(entries));

  const localize = FoundryAdapter.localize;
</script>

{#if blank !== null}
  <option value="">{localize(blank)}</option>
{/if}

{#each groups as [groupKey, groupValue] (groupKey)}
  <!-- When Svelte 5, snippets -->
  {#if groupKey === ''}
    {#each groupValue as [key, value]}
      {#if value?.rule}
        <hr />
      {:else}
        <option value={getValue(key, value)}>{localize(getLabel(value))}</option
        >
      {/if}
    {/each}
  {:else}
    <optgroup label={localize(groupKey)}>
      {#each groupValue as [key, value]}
        {#if value?.rule}
          <hr />
        {:else}
          <option value={getValue(key, value)}
            >{localize(getLabel(value))}</option
          >
        {/if}
      {/each}
    </optgroup>
  {/if}
{/each}
