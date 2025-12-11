<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Tab } from 'src/types/types';
  import MiscWorldSettingsTab from './tabs/MiscWorldSettingsTab.svelte';
  import NpcWorldSettingsTab from './tabs/NpcWorldSettingsTab.svelte';
  import ItemWorldSettingsTab from './tabs/ItemWorldSettingsTab.svelte';
  import SheetLockWorldSettingsTab from './tabs/SheetLockWorldSettingsTab.svelte';
  import { getContext } from 'svelte';
  import type {
    WorldSettingsContext,
    WorldSettingsFunctions,
  } from './WorldSettings.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import CustomSectionsWorldSettingsTab from './tabs/CustomSectionsWorldSettingsTab.svelte';

  let selectedTabId: string = $state('');
  let functions = getContext<WorldSettingsFunctions>(
    CONSTANTS.SVELTE_CONTEXT.FUNCTIONS,
  );

  let tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_MISC,
      title: 'TIDY5E.WorldSettings.TabMisc.tabLabel',
      content: {
        component: MiscWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_NPC,
      title: 'TIDY5E.WorldSettings.TabNpc.tabLabel',
      content: {
        component: NpcWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_ITEM,
      title: 'TIDY5E.WorldSettings.TabItem.tabLabel',
      content: {
        component: ItemWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_SHEETLOCK,
      title: 'TIDY5E.WorldSettings.TabSheetLock.tabLabel',
      content: {
        component: SheetLockWorldSettingsTab,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_WORLD_SETTINGS_CUSTOM_SECTIONS,
      title: 'TIDY5E.WorldSettings.TabCustomSections.tabLabel',
      content: {
        component: CustomSectionsWorldSettingsTab,
        type: 'svelte',
      },
    },
  ];

  selectedTabId ??= tabs[0].id;

  let applyingChanges = $state(false);

  async function save() {
    applyingChanges = true;

    try {
      await functions.save();
    } finally {
      applyingChanges = false;
    }
  }

  async function apply() {
    applyingChanges = true;

    try {
      await functions.apply();
    } finally {
      applyingChanges = false;
    }
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form user-select-text">
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

<style lang="less">
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
      padding-top: 0;
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
      min-height: 2rem;
    }
  }

  .remaining-vertical-space {
    margin-right: -0.0625rem;
    border-right: 0.0625rem solid var(--t5e-tab-strip-border-color);
    flex: 1;
    background-color: var(--t5e-header-background);
  }
</style>
