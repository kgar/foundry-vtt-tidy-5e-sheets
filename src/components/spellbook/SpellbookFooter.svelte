<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { submitText } from 'src/sheets/form';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');
  export let cssClass: string | null = null;
  export let includeAttackMod: boolean = true;
  export let includePreparedSpells: boolean = true;

  const localize = FoundryAdapter.localize;
  $: spellAttackBonusInfo = FoundryAdapter.getSpellAttackModAndTooltip($store);
  
  $: abilities = Object.entries($store.abilities).map(
    (a: [string, { label: string }]) => ({
      abbr: a[0],
      ...a[1],
    })
  );
</script>

<footer class="spellcasting-ability {cssClass}">
  <h3 class="spell-dc spell-mod">
    {localize('DND5E.SpellDC')}
    {$store.system.attributes.spelldc}

    {#if includeAttackMod}
      / {localize('T5EK.SpellAttackMod')}:
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
    {/if}
  </h3>
  {#if includePreparedSpells}
    <div class="max-prepared-spells">
      <p>{localize('T5EK.PreparedSpells')}</p>
      <span class="spells-prepared">{$store.preparedSpells ?? 0}</span>
      /
      <input
        class="max-preparation"
        type="number"
        value={FoundryAdapter.tryGetFlag($store.actor, 'maxPreparedSpells')}
        data-dtype="Number"
        placeholder="0"
        data-tooltip={localize('T5EK.PreparedSpellsMax')}
        on:change|stopPropagation|preventDefault={(event) =>
          submitText(
            event,
            $store.actor,
            `flags.${CONSTANTS.MODULE_ID}.maxPreparedSpells`
          )}
      />
    </div>
  {/if}
  <div class="spellcasting-attribute">
    <p>{localize('DND5E.SpellAbility')}</p>
    <select
      on:change|stopPropagation|preventDefault={(event) =>
        $store.actor.update({
          'system.attributes.spellcasting': event.currentTarget.value,
        })}
    >
      <option value="" selected={!$store.system.attributes.spellcasting}
        >{localize('DND5E.None')}</option
      >
      {#each abilities as ability}
        <option
          value={ability.abbr}
          selected={$store.system.attributes.spellcasting === ability.abbr}
          >{ability.label}</option
        >
      {/each}
    </select>
  </div>
  {#if $store.isNPC}
    <div class="flex-row extra-small-gap" style="flex: 0">
      <h3 class="truncate">{localize('DND5E.SpellcasterLevel')}</h3>
      <input
        class="spellcasting-level"
        type="text"
        name="system.details.spellLevel"
        value={$store.system.details.spellLevel}
        data-dtype="Number"
        placeholder="0"
        min="0"
        step="1"
      />
    </div>
  {/if}
</footer>

<style lang="scss">
  .spellcasting-ability {
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
    border-top: 0.125rem solid var(--t5e-light-color);
    align-items: center;
    gap: 0.25rem;

    .max-prepared-spells,
    .spellcasting-attribute {
      flex: 0;
      display: flex;
      align-items: center;
      font-size: 0.75rem;
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
      flex: 0;
    }

    .bonus-icon {
      font-size: 1rem;
    }
  }
</style>
