<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getVehicleSheetQuadroneContext());

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

<div
  class="tab-content vehicle-tab-content vehicle-description-content flexcol"
>
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
    class="description-editor-container"
    class:hidden={editing}
    data-prop="system.details.biography.value"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
  >
    <div class="description-editor-title">
      <h3 class="font-title-small flexrow">
        <i class="fa-solid fa-notebook flexshrink"></i>
        <span class="flex1">{localize('DND5E.Description')}</span>
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
                context.actor.system.details.biography.value,
                context.enriched.biography,
                'system.details.biography.value',
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        {/if}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#key context.enriched.biography}
      <div class="editor">
        <div
          data-target="system.details.biography.value"
          class="user-select-text"
        >
          {@html context.enriched.biography}
        </div>
      </div>
    {/key}
  </article>
</div>
