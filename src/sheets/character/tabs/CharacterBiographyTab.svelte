<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import ContentEditableFormField from '../../../components/inputs/ContentEditableFormField.svelte';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RerenderAfterFormSubmission from '../../../components/utility/RerenderAfterFormSubmission.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  type SystemBioField = { field: string; value: string; text: string };

  let bioFields: SystemBioField[] = [];
  $: bioFields = [
    {
      field: 'system.details.gender',
      value: $context.system.details.gender,
      text: 'DND5E.Gender',
    },
    {
      field: 'system.details.age',
      value: $context.system.details.age,
      text: 'DND5E.Age',
    },
    {
      field: 'system.details.height',
      value: $context.system.details.height,
      text: 'DND5E.Height',
    },
    {
      field: 'system.details.weight',
      value: $context.system.details.weight,
      text: 'DND5E.Weight',
    },
    {
      field: 'system.details.eyes',
      value: $context.system.details.eyes,
      text: 'DND5E.Eyes',
    },
    {
      field: 'system.details.skin',
      value: $context.system.details.skin,
      text: 'DND5E.Skin',
    },
    {
      field: 'system.details.hair',
      value: $context.system.details.hair,
      text: 'DND5E.Hair',
    },
    {
      field: 'system.details.faith',
      value: $context.system.details.faith,
      text: 'DND5E.Faith',
    },
  ];
</script>

<div class="scroll-container">
  <div class="notes-container">
    <div
      class="top-notes note-entries"
      class:limited={$context.showLimitedSheet}
    >
      <article>
        <ul class="character-details">
          {#each bioFields as bioField (bioField.field)}
            <li>
              <span>{localize(bioField.text)}:</span>
              <ContentEditableFormField
                selectOnFocus={true}
                element="span"
                editable={$context.editable && !$context.lockSensitiveFields}
                document={$context.actor}
                field={bioField.field}
                value={bioField.value ?? ''}
                cssClass="detail-input"
              />
            </li>
          {/each}
        </ul>
      </article>
    </div>
    <div class="main-notes">
      <div
        class="left-notes note-entries"
        class:limited={$context.showLimitedSheet}
      >
        <RerenderAfterFormSubmission
          andOnValueChange={$context.system.details.trait}
        >
          <article use:$context.activateEditors>
            <div class="section-titles biopage">
              {localize('DND5E.PersonalityTraits')}
            </div>
            <SheetEditor
              content={$context.traitEnrichedHtml}
              target="system.details.trait"
              editable={$context.editable}
            />
          </article>
        </RerenderAfterFormSubmission>

        <RerenderAfterFormSubmission
          andOnValueChange={$context.system.details.ideal}
        >
          <article use:$context.activateEditors>
            <div class="section-titles biopage">{localize('DND5E.Ideals')}</div>
            <SheetEditor
              content={$context.idealEnrichedHtml}
              target="system.details.ideal"
              editable={$context.editable}
            />
          </article>
        </RerenderAfterFormSubmission>
        <RerenderAfterFormSubmission
          andOnValueChange={$context.system.details.bond}
        >
          <article use:$context.activateEditors>
            <div class="section-titles biopage">{localize('DND5E.Bonds')}</div>
            <SheetEditor
              content={$context.bondEnrichedHtml}
              target="system.details.bond"
              editable={$context.editable}
            />
          </article>
        </RerenderAfterFormSubmission>
        <RerenderAfterFormSubmission
          andOnValueChange={$context.system.details.flaw}
        >
          <article use:$context.activateEditors>
            <div class="section-titles biopage">{localize('DND5E.Flaws')}</div>
            <SheetEditor
              content={$context.flawEnrichedHtml}
              target="system.details.flaw"
              editable={$context.editable}
            />
          </article>
        </RerenderAfterFormSubmission>
      </div>

      <div
        class="right-notes note-entries"
        class:limited={$context.showLimitedSheet}
      >
        <RerenderAfterFormSubmission
          andOnValueChange={$context.system.details.appearance}
        >
          <article class="appearance-notes" use:$context.activateEditors>
            <div class="section-titles biopage">
              {localize('DND5E.Appearance')}
            </div>
            <SheetEditor
              content={$context.appearanceEnrichedHtml}
              target="system.details.appearance"
              editable={$context.editable}
            />
          </article>
        </RerenderAfterFormSubmission>
        <RerenderAfterFormSubmission
          andOnValueChange={$context.system.details.biography.value}
        >
          <article class="biography-notes" use:$context.activateEditors>
            <div class="section-titles">
              {localize('DND5E.Background')}/{localize('DND5E.Biography')}
            </div>
            <SheetEditor
              content={$context.biographyEnrichedHtml}
              target="system.details.biography.value"
              editable={$context.editable}
            />
          </article>
        </RerenderAfterFormSubmission>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .notes-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
  }

  .main-notes {
    display: flex;
    flex: 1;
    gap: 1rem;
  }

  .left-notes,
  .right-notes {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .left-notes {
    max-width: 21.875rem;
  }

  .top-notes {
    width: 100%;

    .character-details {
      margin: 0;
      padding: 0;
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
    }

    li {
      display: flex;
      flex: 0 0 calc(100% / 3 - 0.25rem);

      :global(span) {
        flex: 1;
        margin: 0 0.5rem 0 0.25rem;
      }

      :global(span:first-child) {
        flex: 0 0 0.0625rem;
        font-weight: 600;
        margin: 0;
      }
    }
  }

  .character-details :global(.detail-input) {
    flex: 1;
    margin: 0 0.5rem 0 0.25rem;
  }
</style>
