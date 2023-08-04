<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import ItemSubclassDetails from './parts/ItemSubclassDetails.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemAdvancement from './parts/ItemAdvancement.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemDescription from './parts/ItemDescription.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: console.log($store);

  export let selectedTabId: string;

  const tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
      displayName: 'DND5E.Description',
      content: {
        component: ItemDescription,
        cssClass: 'flexcol',
      },
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS_ID,
      displayName: 'DND5E.Details',
      content: {
        component: ItemSubclassDetails,
        cssClass: 'detail-tab-contents',
      },
    },
    {
      id: CONSTANTS.TAB_ITEM_ADVANCEMENT_ID,
      displayName: 'DND5E.AdvancementTitle',
      content: {
        component: ItemAdvancement,
        cssClass: 'detail-tab-contents items-list-container',
      },
    },
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_SUBCLASS_TABS, {
    tabs,
    context: $store,
  });

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header flexrow gap">
  <ItemProfilePicture />
  <div class="header-details flexrow">
    <h1 class="charname">
      <TextInput
        field="name"
        document={$store.item}
        value={$store.item.name}
        placeholder={localize('DND5E.SubclassName')}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$store.itemType}</h4>
      <span class="item-status">{$store.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>
        <TextInput
          field="system.source"
          document={$store.item}
          value={$store.system.source}
          placeholder={localize('DND5E.Source')}
        />
      </li>
    </ul>
  </div>
</header>
<Tabs bind:selectedTabId {tabs} />
<div class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</div>
