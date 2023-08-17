<script lang="ts">
  import type { NpcSheetContext, Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import VehicleAttributesTab from './VehicleAttributesTab.svelte';
  import { CONSTANTS } from 'src/constants';
  import VehicleCargoAndCrewTab from './VehicleCargoAndCrewTab.svelte';
  import VehicleDescriptionTab from './VehicleDescriptionTab.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import VehicleProfile from './parts/VehicleProfile.svelte';
  import ActorEffectsTab from '../actor/ActorEffectsTab.svelte';

  export let selectedTabId: string;

  let store = getContext<Readable<NpcSheetContext>>('store');

  $: console.log($store);

  let tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: VehicleAttributesTab,
      },
    },
    {
      id: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
      displayName: 'DND5E.VehicleCargoCrew',
      content: {
        component: VehicleCargoAndCrewTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        props: {
          classicControlsEnabled: true,
        },
      },
    },
    {
      id: CONSTANTS.TAB_VEHICLE_DESCRIPTION,
      displayName: 'DND5E.Description',
      content: {
        component: VehicleDescriptionTab,
      },
    },
  ];

  if (!tabs.some((tab) => tab.id === selectedTabId)) {
    selectedTabId = tabs[0]?.id;
  }
</script>

<header>
  <div class="flex-0">
    <VehicleProfile />
  </div>
  <div class="flex-grow-1" />
</header>
<Tabs {tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if $store.owner}
      <AllowEditLock />
    {/if}
  </svelte:fragment>
</Tabs>
<section class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</section>

<style lang="scss">
  header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);
  }

  .sheet-body {
    // TODO: Tab-specific styles here.
  }
</style>
