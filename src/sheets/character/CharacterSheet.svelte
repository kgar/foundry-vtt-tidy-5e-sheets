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
  import { submitText } from '../form';
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import type { Readable } from 'svelte/store';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import ActorMovementRow from '../actor/ActorMovementRow.svelte';
  import ActorHeaderStats from '../actor/ActorHeaderStats.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';

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

  let playerName = FoundryAdapter.tryGetFlag($store.actor, 'playerName');
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
  <!-- Portrait -->
  <!-- FIXME: this hardcoded height is to make scroll position work while this form is unstyled.  -->
  <div class="flex-grow-0">
    <CharacterProfile />
  </div>

  <!-- Name -->
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
              <input
                class="current-xp"
                type="text"
                value={$store.system.details.xp.value}
                placeholder="0"
                data-dtype="Number"
                maxlength="7"
                on:change|stopPropagation|preventDefault={(event) =>
                  submitText(event, $store.actor, 'system.details.xp.value')}
              />
              <span class="sep">/</span>
              {#if FoundryAdapter.userIsGm()}
                <input
                  class="max-xp max"
                  type="text"
                  value={$store.system.details.xp.max}
                  placeholder="0"
                  data-dtype="Number"
                  maxlength="7"
                  on:change|stopPropagation|preventDefault={(event) =>
                    submitText(event, $store.actor, 'system.details.xp.max')}
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
        <!-- Level -->
        <div class="flex-grow-0">
          <h2 class="level">
            {localize('DND5E.AbbreviationLevel')}
            {$store.system.details.level}
          </h2>
        </div>
      </div>
    </div>

    <section class="class-list">
      <!-- Player Name -->
      {#if SettingsProvider.settings.playerNameEnabled.get()}
        {#if $store.owner}
          <input
            type="hidden"
            value={playerName}
            placeholder={localize('T5EK.PlayerName')}
            maxlength="40"
            on:change|stopPropagation|preventDefault={(event) =>
              submitText(
                event,
                $store.actor,
                `flags.${CONSTANTS.MODULE_ID}.playerName`
              )}
          />
          <span
            contenteditable="true"
            spellcheck="false"
            class="player-name"
            data-placeholder={localize('T5EK.PlayerName')}
            data-maxlength="40"
            bind:textContent={playerName}
            on:blur={() => $store.actor.update({ name: characterName })}
            on:keypress={submitWhenEnterKey}
          />
          <span>&#8226;</span>
        {:else}
          <span data-placeholder={localize('T5EK.PlayerName')}
            >{playerName}</span
          >
          <span>&#8226;</span>
        {/if}
      {/if}

      <!-- Class / Subclass -->
      {#if $store.editable}
        <span class="flex-row extra-small-gap">
          {#each classAndSubclassSummaries as summary, i}
            {#if i > 0}
              <span class="flex-no-grow">/</span>
            {/if}
            <span class="flex-no-grow">
              <span data-tooltip="{summary.class} {summary.level ?? '0'}"
                >{summary.class}
                {summary.level ?? '0'}
              </span>
              {#if summary.subclass}
                <span data-tooltip={summary.subclass} class="flex-no-grow"
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
          <span data-tooltip={entry} class="truncate">{entry}</span>
        {/each}
      </span>
      <span class="flex-row align-items-center extra-small-gap">
        <b>
          {localize('DND5E.Proficiency')}: {$store.labels.proficiency}
        </b>
        {#if $store.owner}
          <a
            class="origin-summary-tidy"
            data-tooltip={localize('T5EK.OriginSummaryConfig')}
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
