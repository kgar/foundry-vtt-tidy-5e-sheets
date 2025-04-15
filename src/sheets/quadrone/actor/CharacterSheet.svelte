<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $state('');

  let sidebarExpanded = $state(false);
</script>

<header class="sheet-header">
  <div class="character-vitals">Character vitals here</div>
  <div class="character-profile">
    <div class="character-name">Character name here</div>
    <div class="character-summary">
      Main movement, size, species, classes (level, main stat, DC)
    </div>
  </div>
  <div class="sheet-header-buttons">Sheet header buttons</div>
  <div class="level-badge-container">Level badge container</div>
  <div class="abilities-container">AC, Abilities, Init, Concentration</div>
  <div class="tabs-row">
    <a
      class="sidebar-toggle button button-borderless"
      title={localize(
        sidebarExpanded ? 'JOURNAL.ViewCollapse' : 'JOURNAL.ViewExpand',
      )}
      onclick={() => (sidebarExpanded = !sidebarExpanded)}
    >
      {#if sidebarExpanded}
        <i class="fa-solid fa-caret-left"></i>
        <i class="fa-solid fa-sidebar-flip"></i>
      {:else}
        <i class="fa-solid fa-sidebar"></i>
        <i class="fa-solid fa-caret-right"></i>
      {/if}
    </a>
    <Tabs
      bind:selectedTabId
      tabs={context.tabs}
      sheet={context.actor.sheet}
      cssClass="character-tabs"
      tabContext={{ context, actor: context.actor }}
    />
  </div>
</header>
<div class="main-content">
  <div class={['sidebar', { expanded: sidebarExpanded }]}>sidebar here</div>
  <TabContents tabs={context.tabs} {selectedTabId} />
</div>
