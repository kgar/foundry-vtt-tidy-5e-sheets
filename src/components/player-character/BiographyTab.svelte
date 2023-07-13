<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/sheets/SheetEditor.svelte';
  import ContentEditableFormField from '../inputs/ContentEditableFormField.svelte';
  import type { SheetFunctions } from 'src/types/types';

  export let context: CharacterSheetContext;
  export let sheetFunctions: SheetFunctions;

  const localize = FoundryAdapter.localize;
</script>

<div class="notes-container">
  <div class="top-notes note-entries" class:limited={context.actor.limited}>
    <article>
      <ul class="character-details">
        <li>
          <span>{localize('TIDY5E.Gender')}:</span>
          <ContentEditableFormField
            element="span"
            editable={context.owner}
            fieldName="flags.tidy5e-sheet-kgar.gender"
            value={FoundryAdapter.tryGetFlag(context.actor, 'gender') ?? ''}
            {sheetFunctions}
            cssClass="detail-input"
          />
        </li>
        <li>
          <span>{localize('TIDY5E.Age')}:</span>
          <ContentEditableFormField
            element="span"
            editable={context.owner}
            fieldName="flags.tidy5e-sheet-kgar.age"
            value={FoundryAdapter.tryGetFlag(context.actor, 'age') ?? ''}
            {sheetFunctions}
            cssClass="detail-input"
            dataMaxLength={5}
          />
        </li>
        <li>
          <span>{localize('TIDY5E.Height')}:</span>
          <ContentEditableFormField
            element="span"
            editable={context.owner}
            fieldName="flags.tidy5e-sheet-kgar.height"
            value={FoundryAdapter.tryGetFlag(context.actor, 'height') ?? ''}
            {sheetFunctions}
            cssClass="detail-input"
            dataMaxLength={20}
          />
        </li>
        <li>
          <span>{localize('TIDY5E.Weight')}:</span>
          <ContentEditableFormField
            element="span"
            editable={context.owner}
            fieldName="flags.tidy5e-sheet-kgar.weight"
            value={FoundryAdapter.tryGetFlag(context.actor, 'weight') ?? ''}
            {sheetFunctions}
            cssClass="detail-input"
            dataMaxLength={20}
          />
        </li>
        <li>
          <span>{localize('TIDY5E.Eyes')}:</span>
          <ContentEditableFormField
            element="span"
            editable={context.owner}
            fieldName="flags.tidy5e-sheet-kgar.eyes"
            value={FoundryAdapter.tryGetFlag(context.actor, 'eyes') ?? ''}
            {sheetFunctions}
            cssClass="detail-input"
            dataMaxLength={40}
          />
        </li>
        <li>
          <span>{localize('TIDY5E.Skin')}:</span>
          <ContentEditableFormField
            element="span"
            editable={context.owner}
            fieldName="flags.tidy5e-sheet-kgar.skin"
            value={FoundryAdapter.tryGetFlag(context.actor, 'skin') ?? ''}
            {sheetFunctions}
            cssClass="detail-input"
            dataMaxLength={40}
          />
        </li>
        <li>
          <span>{localize('TIDY5E.Hair')}:</span>
          <ContentEditableFormField
            element="span"
            editable={context.owner}
            fieldName="flags.tidy5e-sheet-kgar.hair"
            value={FoundryAdapter.tryGetFlag(context.actor, 'hair') ?? ''}
            {sheetFunctions}
            cssClass="detail-input"
            dataMaxLength={40}
          />
        </li>
      </ul>
    </article>
  </div>
  <div class="main-notes">
    <div class="left-notes note-entries" class:limited={context.actor.limited}>
      <article>
        <div class="section-titles biopage">
          {localize('DND5E.PersonalityTraits')}
        </div>
        <SheetEditor
          content={context.system.details.trait}
          target="system.details.trait"
          editable={context.editable}
        />
      </article>
      <article>
        <div class="section-titles biopage">{localize('DND5E.Ideals')}</div>
        <SheetEditor
          content={context.system.details.ideal}
          target="system.details.ideal"
          editable={context.editable}
        />
      </article>
      <article>
        <div class="section-titles biopage">{localize('DND5E.Bonds')}</div>
        <SheetEditor
          content={context.system.details.bond}
          target="system.details.bond"
          editable={context.editable}
        />
      </article>
      <article>
        <div class="section-titles biopage">{localize('DND5E.Flaws')}</div>
        <SheetEditor
          content={context.system.details.flaw}
          target="system.details.flaw"
          editable={context.editable}
        />
      </article>
    </div>

    <div class="right-notes note-entries" class:limited={context.actor.limited}>
      <article class="appearance-notes">
        <div class="section-titles biopage">{localize('DND5E.Appearance')}</div>
        <SheetEditor
          content={context.system.details.appearance}
          target="system.details.appearance"
          editable={context.editable}
        />
      </article>
      <article class="biography-notes">
        <div class="section-titles">
          {localize('DND5E.Background')}/{localize('DND5E.Biography')}
        </div>
        <SheetEditor
          content={context.system.details.biography.value}
          target="system.details.biography.value"
          editable={context.editable}
        />
      </article>
    </div>
  </div>
</div>

<style lang="scss">
  .notes-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
  }

  .main-notes {
    display: flex;
    flex: 1;
  }

  .left-notes,
  .right-notes {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .left-notes {
    margin-right: 1rem;
    max-width: 350px;
  }

  .top-notes {
    // flex: 0 0 1px;
    width: 100%;
    margin-bottom: 1rem;

    .character-details {
      margin: 0;
      padding: 0;
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    li {
      display: flex;
      flex: 0 0 calc(100% / 3 - 4px);

      span {
        flex: 1;
        margin: 0 8px 0 4px;
      }

      span:first-child {
        flex: 0 0 1px;
        font-weight: 600;
        margin: 0;
      }
    }
  }

  .character-details :global(.detail-input) {
    flex: 1;
    margin: 0 8px 0 4px;
  }
</style>
