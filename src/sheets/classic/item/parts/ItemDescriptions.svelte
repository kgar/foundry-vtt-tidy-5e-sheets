<script lang="ts">
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

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
    onEdit?: (detail: {
      contentToEdit: string;
      enrichedText: string;
      fieldToEdit: string;
    }) => void;
  }

  let { renderDescriptions = true, onEdit }: Props = $props();

  let context = $derived(getItemSheetContext());

  let accordionItemOpenStates = $state<boolean[]>([]);

  $effect(() => {
    if (context.itemDescriptions.length !== accordionItemOpenStates.length) {
      accordionItemOpenStates = context.itemDescriptions.map(
        (_, i) => accordionItemOpenStates[i] ?? i === 0,
      );
    }
  });

  function manageSecrets(node: HTMLElement) {
    if (!context.item.isOwner) {
      return;
    }

    const secret = new foundry.applications.ux.HTMLSecret({
      parentSelector: `[data-field]`,
      callbacks: {
        content: (secret: HTMLElement) =>
          foundry.utils.getProperty(
            context.item.toObject(),
            secret.closest<HTMLElement>('[data-field]')!.dataset.field,
          ),
        update: (secret: HTMLElement, content: string) =>
          context.item.update({
            [secret.closest<HTMLElement>('[data-field]')!.dataset.field!]:
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
    <Accordion>
      {#each accordionItemOpenStates, i}
        {@const itemDescription = context.itemDescriptions[i]}
        {#key itemDescription.content}
          <div use:manageSecrets>
            <AccordionItem
              bind:open={accordionItemOpenStates[i]}
              class="editor"
            >
              {#snippet header()}
                <span class="flex-1 flex-row justify-content-space-between">
                  {itemDescription.label}

                  {#if context.editable}
                    <button
                      type="button"
                      class="inline-icon-button edit-item-description"
                      onclick={(event) => {
                        event.stopPropagation();
                        onEdit?.({
                          contentToEdit: itemDescription.content,
                          enrichedText: itemDescription.enriched,
                          fieldToEdit: itemDescription.field,
                        });
                      }}
                      tabindex={settings.value.useAccessibleKeyboardSupport
                        ? 0
                        : -1}><i class="fas fa-feather"></i></button
                    >
                  {/if}
                </span>
              {/snippet}
              <div
                data-field={itemDescription.field}
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

<style lang="less">
  .item-descriptions-container {
    padding-right: 0.3125rem;

    .edit-item-description {
      padding-left: 2rem;
      padding-right: 0.125rem;
    }
  }
</style>
