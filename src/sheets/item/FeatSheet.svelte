<script lang="ts">
  import type { Tab } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import itemSheetTabs from '../itemSheetTabs';

  let context = getContext<Readable<ItemSheetContext>>('context');

  export let selectedTabId: string;

  const tabs: Tab[] = [
    itemSheetTabs.descriptionWithSidebar,
    itemSheetTabs.featDetails,
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
        {$context.labels.featType ?? ''}
      </li>
      <li>
        <TextInput
          document={$context.item}
          field="system.requirements"
          value={$context.system.requirements}
          placeholder={localize('DND5E.Requirements')}
          disabled={!$context.owner}
        />
      </li>
      <li>
        <TextInput
          document={$context.item}
          field="system.source"
          value={$context.system.source}
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
