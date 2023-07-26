<script lang="ts">
  import { onMount } from 'svelte';
  import { FoundryAdapter } from '../foundry/foundry-adapter';
  import type {
    ActorSheetContext,
    SheetFunctions,
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
  import { debounce } from 'src/utils/debounce';
  import type { SheetParameter } from 'src/utils/sheet-parameter';
  import { CONSTANTS } from 'src/constants';
  import { submitText } from './form';
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import Tabs from 'src/components/shared/Tabs.svelte';

  export let debug: any = 'Put any debug information here, if ya need it.';
  export let sheetFunctions: SheetFunctions;
  export let currentTabParam: SheetParameter<string>;
  export let tabToScrollTopMap: Map<string, number>;
  export let scrollView: HTMLElement | undefined = undefined;
  export let isEditable: boolean;
  export let context: ActorSheetContext;

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      context.actor.update({ name: characterName });
    }
  }

  const localize = FoundryAdapter.localize;

  onMount(() => {
    sheetFunctions.activateListeners();
  });

  let playerName = FoundryAdapter.tryGetFlag(context.actor, 'playerName');
  let characterName = context.actor.name;

  /*
  Loop through items
  When item.type === 'class', get item.name and item.system.levels (number)
  -> then classMap.set(item.system.identifier, {...(classMap.get(item.system.identifier) ?? {}), className, levels})
  When item.type === 'subclass', get item.name

  */

  const classAndSubclassSummaries = Array.from(
    FoundryAdapter.getClassAndSubclassSummaries(context.actor).values()
  );

  const characterSummaryEntries =
    FoundryAdapter.getActorCharacterSummaryEntries(context);

  $: abilities = Object.entries<any>(context.abilities);

  const sizes: TidyDropdownOption[] = Object.entries(
    context.config.actorSizes
  ).map(([abbreviation, size]) => ({
    value: abbreviation,
    text: size as string,
  }));

  const currentSize: TidyDropdownOption = {
    value: context.system.traits.size,
    text: context.config.actorSizes[context.system.traits.size],
  };

  const allowJournal =
    context.owner && !SettingsProvider.settings.journalTabDisabled.get();

  const tabs: Tab[] = [
    { id: 'attributes', displayName: localize('DND5E.Attributes') },
    { id: 'inventory', displayName: localize('DND5E.Inventory') },
    { id: 'spellbook', displayName: localize('DND5E.Spellbook') },
    { id: 'features', displayName: localize('DND5E.Features') },
    { id: 'effects', displayName: localize('DND5E.Effects') },
    { id: 'biography', displayName: localize('DND5E.Biography') },
  ];

  if (allowJournal) {
    tabs.push({ id: 'journal', displayName: localize('T5EK.Journal') });
  }

  Hooks.call(CONSTANTS.HOOKS_RENDERING_CHARACTER_TABS, { tabs, context });

  console.log(context);

  let selectedTabId: string = currentTabParam.get();

  $: {
    currentTabParam.set(selectedTabId);
  }
</script>

