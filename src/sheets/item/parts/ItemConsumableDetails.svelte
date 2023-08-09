<script lang="ts">
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import ItemActivation from './ItemActivation.svelte';
  import ItemAction from './ItemAction.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/form/Select.svelte';
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemConsumableDetails')}</h3>

<ItemFormGroup
  labelText={localize('DND5E.ItemConsumableType')}
  field="system.consumableType"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.consumableType"
    value={$store.system.consumableType}
  >
    <SelectOptions data={$store.config.consumableTypes} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.Attunement')}
  field="system.attunement"
  let:inputId
>
  <Select
    id={inputId}
    document={$store.item}
    field="system.attunement"
    dtype="Number"
    value={$store.system.attunement}
  >
    <SelectOptions data={$store.config.attunements} />
  </Select>
</ItemFormGroup>

<ItemFormGroup
  cssClass="stacked"
  labelText={localize('DND5E.ItemConsumableStatus')}
>
  <Checkbox
    labelCssClass="checkbox"
    document={$store.item}
    field="system.equipped"
    checked={$store.system.equipped}
  >
    {localize('DND5E.Equipped')}
  </Checkbox>

  <Checkbox
    labelCssClass="checkbox"
    document={$store.item}
    field="system.identified"
    checked={$store.system.identified}
  >
    {localize('DND5E.Identified')}
  </Checkbox>
</ItemFormGroup>

{#if $store.system.consumableType === 'ammo'}
  <ItemFormGroup
    cssClass="stacked weapon-properties"
    labelText={localize('DND5E.ItemAmmoProperties')}
  >
    {#each Object.entries($store.config.physicalWeaponProperties) as [prop, name]}
      {@const checked = $store.system.properties[prop]}
      <Checkbox
        labelCssClass="checkbox"
        document={$store.item}
        field="system.properties.{prop}"
        {checked}
      >
        {name}
      </Checkbox>
    {/each}
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.ItemConsumableUsage')}</h3>

<ItemActivation />
{#if $store.system.activation.type}
  <ItemFormGroup>
    <Checkbox
      labelCssClass="checkbox"
      document={$store.item}
      field="system.uses.autoDestroy"
      checked={$store.system.uses.autoDestroy}
    >
      {localize('DND5E.ItemDestroyEmpty')}
    </Checkbox>
  </ItemFormGroup>
{/if}

<h3 class="form-header">{localize('DND5E.ItemConsumableActivation')}</h3>

<ItemAction />
