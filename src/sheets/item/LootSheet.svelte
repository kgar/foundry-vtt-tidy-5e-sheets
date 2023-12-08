<script lang="ts">
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Tab } from 'src/types/types';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import itemSheetTabs from '../../runtime/item/item-sheet-tabs';
  import Source from '../shared/Source.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  let selectedTabId: string;

  let tabs: Tab[] = [
    itemSheetTabs.descriptionWithSidebar,
    itemSheetTabs.lootDetails,
  ];

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header loot-header flexrow gap">
  <ItemProfilePicture />
  <div class="header-details flexrow">
    <h1 class="charname">
      <TextInput
        document={$context.item}
        field="name"
        placeholder={localize('DND5E.ItemName')}
        value={$context.item.name}
        disabled={!$context.owner}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$context.itemType ?? ''}</h4>
      <span class="item-status">{$context.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>
        <Select
          document={$context.item}
          field="system.rarity"
          value={$context.system.rarity}
          disabled={!$context.owner}
        >
          <SelectOptions data={$context.config.itemRarity} blank="" />
        </Select>
      </li>
      <li class="flex-row">
        <Source
          document={$context.item}
          keyPath="system.source"
          editable={$context.editable}
        />
      </li>
    </ul>
  </div>
</header>
<Tabs bind:selectedTabId {tabs} />
<section class="tidy-sheet-body">
  <TabContents {tabs} {selectedTabId} />
</section>
