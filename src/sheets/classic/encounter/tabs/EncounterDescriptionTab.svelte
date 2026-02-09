<script lang="ts">
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';

  const context = $derived(getGroupSheetClassicContext());
</script>

<div class="tab-right-column">
  <div class="tab-content">
    {#key context.actor.system.description.full}
      <article class="editor-container mt-3">
        <SheetEditorV2
          content={context.system.description.full}
          enriched={context.descriptionFullEnrichedHtml}
          field="system.description.full"
          editorOptions={{
            editable: context.editable,
          }}
          documentUuid={context.actor.uuid}
          manageSecrets={context.document.isOwner}
        />
      </article>
    {/key}
  </div>
</div>
