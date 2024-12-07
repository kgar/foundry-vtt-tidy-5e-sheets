<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Source from '../shared/Source.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemIdentifiableName from './parts/ItemIdentifiableName.svelte';
  import ItemHeaderToggles from './parts/ItemHeaderToggles.svelte';
  import AttachedInfoCard from 'src/components/item-info-card/AttachedInfoCard.svelte';
  import { settingStore } from 'src/settings/settings.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let appId = $derived($context.document.id);

  let selectedTabId: string = $state('');

  const localize = FoundryAdapter.localize;
</script>

<AttachedInfoCard
  sheet={$context.item.sheet}
  floating={$settingStore.itemCardsAreFloating}
  delay={$settingStore.itemCardsDelay}
  inspectKey={$settingStore.itemCardsFixKey}
/>

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
      <ItemIdentifiableName />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$context.itemType ?? ''}</h4>
    </div>

    <ul class="summary flexrow">
      <li>{$context.system.type.label}</li>
      <li>
        {#if $context.concealDetails}
          <span>{localize('DND5E.Unidentified.Title')}</span>
        {:else}
          <Select
            id="{appId}-rarity"
            document={$context.item}
            field="system.rarity"
            class="item-rarity"
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
    <ItemHeaderToggles />
  </div>
</header>
<Tabs bind:selectedTabId tabs={$context.tabs} />
<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
