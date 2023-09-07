<script lang="ts">
  import type { Tab } from 'src/types/types';
  import SettingsTabContents from './SettingsTabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';

  let selectedTabId: string;

  const tabs: Tab[] = [
    {
      id: 'players',
      displayName: 'T5EK.Settings.TabPlayers.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'buddy' },
      },
    },
    {
      id: 'npcs',
      displayName: 'T5EK.Settings.NPCs.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'ol pal' },
      },
    },
    {
      id: 'vehicles',
      displayName: 'T5EK.Settings.Vehicles.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'friend' },
      },
    },
    {
      id: 'gm',
      displayName: 'T5EK.Settings.TabGM.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'buddy' },
      },
    },
    {
      id: 'modules',
      displayName: 'T5EK.Settings.TabModules.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'buddy' },
      },
    },
    {
      id: 'homebrew',
      displayName: 'T5EK.Settings.TabHomebrewRules.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'buddy' },
      },
    },
    {
      id: 'locks',
      displayName: 'T5EK.Settings.TabLocks.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'buddy' },
      },
    },
    {
      id: 'info',
      displayName: 'T5EK.Settings.TabInfo.tabLabel',
      content: {
        component: SettingsTabContents,
        props: { name: 'buddy' },
      },
    },
  ];
</script>

<div class="full-height flex-row extra-small-gap">
  <div class="vertical-tab-container flex-column no-gap">
    <Tabs {tabs} bind:selectedTabId orientation="vertical" />
    <div class="remaining-vertical-space" />
  </div>

  <section class="sheet-body">
    <TabContents {tabs} {selectedTabId} />
  </section>
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
