<script lang="ts">
  import type { ItemDescription } from 'src/types/item.types';
  import CollapsibleEditorSection from './CollapsibleEditorSection.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  interface Props {
    itemDescriptions: ItemDescription[];
    editing?: boolean;
    document: any;
  }

  let {
    itemDescriptions,
    editing = $bindable(false),
    document,
  }: Props = $props();

  let sectionItemOpenStates = $state(itemDescriptions.map((_, i) => i === 0));
  let itemDescriptionToEdit: ItemDescription | undefined = $state();

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
        onEdit={(detail) => handleEdit(detail)}
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
    onSave={() => (editing = false)}
  ></SheetEditorV2>
{/if}
