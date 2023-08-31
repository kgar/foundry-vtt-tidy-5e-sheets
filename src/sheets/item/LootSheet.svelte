<script lang="ts">
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import type { Tab } from 'src/types/types';
  import TextInput from 'src/components/form/TextInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import itemSheetTabs from './itemSheetTabs';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: console.log($store);

  export let selectedTabId: string;

  let tabs: Tab[] = [itemSheetTabs.descriptionWithSidebar];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_LOOT_TABS, {
    tabs,
    context: $store,
  });

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header loot-header flexrow gap">
  <ItemProfilePicture />
  <div class="header-details flexrow">
    <h1 class="charname">
      <TextInput
        document={$store.item}
        field="name"
        placeholder={localize('DND5E.ItemName')}
        value={$store.item.name}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$store.itemType}</h4>
      <span class="item-status">{$store.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>
        <Select
          document={$store.item}
          field="system.rarity"
          value={$store.system.rarity}
        >
          <SelectOptions data={$store.config.itemRarity} blank="" />
        </Select>
      </li>
      <li>
        <TextInput
          document={$store.item}
          field="system.source"
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
