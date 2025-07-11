<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Tab } from 'src/types/types';
  import SidebarTabSkills from 'src/sheets/quadrone/actor/tabs/SidebarTabSkills.svelte';
  import SidebarTabFavorites from 'src/sheets/quadrone/actor/tabs/SidebarTabFavorites.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { setContext, untrack } from 'svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getCharacterSheetQuadroneContext());

  let selectedTabId = $state('');

  // Assign initial sidebar tab ID one time. It manages itself thereafter.
  $effect(() => {
    untrack(() => {
      selectedTabId = context.initialSidebarTabId;
    });
  });

  let tabs: Tab[] = $state([
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
  ]);

  function onSidebarTabSelected(tabId: string) {
    context.actor.sheet.currentSidebarTabId = tabId;
  }

  setContext(CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED, onSidebarTabSelected);
</script>

<div class="sidebar-header">
  <Tabs
    bind:selectedTabId
    {tabs}
    cssClass="sidebar-tab-strip button-group"
    tabCssClass="button button-secondary button-toggle"
  />
</div>
<TabContents {selectedTabId} {tabs} cssClass="sidebar-tab-contents flexcol" />
