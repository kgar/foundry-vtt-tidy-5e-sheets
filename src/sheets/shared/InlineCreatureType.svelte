<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContextV1 } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: text = coalesce($context.labels.type, localize('DND5E.CreatureType'));

  $: configFn =
    $context.actor.type === 'character'
      ? FoundryAdapter.openCharacterActorTypeConfig
      : FoundryAdapter.openActorTypeConfig;

  const localize = FoundryAdapter.localize;
</script>

{#if $context.editable && ($context.actor.type === 'npc' || $context.system.details?.race?.id)}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
    class="configure-creature-type inline-transparent-button highlight-on-hover truncate"
    on:click={() => configFn($context.actor)}
    title={localize('DND5E.CreatureType')}
  >
    {text}
  </a>
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
