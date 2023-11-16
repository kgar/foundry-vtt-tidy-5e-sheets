<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContext>>('context');

  $: text = coalesce($context.labels.type, '');

  const localize = FoundryAdapter.localize;
</script>

{#if ($context.owner && $context.actor.type === 'npc') || $context.system.details?.race?.id}
  <button
    type="button"
    class="configure-creature-type inline-transparent-button highlight-on-hover truncate"
    on:click={() => FoundryAdapter.openActorTypeConfig($context.actor)}
    title={localize('DND5E.CreatureType')}
  >
    {text}
  </button>
{:else}
  <span
    class="creature-type-label truncate"
    title={localize('DND5E.CreatureType')}>{text}</span
  >
{/if}

<style lang="scss">
  .creature-type-label,
  .configure-creature-type {
    flex: 1;
    line-height: inherit;
    height: inherit;
  }
</style>
