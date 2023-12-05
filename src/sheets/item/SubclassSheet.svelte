<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import itemSheetTabs from '../itemSheetTabs';
  import Source from '../shared/Source.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  let selectedTabId: string;

  const tabs: Tab[] = [
    itemSheetTabs.description,
    itemSheetTabs.subclassDetails,
    itemSheetTabs.advancement,
  ];

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header flexrow gap">
  <ItemProfilePicture />
  <div class="header-details flexrow">
    <h1 class="charname">
      <TextInput
        field="name"
        document={$context.item}
        value={$context.item.name}
        placeholder={localize('DND5E.SubclassName')}
        disabled={!$context.owner}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$context.itemType ?? ''}</h4>
      <span class="item-status">{$context.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
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
<div class="tidy-sheet-body">
  <TabContents {tabs} {selectedTabId} />
</div>
