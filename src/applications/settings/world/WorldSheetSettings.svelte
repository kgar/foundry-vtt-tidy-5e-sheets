<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Tab } from 'src/types/types';
  import type { WorldSettingsQuadroneApplication } from './TidyWorldSettingsQuadroneApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import SortableListbox from 'src/applications/tab-configuration/parts/SortableListbox.svelte';
  import SheetHeaderControlConfig from 'src/applications/header-control-configuration/SheetHeaderControlConfig.svelte';

  interface Props {
    app: WorldSettingsQuadroneApplication;
    documentName: string;
    documentType: string;
    title: string;
  }
  const localize = FoundryAdapter.localize;

  let { app, documentName, documentType, title }: Props = $props();

  /**
   * Unique per sheet/document type so the tabs remount and are 
   * re-read when you switch sheets.
   */
  let prefix = $derived(`${documentName}-${documentType}`);

  let tabConfigEntry = $derived(
    app.editors.tabConfigTab.value.find(
      (c) =>
        c.documentName === documentName &&
        c.documentType === documentType &&
        !c.docTypeKeyOverride,
    ),
  );

  let sidebarTabConfigEntry = $derived(
    app.editors.tabConfigTab.value.find(
      (c) =>
        c.documentName === documentName &&
        c.documentType === documentType &&
        c.docTypeKeyOverride === CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
    ),
  );

  let headerControlEntry = $derived(
    app.editors.headerControlsTab.value.find(
      (c) => c.documentName === documentName && c.documentType === documentType,
    ),
  );

  let tabs: Tab[] = $derived.by(() => {
    const result: Tab[] = [];

    if (tabConfigEntry) {
      const entry = tabConfigEntry;

      result.push({
        id: `${prefix}-tabs`,
        title: 'TIDY5E.TabConfiguration.MenuOptionText',
        content: {
          type: 'svelte',
          component: SortableListbox,
          getProps: () => ({ tabConfigContext: entry }),
        },
      });
    }

    if (headerControlEntry) {
      const config = headerControlEntry;

      result.push({
        id: `${prefix}-header-controls`,
        title: 'TIDY5E.SettingsMenu.HeaderControlConfiguration.name',
        content: {
          type: 'svelte',
          component: SheetHeaderControlConfig,
          getProps: () => ({ config, idPrefix: `${app.id}-${prefix}` }),
        },
      });
    }

    if (sidebarTabConfigEntry) {
      const entry = sidebarTabConfigEntry;

      result.push({
        id: `${prefix}-sidebar`,
        title: 'TIDY5E.Character.Sidebar.Title',
        content: {
          type: 'svelte',
          component: SortableListbox,
          getProps: () => ({ tabConfigContext: entry }),
        },
      });
    }

    return result;
  });

  let selectedTabId = $state('');
</script>

<div
  class="dialog-content-container flexcol"
  data-document-name={documentName}
  data-document-type={documentType}
  aria-label={title}
>
  <h2>{localize('TIDY5E.WorldSettings.SheetConfiguration.label', { sheetName: title })}</h2>
  <p class="settings-description">{localize('TIDY5E.WorldSettings.SheetConfiguration.hint', { sheetName: title })}</p>
  <!-- Tab/header panes mount once (TabContent.onMount); remount them when the
       dialog stages an Undo / Use Global Defaults so they re-read the config. -->
  {#key app.tabPaneVersion}
    <div class="tabs-row tab-configuration-tabs">
      <Tabs bind:selectedTabId {tabs} cssClass="item-tabs" />
      <hr class="golden-fade" />
    </div>
    <TabContents {selectedTabId} {tabs} cssClass="flex1" />
  {/key}
</div>
