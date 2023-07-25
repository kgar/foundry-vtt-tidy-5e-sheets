<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { submitText } from 'src/sheets/form';
  import type { ActorSheetContext } from 'src/types/types';

  export let context: ActorSheetContext;
  export let abilities: any[];

  const localize = FoundryAdapter.localize;
  const spellAttackBonusInfo =
    FoundryAdapter.getSpellAttackModAndTooltip(context);
</script>

<footer class="spellcasting-ability">
  <h3 class="spell-dc spell-mod">
    {localize('DND5E.SpellDC')}
    {context.system.attributes.spelldc} / {localize('T5EK.SpellAttackMod')}:
    <span class="spell-attack-mod">
      <span data-tooltip={spellAttackBonusInfo.modTooltip}
        >{spellAttackBonusInfo.mod}</span
      >
      {#if spellAttackBonusInfo.bonus?.trim() !== ''}
        <i
          class="bonus-icon fa-solid fa-dice-d4"
          data-tooltip="{spellAttackBonusInfo.bonus}: bonus 'actor.system.bonuses.rsak.attack'"
        />
      {/if}
    </span>
  </h3>
  <div class="max-prepared-spells">
    <p>{localize('T5EK.PreparedSpells')}</p>
    <span class="spells-prepared">{context.preparedSpells ?? 0}</span>
    /
    <input
      class="max-preparation"
      type="number"
      value={FoundryAdapter.tryGetFlag(context.actor, 'maxPreparedSpells')}
      data-dtype="Number"
      placeholder="0"
      data-tooltip={localize('T5EK.PreparedSpellsMax')}
      on:change|stopPropagation|preventDefault={(event) =>
        submitText(
          event,
          context.actor,
          `flags.${CONSTANTS.MODULE_ID}.maxPreparedSpells`
        )}
    />
  </div>
  <div class="spellcasting-attribute">
    <p>{localize('DND5E.SpellAbility')}</p>
    <select
      on:change|stopPropagation|preventDefault={(event) =>
        context.actor.update({
          'system.attributes.spellcasting': event.currentTarget.value,
        })}
    >
      <option value="" selected={!context.system.attributes.spellcasting}
        >{localize('DND5E.None')}</option
      >
      {#each abilities as ability}
        <option
          value={ability.abbr}
          selected={context.system.attributes.spellcasting === ability.abbr}
          >{ability.label}</option
        >
      {/each}
    </select>
  </div>
</footer>

<style lang="scss">
  .spellcasting-ability {
    display: flex;
    justify-content: space-between;
    margin: 0rem 14px 0 0;
    padding-top: 0.5rem;
    border-top: 2px solid var(--t5e-light-color);
    align-items: center;

    .max-prepared-spells,
    .spellcasting-attribute {
      display: flex;
      align-items: center;
      font-size: 12px;
    }

    h3 {
      margin-right: 0.625rem;
      font-size: 1.25rem;
      font-family: var(--t5e-modesto);
    }

    p {
      font-weight: 700;
      margin: 0 0.25rem 0 0;
      white-space: nowrap;
    }

    select {
      height: 1.1875rem;
      font-size: 0.75rem;
      font-family: var(--t5e-signika);
    }

    input {
      width: 1.25rem;
      height: 1.25rem;
    }

    .bonus-icon {
      font-size: 1rem;
    }
  }
</style>
