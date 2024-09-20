<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item.types';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import Source from '../shared/Source.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.document.sheet.appId;

  let selectedTabId: string;

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header flexrow gap">
  <ItemProfilePicture />

  <div
    class="header-details flexrow small-gap"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
  >
    <h1
      class="charname"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
    >
      <TextInput
        id="{appId}-name"
        document={$context.item}
        field="name"
        placeholder={localize('DND5E.ItemName')}
        value={$context.item.name}
        attributes={{ 'data-tidy-item-name': $context.item.name }}
        disabled={!$context.editable}
        title={$context.item.name}
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
          id="{appId}-name"
          document={$context.item}
          field="system.requirements"
          value={$context.system.requirements}
          placeholder={localize('DND5E.Requirements')}
          disabled={!$context.editable}
        />
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
