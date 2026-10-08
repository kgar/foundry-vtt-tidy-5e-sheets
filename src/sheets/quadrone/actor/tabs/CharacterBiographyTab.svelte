<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

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

  let personalityEntries: {
    icon: string;
    label: string;
    value: string;
    enriched: string;
    field: string;
  }[] = $derived([
    {
      icon: 'fa-puzzle-piece',
      label: 'DND5E.PersonalityTraits',
      value: context.system.details.trait,
      enriched: context.enriched.trait,
      field: 'system.details.trait',
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

  let hasPersonalityEntries = $derived(
    personalityEntries.some((entry) => entry.enriched !== ''),
  );

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
            <span class="flex1"
              >{localize('TIDY5E.ACTOR.Characteristics.Title')}</span
            >
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
</div>

{#snippet bioEditorEntry(
  icon: string,
  label: string,
  value: string,
  enriched: string,
  field: string,
)}
  {#if enriched !== '' || context.unlocked}
    {const expanded = $derived(
      expansionTracker.isExpanded(field, tabId, location),
    )}
    <article
      class="biography-editor-container collapsible-editor"
      data-prop={field}
      data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
    >
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
            data-action="showContextMenu"
            data-target-selector="[data-context-menu]"
            {@attach InputAttachments.triggerClickOnKeydown}
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
            data-action="copyData"
            {@attach InputAttachments.triggerClickOnKeydown}
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
              aria-label={localize('DND5E.BiographyPublicEdit')}
              data-tooltip=""
              role="button"
              tabindex="0"
              onclick={() => edit(value, enriched, field)}
              onkeydown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  edit(value, enriched, field);
                }
              }}
              {@attach InputAttachments.triggerClickOnKeydown}
            >
              <i class="fa-solid fa-feather"></i>
            </a>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      <ExpandableContainer {expanded}>
        <div class={['editor']}>
          <div data-target={field} class="user-select-text">
            {@html enriched}
          </div>
        </div>
      </ExpandableContainer>
    </article>
  {/if}
{/snippet}
