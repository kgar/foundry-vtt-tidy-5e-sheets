<script lang="ts">
  import type { Actor5e } from '../foundry/foundry-adapter';
  import { onMount } from 'svelte';
  import { FoundryAdapter } from '../foundry/foundry-adapter';
  import SheetEditor from './sheet-editor.svelte';
  import type { SheetFunctions } from 'src/types/types';

  export let actor: Actor5e;
  export let debug: any = 'Put any debug information here, if ya need it.';
  export let sheetFunctions: SheetFunctions;
  export let scrollTop: number = 0;
  export let scrollView: HTMLElement | undefined = undefined;

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      sheetFunctions.submit();
    }
  }

  console.log('Tidy5e KGar', debug);
  const actorReference = FoundryAdapter.getActorReference();
  const localize = FoundryAdapter.localize;

  onMount(() => {
    if (scrollView) {
      console.log('setting scroll top to ' + scrollTop);
      scrollView.scrollTop = scrollTop;
      // const tab = actor.getFlag(CONSTANTS.MODULE_ID, 'tab') ?? 0;
    }
    sheetFunctions.activateListeners();
  });
</script>

<div
  style="height: 100%; overflow-y: scroll; overflow-x: hidden"
  bind:this={scrollView}
>
  <!-- Portrait -->
  <!-- FIXME: this hardcoded height is to make scroll position work while this form is unstyled.  -->
  <div style="height: 200px">
    <img
      src={actor.img}
      alt={actor.name}
      title={localize('T5EK.EditActorImage') +
        ' / ' +
        localize('T5EK.ShowActorImage')}
      style="height: 200px"
      on:click={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const target = event.currentTarget;
        const current = foundry.utils.getProperty(actor, 'img');
        const originalEvent = event;
        const fp = new FilePicker({
          type: 'image',
          current,
          callback: (path) => {
            target.src = path;
            sheetFunctions.submit();
            actor.update({ img: path });
          },
          top: rect.top + 40,
          left: rect.left + 10,
        });
        return fp.browse();
      }}
    />
    <div>
      <a
        on:click={() =>
          new ImagePopout(actor.img, {
            title: 'Portrait: ' + actor.name,
            shareable: true,
            uuid: actor.uuid,
          }).render(true)}>{localize('TIDY5E.ShowPortraitArt')}</a
      >
      <a
        on:click={() =>
          new ImagePopout(actor.prototypeToken.texture.src, {
            title: 'Portrait: ' + actor.name,
            shareable: true,
            uuid: actor.uuid,
          }).render(true)}>{localize('TIDY5E.ShowTokenArt')}</a
      >
    </div>
  </div>

  <!-- Death Saves -->
  <i class="fas fa-check" />
  <input
    type="text"
    name="system.attributes.death.success"
    data-dtype="Number"
    placeholder="0"
    value={actor.system.attributes.death.success}
    maxlength="1"
    data-tooltip={localize('T5EK.DeathSave')}
  />

  <div on:click={(event) => actor.rollDeathSave({ event })}>
    <i class="fas fa-skull" />
  </div>

  <input
    type="text"
    name="system.attributes.death.failure"
    data-dtype="Number"
    placeholder="0"
    value={actor.system.attributes.death.failure}
    maxlength="1"
  />
  <i class="fas fa-times" />

  <!-- Exhaustion -->
  <!-- TODO: Learn the full breadth of exhaustion features in Tidy 5e and reimplement -->
  <div data-tooltip="TODO: Put exhaustion definition here">
    <span>
      {actor.system.attributes.exhaustion}
    </span>
    <i
      class="far"
      class:fa-grin={actor.system.attributes.exhaustion === 0}
      class:fa-smile={actor.system.attributes.exhaustion === 1}
      class:fa-meh={actor.system.attributes.exhaustion === 2}
      class:fa-frown={actor.system.attributes.exhaustion === 3}
      class:fa-frown-open={actor.system.attributes.exhaustion === 4}
      class:fa-tired={actor.system.attributes.exhaustion === 5}
      class:fa-dizzy={actor.system.attributes.exhaustion === 6}
    />
    <ul>
      <li
        on:click={() => {
          sheetFunctions.submit();
          actor.update({ 'system.attributes.exhaustion': 0 });
        }}
      >
        0
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          actor.update({ 'system.attributes.exhaustion': 1 });
        }}
      >
        1
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          actor.update({ 'system.attributes.exhaustion': 2 });
        }}
      >
        2
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          actor.update({ 'system.attributes.exhaustion': 3 });
        }}
      >
        3
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          actor.update({ 'system.attributes.exhaustion': 4 });
        }}
      >
        4
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          actor.update({ 'system.attributes.exhaustion': 5 });
        }}
      >
        5
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          actor.update({ 'system.attributes.exhaustion': 6 });
        }}
      >
        6
      </li>
    </ul>
  </div>

  <!-- DMspiration -->
  <label data-tooltip={localize('DND5E.Inspiration')}>
    <input
      type="checkbox"
      name="system.attributes.inspiration"
      data-dtype="Boolean"
      checked={actor.system.attributes.inspiration}
    />
    <i class="inspiration-icon fas fa-dice-d20" />
  </label>

  <!-- Short/Long Rest -->
  <div>
    <span data-tooltip={localize('TIDY5E.RestHint')}>
      <i class="fas fa-bed" />
    </span>
    <span
      data-tooltip={localize('TIDY5E.RestS')}
      on:click={(event) => sheetFunctions.onShortRest(event)}
    >
      <i class="fas fa-hourglass-half" />
    </span>
    <span
      data-tooltip={localize('TIDY5E.RestL')}
      on:click={(event) => sheetFunctions.onLongRest(event)}
    >
      <i class="fas fa-hourglass-end" />
    </span>
  </div>

  <!-- HP / HP Max -->
  <input
    name="system.attributes.hp.value"
    type="text"
    value={actor.system.attributes.hp.value}
    placeholder="10"
    data-tooltip={localize('DND5E.HitPointsCurrent')}
    data-dtype="Number"
    maxlength="5"
    aria-describedby="tooltip"
  />
  <span> / </span>
  <!-- TODO: Implement "Allow Max HP Override" / TIDY5E.Settings.AllowHpMaxOverride -->
  <span
    data-tooltip={actor.system.attributes.hp.max
      ? localize('DND5E.HitPointsOverride')
      : localize('DND5E.HitPointsMax')}
  >
    {actor.system.attributes.hp.max}</span
  >
  <a
    data-tooltip={localize('DND5E.HitPointsConfig')}
    on:click={new dnd5e.applications.actor.ActorHitPointsConfig(actor).render(
      true
    )}
  >
    <i class="fas fa-cog" />
  </a>

  <!-- Hit Dice -->
  <div
    data-tooltip="{localize('DND5E.HitDice')}: {actor.system.attributes
      .hd}/{actor.system.details.level}&#10;{localize('DND5E.HitDiceConfig')}"
  >
    <a
      on:click={new dnd5e.applications.actor.ActorHitDiceConfig(actor).render(
        true
      )}>{actor.system.attributes.hd}</a
    >
  </div>

  <!-- Name -->
  {#if actor.isOwner}
    <h1
      contenteditable="true"
      spellcheck="false"
      data-placeholder={localize('DND5E.Name')}
      data-maxlength="40"
      bind:textContent={actor.name}
      on:blur={sheetFunctions.submit}
      on:keypress={submitWhenEnterKey}
    />
  {:else}
    <h1>
      {actor.name}
    </h1>
  {/if}

  <input
    name="name"
    type="hidden"
    value={actor.name}
    placeholder={localize('DND5E.Name')}
    maxlength="40"
  />

  <!-- Level -->
  <h2 class="level">
    {localize('DND5E.AbbreviationLevel')}
    {actor.system.details.level}
  </h2>
  <!-- XP / XP To Next Level -->
  {#if game.settings.get('dnd5e', 'disableExperienceTracking')}
    <!-- NO XP View -->
  {:else}
    <div class="xp-tracker">
      <div class="experience">
        <input
          class="current-xp"
          type="text"
          name="system.details.xp.value"
          value={actor.system.details.xp.value}
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
            value={actor.system.details.xp.max}
            placeholder="0"
            data-dtype="Number"
            maxlength="7"
          />
        {:else}
          <span class="max">{actor.system.details.xp.max}</span>
        {/if}
      </div>
      <div class="xp-bar">
        <div class="xp-bar-total">
          <span
            class="xp-bar-current"
            style="width: {actor.system.details.xp.pct}%"
          />
        </div>
      </div>
    </div>
  {/if}

  <!-- Class / Subclass -->

  <!-- TODO: Remember to account for multiclassing -->
  <!-- Size , Race , Background , Alignment , Proficiency , Origin Summary Configuration Cog -->
  <!-- Speed , Configure Movement Speed Cog -->

  <!-- AC  -->
  <!-- Initiative (mod, cog) , Str (rollable, score, mod, save, proficient, cog) thru Cha (rollable, score, mod, save, proficient, cog) -->

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

  <article style="height: 200px;">
    <div>Test: Background Editor</div>

    <SheetEditor
      content={actor.system.details.background}
      target="system.details.background"
      editable={actor.isOwner || FoundryAdapter.userIsGm()}
    />
  </article>
  <article style="height: 200px;">
    <div>Test: Bond Editor</div>
    <SheetEditor
      content={actor.system.details.bond}
      target="system.details.bond"
      editable={actor.isOwner || FoundryAdapter.userIsGm()}
    />
  </article>
  <article style="height: 200px;">
    <div>Test: Flaw Editor</div>
    <SheetEditor
      content={actor.system.details.flaw}
      target="system.details.flaw"
      editable={actor.isOwner || FoundryAdapter.userIsGm()}
    />
  </article>

  <p>
    Actor Name: {actor.name}<br />
    Owner: {actor.isOwner}
  </p>

  <p>
    HP: {actor.system.attributes.hp.value} / {actor.system.attributes.hp.max}
  </p>

  {#each actorReference.abilitiesList as ability}
    <div style="display: flex;">
      <button
        on:click={(event) => actor.rollAbility(ability.abbreviation, { event })}
        >{actorReference.abilities[ability.abbreviation].label}</button
      >
      <button
        on:click={(event) =>
          actor.rollAbilityTest(ability.abbreviation, { event })}
        >Do a {actorReference.abilities[ability.abbreviation].label} roll!</button
      >
      <button
        on:click={(event) =>
          actor.rollAbilitySave(ability.abbreviation, { event })}
        >Make a {actorReference.abilities[ability.abbreviation].label} save!</button
      >
    </div>
  {/each}
  <hr />
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
    {#each actorReference.skillsList as skill}
      <button
        on:click={(event) => actor.rollSkill(skill.abbreviation, { event })}
        >{actorReference.skills[skill.abbreviation].label}</button
      >
    {/each}
  </div>
</div>
