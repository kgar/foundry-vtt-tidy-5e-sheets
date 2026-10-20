<script lang="ts">
  import DescriptionControls from 'src/sheets/quadrone/shared/DescriptionControls.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getEncounterSheetQuadroneContext());

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
          <DescriptionControls
            editLabel={localize('DND5E.DescriptionEdit', {
              description: localize('DND5E.Summary'),
            })}
            onEdit={context.editable
              ? () =>
                  edit(
                    context.actor.system.description.summary,
                    context.enriched.description.summary,
                    'system.description.summary',
                  )
              : undefined}
          />
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
          <DescriptionControls
            onEdit={context.editable
              ? () =>
                  edit(
                    context.actor.system.description.full,
                    context.enriched.description.full,
                    'system.description.full',
                  )
              : undefined}
          />
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
