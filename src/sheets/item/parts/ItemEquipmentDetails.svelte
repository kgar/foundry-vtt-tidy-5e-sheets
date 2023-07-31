<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemMountable from './ItemMountable.svelte';
  import ItemActivation from './ItemActivation.svelte';
  import ItemAction from './ItemAction.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">
  {localize('DND5E.ItemEquipmentDetails')}
</h3>

<ItemFormGroup
  field="system.armor.type"
  labelText={localize('DND5E.ItemEquipmentType')}
  let:inputId
>
  <select
    id={inputId}
    value={$store.system.armor.type}
    on:change={(event) =>
      $store.item.update({ 'system.armor.type': event.currentTarget.value })}
  >
    <option value="" />
    <optgroup label={localize('DND5E.Armor')}>
      {#each Object.entries($store.config.armorTypes) as [key, displayName]}
        <option value={key}>{displayName}</option>
      {/each}
    </optgroup>
    {#each Object.entries($store.config.miscEquipmentTypes) as [key, displayName]}
      <option value={key}>{displayName}</option>
    {/each}
  </select>
</ItemFormGroup>

<ItemFormGroup
  field="system.baseItem"
  labelText={localize('DND5E.ItemEquipmentBase')}
  let:inputId
>
  <select
    id={inputId}
    value={$store.system.baseItem}
    on:change={(event) =>
      $store.item.update({
        'system.baseItem': event.currentTarget.value,
      })}
  >
    <option value="" />
    {#each Object.entries($store.baseItems) as [key, displayName]}
      <option value={key}>{displayName}</option>
    {/each}
  </select>
</ItemFormGroup>

{#if !$store.system.isMountable}
  <ItemFormGroup
    field="system.attunement"
    labelText={localize('DND5E.Attunement')}
    let:inputId
  >
    <select
      id="{$store.appId}-system-attunement"
      value={$store.system.attunement?.toString() ?? ''}
      data-dtype="Number"
      on:change={(event) =>
        $store.item.update({ 'system.attunement': event.currentTarget.value })}
    >
      {#each Object.entries($store.config.attunements) as [key, displayName]}
        <option value={key}>{displayName}</option>
      {/each}
    </select>
  </ItemFormGroup>
{/if}

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemEquipmentStatus')}
>
  <label class="checkbox">
    <input
      type="checkbox"
      checked={$store.system.proficient}
      on:change={(event) =>
        $store.item.update({
          'system.proficient': event.currentTarget.checked,
        })}
    />
    {localize('DND5E.Proficient')}
  </label>
  <label class="checkbox">
    <input
      type="checkbox"
      checked={$store.system.equipped}
      on:change={(event) =>
        $store.item.update({ 'system.equipped': event.currentTarget.checked })}
    />
    {localize('DND5E.Equipped')}
  </label>
  <label class="checkbox">
    <input
      type="checkbox"
      checked={$store.system.identified}
      on:change={(event) =>
        $store.item.update({
          'system.identified': event.currentTarget.checked,
        })}
    />
    {localize('DND5E.Identified')}
  </label>
</ItemFormGroup>

{#if $store.system.isArmor || $store.system.isMountable}
  <ItemFormGroup
    labelText={localize('DND5E.ArmorClass')}
    field="system.armor.value"
    let:inputId
  >
    <input
      id={inputId}
      type="number"
      value={$store.system.armor.value}
      step="1"
      on:change={(event) =>
        $store.item.update({ 'system.armor.value': event.currentTarget.value })}
    />
  </ItemFormGroup>
{/if}

{#if $store.hasDexModifier}
  <ItemFormGroup
    labelText={localize('DND5E.ItemEquipmentDexMod')}
    field="system.armor.dex"
    let:inputId
  >
    <input
      id={inputId}
      type="number"
      step="1"
      placeholder={localize('DND5E.Unlimited')}
      on:change={(event) =>
        $store.item.update({
          'system.armor.dex': event.currentTarget.value,
        })}
    />
  </ItemFormGroup>
{/if}

{#if $store.system.isArmor}
  <ItemFormGroup
    field="system.strength"
    labelText={localize('DND5E.ItemRequiredStr')}
    let:inputId
  >
    <input
      id={inputId}
      type="number"
      step="1"
      placeholder={localize('DND5E.None')}
      on:change={(event) =>
        $store.item.update({
          'system.strength': event.currentTarget.value,
        })}
    />
  </ItemFormGroup>

  <ItemFormGroup
    field="system.stealth"
    labelText={localize('DND5E.ItemEquipmentStealthDisav')}
    let:inputId
  >
    <input
      id={inputId}
      type="checkbox"
      name="system.stealth"
      checked={$store.system.stealth}
      on:change={(event) =>
        $store.item.update({ 'system.stealth': event.currentTarget.checked })}
    />
  </ItemFormGroup>
{/if}

{#if $store.system.isMountable}
  <ItemMountable />
  <ItemFormGroup labelText={localize('DND5E.Speed')}>
    <div class="form-fields">
      <input
        type="number"
        placeholder="0"
        value={$store.system.speed.value}
        on:change={(event) =>
          $store.item.update({
            'system.speed.value': event.currentTarget.value,
          })}
      />
      <span class="sep">{localize('DND5E.FeetAbbr')}</span>
      <input
        type="text"
        name="system.speed.conditions"
        value={$store.system.speed.conditions}
        on:change={(event) =>
          $store.item.update({
            'system.speed.conditions': event.currentTarget.value,
          })}
      />
    </div>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.ItemEquipmentUsage')}</h3>

<ItemActivation />

<h3 class="form-header">{localize('DND5E.ItemEquipmentAction')}</h3>

<ItemAction />
