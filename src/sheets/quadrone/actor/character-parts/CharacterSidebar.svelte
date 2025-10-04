<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Tab } from 'src/types/types';
  import SidebarTabSkills from 'src/sheets/quadrone/actor/tabs/SidebarTabSkills.svelte';
  import SidebarTabFavorites from 'src/sheets/quadrone/actor/tabs/SidebarTabFavorites.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { setContext, untrack } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import SidebarTabTraits from '../tabs/SidebarTabTraits.svelte';
  import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
  import { TidyFlags } from 'src/api';
  import { buildTabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration-functions';

  let context = $derived(getCharacterSheetQuadroneContext());

  let selectedTabId = $state('');

  // Assign initial sidebar tab ID one time. It manages itself thereafter.
  $effect(() => {
    untrack(() => {
      selectedTabId = context.initialSidebarTabId;
    });
  });

  let registeredSidebarTabs: Tab[] = $state([
    {
      id: 'sidebar-favorites',
      title: 'DND5E.Favorites',
      content: {
        type: 'svelte',
        component: SidebarTabFavorites,
        cssClass: 'favorites',
      },
      iconClass: 'fa-solid fa-star',
    } satisfies Tab,
    {
      id: 'sidebar-skills',
      title: 'DND5E.Skills',
      content: {
        type: 'svelte',
        component: SidebarTabSkills,
      },
      iconClass: 'fa-solid fa-briefcase',
    } satisfies Tab,
    {
      id: 'sidebar-traits',
      title: 'DND5E.Traits',
      content: {
        type: 'svelte',
        component: SidebarTabTraits,
      },
      iconClass: 'fa-solid fa-list-ul',
    } satisfies Tab,
  ]);

  let tabs = $derived.by(() => {
    let tabIds = registeredSidebarTabs.map((tab) => tab.id);

    const selectedTabs =
      TidyFlags.sidebarTabConfiguration.get(context.actor)?.selected ?? [];

    if (selectedTabs?.length) {
      tabIds = tabIds
        .filter((t) => selectedTabs?.includes(t))
        .sort((a, b) => selectedTabs.indexOf(a) - selectedTabs.indexOf(b));
    }

    return tabIds
      .map((tabId) => registeredSidebarTabs.find((tab) => tab.id === tabId))
      .filter((t) => !!t);
  });

  function onSidebarTabSelected(tabId: string) {
    context.actor.sheet.currentSidebarTabId = tabId;
  }

  setContext(CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED, onSidebarTabSelected);
</script>

<div class="sidebar-header" data-tidy-sheet-part="sidebar-header">
  <div class="flexrow">
    <Tabs
      bind:selectedTabId
      {tabs}
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
                  [...registeredSidebarTabs],
                  setting,
                  registeredSidebarTabs.map((x) => x.id),
                );
              },
            },
          }).render({ force: true })}
      >
        <i class="fas fa-cog"></i>
      </button>
    {/if}
  </div>
</div>
<TabContents {selectedTabId} {tabs} cssClass="sidebar-tab-contents flexcol" />
