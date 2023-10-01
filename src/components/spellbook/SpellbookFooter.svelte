<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NumberInput from '../form/NumberInput.svelte';
  import Select from '../form/Select.svelte';
  import TabFooter from 'src/sheets/actor/TabFooter.svelte';

  let store =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('store');
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

<TabFooter cssClass="{cssClass} spellbook-footer" mode="horizontal">
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
      <NumberInput
        document={$store.actor}
        field="flags.{CONSTANTS.MODULE_ID}.maxPreparedSpells"
        cssClass="max-preparation"
        value={FoundryAdapter.tryGetFlag($store.actor, 'maxPreparedSpells')}
        dtype="Number"
        placeholder="0"
        title={localize('T5EK.PreparedSpellsMax')}
        selectOnFocus={true}
        disabled={$store.lockSensitiveFields}
      />
    </div>
  {/if}
  <div class="spellcasting-attribute">
    <p>{localize('DND5E.SpellAbility')}</p>
    <Select
      document={$store.actor}
      field="system.attributes.spellcasting"
      value={$store.system.attributes.spellcasting}
      disabled={$store.lockSensitiveFields}
    >
      <option value="" selected={!$store.system.attributes.spellcasting}
        >{localize('DND5E.None')}</option
      >
      {#each abilities as ability}
        <option value={ability.abbr}>{ability.label}</option>
      {/each}
    </Select>
  </div>
  {#if $store.isNPC}
    <div
      class="spellcasting-level-container flex-row extra-small-gap flex-0 align-items-center"
    >
      <h3 class="truncate">{localize('DND5E.SpellcasterLevel')}</h3>
      <NumberInput
        cssClass="spellcasting-level"
        document={$store.actor}
        field="system.details.spellLevel"
        value={$store.system.details.spellLevel}
        placeholder="0"
        min="0"
        step="1"
        selectOnFocus={true}
        disabled={$store.lockSensitiveFields}
      />
    </div>
  {/if}
</TabFooter>

<style lang="scss">
  .max-prepared-spells,
  .spellcasting-attribute {
    flex: 0;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
  }

  h3 {
    font-size: 1.25rem;
    font-family: var(--t5ek-title-font-family);
  }

  p {
    font-weight: 700;
    margin: 0 0.25rem 0 0;
    white-space: nowrap;
  }

  .spellcasting-attribute :global(select) {
    height: 1.1875rem;
    font-size: 0.75rem;
    font-family: var(--t5ek-body-font-family);
  }

  .spellcasting-level-container :global(.spellcasting-level) {
    width: 1.25rem;
    height: 1.25rem;
    flex: 0;
    text-align: center;
  }

  .bonus-icon {
    font-size: 1rem;
  }
</style>
