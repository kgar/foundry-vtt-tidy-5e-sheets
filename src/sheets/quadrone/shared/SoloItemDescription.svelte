<script lang="ts">
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
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
      manageSecrets={true}
      field={itemDescription.field}
      enriched={itemDescription.enriched}
    ></SheetEditorV2>
  {:else}
    <div class="editor" use:manageSecrets={{ document }}>
      <div data-field={itemDescription.field} class="user-select-text">
        {@html itemDescription.enriched}
      </div>
    </div>
  {/if}
{/key}
