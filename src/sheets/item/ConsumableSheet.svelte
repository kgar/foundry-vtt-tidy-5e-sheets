<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Readable } from 'svelte/store';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Source from '../shared/Source.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemIdentifiableName from './parts/ItemIdentifiableName.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

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
      <ItemIdentifiableName />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$context.itemType ?? ''}</h4>
    </div>

    <ul class="summary flexrow">
      <li>{$context.itemType}</li>
      <li>
        <Select
          document={$context.item}
          field="system.rarity"
          value={$context.system.rarity}
          disabled={!$context.editable}
          blankValue=""
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
    <div class="flex-row no-gap">
      <Checkbox
        labelCssClass="green-checkbox"
        document={$context.item}
        field="system.equipped"
        checked={$context.system.equipped}
        disabled={!$context.editable}
      >
        {$context.system.equipped
          ? localize('DND5E.Equipped')
          : localize('DND5E.Unequipped')}
      </Checkbox>

      <Checkbox
        labelCssClass="green-checkbox"
        document={$context.item}
        field="system.identified"
        checked={$context.system.identified}
        disabled={!$context.editable}
      >
        {$context.system.identified
          ? localize('DND5E.Identified')
          : localize('DND5E.Unidentified.Title')}
      </Checkbox>
    </div>
  </div>
</header>
<Tabs bind:selectedTabId tabs={$context.tabs} />
<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
