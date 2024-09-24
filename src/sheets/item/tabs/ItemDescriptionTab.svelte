<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

{#key $context.item.system.description.value}
  <article class="editor-container">
    <SheetEditorV2
      content={$context.item.system.description.value}
      enriched={$context.enriched.description}
      field="system.description.value"
      editorOptions={{
        editable: $context.editable,
      }}
      documentUuid={$context.document.uuid}
    />
  </article>
{/key}
