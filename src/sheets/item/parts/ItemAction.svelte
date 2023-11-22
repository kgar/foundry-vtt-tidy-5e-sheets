<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function addDamageFormula() {
    const damage = $context.item.system.damage;
    return $context.item.update({
      'system.damage.parts': damage.parts.concat([['', '']]),
    });
  }

  function deleteDamageFormula(index: number) {
    const damage = FoundryAdapter.deepClone($context.item.system.damage);
    damage.parts.splice(index, 1);
    return $context.item.update({ 'system.damage.parts': damage.parts });
  }

  $: damageParts = [...$context.system.damage.parts];

  function saveDamageFormulae() {
    $context.item.update({
      'system.damage.parts': damageParts,
    });
  }
</script>

<ItemFormGroup
  cssClass="select"
  labelText={localize('DND5E.ItemActionType')}
  field="system.actionType"
  let:inputId
>
  <Select
    id={inputId}
    value={$context.system.actionType}
    document={$context.item}
    field="system.actionType"
    disabled={!$context.owner}
  >
    <SelectOptions data={$context.config.itemActionTypes} blank="" />
  </Select>
</ItemFormGroup>

{#if $context.system.actionType}
  <ItemFormGroup
    cssClass="select"
    labelText={localize('DND5E.AbilityModifier')}
    field="system.ability"
    let:inputId
  >
    <Select
      id={inputId}
      value={$context.system.ability}
      document={$context.item}
      field="system.ability"
      disabled={!$context.owner}
    >
      <option value="">{localize('DND5E.Default')}</option>
      <option value="none">{localize('DND5E.None')}</option>
      <optgroup label={localize('DND5E.Ability')}>
        <SelectOptions data={$context.config.abilities} labelProp="label" />
      </optgroup>
    </Select>
  </ItemFormGroup>

  {#if $context.system.hasAttack}
    <ItemFormGroup
      labelText={localize('DND5E.ItemAttackBonus')}
      field="system.attackBonus"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          document={$context.item}
          field="system.attackBonus"
          value={$context.system.attackBonus}
          dataset={{ formulaEditor: true }}
          disabled={!$context.owner}
        />
      </div>
    </ItemFormGroup>

    <ItemFormGroup
      labelText={localize('DND5E.ItemCritThreshold')}
      field="system.critical.threshold"
      let:inputId
    >
      <div class="form-fields">
        <NumberInput
          id={inputId}
          value={$context.system.critical.threshold}
          document={$context.item}
          field="system.critical.threshold"
          placeholder="20"
          max="20"
          min="1"
          step="1"
          disabled={!$context.owner}
        />
      </div>
    </ItemFormGroup>

    <ItemFormGroup
      labelText={localize('DND5E.ItemCritExtraDamage')}
      field="system.critical.damage"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          document={$context.item}
          field="system.critical.damage"
          value={$context.system.critical.damage}
          disabled={!$context.owner}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <h4 class="damage-header">
    {#if $context.isHealing}
      {localize('DND5E.Healing')}
    {:else}
      {localize('DND5E.Damage')}
    {/if}
    {localize('DND5E.Formula')}
    <button
      class="damage-formula-control add-damage"
      on:click={() => addDamageFormula()}
      disabled={!$context.owner}
    >
      <i class="fas fa-plus" />
    </button>
  </h4>
  <ol class="damage-parts form-group">
    {#each damageParts as [formula, damageType], i}
      <li class="damage-part flexrow">
        <input
          id="{$context.appId}-system-damage-part-{i}-0"
          type="text"
          bind:value={formula}
          data-formula-editor
          on:change={() => saveDamageFormulae()}
          disabled={!$context.owner}
        />
        <select
          id="{$context.appId}-system-damage-part-{i}-1"
          bind:value={damageType}
          data-formula-editor
          on:change={() => saveDamageFormulae()}
          disabled={!$context.owner}
        >
          <option value="">{localize('DND5E.None')}</option>
          <optgroup label={localize('DND5E.Damage')}>
            <SelectOptions data={$context.config.damageTypes} />
          </optgroup>
          <optgroup label={localize('DND5E.Healing')}>
            <SelectOptions data={$context.config.healingTypes} />
          </optgroup>
        </select>
        <button
          class="damage-formula-control delete-damage"
          on:click={() => deleteDamageFormula(i)}
          disabled={!$context.owner}
        >
          <i class="fas fa-minus" />
        </button>
      </li>
    {/each}
  </ol>

  {#if $context.system.damage.parts.length}
    <ItemFormGroup
      labelText={localize('DND5E.VersatileDamage')}
      field="system.damage.versatile"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          value={$context.system.damage.versatile}
          placeholder={localize('DND5E.Formula')}
          dataset={{ formulaEditor: true }}
          document={$context.item}
          field="system.damage.versatile"
          disabled={!$context.owner}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    labelText={localize('DND5E.OtherFormula')}
    field="system.formula"
    let:inputId
  >
    <div class="form-fields">
      <TextInput
        id={inputId}
        document={$context.item}
        field="system.formula"
        value={$context.system.formula}
        placeholder={localize('DND5E.Formula')}
        dataset={{ formulaEditor: true }}
        disabled={!$context.owner}
      />
    </div>
  </ItemFormGroup>

  <ItemFormGroup
    cssClass="input-select"
    labelText={localize('DND5E.ActionSave')}
    field="system.save.ability"
    let:inputId
  >
    <div class="form-fields">
      <Select
        id={inputId}
        value={$context.system.save.ability}
        document={$context.item}
        field="system.save.ability"
        disabled={!$context.owner}
      >
        <SelectOptions
          data={$context.config.abilities}
          labelProp="label"
          blank=""
        />
      </Select>
      <span>{localize('DND5E.VsDC')}</span>
      <NumberInput
        id="{$context.appId}-system-save-dc"
        step="any"
        document={$context.item}
        field="system.save.dc"
        value={$context.system.save.dc ?? null}
        placeholder={localize('DND5E.AbbreviationDC')}
        disabled={!$context.owner || !$context.isFlatDC}
      />
      <Select
        id="{$context.appId}-system-save-scaling"
        document={$context.item}
        field="system.save.scaling"
        value={$context.system.save.scaling}
        disabled={!$context.owner}
      >
        <option value="spell">{localize('DND5E.Spellcasting')}</option>
        <SelectOptions data={$context.config.abilities} labelProp="label" />
        <option value="flat">{localize('DND5E.Flat')}</option>
      </Select>
    </div>
  </ItemFormGroup>

  <ItemFormGroup
    cssClass="stacked"
    labelText={localize('DND5E.ChatFlavor')}
    field="system.chatFlavor"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.chatFlavor"
      value={$context.system.chatFlavor}
      disabled={!$context.owner}
    />
  </ItemFormGroup>
{/if}
