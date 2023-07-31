<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescription from './parts/ItemDescription.svelte';
  import ItemEquipmentDetails from './parts/ItemEquipmentDetails.svelte';
  import ActiveEffects from './parts/ActiveEffects.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: context = $store;

  $: context, console.log(context);

  export let selectedTabId: string;

  const tabs: Tab[] = [
    {
      id: 'description',
      displayName: 'DND5E.Description',
      content: {
        component: ItemDescription,
        props: {},
      },
    },
    {
      id: 'details',
      displayName: 'DND5E.Details',
      content: {
        component: ItemEquipmentDetails,
        props: {},
      },
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActiveEffects,
        props: {},
      },
    },
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_EQUIPMENT_TABS, {
    tabs,
    context: $store,
  });

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header flexrow gap">
  <img
    class="profile"
    src={$store.item.img}
    data-tooltip={$store.item.name}
    alt={$store.item.name}
  />
  <div class="header-details flexrow">
    <h1 class="charname">
      <input
        type="text"
        value={$store.item.name}
        placeholder={localize('DND5E.ItemName')}
        on:change={(event) =>
          $store.item.update({ name: event.currentTarget.value })}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$store.item.type}</h4>
      <span class="item-status">{$store.itemStatus}</span>
    </div>

    <ul class="summary flexrow">
      <li>{$store.config.equipmentTypes[$store.system.armor.type]}</li>
      <li>
        <select
          on:change={(event) =>
            $store.item.update({ 'system.rarity': event.currentTarget.value })}
        >
          {#each Object.entries($store.config.itemRarity) as [value, key]}
            <option {value} selected={value === $store.system.rarity}>
              {key}
            </option>
          {/each}
        </select>
      </li>
      <li>
        <input
          type="text"
          value={$store.system.source}
          placeholder={localize('DND5E.Source')}
          on:change={(event) =>
            $store.item.update({ 'system.source': event.currentTarget.value })}
        />
      </li>
    </ul>
  </div>
</header>
<Tabs bind:selectedTabId {tabs} />
<!-- To Do: Update Tab type to allow for cssClass specifically for the tab element, and then add flexrow for description tab -->
<div class="sheet-body">
  <TabContents tabCssClass="flexrow" {tabs} {selectedTabId} />
</div>
