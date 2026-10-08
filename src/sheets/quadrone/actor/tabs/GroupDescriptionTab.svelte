<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let editing = $state(false);
  let contentToEdit: string = $state('');
  let enrichedText: string = $state('');
  let fieldToEdit: string = $state('');

  async function stopEditing() {
    editing = false;
  }

  function edit(value: string, enriched: string, field: string) {
    contentToEdit = value;
    fieldToEdit = field;
    enrichedText = enriched;
    editing = true;
  }
</script>

<div class="tab-right-column">
  <div class="tab-content">
    {#if editing}
      {#key contentToEdit}
        <article class="flexible-editor-container singleton">
          <SheetEditorV2
            enriched={enrichedText}
            content={contentToEdit}
            field={fieldToEdit}
            editorOptions={{
              editable: context.editable,
              toggled: false,
            }}
            documentUuid={context.actor.uuid}
            onSave={() => stopEditing()}
          />
        </article>
      {/key}
    {/if}

    <article
      class="summary-editor-container"
      class:hidden={editing}
      data-prop="system.description.summary"
      data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
    >
      <div class="summary-editor-title">
        <h3 class="font-title-small flexrow">
          <i class="fa-solid fa-note-sticky flexshrink"></i>
          <span class="flex1">{localize('DND5E.Summary')}</span>
          <a
            class={[
              'button button-borderless button-icon-only flexshrink',
              'menu',
            ]}
            aria-label={localize('DND5E.AdditionalControls')}
            role="button"
            tabindex="0"
            {@attach InputAttachments.triggerClickOnKeydown}
            data-action="showContextMenu"
            data-target-selector="[data-context-menu]"
          >
            <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
          </a>
          <a
            class={[
              'button button-borderless button-icon-only flexshrink',
              'copy',
            ]}
            aria-label={localize('TIDY5E.COMMON.Action.CopyToClipboard')}
            data-tooltip=""
            role="button"
            tabindex="0"
            {@attach InputAttachments.triggerClickOnKeydown}
            data-action="copyData"
          >
            <i class="fa-solid fa-copy fa-fw"></i>
          </a>
          {#if context.editable}
            <a
              class={[
                'button button-borderless button-icon-only flexshrink',
                'edit',
              ]}
              role="button"
              tabindex="0"
              {@attach InputAttachments.triggerClickOnKeydown}
              onclick={() =>
                edit(
                  context.actor.system.description.summary,
                  context.enriched.description.summary,
                  'system.description.summary',
                )}
            >
              <i class="fa-solid fa-feather"></i>
            </a>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      {#key context.enriched.description.summary}
        <div class="editor">
          <div
            data-target="system.description.summary"
            class="user-select-text"
          >
            {@html context.enriched.description.summary}
          </div>
        </div>
      {/key}
    </article>
    <article
      class="description-editor-container"
      class:hidden={editing}
      data-prop="system.description.full"
      data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
    >
      <div class="description-editor-title">
        <h3 class="font-title-small flexrow">
          <i class="fa-solid fa-notebook flexshrink"></i>
          <span class="flex1">{localize('DND5E.Description')}</span>
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            class={[
              'button button-borderless button-icon-only flexshrink',
              'menu',
            ]}
            aria-label={localize('DND5E.AdditionalControls')}
            data-tooltip=""
            role="button"
            tabindex="0"
            {@attach InputAttachments.triggerClickOnKeydown}
            data-action="showContextMenu"
            data-target-selector="[data-context-menu]"
          >
            <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
          </a>
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            class={[
              'button button-borderless button-icon-only flexshrink',
              'copy',
            ]}
            aria-label={localize('TIDY5E.COMMON.Action.CopyToClipboard')}
            data-tooltip=""
            role="button"
            tabindex="0"
            {@attach InputAttachments.triggerClickOnKeydown}
            data-action="copyData"
          >
            <i class="fa-solid fa-copy fa-fw"></i>
          </a>
          {#if context.editable}
            <!-- svelte-ignore a11y_missing_attribute -->
            <a
              class={[
                'button button-borderless button-icon-only flexshrink',
                'edit',
              ]}
              aria-label={localize('DND5E.DescriptionEdit', {
                description: localize('DND5E.Description'),
              })}
              data-tooltip=""
              role="button"
              tabindex="0"
              {@attach InputAttachments.triggerClickOnKeydown}
              onclick={() =>
                edit(
                  context.actor.system.description.full,
                  context.enriched.description.full,
                  'system.description.full',
                )}
              onkeydown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  edit(
                    context.actor.system.description.full,
                    context.enriched.description.full,
                    'system.description.full',
                  );
                }
              }}
            >
              <i class="fa-solid fa-feather"></i>
            </a>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      {#key context.enriched.description.full}
        <div class="editor">
          <div data-target="system.description.full" class="user-select-text">
            {@html context.enriched.description.full}
          </div>
        </div>
      {/key}
    </article>
  </div>
</div>
