<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import { createEventDispatcher, getContext, tick } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const dispatcher = createEventDispatcher<{
    edit: {
      valueToEdit: string;
      fieldToEdit: string;
    };
  }>();

  let accordionItemOpenStates = $context.itemDescriptions.map(
    (_, i) => i === 0,
  );

  function activateCoreJqueryListeners(node: HTMLElement): any {
    $context.activateFoundryJQueryListeners(node);
  }

  async function activateCoreJqueryListenersAsync(node: HTMLElement) {
    await tick();
    activateCoreJqueryListeners(node);
  }

  let editorsContainers: HTMLElement[] = [];
</script>

<div class="item-descriptions-container">
  <Accordion multiple>
    {#each $context.itemDescriptions as itemDescription, i (itemDescription.field)}
      {#key itemDescription.content}
        <div bind:this={editorsContainers[i]} use:activateCoreJqueryListeners>
          <AccordionItem
            bind:open={accordionItemOpenStates[i]}
            class="editor"
          >
            <span
              slot="header"
              class="flex-1 flex-row justify-content-space-between"
            >
              {itemDescription.label}

              {#if $context.editable}
                <button
                  type="button"
                  class="inline-icon-button edit-item-description"
                  on:click|stopPropagation={() =>
                    dispatcher('edit', {
                      valueToEdit: itemDescription.content,
                      fieldToEdit: itemDescription.field,
                    })}><i class="fas fa-edit" /></button
                >
              {/if}
            </span>
            <div data-edit={itemDescription.field}>
              {@html itemDescription.content}
            </div>
          </AccordionItem>
        </div>
      {/key}
    {/each}
  </Accordion>
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
