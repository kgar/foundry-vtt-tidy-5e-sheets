<script lang="ts">
  import type { CharacterSheetContext } from '../foundry/foundry-adapter';
  import { onMount } from 'svelte';
  import { FoundryAdapter } from '../foundry/foundry-adapter';
  import type { SheetFunctions, TidyDropdownOption } from 'src/types/types';
  import { log } from 'src/utils/logging';
  import { SettingsProvider } from 'src/settings/settings';
  import Tidy5eActorOriginSummaryConfig from './tidy5e-actor-origin-summary-config';
  import CharacterProfile from './character-profile.svelte';
  import TidyDropdownList from './tidy-dropdown-list.svelte';
  import AcShield from './ac-shield.svelte';
  import AttributeBlock from './attribute-block.svelte';
  import InitiativeBlock from './initiative-block.svelte';
  import ActorWarnings from './actor-warnings.svelte';
  import AttributesTab from 'src/components/player-character/attributes-tab.svelte';
  import InventoryTab from 'src/components/player-character/inventory-tab.svelte';
  import SpellbookTab from 'src/components/player-character/spellbook-tab.svelte';
  import FeaturesTab from 'src/components/player-character/features-tab.svelte';
  import EffectsTab from 'src/components/player-character/effects-tab.svelte';
  import BiographyTab from 'src/components/player-character/biography-tab.svelte';
  import JournalTab from 'src/components/player-character/journal-tab.svelte';

  export let debug: any = 'Put any debug information here, if ya need it.';
  export let sheetFunctions: SheetFunctions;
  export let scrollTop: number = 0;
  export let scrollView: HTMLElement | undefined = undefined;
  export let isEditable: boolean;
  export let context: CharacterSheetContext;
  console.log(context);

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      sheetFunctions.submit();
    }
  }

  console.log('Tidy5e KGar', debug);
  const localize = FoundryAdapter.localize;

  onMount(() => {
    if (scrollView) {
      log('setting scroll top to ' + scrollTop);
      scrollView.scrollTop = scrollTop;
      // const tab = actor.getFlag(CONSTANTS.MODULE_ID, 'tab') ?? 0;
    }
    sheetFunctions.activateListeners();
  });

  let playerName = FoundryAdapter.tryGetFlag(context.actor, 'playerName');

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

  let selectedTab: string =
    SettingsProvider.settings.defaultActionsTab.get() != 'default'
      ? SettingsProvider.settings.defaultActionsTab.get()
      : 'attributes';
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
            bind:textContent={context.actor.name}
            on:blur={sheetFunctions.submit}
            on:keypress={submitWhenEnterKey}
          />
        {:else}
          <h1>
            {context.actor.name}
          </h1>
        {/if}
        <input
          name="name"
          type="hidden"
          value={context.actor.name}
          placeholder={localize('DND5E.Name')}
          maxlength="40"
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
                name="system.details.xp.value"
                value={context.system.details.xp.value}
                placeholder="0"
                data-dtype="Number"
                maxlength="7"
              />
              <span class="sep">/</span>
              {#if FoundryAdapter.userIsGm()}
                <input
                  class="max-xp max"
                  type="text"
                  name="system.details.xp.max"
                  value={context.system.details.xp.max}
                  placeholder="0"
                  data-dtype="Number"
                  maxlength="7"
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
            name="flags.tidy5e-sheet-kgar.playerName"
            type="hidden"
            value={playerName}
            placeholder={localize('T5EK.PlayerName')}
            maxlength="40"
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
            data-tooltip={localize('TIDY5E.OriginSummaryConfig')}
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
<nav
  class="tidy5e-kgar-navigation tabs"
  class:allow-edit={FoundryAdapter.tryGetFlag(context.actor, 'allow-edit') ??
    false}
>
  <a
    class="item"
    class:active={selectedTab === 'attributes'}
    on:click={() => (selectedTab = 'attributes')}
    >{localize('DND5E.Attributes')}</a
  >
  <a
    class="item"
    class:active={selectedTab === 'inventory'}
    on:click={() => (selectedTab = 'inventory')}
    >{localize('DND5E.Inventory')}</a
  >
  <a
    class="item"
    class:active={selectedTab === 'spellbook'}
    on:click={() => (selectedTab = 'spellbook')}
    >{localize('DND5E.Spellbook')}</a
  >
  <a
    class="item"
    class:active={selectedTab === 'features'}
    on:click={() => (selectedTab = 'features')}>{localize('DND5E.Features')}</a
  >
  <a
    class="item"
    class:active={selectedTab === 'effects'}
    on:click={() => (selectedTab = 'effects')}>{localize('DND5E.Effects')}</a
  >
  <a
    class="item"
    class:active={selectedTab === 'biography'}
    on:click={() => (selectedTab = 'biography')}
    >{localize('DND5E.Biography')}</a
  >
  {#if context.owner && !SettingsProvider.settings.journalTabDisabled.get()}
    <a
      class="item"
      class:active={selectedTab === 'journal'}
      on:click={() => (selectedTab = 'journal')}>{localize('TIDY5E.Journal')}</a
    >
  {/if}
  {#if context.owner}
    <div class="toggle-allow-edit">
      <span
        ><i
          class="fas fa-lock"
          title="{localize('TIDY5E.EnableEdit')} - {localize(
            'TIDY5E.EditHint'
          )}"
        /><i
          class="fas fa-lock-open"
          title="{localize('TIDY5E.DisableEdit')} - {localize(
            'TIDY5E.EditHint'
          )}"
        /></span
      >
    </div>
  {/if}
