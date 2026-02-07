<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetClassicContextV2,
    ActorSheetQuadroneContext,
  } from 'src/types/types';
  import { DRAKKENHEIM_CORE_CONSTANTS } from './DrakkenheimCoreConstants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';

  const context =
    $derived(
      getSheetContext<ActorSheetClassicContextV2 | ActorSheetQuadroneContext>(),
    );

  const localize = FoundryAdapter.localize;

  let contaminationLevel = $derived(
    FoundryAdapter.getProperty<number | undefined>(
      context.actor,
      DRAKKENHEIM_CORE_CONSTANTS.CONTAMINATION_LEVEL_FLAG_PROP,
    ) ?? 0,
  );

  const actorName = $derived(FoundryAdapter.getProperty<string>(context.actor, 'name'));

  let levels = Array.fromRange(6, 1);

  let version = $derived(
    getContext<string>(DRAKKENHEIM_CORE_CONSTANTS.SVELTE_CONTEXT.VERSION),
  );

  let enrichedPromises = levels.map((level) =>
    foundry.applications.ux.TextEditor.enrichHTML(
      localize(`DRAKKENHEIM.CONTAMINATION.LEVELS.${version}${level}`),
    ),
  );

  async function onContaminationLevelChanged(level: number): Promise<void> {
    await context.actor.update({
      [DRAKKENHEIM_CORE_CONSTANTS.CONTAMINATION_LEVEL_FLAG_PROP]: level,
    });
  }

  async function rollMutation(): Promise<void> {
    const roll = new Roll('1d6');
    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: context.actor }),
      flavor: localize('TIDY5E.Drakkenheim.Contamination.rolledMutation', { name: actorName, level: contaminationLevel }),
    });
  }

  async function rollContaminationSave(): Promise<void> {
    const roll = new Roll('1d20');
    await roll.evaluate();
    const success = roll.total >= 10;
    const resultKey = success
      ? 'DRAKKENHEIM.CONTAMINATION.roll'
      : 'DRAKKENHEIM.CONTAMINATION.rollIncrease';
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: context.actor }),
      flavor: `${localize(resultKey, { name: actorName })}`,
    });
  }

  async function clearContamination(): Promise<void> {
    await context.actor.update({
      [DRAKKENHEIM_CORE_CONSTANTS.CONTAMINATION_LEVEL_FLAG_PROP]: 0,
    });
  }
</script>

<div class="scroll-container">
  <div class="contamination-actions flexrow">
    <button type="button" 
      onclick={rollContaminationSave}
      class="button button-icon-only button-secondary">
      <i class="fa-solid fa-dice-d20"></i>
      {localize('TIDY5E.Drakkenheim.Contamination.rollSave')}
    </button>
    <button type="button" onclick={rollMutation}
      class="button button-icon-only button-secondary">
      <i class="fa-solid fa-bacteria"></i>
      {localize('TIDY5E.Drakkenheim.Contamination.rollMutation')}
    </button>
    <button type="button" onclick={clearContamination}
    class="button button-icon-only button-secondary">
      <i class="fa-solid fa-syringe"></i>
      {localize('TIDY5E.Drakkenheim.Contamination.clear')}
    </button>
  </div>
  <div class="contamination-title title-underlined">
    <h3 class="font-title-small flexrow">
      <i class="fa-solid fa-meteor flexshrink"></i>
      <span class="flex1">{localize('DRAKKENHEIM.CONTAMINATION.tab')}</span>
    </h3>
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </div>
  <div class="pin">

  </div>
  <p class="description">
    {#await FoundryAdapter.enrichHtml(localize('DRAKKENHEIM.CONTAMINATION.TABLE.caption')) then text}
      {@html text}
    {/await}
  </p>
  <div class="contamination-title title-underlined">
    <h3 class="font-title-small flexrow">
      <i class="fa-solid fa-radiation flexshrink"></i>
      <span class="flex1">{localize('DRAKKENHEIM.CONTAMINATION.TABLE.symptoms')}</span>
    </h3>
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </div>
  <div class="contamination-levels flexcol">
    <button 
      tabindex={0}
      class:active={0 === contaminationLevel} 
      class="symptom level-0" 
      onclick={() => clearContamination()}
      onkeydown={(ev) => clearContamination()}
    >
    <span class="level-icon">
      <i class="fa-solid fa-heart"></i>
    </span>
    {localize('TIDY5E.Drakkenheim.Contamination.none')}
  </button>
    {#each enrichedPromises as promise, i}
      {@const level = i + 1}
      <button 
        tabindex={0}
        class:active={level <= contaminationLevel} 
        class="symptom" 
        onclick={() => onContaminationLevelChanged(level)}
        onkeydown={(ev) => onContaminationLevelChanged(level)}
        >
        <span class="level-icon">
          <i class="fa-solid fa-meteor"></i>
          <span class="level-number">{level}</span>
        </span>
        {#await promise then text}
          {@html text}
        {/await}
      </button>
    {/each}
  </div>
</div>
