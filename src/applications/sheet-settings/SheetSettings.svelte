<script lang="ts">
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import PlayerSettingsTab from './tabs/PlayerSettingsTab.svelte';
  import NpcSettingsTab from './tabs/NpcSettingsTab.svelte';
  import VehicleSettingsTab from './tabs/VehicleSettingsTab.svelte';
  import GmOptionsSettingsTab from './tabs/GmOptionsSettingsTab.svelte';
  import LockSettingsTab from './tabs/LockSettingsTab.svelte';
  import FeaturesSettingsTab from './tabs/FeaturesSettingsTab.svelte';
  import InfoTab from './tabs/InfoTab.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type {
    SettingsSheetFunctions,
    SettingsSheetStore,
  } from './SheetSettings.types';

  let selectedTabId: string;
  let context = getContext<SettingsSheetStore>('context');
  let functions = getContext<SettingsSheetFunctions>('functions');

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
      displayName: 'T5EK.Settings.TabNPCs.tabLabel',
      content: {
        component: NpcSettingsTab,
      },
    },
    {
      id: CONSTANTS.TAB_SETTINGS_VEHICLES,
      displayName: 'T5EK.Settings.TabVehicles.tabLabel',
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
        id: CONSTANTS.TAB_SETTINGS_LOCKS,
        displayName: 'T5EK.Settings.TabLocks.tabLabel',
        content: {
          component: LockSettingsTab,
        },
      },
    );
  }

  tabs.push({
    id: CONSTANTS.TAB_SETTINGS_FEATURES,
    displayName: 'T5EK.Settings.TabFeatures.tabLabel',
    content: {
      component: FeaturesSettingsTab,
    },
  });

  tabs.push({
    id: CONSTANTS.TAB_SETTINGS_INFO,
    displayName: 'T5EK.Settings.TabInfo.tabLabel',
    content: {
      component: InfoTab,
    },
  });

  selectedTabId ??= tabs[0].id;

  let applyingChanges = false;

  async function save() {
    applyingChanges = true;

    try {
      await functions.save($context);
    } finally {
      applyingChanges = false;
    }
  }

  async function apply() {
    applyingChanges = true;

    try {
      await functions.apply($context);
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

  <TabContents {tabs} {selectedTabId} cssClass="sheet-body" />
  <div class="button-bar">
    <button
      type="button"
      class="save-changes-btn"
      on:click={save}
      disabled={applyingChanges}
    >
      <i class="fas fa-save" />
      {localize('T5EK.SaveChanges')}
    </button>
    <button
      type="button"
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
      margin-top: -0.5rem;
      margin-left: -0.5rem;
      margin-bottom: -0.5rem;
    }

    :global(.sheet-body) {
      grid-area: body;
      overflow-y: scroll;
      padding-top: 0.5rem;
      padding-right: 0.5rem;
      margin-right: -0.25rem;
      flex: 1;
    }

    .button-bar {
      grid-area: buttons;
    }
  }

  .button-bar {
    flex: 0;
    display: flex;
    padding-right: 0.5rem;
  }

  .remaining-vertical-space {
    margin-right: -0.0625rem;
    border-right: 0.0625rem solid var(--t5ek-tab-strip-border-color);
    flex: 1;
    background-color: var(--t5ek-header-background);
  }
</style>
