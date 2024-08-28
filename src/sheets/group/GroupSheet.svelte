<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { GroupSheetClassicContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const context = getContext<Readable<GroupSheetClassicContext>>('context');

  let selectedTabId = $context.tabs[0].id;
</script>

<header>
  <h1>Header Content Here</h1>
</header>

<Tabs tabs={$context.tabs} bind:selectedTabId />

<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
