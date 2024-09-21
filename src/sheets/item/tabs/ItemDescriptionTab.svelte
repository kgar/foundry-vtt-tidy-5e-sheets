<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

{#key $context.item.system.description.value}
  <article class="editor-container">
    <!-- use:$context.activateEditors -->
    <h2 class="details-headline">{localize('TIDY5E.ItemDetailsHeadline')}</h2>
    <SheetEditorV2
      content={$context.enriched.description}
      enriched={$context.descriptionFullEnrichedHtml}
      field="system.description.value"
      editorOptions={{
        editable: $context.editable,
      }}
      documentUuid={$context.document.uuid}
    />
  </article>
{/key}
