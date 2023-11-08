<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Readable } from 'svelte/store';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import itemSheetTabs from '../itemSheetTabs';

  let context = getContext<Readable<ItemSheetContext>>('context');

  let selectedTabId: string;

  const tabs: Tab[] = [
    itemSheetTabs.description,
    itemSheetTabs.classDetails,
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
        placeholder={localize('DND5E.ClassName')}
        disabled={!$context.owner}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$context.itemType ?? ''}</h4>
      <span class="item-status">{$context.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>
        <TextInput
          field="system.source.label"
          document={$context.item}
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
