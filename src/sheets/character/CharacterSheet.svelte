<script lang="ts">
  import { getContext } from 'svelte';
  import { FoundryAdapter } from '../../foundry/foundry-adapter';
  import type {
    ActorSheetContext,
    Tab,
    TidyDropdownOption,
  } from 'src/types/types';
  import { SettingsProvider } from 'src/settings/settings';
  import Tidy5eActorOriginSummaryConfig from '../tidy5e-actor-origin-summary-config';
  import CharacterProfile from './parts/CharacterProfile.svelte';
  import TidyDropdownList from '../TidyDropdownList.svelte';
  import ActorWarnings from '../ActorWarnings.svelte';
  import CharacterAttributesTab from 'src/components/player-character/CharacterAttributesTab.svelte';
  import CharacterInventoryTab from 'src/components/player-character/CharacterInventoryTab.svelte';
  import CharacterSpellbookTab from 'src/components/player-character/CharacterSpellbookTab.svelte';
  import CharacterFeaturesTab from 'src/components/player-character/CharacterFeaturesTab.svelte';
  import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
  import CharacterBiographyTab from 'src/components/player-character/CharacterBiographyTab.svelte';
  import ActorJournalTab from 'src/components/player-character/ActorJournalTab.svelte';
  import { CONSTANTS } from 'src/constants';
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import type { Readable } from 'svelte/store';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import ActorMovementRow from '../actor/ActorMovementRow.svelte';
  import ActorHeaderStats from '../actor/ActorHeaderStats.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';

  export let debug: any = 'Put any debug information here, if ya need it.';
  export let selectedTabId: string;
  let store = getContext<Readable<ActorSheetContext>>('store');

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      $store.actor.update({ name: characterName });
    }
  }

  const localize = FoundryAdapter.localize;

  $: playerName =
    FoundryAdapter.tryGetFlag<string>($store.actor, 'playerName') ?? '';
  let characterName = $store.actor.name;

  /*
  Loop through items
  When item.type === 'class', get item.name and item.system.levels (number)
  -> then classMap.set(item.system.identifier, {...(classMap.get(item.system.identifier) ?? {}), className, levels})
  When item.type === 'subclass', get item.name

  */

  $: classAndSubclassSummaries = Array.from(
    FoundryAdapter.getClassAndSubclassSummaries($store.actor).values()
  );

  $: characterSummaryEntries =
    FoundryAdapter.getActorCharacterSummaryEntries($store);

  $: abilities = Object.entries<any>($store.abilities);

  $: sizes = <TidyDropdownOption[]>Object.entries($store.config.actorSizes).map(
    ([abbreviation, size]) => ({
      value: abbreviation,
      text: size as string,
    })
  );

  $: currentSize = <TidyDropdownOption>{
    value: $store.system.traits.size,
    text: $store.config.actorSizes[$store.system.traits.size],
  };

  let tabs: Tab[] = [];
  $: {
    tabs = [
      {
        id: 'attributes',
        displayName: 'DND5E.Attributes',
        content: {
          component: CharacterAttributesTab,
        },
      },
      {
        id: 'inventory',
        displayName: 'DND5E.Inventory',
        content: {
          component: CharacterInventoryTab,
        },
      },
      {
        id: 'spellbook',
        displayName: 'DND5E.Spellbook',
        content: {
          component: CharacterSpellbookTab,
        },
      },
      {
        id: 'features',
        displayName: 'DND5E.Features',
        content: {
          component: CharacterFeaturesTab,
        },
      },
      {
        id: 'effects',
        displayName: 'DND5E.Effects',
        content: {
          component: ActorEffectsTab,
          props: {
            classicControlsEnabled:
              SettingsProvider.settings.classicControlsEnabled.get(),
          },
        },
      },
      {
        id: 'biography',
        displayName: 'DND5E.Biography',
        content: {
          component: CharacterBiographyTab,
        },
      },
    ];

    const allowJournal =
      $store.owner && !SettingsProvider.settings.journalTabDisabled.get();

    if (allowJournal) {
      tabs.push({
        id: 'journal',
        displayName: 'T5EK.Journal',
        content: {
          component: ActorJournalTab,
        },
      });
    }
  }

  Hooks.call(CONSTANTS.HOOKS_RENDERING_CHARACTER_TABS, {
    tabs,
    context: $store,
  });

  $: {
    console.log($store);
  }
</script>

