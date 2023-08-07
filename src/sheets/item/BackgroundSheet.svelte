<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Tab } from 'src/types/types';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import TextInput from 'src/components/form/TextInput.svelte';
  import itemSheetTabs from './itemSheetTabs';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: console.log($store);

  const tabs: Tab[] = [itemSheetTabs.description, itemSheetTabs.advancement];

  export let selectedTabId: string = 'description';

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_BACKGROUND_TABS, {
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
        placeholder={localize('DND5E.BackgroundName')}
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
