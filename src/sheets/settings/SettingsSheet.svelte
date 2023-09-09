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
  import { getContext, setContext } from 'svelte';
  import type {
    SettingsSheetFunctions,
    SettingsSheetStore,
  } from './Tidy5eKgarSettingsSheet';
  import { CONSTANTS } from 'src/constants';

  export let selectedTabId: string;
  let store = getContext<SettingsSheetStore>('store');
  let functions = getContext<SettingsSheetFunctions>('functions');
  setContext('store', store);

  let tabs: Tab[] = [];

  tabs = [
    {
      id: CONSTANTS.TAB_SETTINGS_PLAYERS,
      displayName: 'T5EK.Settings.TabPlayers.tabLabel',
      content: {
        component: PlayerSettingsTab,
      },
    },
    {
      id: CONSTANTS.TAB_SETTINGS_NPCS,
      displayName: 'T5EK.Settings.NPCs.tabLabel',
      content: {
        component: NpcSettingsTab,
      },
    },
    {
      id: CONSTANTS.TAB_SETTINGS_VEHICLES,
      displayName: 'T5EK.Settings.Vehicles.tabLabel',
      content: {
        component: VehicleSettingsTab,
      },
    },
  ];

  if (FoundryAdapter.userIsGm()) {
    tabs.push(
      {
        id: CONSTANTS.TAB_SETTINGS_GM,
        displayName: 'T5EK.Settings.TabGM.tabLabel',
        content: {
          component: GmOptionsSettingsTab,
        },
      },
      {
        id: CONSTANTS.TAB_SETTINGS_MODULES,
        displayName: 'T5EK.Settings.TabModules.tabLabel',
        content: {
          component: ModuleSettingsTab,
        },
      },
      {
        id: CONSTANTS.TAB_SETTINGS_HOMEBREW,
        displayName: 'T5EK.Settings.TabHomebrewRules.tabLabel',
        content: {
          component: HomebrewSettingsTab,
        },
      },
      {
        id: CONSTANTS.TAB_SETTINGS_LOCKS,
        displayName: 'T5EK.Settings.TabLocks.tabLabel',
        content: {
          component: LockSettingsTab,
        },
      }
    );
  }

  tabs.push({
    id: CONSTANTS.TAB_SETTINGS_INFO,
    displayName: 'T5EK.Settings.TabInfo.tabLabel',
    content: {
      component: InfoTab,
      props: { name: 'buddy' },
    },
  });

  selectedTabId ??= tabs[0].id;

  let applyingChanges = false;

  async function save() {
    applyingChanges = true;

    try {
      await functions.save($store);
    } finally {
      applyingChanges = false;
    }
  }

  async function apply() {
    applyingChanges = true;

    try {
      await functions.apply($store);
    } finally {
      applyingChanges = false;
    }
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <div role="presentation" class="vertical-tab-container flex-column no-gap">
    <Tabs {tabs} bind:selectedTabId orientation="vertical" />
    <div role="presentation" class="remaining-vertical-space" />
  </div>
  <section class="sheet-body">
    <TabContents {tabs} {selectedTabId} />
  </section>

  <div class="button-bar">
    <button
      type="button"
      name="save"
      class="save-changes-btn"
      on:click={save}
      disabled={applyingChanges}
    >
      <i class="fas fa-save" />
      {localize('T5EK.SaveChanges')}
    </button>
    <button
      type="button"
      name="apply"
      class="apply-changes-btn"
      on:click={apply}
      disabled={applyingChanges}
    >
      <i class="fas fa-check" />
      {localize('T5EK.ApplyChanges')}
    </button>
  </div>
</div>

<style lang="scss">
  .settings-form {
    height: 100%;
    display: grid;
    grid-template-areas:
      'nav    body'
      'nav    buttons';
    grid-template-rows: 1fr auto;
    grid-template-columns: 15rem 1fr;
    gap: 0.5rem;

    .vertical-tab-container {
      grid-area: nav;
    }

    .sheet-body {
      grid-area: body;
      overflow-y: scroll;
      padding-top: 0.5rem;
      padding-right: 1rem;
      flex: 1;
    }

    .button-bar {
      grid-area: buttons;
    }
  }

  .button-bar {
    flex: 0;
    display: flex;
    padding-right: 1.5rem;
    padding-bottom: 0.25rem;
  }

  .remaining-vertical-space {
    border-right: 0.0625rem solid var(--t5ek-light-color);
    flex: 1;
    background-color: var(--t5ek-header-background);
  }
</style>
