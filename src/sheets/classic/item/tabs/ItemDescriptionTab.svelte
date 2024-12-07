<script lang="ts">
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = getItemSheetContext();
</script>

{#key context.item.system.description.value}
  <article class="editor-container">
    <SheetEditorV2
      content={context.item.system.description.value}
      enriched={context.enriched.description}
      field="system.description.value"
      editorOptions={{
        editable: context.editable,
      }}
      documentUuid={context.document.uuid}
      manageSecrets={context.document.isOwner}
    />
  </article>
{/key}
