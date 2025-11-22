<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getSheetContext());

  let unidentified = $derived(context.system.identified === false);
  let value = $derived(
    unidentified ? context.system.unidentified.name : context.name.editable,
  );
  let field = $derived(unidentified ? 'system.unidentified.name' : 'name');
</script>

<!-- Name -->
{#if context.unlocked}
  <TextInputQuadrone
    {field}
    document={context.item}
    {value}
    class="document-name"
    data-tooltip={context.item.name}
  />
{:else}
  <div class="document-name" data-tooltip={context.item.name}>
    {context.item.name}
  </div>
{/if}
