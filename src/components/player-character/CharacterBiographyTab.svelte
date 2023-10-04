<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/sheets/SheetEditor.svelte';
  import ContentEditableFormField from '../inputs/ContentEditableFormField.svelte';
  import type { CharacterSheetContext } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RerenderAfterFormSubmission from '../shared/RerenderAfterFormSubmission.svelte';

  let store = getContext<Readable<CharacterSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="notes-container">
  <div class="top-notes note-entries" class:limited={$store.actor.limited}>
    <article>
      <ul class="character-details">
        <li>
          <span>{localize('T5EK.Gender')}:</span>
          <ContentEditableFormField
            element="span"
            editable={$store.owner && !$store.lockSensitiveFields}
            document={$store.actor}
            field="flags.{CONSTANTS.MODULE_ID}.gender"
            value={FoundryAdapter.tryGetFlag($store.actor, 'gender') ?? ''}
            cssClass="detail-input"
          />
        </li>
        <li>
          <span>{localize('T5EK.Age')}:</span>
          <ContentEditableFormField
            element="span"
            editable={$store.owner && !$store.lockSensitiveFields}
            document={$store.actor}
            field="flags.{CONSTANTS.MODULE_ID}.age"
            value={FoundryAdapter.tryGetFlag($store.actor, 'age') ?? ''}
            cssClass="detail-input"
            dataMaxLength={5}
          />
        </li>
        <li>
          <span>{localize('T5EK.Height')}:</span>
          <ContentEditableFormField
            element="span"
            editable={$store.owner && !$store.lockSensitiveFields}
            document={$store.actor}
            field="flags.{CONSTANTS.MODULE_ID}.height"
            value={FoundryAdapter.tryGetFlag($store.actor, 'height') ?? ''}
            cssClass="detail-input"
            dataMaxLength={20}
          />
        </li>
        <li>
          <span>{localize('T5EK.Weight')}:</span>
          <ContentEditableFormField
            element="span"
            editable={$store.owner && !$store.lockSensitiveFields}
            document={$store.actor}
            field="flags.{CONSTANTS.MODULE_ID}.weight"
            value={FoundryAdapter.tryGetFlag($store.actor, 'weight') ?? ''}
            cssClass="detail-input"
            dataMaxLength={20}
          />
        </li>
        <li>
          <span>{localize('T5EK.Eyes')}:</span>
          <ContentEditableFormField
            element="span"
            editable={$store.owner && !$store.lockSensitiveFields}
            document={$store.actor}
            field="flags.{CONSTANTS.MODULE_ID}.eyes"
            value={FoundryAdapter.tryGetFlag($store.actor, 'eyes') ?? ''}
            cssClass="detail-input"
            dataMaxLength={40}
          />
        </li>
        <li>
          <span>{localize('T5EK.Skin')}:</span>
          <ContentEditableFormField
            element="span"
            editable={$store.owner && !$store.lockSensitiveFields}
            document={$store.actor}
            field="flags.{CONSTANTS.MODULE_ID}.skin"
            value={FoundryAdapter.tryGetFlag($store.actor, 'skin') ?? ''}
            cssClass="detail-input"
            dataMaxLength={40}
          />
        </li>
        <li>
          <span>{localize('T5EK.Hair')}:</span>
          <ContentEditableFormField
            element="span"
            editable={$store.owner && !$store.lockSensitiveFields}
            document={$store.actor}
            field="flags.{CONSTANTS.MODULE_ID}.hair"
            value={FoundryAdapter.tryGetFlag($store.actor, 'hair') ?? ''}
            cssClass="detail-input"
            dataMaxLength={40}
          />
        </li>
      </ul>
    </article>
  </div>
  <div class="main-notes">
    <div class="left-notes note-entries" class:limited={$store.actor.limited}>
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.trait}
      >
        <article use:activateProseMirrorListeners>
          <div class="section-titles biopage">
            {localize('DND5E.PersonalityTraits')}
          </div>
          <SheetEditor
            content={$store.system.details.trait}
            target="system.details.trait"
            editable={$store.owner || FoundryAdapter.userIsGm()}
          />
        </article>
      </RerenderAfterFormSubmission>

      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.ideal}
      >
        <article use:activateProseMirrorListeners>
          <div class="section-titles biopage">{localize('DND5E.Ideals')}</div>
          <SheetEditor
            content={$store.system.details.ideal}
            target="system.details.ideal"
            editable={$store.owner || FoundryAdapter.userIsGm()}
          />
        </article>
      </RerenderAfterFormSubmission>
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.bond}
      >
        <article use:activateProseMirrorListeners>
          <div class="section-titles biopage">{localize('DND5E.Bonds')}</div>
          <SheetEditor
            content={$store.system.details.bond}
            target="system.details.bond"
            editable={$store.owner || FoundryAdapter.userIsGm()}
          />
        </article>
      </RerenderAfterFormSubmission>
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.flaw}
      >
        <article use:activateProseMirrorListeners>
          <div class="section-titles biopage">{localize('DND5E.Flaws')}</div>
          <SheetEditor
            content={$store.system.details.flaw}
            target="system.details.flaw"
            editable={$store.owner || FoundryAdapter.userIsGm()}
          />
        </article>
      </RerenderAfterFormSubmission>
    </div>

    <div class="right-notes note-entries" class:limited={$store.actor.limited}>
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.appearance}
      >
        <article class="appearance-notes" use:activateProseMirrorListeners>
          <div class="section-titles biopage">
            {localize('DND5E.Appearance')}
          </div>
          <SheetEditor
            content={$store.system.details.appearance}
            target="system.details.appearance"
            editable={$store.owner || FoundryAdapter.userIsGm()}
          />
        </article>
      </RerenderAfterFormSubmission>
      <RerenderAfterFormSubmission
        andOnValueChange={$store.system.details.biography.value}
      >
        <article class="biography-notes" use:activateProseMirrorListeners>
          <div class="section-titles">
            {localize('DND5E.Background')}/{localize('DND5E.Biography')}
          </div>
          <SheetEditor
            content={$store.system.details.biography.value}
            target="system.details.biography.value"
            editable={$store.owner || FoundryAdapter.userIsGm()}
          />
        </article>
      </RerenderAfterFormSubmission>
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
    // flex: 0 0 1px;
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
