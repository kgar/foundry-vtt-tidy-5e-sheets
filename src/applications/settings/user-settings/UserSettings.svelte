<script lang="ts">
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import PlayerSettingsTab from './tabs/PlayerSettingsTab.svelte';
  import NpcSettingsTab from './tabs/NpcSettingsTab.svelte';
  import VehicleSettingsTab from './tabs/VehicleSettingsTab.svelte';
  import ActionsListSettingsTab from './tabs/ActionsListSettingsTab.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext, untrack } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type {
    UserSettingsContext,
    UserSettingsFunctions,
  } from './UserSettings.types';
  import ActivitiesSettingsTab from './tabs/ActivitiesSettingsTabs.svelte';

  let context = getContext<UserSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  
  let functions = getContext<UserSettingsFunctions>(
    CONSTANTS.SVELTE_CONTEXT.FUNCTIONS,
  );

  let selectedTabId = $state('');

  let tabs: Tab[] = $derived.by(() => {
    const result: Tab[] = [
      {
        id: CONSTANTS.TAB_USER_SETTINGS_PLAYERS,
        title: 'TIDY5E.UserSettings.TabPlayers.tabLabel',
        content: {
          component: PlayerSettingsTab,
          type: 'svelte',
        },
      },
      {
        id: CONSTANTS.TAB_USER_SETTINGS_NPCS,
        title: 'TIDY5E.UserSettings.TabNPCs.tabLabel',
        content: {
          component: NpcSettingsTab,
          type: 'svelte',
        },
      },
      {
        id: CONSTANTS.TAB_USER_SETTINGS_VEHICLES,
        title: 'TIDY5E.UserSettings.TabVehicles.tabLabel',
        content: {
          component: VehicleSettingsTab,
          type: 'svelte',
        },
      },
    ];

    result.push({
      id: CONSTANTS.TAB_USER_SETTINGS_ACTIONS_LIST,
      title: 'TIDY5E.UserSettings.TabActionsList.tabLabel',
      content: {
        component: ActionsListSettingsTab,
        type: 'svelte',
      },
    });

    result.push({
      id: CONSTANTS.TAB_USER_SETTINGS_ACTIVITIES,
      title: 'TIDY5E.UserSettings.TabActivities.tabLabel',
      content: {
        component: ActivitiesSettingsTab,
        type: 'svelte',
      },
    });

    return result;
  });

  $effect(() => {
    selectedTabId ??= tabs[0].id;
  });

  let applyingChanges = $state(false);

  async function save() {
    applyingChanges = true;

    try {
      await functions.save(context);
    } finally {
      applyingChanges = false;
    }
  }

  async function apply() {
    applyingChanges = true;

    try {
      await functions.apply(context);
    } finally {
      applyingChanges = false;
    }
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <div role="presentation" class="vertical-tab-container flex-column no-gap">
    <Tabs {tabs} bind:selectedTabId orientation="vertical" />
    <div role="presentation" class="remaining-vertical-space"></div>
  </div>

  <TabContents {tabs} {selectedTabId} cssClass="tidy-sheet-body" />
  <div class="button-bar">
    <button
      type="button"
      class="save-changes-btn"
      onclick={save}
      disabled={applyingChanges}
    >
      <i class="fas fa-save"></i>
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      onclick={apply}
      disabled={applyingChanges}
    >
      <i class="fas fa-check"></i>
      {localize('TIDY5E.ApplyChanges')}
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

    :global(.tidy-sheet-body) {
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

    :global(button) {
      width: 100%;
      min-height: 2rem;
    }
  }

  .button-bar {
    flex: 0;
    display: flex;
    padding-right: 0.5rem;
    gap: 0.25rem;

    button {
      flex: 1;
    }
  }

  .remaining-vertical-space {
    margin-right: -0.0625rem;
    border-right: 0.0625rem solid var(--t5e-tab-strip-border-color);
    flex: 1;
    background-color: var(--t5e-header-background);
  }
</style>
