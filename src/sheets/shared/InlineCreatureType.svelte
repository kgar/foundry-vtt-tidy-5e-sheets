<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import { type ActorSheetContextV1 } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: text = coalesce($context.labels.type, localize('DND5E.CreatureType'));

  const localize = FoundryAdapter.localize;
</script>

{#if $context.editable && ($context.actor.type === 'npc' || $context.system.details?.race?.id)}
  <button
    type="button"
    class="configure-creature-type inline-transparent-button highlight-on-hover truncate"
    on:click={() => FoundryAdapter.openActorTypeConfig($context.actor)}
    title={localize('DND5E.CreatureType')}
    tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
