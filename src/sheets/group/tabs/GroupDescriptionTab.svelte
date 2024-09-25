<script lang="ts">
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div
  class="flex-1 full-height flex-column me-1"
>
  {#key $context.actor.system.description.full}
    <article class="editor-container mt-3">
      <SheetEditorV2
        content={$context.system.description.full}
        enriched={$context.descriptionFullEnrichedHtml}
        field="system.description.full"
        editorOptions={{
          editable: $context.editable,
        }}
        documentUuid={$context.actor.uuid}
        manageSecrets={$context.document.isOwner}
      />
    </article>
  {/key}
</div>