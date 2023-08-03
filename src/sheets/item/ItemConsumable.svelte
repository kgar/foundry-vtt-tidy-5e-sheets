<script lang="ts">
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescriptionWithSidebar from './parts/ItemDescriptionWithSidebar.svelte';
  import ItemConsumableDetails from './parts/ItemConsumableDetails.svelte';
  import ActiveEffects from '../actor/parts/ActiveEffects.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: context = $store;

  $: context, console.log(context);

  export let selectedTabId: string;

  const tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
      displayName: 'DND5E.Description',
      content: {
        component: ItemDescriptionWithSidebar,
        props: {},
        cssClass: 'flexrow',
      },
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS_ID,
      displayName: 'DND5E.Details',
      content: {
        component: ItemConsumableDetails,
        props: {},
        cssClass: 'detail-tab-contents',
      },
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActiveEffects,
        props: {},
        cssClass: 'flexcol items-list-container',
      },
    },
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_CONSUMABLE_TABS, {
    tabs,
    context: $store,
  });

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header flexrow gap">
    <ItemProfilePicture />
  
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
        <li>{$store.config.consumableTypes[$store.system.consumableType]}</li>
        <li>
          <select
            on:change={(event) =>
              $store.item.update({
                'system.rarity': event.currentTarget.value,
              })}
            value={$store.system.rarity}
          >
            {#each Object.entries($store.config.itemRarity) as [key, displayName]}
              <option value={key}>
                {displayName}
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
              $store.item.update({
                'system.source': event.currentTarget.value,
              })}
          />
        </li>
      </ul>
    </div>
  </header>
  <Tabs bind:selectedTabId {tabs} />
<div class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</div>
