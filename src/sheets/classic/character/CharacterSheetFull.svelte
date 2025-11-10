<script lang="ts">
  import { FoundryAdapter } from '../../../foundry/foundry-adapter';
  import type { DropdownListOption } from 'src/types/types';
  import CharacterProfile from './parts/CharacterProfile.svelte';
  import InlineTextDropdownList from '../../../components/inputs/InlineTextDropdownList.svelte';
  import ActorWarnings from '../actor/ActorWarnings.svelte';
  import SpecialSaves from '../actor/SpecialSaves.svelte';
  import { CONSTANTS } from 'src/constants';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import ActorMovement from '../actor/ActorMovement.svelte';
  import ActorHeaderStats from '../actor/ActorHeaderStats.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import InlineCreatureType from '../shared/InlineCreatureType.svelte';
  import ActorOriginSummaryConfigFormApplication from 'src/applications/actor-origin-summary/ActorOriginSummaryConfigFormApplication.svelte';
  import ActorName from '../actor/ActorName.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  let selectedTabId: string = $state('');
  let context = $derived(getCharacterSheetContext());

  const localize = FoundryAdapter.localize;

  let playerName = $derived(TidyFlags.playerName.get(context.actor) ?? '');

  let classAndSubclassSummaries = $derived(
    Array.from(
      FoundryAdapter.getClassAndSubclassSummaries(context.actor).values(),
    ),
  );

  let characterSummaryEntries = $derived(
    FoundryAdapter.getActorCharacterSummaryEntries(context),
  );

  let abilities = $derived(Object.entries<any>(context.abilities));

  let sizes = $derived(
    Object.entries(context.config.actorSizes).map(
      ([abbreviation, size]: [string, any]) => ({
        value: abbreviation,
        text: size.label,
      }),
    ) satisfies DropdownListOption[],
  );

  let currentSize = $derived({
    value: context.system.traits.size,
    text: context.config.actorSizes[context.system.traits.size]?.label,
  } satisfies DropdownListOption);
</script>

