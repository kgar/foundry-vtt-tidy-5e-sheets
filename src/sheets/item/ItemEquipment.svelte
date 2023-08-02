<script lang="ts">
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescription from './parts/ItemDescription.svelte';
  import ItemEquipmentDetails from './parts/ItemEquipmentDetails.svelte';
  import ActiveEffects from '../actor/parts/ActiveEffects.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: context = $store;

  $: context, console.log(context);

  export let selectedTabId: string;

  // TODO: DEBUG REMOVE AFTER DETAILS ARE DONE
  selectedTabId = 'effects';

  const tabs: Tab[] = [
    {
      id: 'description',
      displayName: 'DND5E.Description',
      content: {
        component: ItemDescription,
        props: {},
        cssClass: 'flexrow',
      },
    },
    {
      id: 'details',
      displayName: 'DND5E.Details',
      content: {
        component: ItemEquipmentDetails,
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

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_EQUIPMENT_TABS, {
    tabs,
    context: $store,
  });

  const localize = FoundryAdapter.localize;

  let hideImageMenu = true;

  function openItemImagePicker(target: HTMLImageElement, item: Item5e) {
    const rect = target.getBoundingClientRect();
    const current = item.img;
    const fp = new FilePicker({
      type: 'image',
      current,
      callback: (path) => {
        item.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }

  function handleClick(event: MouseEvent) {
    if (event.button === CONSTANTS.MOUSE_BUTTON_MAIN) {
      openItemImagePicker(event.currentTarget as HTMLImageElement, $store.item);
    } else if (event.button === CONSTANTS.MOUSE_BUTTON_SECONDARY) {
      hideImageMenu = !hideImageMenu;
    }
  }

  function showItemArt(item: Item5e) {
    hideImageMenu = true;
    new ImagePopout(item.img, {
      title: 'Item: ' + item.name,
      shareable: true,
      uuid: item.uuid,
    }).render(true);
  }
</script>

<header class="sheet-header flexrow gap">
  <div class="item-image item-image-show-item-art">
    <img
      class="profile"
      src={$store.item.img}
      alt={$store.item.name}
      data-tooltip="{localize('TIDY5E.EditActorImage')} / {localize(
        'TIDY5E.ShowItemImage'
      )}"
      on:mousedown={(event) => handleClick(event)}
    />
    <div class="item-menu" class:hidden={hideImageMenu}>
      <a class="showItemArt" on:click={() => showItemArt($store.item)}
        >{localize('TIDY5E.ShowItemArt')}</a
      >
    </div>
  </div>

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
<!-- To Do: Update Tab type to allow for cssClass specifically for the tab element, and then add flexrow for description tab -->
<div class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</div>
