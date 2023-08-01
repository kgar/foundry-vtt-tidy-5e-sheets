<script lang="ts">
  export let data: Record<string, unknown>;
  export let labelProp: string | null = null;

  function getLabel(value: unknown) {
    if (
      labelProp !== null &&
      value !== null &&
      typeof value === 'object' &&
      labelProp in value
    ) {
      return (value as Record<string, unknown>)[labelProp];
    }

    return value;
  }
</script>

{#each Object.entries(data) as [key, value]}
  <option value={key}>{getLabel(value)}</option>
{/each}
