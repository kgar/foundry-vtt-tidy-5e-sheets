<script lang="ts">
  import type { Tab } from 'src/types/types';
  import type { WorldSettingsQuadroneApplication } from './TidyWorldSettingsQuadroneApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import SheetHeaderControlConfig from 'src/applications/settings/header-control-configuration/SheetHeaderControlConfig.svelte';
  import type { WorldSheetConfigurationSettingsEditor } from 'src/settings/editors/world-sheet-configuration-settings-editor.svelte';
  import TabConfigurationSortableListbox from '../tab-configuration/parts/TabConfigurationSortableListbox.svelte';

  interface Props {
    app: WorldSettingsQuadroneApplication;
    editor: WorldSheetConfigurationSettingsEditor;
  }
  const localize = FoundryAdapter.localize;

  let { app, editor }: Props = $props();

  const documentName = $derived(editor.documentName);
  const documentType = $derived(editor.documentType);
  const title = $derived(editor.title);

  /**
   * Unique per sheet/document type so the tabs remount and are
   * re-read when you switch sheets.
   */
  let prefix = $derived(`${documentName}-${documentType}`);

  let tabConfigEntry = $derived(editor.value.tabConfig);

  let sidebarTabConfigEntry = $derived(editor.value.sidebarTabConfig);

  let headerControlEntry = $derived(editor.value.headerControlConfig);

  let tabs: Tab[] = $derived.by(() => {
    const result: Tab[] = [];

    if (tabConfigEntry) {
      const entry = tabConfigEntry;

      result.push({
        id: `${prefix}-tabs`,
        title: 'TIDY5E.TabConfiguration.MenuOptionText',
        content: {
          type: 'svelte',
          component: TabConfigurationSortableListbox,
          getProps: () => ({ tabConfigEntry: entry }),
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
          component: TabConfigurationSortableListbox,
          getProps: () => ({ tabConfigEntry: entry }),
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
  <h2>
    {localize('TIDY5E.WorldSettings.SheetConfiguration.label', {
      sheetName: title,
    })}
  </h2>
  <p class="settings-description">
    {localize('TIDY5E.WorldSettings.SheetConfiguration.hint', {
      sheetName: title,
    })}
  </p>
  <div class="tabs-row tab-configuration-tabs">
    <Tabs bind:selectedTabId {tabs} cssClass="item-tabs" />
    <hr class="golden-fade" />
  </div>
  <TabContents {selectedTabId} {tabs} cssClass="flex1" />
</div>
