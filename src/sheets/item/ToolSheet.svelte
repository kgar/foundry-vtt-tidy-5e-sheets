<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';
  import itemSheetTabs from './itemSheetTabs';

  let store = getContext<Readable<ItemSheetContext>>('store');

  export let selectedTabId: string;

  const tabs: Tab[] = [
    itemSheetTabs.descriptionWithSidebar,
    itemSheetTabs.toolDetails,
    itemSheetTabs.effects,
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_TOOL_TABS, {
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
        document={$store.item}
        field="name"
        value={$store.item.name}
        placeholder={localize('DND5E.ItemName')}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$store.itemType}</h4>
      <span class="item-status">{$store.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>
        {#if $store.system.toolType}
          {@const toolType = $store.config.toolTypes[$store.system.toolType]}
          {toolType}
        {:else}
          {localize('ITEM.TypeTool')}
        {/if}
      </li>
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
