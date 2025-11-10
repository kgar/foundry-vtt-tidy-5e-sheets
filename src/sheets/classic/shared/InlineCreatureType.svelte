<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { type ActorSheetContextV1 } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  const localize = FoundryAdapter.localize;
  let text = $derived(
    coalesce(context.system.details.type.label, localize('DND5E.CreatureType')),
  );
</script>

{#if context.editable && (context.actor.type === 'npc' || context.system.details?.race?.id)}
  <button
    type="button"
    class="configure-creature-type inline-transparent-button highlight-on-hover truncate"
    onclick={() => FoundryAdapter.renderCreatureTypeConfig(context.actor)}
    title={localize('DND5E.CreatureType')}
    tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
  >
    {text}
  </button>
{:else}
  <span
    class="creature-type-label truncate"
    title={localize('DND5E.CreatureType')}>{text}</span
  >
{/if}

<style lang="less">
  .creature-type-label,
  .configure-creature-type {
    flex: 1;
    line-height: inherit;
    height: inherit;
  }
</style>
