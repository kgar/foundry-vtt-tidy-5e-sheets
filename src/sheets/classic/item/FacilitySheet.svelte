<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import Source from '../shared/Source.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  let selectedTabId: string = $state('');

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
        field="name"
        document={context.item}
        value={context.item.name}
        attributes={{ 'data-tidy-item-name': context.item.name }}
        disabled={!context.editable}
        title={context.item.name}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{context.itemType ?? ''}</h4>
    </div>

    <ul class="summary flexrow">
      <li class="flex-row">
        <div class="quantity">
          <span class="value">
            {localize('DND5E.FACILITY.Squares', {
              squares: context.system.squares,
            })}
          </span>
        </div>
      </li>
      {#if context.system.type.value === CONSTANTS.FACILITY_TYPE_BASIC}
        <li>
          <div class="price">
            <span class="value">{context.system.price.value}</span>
            <i
              class="currency gp"
              aria-label={context.config.currencies.gp.label}
            ></i>
          </div>
        </li>
      {/if}
      <li class="flex-row">
        <Source
          document={context.item}
          keyPath="system.source"
          editable={context.editable}
        />
      </li>
    </ul>
  </div>
</header>
<Tabs bind:selectedTabId tabs={context.tabs} sheet={context.sheet} />
<section class="tidy-sheet-body">
  <TabContents tabs={context.tabs} {selectedTabId} />
</section>
