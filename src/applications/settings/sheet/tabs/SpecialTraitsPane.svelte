<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import SpecialTraits from 'src/applications-quadrone/special-traits/SpecialTraits.svelte';
  import type { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import { setContext, untrack } from 'svelte';
  import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
  import TabVisibilityControls from './TabVisibilityControls.svelte';

  interface Props {
    app: SpecialTraitsApplication;
    tabConfigEntry?: TabConfigContextEntry;
    tabId?: string;
  }

  let { app, tabConfigEntry = $bindable(), tabId }: Props = $props();
  setContext(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
    untrack(() => app._context),
  );

  let ready = $derived(app._context.data !== undefined);

  $effect(() => {
    untrack(async () => {
      const context = await app._prepareContext({});
      app._context.data = context;
    });
  });
</script>

<div class="dialog-content-container flexcol">
  {#if ready}
    <SpecialTraits />
  {/if}
  {#if tabConfigEntry && tabId}
    <TabVisibilityControls bind:entry={tabConfigEntry} {tabId} />
  {/if}
</div>
