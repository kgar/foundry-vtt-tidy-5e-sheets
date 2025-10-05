<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { setContext, untrack } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
  import { TidyFlags } from 'src/api';
  import { buildTabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration-functions';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  let selectedTabId = $state('');

  // Assign initial sidebar tab ID one time. It manages itself thereafter.
  $effect(() => {
    untrack(() => {
      selectedTabId = context.initialSidebarTabId;
    });
  });

  function onSidebarTabSelected(tabId: string) {
    context.actor.sheet.currentSidebarTabId = tabId;
  }

  const tabConfigTitle = FoundryAdapter.localize('TIDY5E.TabSelection.Title', {
    documentName: FoundryAdapter.localize('TIDY5E.Character.Sidebar.Title'),
  });

  setContext(CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED, onSidebarTabSelected);
</script>

<div class="sidebar-header" data-tidy-sheet-part="sidebar-header">
  <div class="flexrow">
    <Tabs
      bind:selectedTabId
      tabs={context.sidebarTabs}
      cssClass="sidebar-tab-strip button-group"
      tabCssClass="button button-secondary button-toggle"
    ></Tabs>
    {#if context.unlocked}
      <button
        type="button"
        class="flexshrink button button-borderless button-icon-only button-config"
        onclick={() =>
          new SheetTabConfigurationQuadroneApplication({
            document: context.document,
            customTabConfigProvider: {
              getTabConfig: TidyFlags.sidebarTabConfiguration.get,
              setTabsConfig: TidyFlags.sidebarTabConfiguration.set,
              getTabContext: (doc, setting) => {
                return buildTabConfigContextEntry(
                  doc.documentName,
                  doc.type,
                  CharacterSheetQuadroneSidebarRuntime.getAllRegisteredTabs(),
                  setting,
                  CharacterSheetQuadroneSidebarRuntime.getDefaultTabIds(),
                );
              },
            },
            title: tabConfigTitle,
          }).render({ force: true })}
      >
        <i class="fas fa-cog"></i>
      </button>
    {/if}
  </div>
</div>
<TabContents
  {selectedTabId}
  tabs={context.sidebarTabs}
  cssClass="sidebar-tab-contents flexcol"
/>
