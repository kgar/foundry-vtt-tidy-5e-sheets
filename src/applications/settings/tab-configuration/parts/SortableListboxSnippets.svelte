<script module lang="ts">
  export const listboxSnippets = { primaryHeader };
</script>

{#snippet primaryHeader(key: string, label: string)}
  <span
    data-section-key={key}
    data-testid="sortable-listbox-item-label"
    class="sortable-listbox-item-label font-label-medium">{label}</span
  >
{/snippet}
