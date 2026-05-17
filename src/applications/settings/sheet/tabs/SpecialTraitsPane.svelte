<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import SpecialTraits from 'src/applications-quadrone/special-traits/SpecialTraits.svelte';
  import type { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import { setContext, untrack } from 'svelte';

  interface Props {
    app: SpecialTraitsApplication;
  }

  let { app }: Props = $props();
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

{#if ready}
  <SpecialTraits />
{/if}
