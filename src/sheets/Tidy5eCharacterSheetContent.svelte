<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import { FoundryAdapter } from '../foundry/foundry-adapter';
  import type {
    ActorSheetContext,
    Tab,
    TidyDropdownOption,
  } from 'src/types/types';
  import { SettingsProvider } from 'src/settings/settings';
  import Tidy5eActorOriginSummaryConfig from './tidy5e-actor-origin-summary-config';
  import CharacterProfile from './CharacterProfile.svelte';
  import TidyDropdownList from './TidyDropdownList.svelte';
  import AcShield from './AcShield.svelte';
  import AttributeBlock from './AttributeBlock.svelte';
  import InitiativeBlock from './InitiativeBlock.svelte';
  import ActorWarnings from './ActorWarnings.svelte';
  import AttributesTab from 'src/components/player-character/AttributesTab.svelte';
  import InventoryTab from 'src/components/player-character/InventoryTab.svelte';
  import SpellbookTab from 'src/components/player-character/SpellbookTab.svelte';
  import FeaturesTab from 'src/components/player-character/FeaturesTab.svelte';
  import EffectsTab from 'src/components/player-character/EffectsTab.svelte';
  import BiographyTab from 'src/components/player-character/BiographyTab.svelte';
  import JournalTab from 'src/components/player-character/JournalTab.svelte';
  import { CONSTANTS } from 'src/constants';
  import { submitText } from './form';
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import type { Readable } from 'svelte/store';

  export let debug: any = 'Put any debug information here, if ya need it.';
  export let selectedTabId: string;
  let store = getContext<Readable<ActorSheetContext>>('store');

  setContext('store', store);

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
    const allowJournal =
      $store.owner && !SettingsProvider.settings.journalTabDisabled.get();

    tabs = [
      {
        id: 'attributes',
        displayName: 'DND5E.Attributes',
        content: {
          component: AttributesTab,
        },
      },
      {
        id: 'inventory',
        displayName: 'DND5E.Inventory',
        content: {
          component: InventoryTab,
        },
      },
      {
        id: 'spellbook',
        displayName: 'DND5E.Spellbook',
        content: {
          component: SpellbookTab,
        },
      },
      {
        id: 'features',
        displayName: 'DND5E.Features',
        content: {
          component: FeaturesTab,
        },
      },
      {
        id: 'effects',
        displayName: 'DND5E.Effects',
        content: {
          component: EffectsTab,
        },
      },
      {
        id: 'biography',
        displayName: 'DND5E.Biography',
        content: {
          component: BiographyTab,
        },
      },
    ];

    if (allowJournal) {
      tabs.push({
        id: 'journal',
        displayName: 'T5EK.Journal',
        content: {
          component: JournalTab,
          props: { context: $store },
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
      <div class="character-name">
        {#if $store.owner}
          <h1
            contenteditable="true"
            spellcheck="false"
            data-placeholder={localize('DND5E.Name')}
            data-maxlength="40"
            bind:textContent={characterName}
            on:keypress={submitWhenEnterKey}
            on:blur={() =>
              $store.actor.update({
                name: characterName,
              })}
          />
        {:else}
          <h1>
            {$store.actor.name}
          </h1>
        {/if}
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
            class="config-button origin-summary-tidy"
            data-tooltip={localize('T5EK.OriginSummaryConfig')}
            on:click={() =>
              new Tidy5eActorOriginSummaryConfig($store.actor).render(true)}
          >
            <i class="fas fa-cog" />
          </a>
        {/if}
      </span>
    </section>
    <!-- Speed , Configure Movement Speed Cog -->
    <section class="movement flex-row small-gap">
      <h4>{localize('DND5E.Speed')}</h4>
      {#if $store.movement.primary}
        <span data-tooltip={$store.movement.primary}
          >{$store.movement.primary}</span
        >
      {/if}
      {#if $store.movement.special}
        |
        <span data-tooltip={$store.movement.special}
          >{$store.movement.special}</span
        >
      {/if}
      <a
        class="configure"
        data-tooltip={localize('DND5E.MovementConfig')}
        on:click={() =>
          new dnd5e.applications.actor.ActorMovementConfig($store.actor).render(
            true
          )}><i class="fas fa-cog" /></a
      >
    </section>
    <!-- AC  -->
    <section class="character-stats">
      <!-- TODO: switch these back to unordered <li> -->
      <AcShield
        ac={$store.system.attributes.ac.value}
        on:click={() =>
          new dnd5e.applications.actor.ActorArmorConfig($store.actor).render(
            true
          )}
        cssClass="align-self-flex-start"
      />
      <div
        class="horizontal-separator"
        aria-hidden="true"
        role="presentation"
      />
      <!-- Initiative (mod, cog) , Str (rollable, score, mod, save, proficient, cog) thru Cha (rollable, score, mod, save, proficient, cog) -->
      <div>
        <InitiativeBlock
          actor={$store.actor}
          initiative={$store.system.attributes.init}
        />
      </div>
      {#each abilities as [id, ability]}
        <div
          class="horizontal-separator"
          aria-hidden="true"
          role="presentation"
        />
        <div>
          <AttributeBlock abbreviation={id} {ability} actor={$store.actor} />
        </div>
      {/each}
    </section>
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
    padding: 10px 16px 16px 16px;
    background: var(--t5e-header-background);
  }

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
</style>