</nav>

<!-- Tabs -->
<!-- Lock -->
<section class="sheet-body" bind:this={scrollView}>
  {#if selectedTab === 'attributes'}
    <AttributesTab />
  {:else if selectedTab === 'inventory'}
    <InventoryTab />
  {:else if selectedTab === 'spellbook'}
    <SpellbookTab />
  {:else if selectedTab === 'features'}
    <FeaturesTab />
  {:else if selectedTab === 'effects'}
    <EffectsTab />
  {:else if selectedTab === 'biography'}
    <BiographyTab />
  {:else if selectedTab === 'journal' && !SettingsProvider.settings.journalTabDisabled.get()}
    <JournalTab />
  {/if}
</section>

<!-- Cross-cutting: Item Info Card -->

<!-- <article style="height: 200px;">
  <div>Test: Background Editor</div>

  <SheetEditor
    content={context.system.details.background}
    target="system.details.background"
    editable={context.owner || FoundryAdapter.userIsGm()}
  />
</article>
<article style="height: 200px;">
  <div>Test: Bond Editor</div>
  <SheetEditor
    content={context.system.details.bond}
    target="system.details.bond"
    editable={context.owner || FoundryAdapter.userIsGm()}
  />
</article>
<article style="height: 200px;">
  <div>Test: Flaw Editor</div>
  <SheetEditor
    content={context.system.details.flaw}
    target="system.details.flaw"
    editable={context.owner || FoundryAdapter.userIsGm()}
  />
</article>

<p>
  Actor Name: {context.actor.name}<br />
  Owner: {context.owner}
</p>

<p>
  HP: {context.system.attributes.hp.value} / {context.system.attributes.hp
    .max}
</p>

{#each actorReference.abilitiesList as ability}
  <div style="display: flex;">
    <button
      on:click={(event) =>
        context.actor.rollAbility(ability.abbreviation, { event })}
      >{actorReference.abilities[ability.abbreviation].label}</button
    >
    <button
      on:click={(event) =>
        context.actor.rollAbilityTest(ability.abbreviation, { event })}
      >Do a {actorReference.abilities[ability.abbreviation].label} roll!</button
    >
    <button
      on:click={(event) =>
        context.actor.rollAbilitySave(ability.abbreviation, { event })}
      >Make a {actorReference.abilities[ability.abbreviation].label} save!</button
    >
  </div>
{/each}
<hr />
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
  {#each actorReference.skillsList as skill}
    <button
      on:click={(event) =>
        context.actor.rollSkill(skill.abbreviation, { event })}
      >{actorReference.skills[skill.abbreviation].label}</button
    >
  {/each}
</div> -->

<style lang="scss">
  .tidy5e-kgar-sheet-header {
    display: flex;
    justify-content: center;
    padding: 10px 16px 16px 16px;
    background: var(--t5e-header-background);
  }
</style>
