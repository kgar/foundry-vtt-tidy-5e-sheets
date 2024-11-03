<script lang="ts">
  import type { ItemDescription } from 'src/types/item.types';
  import CollapsibleEditorSection from './CollapsibleEditorSection.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  export let itemDescriptions: ItemDescription[];
  export let editing = false;
  export let document: any;

  let sectionItemOpenStates = itemDescriptions.map((_, i) => i === 0);
  let fieldToEdit: string = '';

  function handleEdit(detail: { document: any; field: string }): void {
    fieldToEdit = detail.field;
    editing = true;
  }

  $: contentToEdit = foundry.utils.getProperty(document, fieldToEdit);
</script>

<!-- Collapsible sections -->
{#if !editing}
  <section class="item-descriptions">
    {#each itemDescriptions as itemDescription, i (itemDescription.field)}
      <CollapsibleEditorSection
        {document}
        enriched={itemDescription.enriched}
        bind:expanded={sectionItemOpenStates[i]}
        field={itemDescription.field}
        title={itemDescription.label}
        on:edit={(ev) => handleEdit(ev.detail)}
      />
    {/each}
  </section>
{:else}
  <SheetEditorV2
    documentUuid={document.uuid}
    content={contentToEdit}
    editorOptions={{ toggled: false }}
    manageSecrets={true}
    field={fieldToEdit}
    on:save={() => (editing = false)}
  ></SheetEditorV2>
{/if}
