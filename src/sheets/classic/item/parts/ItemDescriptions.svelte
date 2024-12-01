<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item.types';
  import { createEventDispatcher, getContext, onMount, tick } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';

  interface Props {
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
    renderDescriptions?: boolean;
  }

  let { renderDescriptions = true }: Props = $props();

  let editorsContainers: HTMLElement[] = $state([]);

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const dispatcher = createEventDispatcher<{
    edit: {
      contentToEdit: string;
      enrichedText: string;
      fieldToEdit: string;
    };
  }>();

  let accordionItemOpenStates = $state(
    $context.itemDescriptions.map((_, i) => i === 0),
  );

  function manageSecrets(node: HTMLElement) {
    if (!$context.item.isOwner) {
      return;
    }

    const secret = new HTMLSecret({
      parentSelector: `[data-edit]`,
      callbacks: {
        content: (secret: HTMLElement) =>
          foundry.utils.getProperty(
            $context.item,
            secret.closest<HTMLElement>('[data-edit]')!.dataset.edit,
          ),
        update: (secret: HTMLElement, content: string) =>
          $context.item.update({
            [secret.closest<HTMLElement>('[data-edit]')!.dataset.edit!]:
              content,
          }),
      },
    });

    queueMicrotask(() => {
      secret.bind(node);
    });
  }
</script>

{#if renderDescriptions}
  <div class="item-descriptions-container">
    <Accordion multiple>
      {#each $context.itemDescriptions as itemDescription, i (itemDescription.field)}
        {#key itemDescription.content}
          <div bind:this={editorsContainers[i]} use:manageSecrets>
            <AccordionItem
              bind:open={accordionItemOpenStates[i]}
              class="editor"
            >
              {#snippet header()}
                <span class="flex-1 flex-row justify-content-space-between">
                  {itemDescription.label}

                  {#if $context.editable}
                    <button
                      type="button"
                      class="inline-icon-button edit-item-description"
                      onclick={(event) => {
                        event.stopPropagation();
                        dispatcher('edit', {
                          contentToEdit: itemDescription.content,
                          enrichedText: itemDescription.enriched,
                          fieldToEdit: itemDescription.field,
                        });
                      }}
                      tabindex={$settingStore.useAccessibleKeyboardSupport
                        ? 0
                        : -1}><i class="fas fa-edit"></i></button
                    >
                  {/if}
                </span>
              {/snippet}
              <div
                data-edit={itemDescription.field}
                class="item-editor-descriptions-html-container user-select-text"
              >
                {@html itemDescription.enriched}
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
