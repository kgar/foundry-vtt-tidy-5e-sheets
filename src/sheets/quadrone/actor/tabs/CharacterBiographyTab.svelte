<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  const expansionTracker = getContext<ExpansionTracker>(
    CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
  );
  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  type SystemBioField = { field: string; value: string; text: string };

  let bioFields: SystemBioField[] = $derived([
    {
      field: 'system.details.alignment',
      value: context.system.details.alignment,
      text: 'DND5E.Alignment',
    },
    {
      field: 'system.details.gender',
      value: context.system.details.gender,
      text: 'DND5E.Gender',
    },
    {
      field: 'system.details.age',
      value: context.system.details.age,
      text: 'DND5E.Age',
    },
    {
      field: 'system.details.height',
      value: context.system.details.height,
      text: 'DND5E.Height',
    },
    {
      field: 'system.details.weight',
      value: context.system.details.weight,
      text: 'DND5E.Weight',
    },
    {
      field: 'system.details.eyes',
      value: context.system.details.eyes,
      text: 'DND5E.Eyes',
    },
    {
      field: 'system.details.skin',
      value: context.system.details.skin,
      text: 'DND5E.Skin',
    },
    {
      field: 'system.details.hair',
      value: context.system.details.hair,
      text: 'DND5E.Hair',
    },
    {
      field: 'system.details.faith',
      value: context.system.details.faith,
      text: 'DND5E.Faith',
    },
  ]);

  let editing = $state(false);
  let contentToEdit: string = $state('');
  let enrichedText: string = $state('');
  let fieldToEdit: string = $state('');

  async function stopEditing() {
    await context.actor.sheet.submit();
    editing = false;
  }

  function edit(value: string, enriched: string, field: string) {
    contentToEdit = value;
    fieldToEdit = field;
    enrichedText = enriched;
    editing = true;
  }
</script>

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
        manageSecrets={context.actor.isOwner}
      />
    </article>
  {/key}
{/if}

{#if context.enriched.biography !== '' || context.enriched.appearance !== '' || context.unlocked}
  <div class="tidy-tab-column flexcol" class:hidden={editing}>
    {@render bioEditorEntry(
      'fa-image-portrait',
      'DND5E.Appearance',
      context.system.details.appearance,
      context.enriched.appearance,
      'system.details.appearance',
    )}

    {@render bioEditorEntry(
      'fa-book-user',
      'DND5E.BiographyPublic',
      context.system.details.biography.value,
      context.enriched.biography,
      'system.details.biography.value',
    )}
  </div>
{/if}

<div class="tidy-tab-row flexrow" class:hidden={editing}>
  {#if (context.enriched.appearance !== '' && context.enriched.trait !== '' && context.enriched.ideal !== '' && context.enriched.bond !== '' && context.enriched.flaw !== '') || context.unlocked}
    <div class="tidy-tab-column flexcol">
      {@render bioEditorEntry(
        'fa-puzzle-piece',
        'DND5E.PersonalityTraits',
        context.system.details.trait,
        context.enriched.trait,
        'system.details.trait',
      )}

      {@render bioEditorEntry(
        'fa-seedling',
        'DND5E.Ideals',
        context.system.details.ideal,
        context.enriched.ideal,
        'system.details.ideal',
      )}

      {@render bioEditorEntry(
        'fa-link',
        'DND5E.Bonds',
        context.system.details.bond,
        context.enriched.bond,
        'system.details.bond',
      )}

      {@render bioEditorEntry(
        'fa-heart-crack',
        'DND5E.Flaws',
        context.system.details.flaw,
        context.enriched.flaw,
        'system.details.flaw',
      )}
    </div>
  {/if}

  {#if bioFields.some((bioField) => bioField.value != null && bioField.value !== '') || context.unlocked}
    <div class="tidy-tab-column flexcol">
      <div class="biography-editor-title title-underlined">
        <h3 class="font-title-small flexrow">
          <i class="fa-solid fa-address-card flexshrink"></i>
          <span class="flex1">{localize('TIDY5E.Actor.Characteristics')}</span>
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      <ul class="biography-entries">
        {#each bioFields as bioField (bioField.field)}
          {#if (bioField.value != null && bioField.value !== '') || context.unlocked}
            <li class="form-group">
              <label class="biography-entry-label" for={bioField.field}
                >{localize(bioField.text)}</label
              >
              <div class="form-fields">
                <TextInputQuadrone
                  id={bioField.field}
                  document={context.actor}
                  field={bioField.field}
                  value={bioField.value}
                  selectOnFocus={true}
                  class="biography-entry-value"
                  disabled={!context.unlocked}
                />
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>

{#snippet bioEditorEntry(
  icon: string,
  label: string,
  value: string,
  enriched: string,
  field: string,
)}
  {#if enriched !== '' || context.unlocked}
    {@const expanded = expansionTracker.isExpanded(field, tabId, location)}
    <article class="biography-editor-container collapsible-editor">
      <div class="biography-editor-title">
        <h3 class="font-title-small flexrow">
          <a
            class="title"
            onclick={() => expansionTracker.toggle(field, tabId, location)}
          >
            <i class="fa-solid {icon} flexshrink"></i>
            <span class="flex1">{localize(label)}</span>
            {#if enriched}
              <i
                class="fas fa-angle-right fa-fw expand-indicator"
                class:expanded
              ></i>
            {/if}
          </a>
          {#if context.editable}
            <a
              class={['button button-borderless button-icon-only flexshrink']}
              onclick={() => edit(value, enriched, field)}
            >
              <i class="fa-solid fa-feather"></i>
            </a>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      <ExpandableContainer {expanded}>
        {#key enriched}
          <div
            class={['editor']}
            use:manageSecrets={{ document: context.actor }}
          >
            <div data-field={field} class="user-select-text">
              {@html enriched}
            </div>
          </div>
        {/key}
      </ExpandableContainer>
    </article>
  {/if}
{/snippet}
