<script lang="ts">
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Source from '../shared/Source.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  let selectedTabId: string;

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
        attributes={{ 'data-tidy-item-name': $context.item.name }}
        disabled={!$context.editable}
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
          disabled={!$context.editable}
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
<Tabs bind:selectedTabId tabs={$context.tabs} />
<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
