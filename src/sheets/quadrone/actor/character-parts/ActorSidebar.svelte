<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Tab } from 'src/types/types';
  import SidebarTabSkills from 'src/sheets/quadrone/actor/tabs/SidebarTabSkills.svelte';
  import SidebarTabTraits from 'src/sheets/quadrone/actor/tabs/SidebarTabTraits.svelte';
  import SidebarTabPinned from 'src/sheets/quadrone/actor/tabs/SidebarTabPinned.svelte';

  let selectedTabId = $state('');
  let tabs: Tab[] = $state([
    {
      id: 'sidebar-skills',
      title: 'DND5E.Skills',
      content: {
        type: 'svelte',
        component: SidebarTabSkills,
      },
    } satisfies Tab,
    {
      id: 'sidebar-traits',
      title: 'DND5E.Traits',
      content: {
        type: 'svelte',
        component: SidebarTabTraits,
      },
    } satisfies Tab,
    {
      id: 'sidebar-pinned',
      title: 'TIDY5E.SidebarPinnedTab.Title',
      content: {
        type: 'svelte',
        component: SidebarTabPinned,
      },
    } satisfies Tab,
  ]);
</script>

<div class="sidebar-header">
  <Tabs bind:selectedTabId {tabs} cssClass="sidebar-tab-strip" />
</div>
<TabContents {selectedTabId} {tabs} cssClass="sidebar-tab-contents" />
