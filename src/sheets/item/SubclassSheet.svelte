<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import itemSheetTabs from './itemSheetTabs';

  let context = getContext<Readable<ItemSheetContext>>('context');

  export let selectedTabId: string;

  const tabs: Tab[] = [
    itemSheetTabs.description,
    itemSheetTabs.subclassDetails,
    itemSheetTabs.advancement,
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_SUBCLASS_TABS, {
    tabs,
    context: $context,
  });

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
      <h4 class="item-type">{$context.itemType}</h4>
      <span class="item-status">{$context.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>
        <TextInput
          field="system.source"
          document={$context.item}
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