{#if context.warnings.length}
  <ActorWarnings warnings={context.warnings} />
{/if}
<header class="tidy5e-kgar-sheet-header flex-row">
  <!-- Portrait -->
  <!-- FIXME: this hardcoded height is to make scroll position work while this form is unstyled.  -->
  <div class="flex-grow-0">
    <CharacterProfile {context} {sheetFunctions} />
  </div>

  <!-- Name -->
  <div class="flex-grow-1">
    <div class="flex-row justifty-content-space-between align-items-center">
      <div class="character-name">
        {#if context.owner}
          <h1
            contenteditable="true"
            spellcheck="false"
            data-placeholder={localize('DND5E.Name')}
            data-maxlength="40"
            bind:textContent={characterName}
            on:blur={(event) =>
              context.actor.update({
                name: characterName,
              })}
            on:keypress={submitWhenEnterKey}
          />
        {:else}
          <h1>
            {context.actor.name}
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
                value={context.system.details.xp.value}
                placeholder="0"
                data-dtype="Number"
                maxlength="7"
                on:change|stopPropagation|preventDefault={(event) =>
                  submitText(event, context.actor, 'system.details.xp.value')}
              />
              <span class="sep">/</span>
              {#if FoundryAdapter.userIsGm()}
                <input
                  class="max-xp max"
                  type="text"
                  value={context.system.details.xp.max}
                  placeholder="0"
                  data-dtype="Number"
                  maxlength="7"
                  on:change|stopPropagation|preventDefault={(event) =>
                    submitText(event, context.actor, 'system.details.xp.max')}
                />
              {:else}
                <span class="max">{context.system.details.xp.max}</span>
              {/if}
            </div>
            <div class="xp-bar">
              <div class="xp-bar-total">
                <span
                  class="xp-bar-current"
                  style="width: {context.system.details.xp.pct}%"
                />
              </div>
            </div>
          </div>
        {/if}
        <!-- Level -->
        <div class="flex-grow-0">
          <h2 class="level">
            {localize('DND5E.AbbreviationLevel')}
            {context.system.details.level}
          </h2>
        </div>
      </div>
    </div>

    <section class="class-list">
      <!-- Player Name -->
      {#if SettingsProvider.settings.playerNameEnabled.get()}
        {#if context.owner}
          <input
            type="hidden"
            value={playerName}
            placeholder={localize('T5EK.PlayerName')}
            maxlength="40"
            on:change|stopPropagation|preventDefault={(event) =>
              submitText(
                event,
                context.actor,
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
            on:blur={sheetFunctions.submit}
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
      {#if isEditable}
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
            context.actor.update({ 'system.traits.size': event.detail.value })}
        />
        {#each characterSummaryEntries as entry}
          <span>&#8226;</span>
          <span data-tooltip={entry} class="truncate">{entry}</span>
        {/each}
      </span>
      <span class="flex-row align-items-center extra-small-gap">
        <b>
          {localize('DND5E.Proficiency')}: {context.labels.proficiency}
        </b>
        {#if context.owner}
          <a
            class="config-button origin-summary-tidy"
            data-tooltip={localize('T5EK.OriginSummaryConfig')}
            on:click={() =>
              new Tidy5eActorOriginSummaryConfig(context.actor).render(true)}
          >
            <i class="fas fa-cog" />
          </a>
        {/if}
      </span>
    </section>
    <!-- Speed , Configure Movement Speed Cog -->
    <section class="movement flex-row small-gap">
      <h4>{localize('DND5E.Speed')}</h4>
      {#if context.movement.primary}
        <span data-tooltip={context.movement.primary}
          >{context.movement.primary}</span
        >
      {/if}
      {#if context.movement.special}
        |
        <span data-tooltip={context.movement.special}
          >{context.movement.special}</span
        >
      {/if}
      <a
        class="configure"
        data-tooltip={localize('DND5E.MovementConfig')}
        on:click={() =>
          new dnd5e.applications.actor.ActorMovementConfig(
            context.actor
          ).render(true)}><i class="fas fa-cog" /></a
      >
    </section>
    <!-- AC  -->
    <section class="character-stats">
      <!-- TODO: switch these back to unordered <li> -->
      <AcShield
        ac={context.system.attributes.ac.value}
        on:click={() =>
          new dnd5e.applications.actor.ActorArmorConfig(context.actor).render(
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
          actor={context.actor}
          initiative={context.system.attributes.init}
        />
      </div>
      {#each abilities as [id, ability]}
        <div
          class="horizontal-separator"
          aria-hidden="true"
          role="presentation"
        />
        <div>
          <AttributeBlock abbreviation={id} {ability} actor={context.actor} />
        </div>
      {/each}
    </section>
  </div>
</header>
<!-- TODO: To component? -->
<Tabs {tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if context.owner}
      <AllowEditLock {context} />
    {/if}
  </svelte:fragment>
</Tabs>

<!-- Tabs -->
<!-- Lock -->
<section class="sheet-body" bind:this={scrollView}>
  <section class="tab attributes" class:active={selectedTabId === 'attributes'}>
    <AttributesTab {context} {sheetFunctions} />
  </section>
  <section class="tab inventory" class:active={selectedTabId === 'inventory'}>
    <InventoryTab {context} {sheetFunctions} />
  </section>
  <section class="tab spellbook" class:active={selectedTabId === 'spellbook'}>
    <SpellbookTab {context} {sheetFunctions} />
  </section>
  <section class="tab features" class:active={selectedTabId === 'features'}>
    <FeaturesTab {context} {sheetFunctions} />
  </section>
  <section class="tab effects" class:active={selectedTabId === 'effects'}>
    <EffectsTab {context} />
  </section>
  <section class="tab biography" class:active={selectedTabId === 'biography'}>
    <BiographyTab {context} {sheetFunctions} />
  </section>
  {#if allowJournal}
    <section class="tab journal" class:active={selectedTabId === 'journal'}>
      <JournalTab {context} />
    </section>
  {/if}
</section>

<!-- Cross-cutting: Item Info Card -->

<style lang="scss">
  .tidy5e-kgar-sheet-header {
    display: flex;
    justify-content: center;
    padding: 10px 16px 16px 16px;
    background: var(--t5e-header-background);
  }

  .tab {
    height: 100%;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: #782e22 #0000;
    display: none;

    &.active {
      display: flex;
    }

    &.attributes {
      overflow-y: scroll;
      padding-right: 0.75rem;
    }

    &.biography,
    &.journal {
      align-items: flex-start;
      flex-direction: row;
      padding-right: 0.75rem;
      overflow-x: inherit;
    }

    &.biography,
    &.journal {
      font-size: 0.8125rem;
    }

    &.biography {
      flex-wrap: wrap;
    }

    &.grid .toggle-grid,
    .toggle-list {
      display: none;
    }

    .toggle-grid,
    &.grid .toggle-list {
      display: inline-block;
    }
  }
</style>
