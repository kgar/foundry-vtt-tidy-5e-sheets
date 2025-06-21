<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Tab } from 'src/types/types';
  import SidebarTabSkills from 'src/sheets/quadrone/actor/tabs/SidebarTabSkills.svelte';
  import SidebarTabFavorites from 'src/sheets/quadrone/actor/tabs/SidebarTabFavorites.svelte';

  let selectedTabId = $state('');
  let tabs: Tab[] = $state([
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
      id: 'sidebar-favorites',
      title: 'DND5E.Favorites',
      content: {
        type: 'svelte',
        component: SidebarTabFavorites,
        cssClass: 'favorites',
      },
      iconClass: 'fa-solid fa-star',
    } satisfies Tab,
  ]);
</script>

<div class="sidebar-header">
  <Tabs 
    bind:selectedTabId {tabs} 
    cssClass="sidebar-tab-strip button-group" 
    tabCssClass="button button-secondary button-toggle" 
  />
</div>
<TabContents {selectedTabId} {tabs} cssClass="sidebar-tab-contents flexcol" />
