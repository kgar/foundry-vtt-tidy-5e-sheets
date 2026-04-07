<script lang="ts">
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import type { ItemDescription } from 'src/types/item.types';

  interface Props {
    itemDescription: ItemDescription;
    document: any;
    unlocked: boolean;
  }

  let { itemDescription, document, unlocked }: Props = $props();
</script>

{#key itemDescription.enriched}
  {#if unlocked}
    <SheetEditorV2
      documentUuid={document.uuid}
      content={itemDescription.content}
      editorOptions={{ toggled: false }}
      field={itemDescription.field}
      enriched={itemDescription.enriched}
    ></SheetEditorV2>
  {:else}
    <div class="editor">
      <div data-target={itemDescription.field} class="user-select-text">
        {@html itemDescription.enriched}
      </div>
    </div>
  {/if}
{/key}