{#if context.viewableWarnings.length}
  <ActorWarnings warnings={context.viewableWarnings} />
{/if}
<header class="tidy5e-sheet-header flex-row">
  <div class="flex-0">
    <CharacterProfile />
  </div>

  <div class="flex-grow-1">
    <div
      class="flex-row justify-content-space-between align-items-center small-gap"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
    >
      <div
        class="actor-name"
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
      >
        <ActorName />
      </div>

      <div class="flex-row extra-small-gap align-items-stretch">
        {#if !context.disableExperience}
          <!-- XP / XP To Next Level -->
          <div class="xp-tracker">
            <div class="experience flex-row no-gap">
              <TextInput
                document={context.actor}
                field="system.details.xp.value"
                class="current-xp"
                value={context.system.details.xp.value}
                placeholder="0"
                selectOnFocus={true}
                allowDeltaChanges={true}
                maxlength={7}
                disabled={!context.editable || context.lockExpChanges}
              />

              {#if !context.epicBoonsEarned}
                <span class="sep">/</span>
                {#if context.editable && FoundryAdapter.userIsGm()}
                  <TextInput
                    document={context.actor}
                    field="system.details.xp.max"
                    class="max-xp max"
                    value={context.system.details.xp.max}
                    placeholder="0"
                    selectOnFocus={true}
                    allowDeltaChanges={true}
                    maxlength={7}
                    disabled={!context.editable}
                  />
                {:else}
                  <span class="max">{context.system.details.xp.max}</span>
                {/if}
              {/if}
            </div>
            <div class="xp-bar">
              <div class="xp-bar-total">
                <span
                  class="xp-bar-current"
                  style="width: {context.system.details.xp.pct}%"
                ></span>
              </div>
            </div>
          </div>
        {/if}
        <h2 class="level">
          {localize('DND5E.AbbreviationLevel')}
          {context.system.details.level}
        </h2>
      </div>
    </div>

    <section class="class-list">
      <!-- Player Name -->
      {#if settings.value.showPlayerName}
        <ContentEditableFormField
          element="span"
          document={context.actor}
          field={TidyFlags.playerName.prop}
          value={playerName}
          cssClass="player-name"
          placeholder={localize('TIDY5E.PlayerName')}
          dataMaxLength={40}
          editable={context.editable && !context.lockSensitiveFields}
        />
        <!-- <span>&#8226;</span> -->
      {/if}

      <!-- Class / Subclass -->
      {#if context.owner && settings.value.showClassList}
        <span class="flex-row extra-small-gap">
          {#each classAndSubclassSummaries as summary, i}
            {#if i > 0}
              <span class="flex-no-grow">/</span>
            {/if}
            <span class="flex-no-grow">
              <span title="{summary.class} {summary.level ?? '0'}"
                >{summary.class}
                {summary.level ?? '0'}
              </span>
              {#if summary.subclass}
                <span title={summary.subclass} class="flex-no-grow"
                  >{summary.subclass}</span
                >
              {/if}
            </span>
          {/each}
        </span>
      {/if}

      {#if context.actor.system.details.xp.boonsEarned}
        <span class="ms-auto">
          {context.epicBoonsEarned}
        </span>
      {/if}
    </section>

    <!-- Origin Summary: Size , Race , Background , Alignment , Proficiency , Origin Summary Configuration Cog -->
    <section class="origin-summary">
      <span class="origin-points">
        {#if context.editable}
          <InlineTextDropdownList
            options={sizes}
            selected={currentSize}
            onOptionClicked={(option) =>
              context.actor.update({
                'system.traits.size': option.value,
              })}
            title={localize('DND5E.Size')}
          />
        {:else}
          <span title={localize('DND5E.Size')}>{currentSize.text}</span>
        {/if}
        <span>&#8226;</span>
        <InlineCreatureType />
        {#each characterSummaryEntries as entry}
          <span>&#8226;</span>
          <span title={entry} class="truncate">{entry}</span>
        {/each}
      </span>
      <span class="flex-row align-items-center extra-small-gap">
        <b>
          {localize('DND5E.Proficiency')}: {context.labels.proficiency}
        </b>
        {#if context.unlocked}
          <button
            type="button"
            class="inline-icon-button"
            title={localize('TIDY5E.OriginSummaryConfig')}
            onclick={() =>
              new ActorOriginSummaryConfigFormApplication(context.actor).render(
                true,
              )}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-cog"></i>
          </button>
        {/if}
      </span>
    </section>
    <div
      role="presentation"
      class="header-line-margin flex-row extra-small-gap justify-content-space-between"
    >
      <ActorMovement />
      {#if context.hasSpecialSaves}
        <SpecialSaves />
      {/if}
    </div>
    <HorizontalLineSeparator
      class="header-line-margin-left"
      borderColor="light"
    />
    <!-- AC  -->
    <ActorHeaderStats
      {abilities}
      ac={context.system.attributes.ac}
      init={context.system.attributes.init}
    />
  </div>
</header>

<Tabs tabs={context.tabs} bind:selectedTabId sheet={context.actor.sheet} />

<section class="tidy-sheet-body">
  <TabContents tabs={context.tabs} {selectedTabId} />
</section>

<style lang="less">
  .tidy5e-sheet-header {
    display: flex;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);

    :global(.current-xp) {
      height: 1rem;
      width: calc(10.5ch + 0.3rem);
      text-align: right;
      padding: 0 0.25rem;
      min-width: 1.25rem;
    }

    :global(.max-xp) {
      height: 1rem;
      width: calc(10.5ch + 0.3rem);
      text-align: left;
      padding: 0 0.25rem;
      min-width: 1.25rem;
    }

    .xp-tracker {
      max-width: 7.75rem;
    }

    .xp-bar-total {
      width: 100%;
      height: 0.3125rem;
      border: 0.0625rem solid var(--t5e-tertiary-color);
      border-radius: 0.125rem;
      background: var(--t5e-light-color);
      position: relative;
    }

    .xp-bar-current {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      max-width: 100%;
      background: var(--t5e-xp-bar-background);
      transition: width 0.3s ease;
    }

    .level {
      padding: 0.25rem 0.375rem;
      border-radius: 0.1875rem;
      background: var(--t5e-faint-color);
      color: var(--t5e-secondary-color);
      font-size: 1.25rem;
      line-height: 1;
      height: 1.5rem;
      white-space: nowrap;
    }

    .class-list {
      font-size: 0.75rem;
      margin: 0;
      padding: 0.1875rem 0 0 0;
      color: var(--t5e-secondary-color);
      margin-left: 0.25rem;
      line-height: 1;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-wrap: wrap;

      :global(.player-name) {
        display: inline-block;
        font-weight: 600;
        margin-left: -0.25rem;
        margin-right: 0.25rem;
        min-width: 3.125rem;
        padding: 0 0.25rem;
        white-space: nowrap;
        color: var(--t5e-primary-font-color);
      }
    }

    .origin-summary {
      margin-left: 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.25rem;
      border-bottom: 0.0625rem solid var(--t5e-separator-color);
      border-top: 0.0625rem solid var(--t5e-separator-color);
      line-height: 1rem;
      padding: 0.1875rem 0 0.125rem 0;
      margin-top: 0.125rem;

      &,
      :global(button) {
        font-size: 0.75rem;
      }

      .origin-points {
        flex: 1;
        display: grid;
        grid-template-columns:
          min-content /* Size */
          min-content /* Bullet */
          minmax(auto, min-content) /* Creature Type */
          min-content /* Bullet */
          minmax(auto, min-content) /* Species */
          min-content /* Bullet */
          minmax(auto, min-content) /* Background */
          min-content /* Bullet */
          minmax(auto, min-content) /* Alignment */;
        gap: 0.25rem;
        align-items: center;
      }
    }
  }
</style>
