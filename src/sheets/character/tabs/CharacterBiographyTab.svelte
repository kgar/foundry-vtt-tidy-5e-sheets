<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import ContentEditableFormField from '../../../components/inputs/ContentEditableFormField.svelte';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RerenderAfterFormSubmission from '../../../components/utility/RerenderAfterFormSubmission.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $context.activateFoundryJQueryListeners(node);
  }
</script>

<div class="scroll-container">
  <div class="notes-container">
    <div
      class="top-notes note-entries"
      class:limited={$context.showLimitedSheet}
    >
      <article>
        <ul class="character-details">
          <li>
            <span>{localize('DND5E.Gender')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.gender"
              value={$context.system.details.gender ?? ''}
              cssClass="detail-input"
            />
          </li>
          <li>
            <span>{localize('DND5E.Age')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.age"
              value={$context.system.details.age ?? ''}
              cssClass="detail-input"
            />
          </li>
          <li>
            <span>{localize('DND5E.Height')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.height"
              value={$context.system.details.height ?? ''}
              cssClass="detail-input"
            />
          </li>
          <li>
            <span>{localize('DND5E.Weight')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.weight"
              value={$context.system.details.weight ?? ''}
              cssClass="detail-input"
            />
          </li>
          <li>
            <span>{localize('DND5E.Eyes')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.eyes"
              value={$context.system.details.eyes ?? ''}
              cssClass="detail-input"
            />
          </li>
          <li>
            <span>{localize('DND5E.Skin')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.skin"
              value={$context.system.details.skin ?? ''}
              cssClass="detail-input"
            />
          </li>
          <li>
            <span>{localize('DND5E.Hair')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.hair"
              value={$context.system.details.hair ?? ''}
              cssClass="detail-input"
            />
          </li>
          <li>
            <span>{localize('DND5E.Faith')}:</span>
            <ContentEditableFormField
              selectOnFocus={true}
              element="span"
              editable={$context.editable && !$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.faith"
              value={$context.system.details.faith ?? ''}
              cssClass="detail-input"
            />
          </li>
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
          <article use:activateProseMirrorListeners>
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
          <article use:activateProseMirrorListeners>
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
          <article use:activateProseMirrorListeners>
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
          <article use:activateProseMirrorListeners>
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
          <article class="appearance-notes" use:activateProseMirrorListeners>
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
          <article class="biography-notes" use:activateProseMirrorListeners>
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
