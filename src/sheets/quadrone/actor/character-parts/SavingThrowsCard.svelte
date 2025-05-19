<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActorAbilityContextEntry,
    ActorSheetQuadroneContext,
  } from 'src/types/types';
  import ProficiencyCycle from '../parts/ProficiencyCycle.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getModifierData } from 'src/utils/formatting';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;

  let leftAbilities = $derived(
    context.abilities.slice(0, Math.floor(context.abilities.length / 2)),
  );
  let rightAbilities = $derived(
    context.abilities.slice(Math.floor(context.abilities.length / 2)),
  );
</script>

<div class="saving-throws card filigree-card">
  <div class="use-ability-header flexrow">
    <i class="fa-solid fa-shield-heart color-text-lightest"></i>
    <h3 class="font-label-medium">
      {localize('DND5E.ClassSaves')}
    </h3>
    <span class="modifier-label color-text-lightest font-default-medium">
      {localize('DND5E.Modifier')}
    </span>
  </div>

  <ul class="saving-throws-ability-column unlist use-ability-list">
    {#each leftAbilities as ability, index}
      <li style="order: {2 * index + 1}">
        {@render savingThrowRow(ability)}
      </li>
    {/each}
    {#each rightAbilities as ability, index}
      <li style="order: {2 * index + 2}">
        {@render savingThrowRow(ability)}
      </li>
    {/each}
  <!-- </ul> -->
  <!-- Concentration here -->
  {#if context.saves.concentration && (context.isConcentrating || context.unlocked)}
    {@const conc = context.saves.concentration}
    {@const tooltip = localize('DND5E.AbilityConfigure', {
      ability: context.saves.concentration.label,
    })}
    <!-- <ul class="saving-throws-special-column unlist use-ability-list"> -->
      <li style="order: 50">
        <i class="fas fa-head-side-brain color-text-gold"></i>
        <button
          type="button"
          class="button button-borderless use-ability-roll-button"
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_SAVE_ROLLER}
          onclick={(ev) =>
            context.actor.rollConcentration({ event: ev, legacy: false })}
        >
          {conc.label}
        </button>
        <span class="modifier">
          <span class="color-text-lightest">
            {conc.sign}
          </span>
          <span>
            {conc.mod}
          </span>
        </span>
        {#if context.unlocked}
          <button
            type="button"
            class="button button-borderless button-icon-only"
            data-tooltip={tooltip}
            onclick={(ev) =>
              FoundryAdapter.openConcentrationConfig(context.actor)}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        {/if}
      </li>
  {/if}
  </ul>
</div>

{#snippet savingThrowRow(ability: ActorAbilityContextEntry)}
  {@const modifier = getModifierData(ability.save.value)}
  {@const tooltip = localize('DND5E.AbilityConfigure', {
    ability: ability.label,
  })}
  <ProficiencyCycle
    actor={context.actor}
    aria-label={localize(ability.hover)}
    data-tooltip={ability.hover}
    disabled={!context.unlocked}
    path="system.abilities.{ability.key}.proficient"
    type="ability"
    value={context.unlocked ? ability.source.proficient : ability.proficient}
  />
  <button
    type="button"
    class="button button-borderless use-ability-roll-button"
    onclick={(event) =>
      context.actor.rollSavingThrow({ ability: ability.key, event })}
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_SAVE_ROLLER}
  >
    {ability.label}
  </button>
  <span class="modifier">
    <span class="color-text-lightest">
      {modifier.sign}
    </span>
    <span>
      {modifier.value}
    </span>
  </span>
  {#if context.unlocked}
    <button
      type="button"
      class="button button-borderless button-icon-only"
      data-tooltip={tooltip}
      onclick={(ev) =>
        FoundryAdapter.renderAbilityConfig(context.actor, ability.key)}
    >
      <i class="fa-solid fa-cog"></i>
    </button>
  {/if}
{/snippet}
