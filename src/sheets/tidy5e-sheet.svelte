<script lang="ts">
  import type { CharacterSheetContext } from '../foundry/foundry-adapter';
  import { onMount } from 'svelte';
  import { FoundryAdapter } from '../foundry/foundry-adapter';
  import type { SheetFunctions, TidyDropdownOption } from 'src/types/types';
  import { log } from 'src/utils/logging';
  import { SettingsProvider } from 'src/settings/settings';
  import Tidy5eActorOriginSummaryConfig from './tidy5e-actor-origin-summary-config';
  import { formatAsModifier } from 'src/utils/formatting';
  import CharacterPortrait from './character-portrait.svelte';
  import TidyDropdownList from './tidy-dropdown-list.svelte';

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
</script>

<header class="tidy5e-kgar-sheet-header flex-row">
  <!-- Portrait -->
  <!-- FIXME: this hardcoded height is to make scroll position work while this form is unstyled.  -->
  <div class="flex-grow-0">
    <CharacterPortrait {context} {sheetFunctions} />
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
      data-tooltip={localize('DND5E.MovementConfig')}
      on:click={() =>
        new dnd5e.applications.actor.ActorMovementConfig(context.actor).render(
          true
        )}><i class="fas fa-cog" /></a
    >
    <!-- AC  -->
    <div style="max-width: 200px">
      <svg
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 90 100"
        xml:space="preserve"
      >
        <path
          d="M45,100C-2.6,79.3,0,12.6,0,12.6c0-2.2,1.8-4,4.4-4.6l39.1-7.9C44,0,44.5,0,45,0c0.5,0,1,0,1.4,0.1L85.5,8
            c2.6,0.5,4.4,2.4,4.4,4.6C90,12.6,92.6,79.3,45,100L45,100z"
        />
      </svg>
    </div>
    <a
      class="config-button"
      data-attribution="attributes.ac"
      data-attribution-caption="DND5E.ArmorClass"
      data-tooltip-direction="DOWN"
      on:click={() =>
        new dnd5e.applications.actor.ActorArmorConfig(context.actor).render(
          true
        )}>{context.system.attributes.ac.value}</a
    >
    <!-- Initiative (mod, cog) , Str (rollable, score, mod, save, proficient, cog) thru Cha (rollable, score, mod, save, proficient, cog) -->
    <div>
      <h4
        title={localize('DND5E.Initiative')}
        on:click={(event) => context.actor.rollInitiativeDialog({ event })}
      >
        {localize('TIDY5E.AbbrInitiative')}
      </h4>
      <div class="value">
        <span>{formatAsModifier(context.system.attributes.init.total)}</span>
      </div>
      <label
        >{localize('TIDY5E.AbbrMod')}
        <input
          name="system.attributes.init.bonus"
          type="text"
          placeholder="0"
          data-dtype="Number"
          value={context.system.attributes.init.bonus}
          maxlength="2"
        />
      </label>
      <a
        data-tooltip={localize('DND5E.InitiativeConfig')}
        on:click={() =>
          new dnd5e.applications.actor.ActorInitiativeConfig(
            context.actor
          ).render(true)}
      >
        <i class="fas fa-cog" />
      </a>
    </div>
    <ul class="ability-scores">
      {#each abilities as [id, ability]}
        <li
          class:proficient={ability.proficient}
          data-ability={id}
          data-key={id}
        >
          <div>
            <h4
              data-tooltip={ability.label}
              on:click={(event) =>
                context.actor.rollAbility(ability, { event })}
            >
              {id}
            </h4>
            <div>
              <input
                type="text"
                name="system.abilities.{id}.value"
                value={ability.value}
                placeholder="10"
                data-dtype="Number"
              />
            </div>
            <div>
              <span
                data-tooltip={localize('DND5E.AbilityModifier')}
                on:click={(event) =>
                  context.actor.rollAbilityTest(id, { event })}
                >{formatAsModifier(ability.mod)}</span
              >
              <span
                data-tooltip={localize('DND5E.ActionSave')}
                on:click={(event) =>
                  context.actor.rollAbilitySave(id, { event })}
                >{formatAsModifier(ability.save)}</span
              >
              <input
                type="hidden"
                name="system.abilities.{id}.proficient"
                value={ability.proficient}
                data-dtype="Number"
              />
              <a
                title={localize('DND5E.Proficiency')}
                on:click={() =>
                  context.actor.update({
                    [`system.abilities.${id}.proficient`]:
                      1 - parseInt(ability.proficient),
                  })}
              >
                {@html ability.icon}
              </a>
              <a
                data-tooltip={localize('DND5E.AbilityConfigure')}
                on:click={() =>
                  new dnd5e.applications.actor.ActorAbilityConfig(
                    context.actor,
                    null,
                    id
                  ).render(true)}
              >
                <i class="fas fa-cog" />
              </a>
            </div>
            <span class="mod-label ability-mod-label"
              >{localize('TIDY5E.AbbrMod')}</span
            >
            <span class="mod-label save-mod-label"
              >{localize('TIDY5E.AbbrSavingThrow')}</span
            >
          </div>
        </li>
      {/each}
    </ul>
  </div>
</header>
<nav class="tidy5e-kgar-sheet-tabs">TODO: Tabs and Lock Here</nav>
<section
  class="tidy5e-kgar-tab-contents"
  style="height: 100%; overflow-y: scroll; overflow-x: hidden"
  bind:this={scrollView}
>
  Tab content area / Scroll View area
  <!-- Tabs -->
  <!-- Lock -->

  <!-- Tab: Attributes -->

  <!-- Tab: Inventory -->

  <!-- Tab: Spellbook -->

  <!-- Tab: Features -->

  <!-- Tab: Effects -->

  <!-- Tab: Biography -->

  <!-- Tab: Journal -->

  <!-- Cross-cutting: Item Info Card -->
</section>

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
