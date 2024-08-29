<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import GroupProfile from './parts/GroupProfile.svelte';
  import { CONSTANTS } from 'src/constants';
  import ActorName from '../actor/ActorName.svelte';

  const context = getContext<Readable<GroupSheetClassicContext>>('context');

  let selectedTabId = $context.tabs[0].id;
</script>

<header class="tidy5e-sheet-header flex-row">
  <div class="flex-0">
    <GroupProfile />
  </div>
  <div class="flex-grow-1">
    <div
      class="flex-row justify-content-space-between align-items-center small-gap"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
    >
      <div
        class="actor-name"
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
      >
        <ActorName />
      </div>

      <!-- Any other content adjacent to Actor Name -->
    </div>
  </div>
</header>

<Tabs tabs={$context.tabs} bind:selectedTabId />

<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
