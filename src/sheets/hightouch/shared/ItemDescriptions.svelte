<script lang="ts">
  import type { ItemDescription } from 'src/types/item.types';
  import CollapsibleEditorSection from './CollapsibleEditorSection.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  export let itemDescriptions: ItemDescription[];
  export let editing = false;
  export let document: any;

  let sectionItemOpenStates = itemDescriptions.map((_, i) => i === 0);
  let itemDescriptionToEdit: ItemDescription | undefined;

  function handleEdit(detail: {
    document: any;
    itemDescription: ItemDescription;
  }): void {
    itemDescriptionToEdit = detail.itemDescription;
    editing = true;
  }
</script>

<!-- Collapsible sections -->
{#if !editing}
  <section class="item-descriptions">
    {#each itemDescriptions as itemDescription, i (itemDescription.field)}
      <CollapsibleEditorSection
        {document}
        bind:expanded={sectionItemOpenStates[i]}
        {itemDescription}
        on:edit={(ev) => handleEdit(ev.detail)}
      />
    {/each}
  </section>
{:else if !!itemDescriptionToEdit}
  <SheetEditorV2
    documentUuid={document.uuid}
    content={itemDescriptionToEdit.content}
    editorOptions={{ toggled: false }}
    manageSecrets={true}
    field={itemDescriptionToEdit.field}
    enriched={itemDescriptionToEdit.enriched}
    on:save={() => (editing = false)}
  ></SheetEditorV2>
{/if}
