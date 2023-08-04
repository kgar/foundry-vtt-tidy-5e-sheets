<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescriptionWithSidebar from './parts/ItemDescriptionWithSidebar.svelte';
  import ItemSpellDetails from './parts/ItemSpellDetails.svelte';
  import ActiveEffects from '../actor/parts/ActiveEffects.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProfilePicture from './parts/ItemProfilePicture.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: console.log($store);

  export let selectedTabId: string;

  const tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
      displayName: 'DND5E.Description',
      content: {
        component: ItemDescriptionWithSidebar,
        cssClass: 'flexrow',
      },
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS_ID,
      displayName: 'DND5E.Details',
      content: {
        component: ItemSpellDetails,
        cssClass: 'detail-tab-contents',
      },
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActiveEffects,
        cssClass: 'flexcol items-list-container',
      },
    },
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_SPELL_TABS, {
    tabs,
    context: $store,
  });

  const localize = FoundryAdapter.localize;
</script>

<header class="sheet-header flexrow gap">
  <ItemProfilePicture />

  <div class="header-details flexrow">
    <h1 class="charname">
      <TextInput
        document={$store.item}
        field="name"
        value={$store.item.name}
        placeholder={localize('DND5E.SpellName')}
      />
    </h1>

    <div class="item-subtitle">
      <h4 class="item-type">{$store.itemType}</h4>
      <span class="item-status">{$store.itemStatus}</span>
    </div>

    <ul class="summary flexrow">
      <li>{$store.labels.level}</li>
      <li>{$store.labels.school}</li>
      <li>
        <TextInput
          document={$store.item}
          field="system.source"
          value={$store.system.source}
          placeholder={localize('DND5E.Source')}
        />
      </li>
    </ul>
  </div>
</header>
<Tabs bind:selectedTabId {tabs} />
<div class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</div>
