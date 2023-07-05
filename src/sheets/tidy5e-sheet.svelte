<script lang="ts">
  import type { Actor5e } from '../foundry/foundry-adapter';
  import { onMount } from 'svelte';
  import { FoundryAdapter } from '../foundry/foundry-adapter';
  import SheetEditor from './sheet-editor.svelte';
  import type { ClassSummary, ItemStub, SheetFunctions } from 'src/types/types';
  import { log } from 'src/utils/logging';
  import { SettingsProvider } from 'src/settings/settings';
  import Tidy5eActorOriginSummaryConfig from './tidy5e-actor-origin-summary-config';
    import { formatAsModifier } from 'src/utils/formatting';

  export let debug: any = 'Put any debug information here, if ya need it.';
  export let sheetFunctions: SheetFunctions;
  export let scrollTop: number = 0;
  export let scrollView: HTMLElement | undefined = undefined;
  export let isEditable: boolean;
  // TODO: Type this.
  export let context: { actor: Actor5e } & Record<string, any>;
  console.log(context);

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      sheetFunctions.submit();
    }
  }

  log('Tidy5e KGar', debug);
  const actorReference = FoundryAdapter.getActorReference();
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
</script>

<div
  style="height: 100%; overflow-y: scroll; overflow-x: hidden"
  bind:this={scrollView}