{#if $store.warnings.length}
  <ActorWarnings warnings={$store.warnings} />
{/if}
<header class="tidy5e-kgar-sheet-header flex-row">
  <div class="flex-0">
    <CharacterProfile />
  </div>

  <div class="flex-grow-1">
    <div class="flex-row justifty-content-space-between align-items-center">
      <div class="actor-name">
        <ContentEditableFormField
          element="h1"
          document={$store.actor}
          editable={$store.owner}
          spellcheck={false}
          placeholder={localize('DND5E.Name')}
          dataMaxLength={40}
          value={characterName}
          field="name"
        />
      </div>

      <div class="flex-row small-gap align-items-right">
        {#if !game.settings.get('dnd5e', 'disableExperienceTracking')}
          <!-- XP / XP To Next Level -->
          <div class="xp-tracker">
            <div class="experience flex-row no-gap">
              <TextInput
                document={$store.actor}
                field="system.details.xp.value"
                cssClass="current-xp"
                value={$store.system.details.xp.value}
                placeholder="0"
                dtype="Number"
                selectOnFocus={true}
                allowDeltaChanges={true}
                maxlength={7}
              />
              <span class="sep">/</span>
              {#if FoundryAdapter.userIsGm()}
                <TextInput
                  document={$store.actor}
                  field="system.details.xp.max"
                  cssClass="max-xp max"
                  value={$store.system.details.xp.max}
                  placeholder="0"
                  dtype="Number"
                  selectOnFocus={true}
                  allowDeltaChanges={true}
                  maxlength={7}
                />
              {:else}
                <span class="max">{$store.system.details.xp.max}</span>
              {/if}
            </div>
            <div class="xp-bar">
              <div class="xp-bar-total">
                <span
                  class="xp-bar-current"
                  style="width: {$store.system.details.xp.pct}%"
                />
              </div>
            </div>
          </div>
        {/if}
        <h2 class="level">
          {localize('DND5E.AbbreviationLevel')}
          {$store.system.details.level}
        </h2>
      </div>
    </div>

    <section class="class-list">
      <!-- Player Name -->
      {#if SettingsProvider.settings.playerNameEnabled.get()}
        <ContentEditableFormField
          element="span"
          document={$store.actor}
          field="flags.{CONSTANTS.MODULE_ID}.playerName"
          value={playerName}
          cssClass="player-name"
          placeholder={localize('T5EK.PlayerName')}
          dataMaxLength={40}
          editable={$store.owner}
        />
        <!-- <span>&#8226;</span> -->
      {/if}

      <!-- Class / Subclass -->
      {#if $store.editable}
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
        <!-- TODO: Consider implementing the hidden select that the original sheet has, or figure out a way to format this select in such a way that it agrees with the rest of the layout instead of undermining it. -->
        <TidyDropdownList
          options={sizes}
          selected={currentSize}
          on:optionClicked={(event) =>
            $store.actor.update({
              'system.traits.size': event.detail.value,
            })}
        />
        {#each characterSummaryEntries as entry}
          <span>&#8226;</span>
          <span title={entry} class="truncate">{entry}</span>
        {/each}
      </span>
      <span class="flex-row align-items-center extra-small-gap">
        <b>
          {localize('DND5E.Proficiency')}: {$store.labels.proficiency}
        </b>
        {#if $store.owner}
          <a
            class="origin-summary-tidy"
            title={localize('T5EK.OriginSummaryConfig')}
            on:click={() =>
              new Tidy5eActorOriginSummaryConfig($store.actor).render(true)}
          >
            <i class="fas fa-cog" />
          </a>
        {/if}
      </span>
    </section>
    <ActorMovementRow actor={$store.actor} movement={$store.movement} />
    <HorizontalLineSeparator borderStyle="light" />
    <!-- AC  -->
    <ActorHeaderStats
      {abilities}
      ac={$store.system.attributes.ac}
      init={$store.system.attributes.init}
      actor={$store.actor}
    />
  </div>
</header>

<Tabs {tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if $store.owner}
      <AllowEditLock />
    {/if}
  </svelte:fragment>
</Tabs>

<section class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</section>

<!-- Cross-cutting: Item Info Card -->

<style lang="scss">
  .tidy5e-kgar-sheet-header {
    display: flex;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);

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
      height: 5px;
      border: 1px solid var(--t5e-tertiary-color);
      border-radius: 2px;
      background: var(--t5e-light-color);
      position: relative;
    }

    .xp-bar-current {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      max-width: 100%;
      background: var(--t5e-xp-bar);
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
      }
    }

    .origin-summary {
      margin-left: 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.25rem;
      border-bottom: 1px solid var(--t5e-light-color);
      border-top: 1px solid var(--t5e-light-color);
      font-size: 0.75rem;
      line-height: 1;
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

  .sheet-body {
    :global(.tab.attributes) {
      overflow-y: scroll;
      padding-right: 0.75rem;
    }

    :global(.tab.biography),
    :global(.tab.journal) {
      align-items: flex-start;
      flex-direction: row;
      padding-right: 0.75rem;
      overflow-x: inherit;
    }

    :global(.tab.biography),
    :global(.tab.journal) {
      font-size: 0.8125rem;
    }

    :global(.tab.biography) {
      flex-wrap: wrap;
    }
  }
</style>
