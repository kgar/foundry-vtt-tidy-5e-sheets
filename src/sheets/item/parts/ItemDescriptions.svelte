<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item.types';
  import { createEventDispatcher, getContext, tick } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';

  /**
   * When true, descriptions are rendered to the DOM; else, they are excluded.
   *
   * @remarks
   * This is a compatibility feature to allow for the singleton active editor
   * while preventing unwanted additional data saving from readonly editor content
   * which has compatibility tags allowing it to render secret buttons.
   *
   * When showing the active editor and when saving active editor changes,
   * readonly editors should not be in the form / DOM, else strange side effects occur.
   */
  export let renderDescriptions: boolean = true;

  let editorsContainers: HTMLElement[] = [];

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const dispatcher = createEventDispatcher<{
    edit: {
      valueToEdit: string;
      fieldToEdit: string;
    };
  }>();

  let accordionItemOpenStates = $context.itemDescriptions.map(
    (_, i) => i === 0,
  );
</script>

{#if renderDescriptions}
  <div class="item-descriptions-container">
    <Accordion multiple>
      {#each $context.itemDescriptions as itemDescription, i (itemDescription.field)}
        {#key itemDescription.content}
          <div bind:this={editorsContainers[i]}>
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
                      })}
                    tabindex={$settingStore.useAccessibleKeyboardSupport
                      ? 0
                      : -1}><i class="fas fa-edit" /></button
                  >
                {/if}
              </span>
              <div
                data-edit={itemDescription.field}
                class="item-editor-descriptions-html-container user-select-text"
              >
                {@html itemDescription.content}
              </div>
            </AccordionItem>
          </div>
        {/key}
      {/each}
    </Accordion>
  </div>
{/if}

<style lang="scss">
  .item-descriptions-container {
    padding-right: 0.3125rem;

    .edit-item-description {
      padding-left: 2rem;
      padding-right: 0.125rem;
    }
  }
</style>