>
  <!-- Portrait -->
  <!-- FIXME: this hardcoded height is to make scroll position work while this form is unstyled.  -->
  <div style="height: 200px">
    <img
      src={context.actor.img}
      alt={context.actor.name}
      title={localize('T5EK.EditActorImage') +
        ' / ' +
        localize('T5EK.ShowActorImage')}
      style="height: 200px"
      on:click={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const target = event.currentTarget;
        const current = foundry.utils.getProperty(context.actor, 'img');
        const originalEvent = event;
        const fp = new FilePicker({
          type: 'image',
          current,
          callback: (path) => {
            target.src = path;
            sheetFunctions.submit();
            context.actor.update({ img: path });
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
          new ImagePopout(context.actor.img, {
            title: 'Portrait: ' + context.actor.name,
            shareable: true,
            uuid: context.actor.uuid,
          }).render(true)}>{localize('T5EK.ShowPortraitArt')}</a
      >
      <a
        on:click={() =>
          new ImagePopout(context.actor.prototypeToken.texture.src, {
            title: 'Portrait: ' + context.actor.name,
            shareable: true,
            uuid: context.actor.uuid,
          }).render(true)}>{localize('T5EK.ShowTokenArt')}</a
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
    value={context.system.attributes.death.success}
    maxlength="1"
    data-tooltip={localize('T5EK.DeathSave')}
  />

  <div on:click={(event) => context.actor.rollDeathSave({ event })}>
    <i class="fas fa-skull" />
  </div>

  <input
    type="text"
    name="system.attributes.death.failure"
    data-dtype="Number"
    placeholder="0"
    value={context.system.attributes.death.failure}
    maxlength="1"
  />
  <i class="fas fa-times" />

  <!-- Exhaustion -->
  <!-- TODO: Learn the full breadth of exhaustion features in Tidy 5e and reimplement -->
  <div data-tooltip="TODO: Put exhaustion definition here">
    <span>
      {context.system.attributes.exhaustion}
    </span>
    <i
      class="far"
      class:fa-grin={context.system.attributes.exhaustion === 0}
      class:fa-smile={context.system.attributes.exhaustion === 1}
      class:fa-meh={context.system.attributes.exhaustion === 2}
      class:fa-frown={context.system.attributes.exhaustion === 3}
      class:fa-frown-open={context.system.attributes.exhaustion === 4}
      class:fa-tired={context.system.attributes.exhaustion === 5}
      class:fa-dizzy={context.system.attributes.exhaustion === 6}
    />
    <ul>
      <li
        on:click={() => {
          sheetFunctions.submit();
          context.actor.update({ 'system.attributes.exhaustion': 0 });
        }}
      >
        0
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          context.actor.update({ 'system.attributes.exhaustion': 1 });
        }}
      >
        1
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          context.actor.update({ 'system.attributes.exhaustion': 2 });
        }}
      >
        2
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          context.actor.update({ 'system.attributes.exhaustion': 3 });
        }}
      >
        3
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          context.actor.update({ 'system.attributes.exhaustion': 4 });
        }}
      >
        4
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          context.actor.update({ 'system.attributes.exhaustion': 5 });
        }}
      >
        5
      </li>
      <li
        on:click={() => {
          sheetFunctions.submit();
          context.actor.update({ 'system.attributes.exhaustion': 6 });
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
      checked={context.system.attributes.inspiration}
    />
    <i class="inspiration-icon fas fa-dice-d20" />
  </label>

  <!-- Short/Long Rest -->
  <div>
    <span data-tooltip={localize('T5EK.RestHint')}>
      <i class="fas fa-bed" />
    </span>
    <span
      data-tooltip={localize('T5EK.RestS')}
      on:click={(event) => sheetFunctions.onShortRest(event)}
    >
      <i class="fas fa-hourglass-half" />
    </span>
    <span
      data-tooltip={localize('T5EK.RestL')}
      on:click={(event) => sheetFunctions.onLongRest(event)}
    >
      <i class="fas fa-hourglass-end" />
    </span>
  </div>

  <!-- HP / HP Max -->
  <input
    name="system.attributes.hp.value"
    type="text"
    value={context.system.attributes.hp.value}
    placeholder="10"
    data-tooltip={localize('DND5E.HitPointsCurrent')}
    data-dtype="Number"
    maxlength="5"
    aria-describedby="tooltip"
  />
  <span> / </span>
  <!-- TODO: Implement "Allow Max HP Override" / T5EK.Settings.AllowHpMaxOverride -->
  <span
    data-tooltip={context.system.attributes.hp.max
      ? localize('DND5E.HitPointsOverride')
      : localize('DND5E.HitPointsMax')}
  >
    {context.system.attributes.hp.max}</span
  >
  <a
    data-tooltip={localize('DND5E.HitPointsConfig')}
    on:click={new dnd5e.applications.actor.ActorHitPointsConfig(
      context.actor
    ).render(true)}
  >
    <i class="fas fa-cog" />
  </a>

  <!-- Hit Dice -->
  <div
    data-tooltip="{localize('DND5E.HitDice')}: {context.system.attributes
      .hd}/{context.system.details.level}&#10;{localize('DND5E.HitDiceConfig')}"
  >
    <a
      on:click={new dnd5e.applications.actor.ActorHitDiceConfig(
        context.actor
      ).render(true)}>{context.system.attributes.hd}</a
    >
  </div>

  <!-- Name -->
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

  <!-- Level -->
  <h2 class="level">
    {localize('DND5E.AbbreviationLevel')}
    {context.system.details.level}
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
        data-placeholder={localize('T5EK.PlayerName')}
        data-maxlength="40"
        bind:textContent={playerName}
        on:blur={sheetFunctions.submit}
        on:keypress={submitWhenEnterKey}
      />
    {:else}
      <span data-placeholder={localize('T5EK.PlayerName')}>{playerName}</span>
    {/if}
  {/if}

  <!-- Class / Subclass -->
  {#if isEditable}
    <div>
      {#each classAndSubclassSummaries as summary, i}
        {#if i > 0}
          /
        {/if}
        <span data-tooltip={summary.class}>{summary.class}</span>
        {#if summary.subclass}
          <span data-tooltip={summary.subclass}>({summary.subclass})</span>
        {/if}
        <span>{summary.level ?? '0'}</span>
      {/each}
    </div>
  {/if}

  <!-- Character Summary: Size , Race , Background , Alignment , Proficiency , Origin Summary Configuration Cog -->
  <select
    class="actor-size"
    name="system.traits.size"
    bind:value={context.system.traits.size}
  >
    <option value="tiny">Tiny</option>
    <option value="sm">Small</option>
    <option value="med">Medium</option>
    <option value="lg">Large</option>
    <option value="huge">Huge</option>
    <option value="grg">Gargantuan</option>
  </select>

  {#each characterSummaryEntries as entry}
    <!-- TODO: There's an `::after` style here to create the little bullet
  .tidy5e.sheet.actor .origin-summary li span::after {
    content: "";
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--t5e-primary-color);
    position: absolute;
    top: 50%;
    left: 0px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
  -->
    * <span data-tooltip={entry}>{entry}</span>
  {/each}

  <span>
    {localize('DND5E.Proficiency')}: {context.labels.proficiency}
  </span>

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
      new dnd5e.applications.actor.ActorArmorConfig(context.actor).render(true)}
    >{context.system.attributes.ac.value}</a
  >

  <!-- Initiative (mod, cog) , Str (rollable, score, mod, save, proficient, cog) thru Cha (rollable, score, mod, save, proficient, cog) -->
  <div>
    <h4
      title={localize('DND5E.Initiative')}
      on:click={rollInitiative!!!!!!!!!!}
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
      on:click={configureInitiative!!!!!!!!!!!}
    >
      <i class="fas fa-cog" />
    </a>
  </div>

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
  </div>
</div>
