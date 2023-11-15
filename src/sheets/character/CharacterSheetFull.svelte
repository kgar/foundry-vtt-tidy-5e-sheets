<script lang="ts">
  import { getContext } from 'svelte';
  import { FoundryAdapter } from '../../foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    Tab,
    DropdownListOption,
  } from 'src/types/types';
  import Tidy5eActorOriginSummaryConfig from '../../dialogs/Tidy5eActorOriginSummaryConfig';
  import CharacterProfile from './parts/CharacterProfile.svelte';
  import InlineTextDropdownList from '../../components/inputs/InlineTextDropdownList.svelte';
  import ActorWarnings from '../actor/ActorWarnings.svelte';
  import { CONSTANTS } from 'src/constants';
  import AllowEditLock from 'src/sheets/actor/AllowEditLock.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import type { Readable } from 'svelte/store';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import ActorMovementRow from '../actor/ActorMovementRow.svelte';
  import ActorHeaderStats from '../actor/ActorHeaderStats.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemInfoCard from 'src/components/item-info-card/ItemInfoCard.svelte';
  import SheetMenu from '../actor/SheetMenu.svelte';
  import { settingStore } from 'src/settings/settings';
  import { currentCharacterSheetTabs } from 'src/state/character-sheet-state';

  let selectedTabId: string;
  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  $: playerName =
    FoundryAdapter.tryGetFlag<string>($context.actor, 'playerName') ?? '';

  $: classAndSubclassSummaries = Array.from(
    FoundryAdapter.getClassAndSubclassSummaries($context.actor).values()
  );

  $: characterSummaryEntries =
    FoundryAdapter.getActorCharacterSummaryEntries($context);

  $: abilities = Object.entries<any>($context.abilities);

  $: sizes = <DropdownListOption[]>Object.entries(
    $context.config.actorSizes
  ).map(([abbreviation, size]) => ({
    value: abbreviation,
    text: size as string,
  }));

  $: currentSize = <DropdownListOption>{
    value: $context.system.traits.size,
    text: $context.config.actorSizes[$context.system.traits.size],
  };

  let tabs: Tab[];
  $: {
    tabs = $currentCharacterSheetTabs.getTabs($context);
  }
</script>

<ItemInfoCard />

