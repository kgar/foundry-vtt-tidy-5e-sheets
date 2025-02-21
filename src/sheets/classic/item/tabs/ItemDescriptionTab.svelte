<script lang="ts">
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ItemDescriptions from '../parts/ItemDescriptions.svelte';
  import type {
    ContainerSheetClassicContext,
    ItemSheetContext,
  } from 'src/types/item.types';

  let context =
    $derived(
      getSheetContext<ItemSheetContext | ContainerSheetClassicContext>(),
    );

  let editing = $state(false);
  let contentToEdit: string = $state('');
  let enrichedText: string = $state('');
  let fieldToEdit: string = $state('');

  function stopEditing() {
    editing = false;
  }

  function edit(value: string, enriched: string, field: string) {
    contentToEdit = value;
    fieldToEdit = field;
    enrichedText = enriched;
    editing = true;
  }
</script>

<ItemDescriptions
  onEdit={(detail) =>
    edit(detail.contentToEdit, detail.enrichedText, detail.fieldToEdit)}
  renderDescriptions={!editing}
/>

{#if editing}
  {#key contentToEdit}
    <article class="editor-container">
      <SheetEditorV2
        enriched={enrichedText}
        content={contentToEdit}
        field={fieldToEdit}
        editorOptions={{
          editable: context.editable,
          toggled: false,
        }}
        documentUuid={context.item.uuid}
        onSave={() => stopEditing()}
        manageSecrets={context.document.isOwner}
      />
    </article>
  {/key}
{/if}
