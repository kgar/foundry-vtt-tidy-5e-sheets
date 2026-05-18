<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import SpellSourceItemAssignments from 'src/applications/spell-source-item-assignments/SpellSourceItemAssignments.svelte';
  import type SpellSourceItemAssignmentsFormApplication from 'src/applications/spell-source-item-assignments/SpellSourceItemAssignmentsFormApplication.svelte';
  import { setContext, untrack } from 'svelte';

  interface Props {
    app: SpellSourceItemAssignmentsFormApplication;
  }

  let { app }: Props = $props();

  setContext(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
    untrack(() => app._context),
  );

  let ready = $derived(app._context.data !== undefined);

  $effect(() => {
    untrack(async () => {
      const context = await app._prepareContext();
      app._context.data = context;
    });
  });
</script>

{#if ready}
  <SpellSourceItemAssignments />
{/if}
