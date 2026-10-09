<script lang="ts">
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { ItemDescription } from 'src/types/item.types';

  interface Props {
    itemDescription: ItemDescription;
    document: any;
    unlocked: boolean;
    disabled?: boolean;
  }

  let { itemDescription, document, unlocked, disabled }: Props = $props();
</script>

{#key itemDescription.enriched}
  {#if unlocked && !disabled}
    <SheetEditorV2
      documentUuid={document.uuid}
      content={itemDescription.content}
      editorOptions={{ toggled: false }}
      field={itemDescription.field}
      enriched={itemDescription.enriched}
    ></SheetEditorV2>
  {:else}
    <div
      class="editor"
      data-prop={itemDescription.field}
      data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
    >
      <div data-target={itemDescription.field} class="user-select-text">
        {@html itemDescription.enriched}
      </div>
    </div>
  {/if}
{/key}
