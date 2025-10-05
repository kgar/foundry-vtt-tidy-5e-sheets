<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
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

  function onSidebarTabSelected(tabId: string) {
    context.actor.sheet.currentSidebarTabId = tabId;
  }

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
        data-action="openSidebarTabConfiguration"
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
