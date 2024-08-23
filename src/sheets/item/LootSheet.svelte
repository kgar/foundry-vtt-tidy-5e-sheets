<script lang="ts">
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import type { ItemSheetContext } from 'src/types/item.types';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Source from '../shared/Source.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemIdentifiableName from './parts/ItemIdentifiableName.svelte';
  import PropertyToggle from 'src/components/toggle/PropertyToggle.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let selectedTabId: string;

  $: identifiedLabelWidthCh = Math.max(
    localize('DND5E.Identified').length,
    localize('DND5E.Unidentified.Title').length,
  );

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header loot-header flexrow gap">
  <ItemProfilePicture />
  <div
    class="header-details flexrow small-gap"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
  >
    <h1
      class="charname"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
    >
      <ItemIdentifiableName />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$context.itemType ?? ''}</h4>
      <span class="item-status">{$context.itemStatus ?? ''}</span>
    </div>

    <ul class="summary flexrow">
      <li>
        {#if $context.concealDetails}
          <span>{localize('DND5E.Unidentified.Title')}</span>
        {:else}
          <Select
            document={$context.item}
            field="system.rarity"
            value={$context.system.rarity}
            disabled={!$context.editable}
            blankValue=""
          >
            <SelectOptions data={$context.config.itemRarity} blank="" />
          </Select>
        {/if}
      </li>
      <li class="flex-row">
        <Source
          document={$context.item}
          keyPath="system.source"
          editable={$context.editable && !$context.concealDetails}
        />
      </li>
    </ul>
    <div class="flex-row no-gap">
      {#if FoundryAdapter.canIdentify($context.item)}
        <PropertyToggle
          document={$context.item}
          field="system.identified"
          checked={$context.system.identified}
          disabled={!$context.editable}
          title={$context.system.identified
            ? localize('DND5E.Identified')
            : localize('DND5E.Unidentified.Title')}
          iconClass="fas fa-magnifying-glass fa-fw"
        >
          <div style="width: {identifiedLabelWidthCh}ch">
            {$context.system.identified
              ? localize('DND5E.Identified')
              : localize('DND5E.Unidentified.Title')}
          </div>
        </PropertyToggle>
      {/if}
    </div>
  </div>
</header>
<Tabs bind:selectedTabId tabs={$context.tabs} />
<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
