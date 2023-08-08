<script lang="ts">
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { NpcSheetContext, Tab } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcAbilitiesTab from './NpcAbilitiesTab.svelte';
  import NpcSpellbookTab from './NpcSpellbookTab.svelte';
  import NpcEffectsTab from './NpcEffectsTab.svelte';
  import NpcBiographyTab from './NpcBiographyTab.svelte';
  import NpcJournalTab from './NpcJournalTab.svelte';
    import NpcProfile from './parts/NpcProfile.svelte';

  export let selectedTabId: string;

  let store = getContext<Readable<NpcSheetContext>>('store');

  let tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_NPC_ABILITIES,
      displayName: 'T5EK.Abilities',
      content: {
        component: NpcAbilitiesTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: NpcSpellbookTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: NpcEffectsTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_BIOGRAPHY,
      displayName: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_JOURNAL,
      displayName: 'TIDY5E.Journal',
      content: {
        component: NpcJournalTab,
      },
    },
  ];
</script>

<header class="tidy5e-kgar-sheet-header flex-row">
  <div class="flex-grow-0">
    <NpcProfile />
  </div>
  <div class="flex-grow-1">
    
  </div>
</header>
<Tabs {tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if $store.owner}
      <AllowEditLock />
    {/if}
  </svelte:fragment>
</Tabs>
<section class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</section>

<style lang="scss">
  .tidy5e-kgar-sheet-header {
    display: flex;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);
  }

  :global(.tab.abilities) {
    overflow-y: scroll;
    padding-right: 0.75rem;
  }

  :global(.tab.biography),
  :global(.tab.journal) {
    align-items: flex-start;
    flex-direction: row;
    padding-right: 0.75rem;
    overflow-x: inherit;
  }

  :global(.tab.biography),
  :global(.tab.journal) {
    font-size: 0.8125rem;
  }

  :global(.tab.biography) {
    flex-wrap: wrap;
  }
</style>
