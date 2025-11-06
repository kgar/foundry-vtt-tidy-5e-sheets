<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { TidyFlags } from 'src/api';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { getContext } from 'svelte';
  import type { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getNpcSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  const expansionTracker = getContext<ExpansionTracker>(
    CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
  );
  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  type FlagBioField = {
    field: string;
    value: string | undefined | null;
    text: string;
  };

  let bioFields: FlagBioField[] = $derived([
    {
      field: 'system.details.alignment',
      value: context.system.details.alignment,
      text: 'DND5E.Alignment',
    },
    {
      field: TidyFlags.gender.prop,
      value: TidyFlags.gender.get(context.actor),
      text: 'DND5E.Gender',
    },
    {
      field: TidyFlags.age.prop,
      value: TidyFlags.age.get(context.actor),
      text: 'DND5E.Age',
    },
    {
      field: TidyFlags.height.prop,
      value: TidyFlags.height.get(context.actor),
      text: 'DND5E.Height',
    },
    {
      field: TidyFlags.weight.prop,
      value: TidyFlags.weight.get(context.actor),
      text: 'DND5E.Weight',
    },
    {
      field: TidyFlags.eyes.prop,
      value: TidyFlags.eyes.get(context.actor),
      text: 'DND5E.Eyes',
    },
    {
      field: TidyFlags.skin.prop,
      value: TidyFlags.skin.get(context.actor),
      text: 'DND5E.Skin',
    },
    {
      field: TidyFlags.hair.prop,
      value: TidyFlags.hair.get(context.actor),
      text: 'DND5E.Hair',
    },
    {
      field: TidyFlags.faith.prop,
      value: TidyFlags.faith.get(context.actor),
      text: 'DND5E.Faith',
    },
  ]);

  let personalityEntries: {
    icon: string;
    label: string;
    value: string;
    enriched: string;
    field: string;
  }[] = $derived([
    {
      icon: 'fa-head-side',
      label: 'DND5E.Appearance',
      value: TidyFlags.appearance.get(context.actor) ?? '',
      enriched: context.enriched.appearance,
      field: TidyFlags.appearance.prop,
    },
    {
      icon: 'fa-puzzle-piece',
      label: 'DND5E.PersonalityTraits',
      value: TidyFlags.trait.get(context.actor) ?? '',
      enriched: context.enriched.trait,
      field: TidyFlags.trait.prop,
    },
    {
      icon: 'fa-seedling',
      label: 'DND5E.Ideals',
      value: context.system.details.ideal,
      enriched: context.enriched.ideal,
      field: 'system.details.ideal',
    },
    {
      icon: 'fa-link',
      label: 'DND5E.Bonds',
      value: context.system.details.bond,
      enriched: context.enriched.bond,
      field: 'system.details.bond',
    },
    {
      icon: 'fa-heart-crack',
      label: 'DND5E.Flaws',
      value: context.system.details.flaw,
      enriched: context.enriched.flaw,
      field: 'system.details.flaw',
    },
  ]);
  let hasPersonalityEntries = $derived(personalityEntries.some(entry => entry.enriched !== ''))


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

{#if context.enriched.biography !== '' || context.enriched.publicBiography !== '' || context.unlocked}
  <div class="tidy-tab-column flexcol" class:hidden={editing}>
    {@render bioEditorEntry(
      'fa-book',
      'DND5E.Biography',
      context.system.details.biography.value,
      context.enriched.biography,
      'system.details.biography.value',
    )}

    {@render bioEditorEntry(
      'fa-book-user',
      'DND5E.BiographyPublic',
      context.system.details.biography.public,
      context.enriched.publicBiography,
      'system.details.biography.public',
    )}
  </div>
{/if}
<div class="tidy-tab-row flexrow" class:hidden={editing}>
  {#if hasPersonalityEntries || context.unlocked}
    <div class="tidy-tab-column flexcol">
      {#each personalityEntries as entry (entry.field)}
        {@render bioEditorEntry(
          entry.icon,
          entry.label,
          entry.value,
          entry.enriched,
          entry.field,
        )}
      {/each}
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
      <div class="biography-editor-title title-underlined">
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
            <button
              type="button"
              class="button button-borderless button-icon-only flexshrink"
              aria-label={localize('TIDY5E.ContextMenuActionEdit')}
              onclick={() => edit(value, enriched, field)}
            >
              <i class="fa-solid fa-feather"></i>
            </button>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      <ExpandableContainer {expanded}>
        {#key enriched}
          <div class="editor" use:manageSecrets={{ document: context.actor }}>
            <div data-field={field} class="user-select-text">
              {@html enriched}
            </div>
          </div>
        {/key}
      </ExpandableContainer>
    </article>
  {/if}
{/snippet}