{#if $context.warnings.length}
  <ActorWarnings warnings={$context.warnings} />
{/if}
<header class="tidy5e-kgar-sheet-header flex-row">
  <div class="flex-0">
    <CharacterProfile />
  </div>

  <div class="flex-grow-1">
    <div class="flex-row justify-content-space-between align-items-center">
      <div class="actor-name">
        <ContentEditableFormField
          element="h1"
          document={$context.actor}
          editable={$context.owner && !$context.lockSensitiveFields}
          spellcheck={false}
          placeholder={localize('DND5E.Name')}
          dataMaxLength={40}
          value={$context.actor.name}
          field="name"
        />
      </div>

      <div class="flex-row extra-small-gap align-items-stretch">
        {#if !$context.disableExperience}
          <!-- XP / XP To Next Level -->
          <div class="xp-tracker">
            <div class="experience flex-row no-gap">
              <TextInput
                document={$context.actor}
                field="system.details.xp.value"
                cssClass="current-xp"
                value={$context.system.details.xp.value}
                placeholder="0"
                selectOnFocus={true}
                allowDeltaChanges={true}
                maxlength={7}
                disabled={$context.lockExpChanges}
              />
              <span class="sep">/</span>
              {#if FoundryAdapter.userIsGm()}
                <TextInput
                  document={$context.actor}
                  field="system.details.xp.max"
                  cssClass="max-xp max"
                  value={$context.system.details.xp.max}
                  placeholder="0"
                  selectOnFocus={true}
                  allowDeltaChanges={true}
                  maxlength={7}
                  disabled={!$context.owner}
                />
              {:else}
                <span class="max">{$context.system.details.xp.max}</span>
              {/if}
            </div>
            <div class="xp-bar">
              <div class="xp-bar-total">
                <span
                  class="xp-bar-current"
                  style="width: {$context.system.details.xp.pct}%"
                />
              </div>
            </div>
          </div>
        {/if}
        <h2 class="level">
          {localize('DND5E.AbbreviationLevel')}
          {$context.system.details.level}
        </h2>
        <SheetMenu defaultSettingsTab={CONSTANTS.TAB_SETTINGS_PLAYERS} />
      </div>
    </div>

    <section class="class-list">
      <!-- Player Name -->
      {#if $settingStore.showPlayerName}
        <ContentEditableFormField
          element="span"
          document={$context.actor}
          field="flags.{CONSTANTS.MODULE_ID}.playerName"
          value={playerName}
          cssClass="player-name"
          placeholder={localize('T5EK.PlayerName')}
          dataMaxLength={40}
          editable={$context.owner && !$context.lockSensitiveFields}
        />
        <!-- <span>&#8226;</span> -->
      {/if}

      <!-- Class / Subclass -->
      {#if $context.owner && $settingStore.showClassList}
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
    </section>

    <!-- Origin Summary: Size , Race , Background , Alignment , Proficiency , Origin Summary Configuration Cog -->
    <section class="origin-summary">
      <span class="origin-points">
        {#if $context.owner}
          <InlineTextDropdownList
            options={sizes}
            selected={currentSize}
            on:optionClicked={(event) =>
              $context.actor.update({
                'system.traits.size': event.detail.value,
              })}
            title={localize('DND5E.Size')}
          />
        {:else}
          <span title={localize('DND5E.Size')}>{currentSize.text}</span>
        {/if}
        {#each characterSummaryEntries as entry}
          <span>&#8226;</span>
          <span title={entry} class="truncate">{entry}</span>
        {/each}
      </span>
      <span class="flex-row align-items-center extra-small-gap">
        <b>
          {localize('DND5E.Proficiency')}: {$context.labels.proficiency}
        </b>
        {#if $context.owner && !$context.lockSensitiveFields}
          <button
            type="button"
            class="inline-icon-button"
            title={localize('T5EK.OriginSummaryConfig')}
            on:click={() =>
              new Tidy5eActorOriginSummaryConfig($context.actor).render(true)}
          >
            <i class="fas fa-cog" />
          </button>
        {/if}
      </span>
    </section>
    <ActorMovementRow />
    <HorizontalLineSeparator borderColor="light" />
    <!-- AC  -->
    <ActorHeaderStats
      {abilities}
      ac={$context.system.attributes.ac}
      init={$context.system.attributes.init}
    />
  </div>
</header>

<Tabs {tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if $context.owner}
      <AllowEditLock
        hint={$settingStore.permanentlyUnlockCharacterSheetForGm &&
        FoundryAdapter.userIsGm()
          ? localize(
              'T5EK.Settings.PermanentlyUnlockCharacterSheetForGM.title'
            )
          : null}
      />
    {/if}
  </svelte:fragment>
</Tabs>

<section class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</section>

<style lang="scss">
  .tidy5e-kgar-sheet-header {
    display: flex;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5ek-header-background);

    :global(.current-xp) {
      height: 1rem;
      width: calc(10.5ch + 0.3rem);
      text-align: right;
      padding: 0 0.25rem;
    }

    :global(.max-xp) {
      height: 1rem;
      width: calc(10.5ch + 0.3rem);
      text-align: left;
      padding: 0 0.25rem;
    }

    .xp-tracker {
      max-width: 7rem;
    }

    .xp-bar-total {
      width: 100%;
      height: 0.3125rem;
      border: 0.0625rem solid var(--t5ek-tertiary-color);
      border-radius: 0.125rem;
      background: var(--t5ek-light-color);
      position: relative;
    }

    .xp-bar-current {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      max-width: 100%;
      background: var(--t5ek-xp-bar-background);
      transition: width 0.3s ease;
    }

    .level {
      padding: 0.25rem 0.375rem;
      border-radius: 0.1875rem;
      background: var(--t5ek-faint-color);
      color: var(--t5ek-secondary-color);
      font-size: 1.25rem;
      line-height: 1;
      height: 1.5rem;
      white-space: nowrap;
    }

    .class-list {
      font-size: 0.75rem;
      margin: 0;
      padding: 0.1875rem 0 0 0;
      color: var(--t5ek-secondary-color);
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
        color: var(--t5ek-primary-font-color);
      }
    }

    .origin-summary {
      margin-left: 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.25rem;
      border-bottom: 0.0625rem solid var(--t5ek-light-color);
      border-top: 0.0625rem solid var(--t5ek-light-color);
      font-size: 0.75rem;
      line-height: 1rem;
      padding: 0.1875rem 0 0.125rem 0;
      margin-top: 0.125rem;

      .origin-points {
        flex: 1;
        display: grid;
        grid-template-columns:
          min-content /* Size */
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
