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
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import itemSheetTabs from '../itemSheetTabs';

  let context = getContext<Readable<ItemSheetContext>>('context');

  let selectedTabId: string;

  const tabs: Tab[] = [
    itemSheetTabs.descriptionWithSidebar,
    itemSheetTabs.equipmentDetails,
    itemSheetTabs.effects,
  ];

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header flexrow gap">
  <ItemProfilePicture />

  <div class="header-details flexrow">
    <h1 class="charname">
      <TextInput
        document={$context.item}
        field="name"
        value={$context.item.name}
        placeholder={localize('DND5E.ItemName')}
        disabled={!$context.owner}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$context.itemType ?? ''}</h4>
      <span class="item-status">{$context.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>{$context.config.equipmentTypes[$context.system.armor.type]}</li>
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
      <li>
        <TextInput
          document={$context.item}
          field="system.source.label"
          value={$context.system.source.label}
          placeholder={localize('DND5E.Source')}
          disabled={!$context.owner}
        />
      </li>
    </ul>
  </div>
</header>
<Tabs bind:selectedTabId {tabs} />
<div class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</div>
