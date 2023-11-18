<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';
  import OpenSheetEditor from 'src/components/editor/OpenSheetEditor.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function onEditorActivation(node: HTMLElement) {
    if (editorIsActive) {
      editing = false;
      editorIsActive = false;
      return;
    }

    $context.activateFoundryJQueryListeners(node);
    editorIsActive = true;
  }

  let editing = false;
  let editorIsActive = false;
  let valueToEdit: string;
  let fieldToEdit: string;

  function edit(value: string, field: string) {
    valueToEdit = value;
    fieldToEdit = field;
    editing = true;
  }

  let accordionItemOpenStates = $context.itemDescriptions.map(
    (_, i) => i === 0
  );
</script>

<div class="item-descriptions-container">
  <Accordion multiple class={editing ? 'hidden' : ''}>
    {#each $context.itemDescriptions as itemDescription, i (itemDescription.field)}
      <AccordionItem bind:open={accordionItemOpenStates[i]}>
        <span
          slot="header"
          class="flex-1 flex-row justify-content-space-between"
        >
          {itemDescription.label}

          {#if $context.owner}
            <button
              type="button"
              class="inline-icon-button edit-item-description"
              on:click|stopPropagation={() =>
                edit(itemDescription.content, itemDescription.field)}
              ><i class="fas fa-edit" /></button
            >
          {/if}
        </span>
        {@html itemDescription.content}
      </AccordionItem>
    {/each}
  </Accordion>

  {#if editing}
    <RerenderAfterFormSubmission andOnValueChange={valueToEdit}>
      <article class="editor-container" use:onEditorActivation>
        <OpenSheetEditor content={valueToEdit} target={fieldToEdit} />
      </article>
    </RerenderAfterFormSubmission>
  {/if}
</div>

<style lang="scss">
  .item-descriptions-container {
    padding-right: 0.3125rem;

    .edit-item-description {
      padding-left: 2rem;
      padding-right: 0.125rem;
    }
  }
</style>
