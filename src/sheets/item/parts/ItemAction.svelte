<script lang="ts">
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function addDamageFormula() {
    const damage = $store.item.system.damage;
    return $store.item.update({
      'system.damage.parts': damage.parts.concat([['', '']]),
    });
  }

  function deleteDamageFormula(index: number) {
    const damage = foundry.utils.deepClone($store.item.system.damage);
    damage.parts.splice(index, 1);
    return $store.item.update({ 'system.damage.parts': damage.parts });
  }

  $: damageParts = [...$store.system.damage.parts];

  function saveDamageFormulae() {
    $store.item.update({
      'system.damage.parts': damageParts,
    });
  }
</script>

<ItemFormGroup
  cssClass="select"
  labelText={localize('DND5E.ItemActionType')}
  let:inputId
>
  <Select
    id={inputId}
    value={$store.system.actionType}
    document={$store.item}
    field="system.actionType"
  >
    <SelectOptions data={$store.config.itemActionTypes} blank="" />
  </Select>
</ItemFormGroup>

{#if $store.system.actionType}
  <ItemFormGroup
    cssClass="select"
    labelText={localize('DND5E.AbilityModifier')}
    field="system.ability"
    let:inputId
  >
    <Select
      id={inputId}
      value={$store.system.ability}
      document={$store.item}
      field="system.ability"
    >
      <option value="">{localize('DND5E.Default')}</option>
      <option value="none">{localize('DND5E.None')}</option>
      <optgroup label={localize('DND5E.Ability')}>
        <SelectOptions data={$store.config.abilities} labelProp="label" />
      </optgroup>
    </Select>
  </ItemFormGroup>

  {#if $store.system.hasAttack}
    <ItemFormGroup
      labelText={localize('DND5E.ItemAttackBonus')}
      field="system.attackBonus"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          document={$store.item}
          field="system.attackBonus"
          value={$store.system.attackBonus}
          dataset={{ formulaEditor: true }}
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
          value={$store.system.critical.threshold}
          document={$store.item}
          field="system.critical.threshold"
          placeholder="20"
          max="20"
          min="1"
          step="1"
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
          document={$store.item}
          field="system.critical.damage"
          value={$store.system.critical.damage}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <h4 class="damage-header">
    {#if $store.isHealing}
      {localize('DND5E.Healing')}
    {:else}
      {localize('DND5E.Damage')}
    {/if}
    {localize('DND5E.Formula')}
    <a
      class="damage-formula-control add-damage"
      on:click={() => addDamageFormula()}><i class="fas fa-plus" /></a
    >
  </h4>
  <ol class="damage-parts form-group">
    {#each damageParts as [formula, damageType], i}
      <li class="damage-part flexrow">
        <input
          id="{$store.appId}-system-damage-part-{i}-0"
          type="text"
          bind:value={formula}
          data-formula-editor
          on:change={() => saveDamageFormulae()}
        />
        <select
          id="{$store.appId}-system-damage-part-{i}-1"
          bind:value={damageType}
          data-formula-editor
          on:change={() => saveDamageFormulae()}
        >
          <option value="">{localize('DND5E.None')}</option>
          <optgroup label={localize('DND5E.Damage')}>
            <SelectOptions data={$store.config.damageTypes} />
          </optgroup>
          <optgroup label={localize('DND5E.Healing')}>
            <SelectOptions data={$store.config.healingTypes} />
          </optgroup>
        </select>
        <a
          class="damage-formula-control delete-damage"
          on:click={() => deleteDamageFormula(i)}><i class="fas fa-minus" /></a
        >
      </li>
    {/each}
  </ol>

  {#if $store.system.damage.parts.length}
    <ItemFormGroup
      labelText={localize('DND5E.VersatileDamage')}
      field="system.damage.versatile"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          value={$store.system.damage.versatile}
          placeholder={localize('DND5E.Formula')}
          dataset={{ formulaEditor: true }}
          document={$store.item}
          field="system.damage.versatile"
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
        document={$store.item}
        field="system.formula"
        value={$store.system.formula}
        placeholder={localize('DND5E.Formula')}
        dataset={{ formulaEditor: true }}
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
        value={$store.system.save.ability}
        document={$store.item}
        field="system.save.ability"
      >
        <SelectOptions
          data={$store.config.abilities}
          labelProp="label"
          blank=""
        />
      </Select>
      <span>{localize('DND5E.VsDC')}</span>
      <NumberInput
        id="{$store.appId}-system-save-dc"
        step="any"
        document={$store.item}
        field="system.save.dc"
        value={$store.system.save.dc ?? null}
        placeholder={localize('DND5E.AbbreviationDC')}
        disabled={!$store.isFlatDC}
      />
      <Select
        id="{$store.appId}-system-save-scaling"
        document={$store.item}
        field="system.save.scaling"
        value={$store.system.save.scaling}
      >
        <option value="spell">{localize('DND5E.Spellcasting')}</option>
        <SelectOptions data={$store.config.abilities} labelProp="label" />
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
      document={$store.item}
      field="system.chatFlavor"
      value={$store.system.chatFlavor}
    />
  </ItemFormGroup>
{/if}
