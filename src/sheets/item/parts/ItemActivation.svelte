<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup labelText={localize('DND5E.ItemActivationCost')}>
  <div class="form-fields">
    {#if $store.system.activation.type}
      <input
        type="number"
        step="any"
        value={$store.system.activation.cost}
        placeholder="&emdash;"
        on:change={(event) =>
          $store.item.update({
            'system.activation.cost': event.currentTarget.value,
          })}
      />
    {/if}
    <select
      value={$store.system.activation.type.toString()}
      data-tooltip={localize('DND5E.ItemActivationType')}
      on:change={(event) =>
        $store.item.update({
          'system.activation.type': event.currentTarget.value,
        })}
    >
      <option value="">{localize('DND5E.None')}</option>
      {#each Object.entries($store.config.abilityActivationTypes) as [key, displayName]}
        <option value={key}>{displayName}</option>
      {/each}
    </select>
  </div>
</ItemFormGroup>

{#if $store.system.activation.type}
  <ItemFormGroup
    labelText={localize('DND5E.ItemActivationCondition')}
    field="system.activation.condition"
    let:inputId
  >
    <div class="form-fields">
      <input
        id={inputId}
        type="text"
        value={$store.system.activation.condition}
        on:change={(event) =>
          $store.item.update({
            'system.activation.condition': event.currentTarget.value,
          })}
      />
    </div>
  </ItemFormGroup>

  {#if $store.isCrewed}
    <ItemFormGroup
      labelText={localize('DND5E.Cover')}
      field="system.cover"
      let:inputId
    >
      <div class="form-fields">
        <select
          id={inputId}
          data-dtype="Number"
          value={$store.system.cover}
          on:change={(event) =>
            $store.item.update({
              'system.cover': event.currentTarget.value,
            })}
        >
          <option value="" />
          {#each Object.entries($store.config.cover) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </select>
      </div>
    </ItemFormGroup>
  {/if}

  <!-- CONTINUE WITH Ability Target -->
  <!-- {#if $store.system.hasScalarTarget}
  <input
    type="number"
    step="any"
    value={$store.system.target.value}
    placeholder="&emdash;"
    on:change={(event) =>
      $store.item.update({
        'system.target.value': event.currentTarget.value,
      })}
  />
{/if} -->
{/if}
