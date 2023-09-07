<script lang="ts">
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import PlayerSettingsTab from './PlayerSettingsTab.svelte';
  import NpcSettingsTab from './NpcSettingsTab.svelte';
  import VehicleSettingsTab from './VehicleSettingsTab.svelte';
  import GmOptionsSettingsTab from './GmOptionsSettingsTab.svelte';
  import ModuleSettingsTab from './ModuleSettingsTab.svelte';
  import HomebrewSettingsTab from './HomebrewSettingsTab.svelte';
  import LockSettingsTab from './LockSettingsTab.svelte';
  import InfoTab from './InfoTab.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    SettingsProvider,
    type Tidy5eSettingKeys,
    type Tidy5eSettings,
  } from 'src/settings/settings';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let selectedTabId: string;

  const keys = Object.keys(
    SettingsProvider.settings
  ) as (keyof (typeof SettingsProvider)['settings'])[];

  let settingToValue = keys.reduce<Record<string, any>>((obj, key) => {
    obj[key] = SettingsProvider.settings[key].get();
    return obj;
  }, {}) as Record<Tidy5eSettingKeys, any>;

  let store = writable(settingToValue);

  setContext('store', store);

  let tabs: Tab[] = [];

  tabs = [
    {
      id: 'players',
      displayName: 'T5EK.Settings.TabPlayers.tabLabel',
      content: {
        component: PlayerSettingsTab,
        props: { name: 'buddy' },
      },
    },
    {
      id: 'npcs',
      displayName: 'T5EK.Settings.NPCs.tabLabel',
      content: {
        component: NpcSettingsTab,
        props: { name: 'ol pal' },
      },
    },
    {
      id: 'vehicles',
      displayName: 'T5EK.Settings.Vehicles.tabLabel',
      content: {
        component: VehicleSettingsTab,
        props: { name: 'friend' },
      },
    },
  ];

  if (FoundryAdapter.userIsGm()) {
    tabs.push(
      {
        id: 'gm',
        displayName: 'T5EK.Settings.TabGM.tabLabel',
        content: {
          component: GmOptionsSettingsTab,
          props: { name: 'buddy' },
        },
      },
      {
        id: 'modules',
        displayName: 'T5EK.Settings.TabModules.tabLabel',
        content: {
          component: ModuleSettingsTab,
          props: { name: 'buddy' },
        },
      },
      {
        id: 'homebrew',
        displayName: 'T5EK.Settings.TabHomebrewRules.tabLabel',
        content: {
          component: HomebrewSettingsTab,
          props: { name: 'buddy' },
        },
      },
      {
        id: 'locks',
        displayName: 'T5EK.Settings.TabLocks.tabLabel',
        content: {
          component: LockSettingsTab,
          props: { name: 'buddy' },
        },
      }
    );
  }

  tabs.push({
    id: 'info',
    displayName: 'T5EK.Settings.TabInfo.tabLabel',
    content: {
      component: InfoTab,
      props: { name: 'buddy' },
    },
  });

  selectedTabId ??= tabs[0].id;
</script>

<div class="full-height flex-row extra-small-gap">
  <div class="vertical-tab-container flex-column no-gap">
    <Tabs {tabs} bind:selectedTabId orientation="vertical" />
    <div class="remaining-vertical-space" />
  </div>

  <section class="sheet-body">
    <TabContents {tabs} {selectedTabId} />
  </section>

  <button on:click={() => console.log($store.playerSheetWidth)}>Check it out</button>
</div>

<style lang="scss">
  .vertical-tab-container {
    width: 15rem;
  }

  .remaining-vertical-space {
    border-right: 1px solid var(--t5ek-light-color);
    flex: 1;
    background-color: var(--t5ek-header-background);
  }

  .sheet-body {
    flex-grow: 1;
  }
</style>
